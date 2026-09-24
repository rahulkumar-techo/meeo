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

function toUserRole(role: string | undefined): UserRole {
  return role || 'customer';
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

  const raw = apiUser.user || apiUser.profile || apiUser;
  const firstName = raw.firstName || raw.first_name || '';
  const lastName = raw.lastName || raw.last_name || '';
  const name =
    raw.name ||
    (firstName || lastName ? `${firstName} ${lastName}`.trim() : '') ||
    raw.email?.split('@')[0] ||
    '';

  return {
    ...raw,
    id: raw.id || raw._id || '',
    firstName,
    lastName,
    name,
    email: raw.email || '',
    phone: raw.phone || raw.phoneNumber || '',
    phoneVerified: Boolean(raw.phoneVerified),
    avatar: raw.avatar || raw.profileImage || raw.avatarUrl || raw.picture || '',
    avatarUrl: raw.avatarUrl || raw.avatar || raw.profileImage || '',
    profileImage: raw.profileImage || raw.avatar || raw.avatarUrl || '',
    role: toUserRole(raw.role),
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
      await secureStorage.setUser(user);
    }
    authSession.setAccessToken(tokens.accessToken);
    set({
      accessToken: tokens.accessToken,
      token: tokens.accessToken,
      isAuthenticated: true,
      user,
      isHydrated: true,
    });
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
    set({ user, isAuthenticated: Boolean(user) });
    if (user) {
      secureStorage.setUser(user);
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
      const storedTokens = await secureStorage.getTokens();
      const cachedUser = await secureStorage.getUser<User>();

      if (!storedTokens?.accessToken) {
        set({ ...initialState, isHydrated: true });
        return;
      }

      authSession.setAccessToken(storedTokens.accessToken);
      set({
        accessToken: storedTokens.accessToken,
        token: storedTokens.accessToken,
        user: cachedUser || null,
        isAuthenticated: true,
      });

      // Synchronize with live user profile from backend
      try {
        const res = await AuthService.getMe();
        const userObj = res.data || res;
        const mappedUser = mapApiUserToStoreUser(userObj);
        await secureStorage.setUser(mappedUser);
        set({ user: mappedUser, isAuthenticated: true });
      } catch (err) {
        if (!isNetworkFailure(err)) {
          const status = (err as any)?.status || (err as any)?.response?.status;
          // If token is invalid (401), reset state
          if (status === 401) {
            await secureStorage.clearTokens();
            authSession.clearSession();
            set({ ...initialState, isHydrated: true });
            return;
          }
        }
      }
    } catch {
      set({ ...initialState, isHydrated: true });
    } finally {
      set({ isLoading: false, isHydrated: true });
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

export const useUserStore = useAuthStore;
export default useAuthStore;
