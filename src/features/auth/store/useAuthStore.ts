import { create } from 'zustand';
import { isAxiosError } from 'axios';
import { AuthService } from '../services/auth.service';
import { secureStorage } from '@/lib/secureStorage';
import { authSession } from '@/lib/auth-session';
import { setupApiClient, setLoggingOut } from '@/apis/client';
import { queryClient } from '@/apis/query-client';
import type { User, UserRole, AuthTokens } from '@/types/auth.types';

export type { User, UserRole, AuthTokens };

interface AuthState {
  user: User | null;
  accessToken: string | null;
  token: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  isLoading: boolean;
  pendingEmail: string | null;
}

interface AuthActions {
  login: (tokens: AuthTokens, user: User) => Promise<void>;
  logout: () => Promise<void>;
  updateTokens: (tokens: AuthTokens) => Promise<void>;
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  setPendingEmail: (email: string | null) => void;
  hydrateSession: () => Promise<void>;
  initializeAuth: () => Promise<void>;
}

export type UserAuthState = AuthState & AuthActions;

const initialState: AuthState = {
  user: null,
  accessToken: null,
  token: null,
  isAuthenticated: false,
  isHydrated: false,
  isLoading: false,
  pendingEmail: null,
};

function toUserRole(role: string | undefined, roles?: string[]): UserRole {
  if (roles && Array.isArray(roles) && roles.length > 0) {
    return roles[0].toLowerCase();
  }
  if (role) {
    return role.toLowerCase();
  }
  return 'customer';
}

export function mapApiUserToStoreUser(apiUser: any): User {
  if (!apiUser) {
    return {
      id: '',
      name: '',
      email: '',
      role: 'customer',
    };
  }

  // Handle nested response format { success, data } or flat object
  const raw = apiUser.data || apiUser.user || apiUser.profile || apiUser;
  const firstName = raw.firstName || raw.first_name || '';
  const lastName = raw.lastName || raw.last_name || '';
  const name =
    raw.name ||
    (firstName || lastName ? `${firstName} ${lastName}`.trim() : '') ||
    raw.email?.split('@')[0] ||
    '';

  const avatar = raw.avatarUrl || raw.avatar || raw.profileImage || null;

  // Keep only clean user profile data and default role 'customer' without permissions
  return {
    id: raw.id || raw.userId || raw._id || '',
    userId: raw.userId || raw.id || '',
    firstName,
    lastName,
    name,
    email: raw.email || '',
    phone: raw.phone || raw.phoneNumber || null,
    phoneVerified: Boolean(raw.phoneVerified),
    emailVerified: Boolean(raw.emailVerified),
    avatar,
    avatarUrl: avatar,
    profileImage: avatar,
    status: raw.status || 'ACTIVE',
    role: toUserRole(raw.role, raw.roles),
    roles: Array.isArray(raw.roles) ? raw.roles : [raw.role || 'customer'],
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    sessionId: raw.sessionId,
    sessionExpiresAt: raw.sessionExpiresAt,
  };
}

function isNetworkFailure(error: unknown): boolean {
  return isAxiosError(error) && (!error.response || error.code === 'ECONNABORTED');
}

export const useAuthStore = create<UserAuthState>()((set, get) => ({
  ...initialState,

  login: async (tokens, user) => {
    await secureStorage.setTokens(tokens);
    if (user) {
      const cleanUser = mapApiUserToStoreUser(user);
      await secureStorage.setUser(cleanUser);
      authSession.setAccessToken(tokens.accessToken);
      set({
        accessToken: tokens.accessToken,
        token: tokens.accessToken,
        isAuthenticated: true,
        user: cleanUser,
        isHydrated: true,
      });
    } else {
      authSession.setAccessToken(tokens.accessToken);
      set({
        accessToken: tokens.accessToken,
        token: tokens.accessToken,
        isAuthenticated: true,
        isHydrated: true,
      });
    }
  },

  logout: async () => {
    setLoggingOut(true);
    try {
      try {
        await AuthService.logout();
      } catch {
        // Ignore network errors during logout
      }
      await secureStorage.clearTokens();
      authSession.clearSession();
      queryClient.clear();
      set({ ...initialState, isHydrated: true });
    } finally {
      setLoggingOut(false);
    }
  },

  updateTokens: async (tokens) => {
    await secureStorage.setTokens(tokens);
    authSession.setAccessToken(tokens.accessToken);
    set({
      accessToken: tokens.accessToken,
      token: tokens.accessToken,
      isAuthenticated: true,
    });
  },

  setUser: (user) => {
    const cleanUser = user ? mapApiUserToStoreUser(user) : null;
    set({ user: cleanUser, isAuthenticated: Boolean(cleanUser) });
    if (cleanUser) {
      secureStorage.setUser(cleanUser);
    }
  },

  updateUser: (updates) => {
    const current = get().user;
    if (!current) return;
    const updated = { ...current, ...updates };
    set({ user: updated });
    secureStorage.setUser(updated);
  },

  setPendingEmail: (email) => {
    set({ pendingEmail: email });
  },

  hydrateSession: async () => {
    if (get().isHydrated || get().isLoading) return;

    set({ isLoading: true });

    try {
      const [storedTokens, cachedUser] = await Promise.all([
        secureStorage.getTokens(),
        secureStorage.getUser<User>(),
      ]);

      if (!storedTokens?.accessToken) {
        set({ ...initialState, isHydrated: true, isLoading: false });
        return;
      }

      authSession.setAccessToken(storedTokens.accessToken);
      
      // Instantly restore cached user from local storage without blocking Cold Launch
      set({
        accessToken: storedTokens.accessToken,
        token: storedTokens.accessToken,
        user: cachedUser || null,
        isAuthenticated: true,
        isHydrated: true,
        isLoading: false,
      });

      // Synchronize with live user profile in background without blocking navigation
      AuthService.getMe()
        .then(async (res) => {
          const userObj = res.data || res;
          const mappedUser = mapApiUserToStoreUser(userObj);

          // Compare with cached user data to avoid redundant re-renders
          const currentCached = get().user;
          const isChanged =
            !currentCached ||
            currentCached.id !== mappedUser.id ||
            currentCached.updatedAt !== mappedUser.updatedAt ||
            currentCached.email !== mappedUser.email ||
            currentCached.name !== mappedUser.name ||
            currentCached.phone !== mappedUser.phone ||
            currentCached.role !== mappedUser.role ||
            currentCached.avatarUrl !== mappedUser.avatarUrl;

          if (isChanged) {
            await secureStorage.setUser(mappedUser);
            set({ user: mappedUser, isAuthenticated: true });
          }
        })
        .catch(async (err) => {
          if (!isNetworkFailure(err)) {
            const status = (err as any)?.status || (err as any)?.response?.status;
            // If token is invalid (401), reset state
            if (status === 401) {
              await secureStorage.clearTokens();
              authSession.clearSession();
              set({ ...initialState, isHydrated: true, isLoading: false });
            }
          }
        });
    } catch {
      set({ ...initialState, isHydrated: true, isLoading: false });
    }
  },

  initializeAuth: async () => {
    return get().hydrateSession();
  },
}));

// Setup API Client with Store Token Management
setupApiClient({
  getTokens: () => secureStorage.getTokens(),
  updateTokens: (tokens: AuthTokens) => useAuthStore.getState().updateTokens(tokens),
  logout: () => useAuthStore.getState().logout(),
});

// Eagerly initiate auth hydration on module load so it is ready before initial render
useAuthStore.getState().initializeAuth();

export const useUserStore = useAuthStore;
export default useAuthStore;
