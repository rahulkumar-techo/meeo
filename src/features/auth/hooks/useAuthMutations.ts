import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AuthService,
  LoginRequest,
  RegisterRequest,
  VerifyOtpRequest,
  ResendOtpRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  GoogleAuthRequest,
  AuthResponse,
} from '../services/auth.service';
import { useAuthStore, mapApiUserToStoreUser } from '../store/useAuthStore';
import type { AuthTokens } from '@/types/auth.types';

export const AUTH_QUERY_KEYS = {
  me: ['auth', 'me'] as const,
};

/**
 * Extracts tokens and user profile from an AuthResponse
 */
function extractAuthData(response: any): { tokens: AuthTokens; user: any } {
  if (!response) {
    return { tokens: { accessToken: '' }, user: mapApiUserToStoreUser(null) };
  }

  const resData = response.data || response;
  const accessToken =
    response.token ||
    response.accessToken ||
    response.jwt ||
    resData?.token ||
    resData?.accessToken ||
    resData?.jwt ||
    resData?.tokens?.accessToken ||
    resData?.tokens?.token ||
    response?.tokens?.accessToken ||
    '';

  const refreshToken =
    response.refreshToken ||
    resData?.refreshToken ||
    resData?.tokens?.refreshToken ||
    response?.tokens?.refreshToken;

  const rawUser =
    resData?.user ||
    resData?.profile ||
    response?.user ||
    response?.profile ||
    (resData?.id ? resData : null);

  const user = mapApiUserToStoreUser(rawUser);

  return {
    tokens: {
      accessToken,
      refreshToken,
    },
    user,
  };
}

/**
 * Hook for User Login via TanStack Query Mutation
 */
export function useLogin() {
  const queryClient = useQueryClient();
  const loginStore = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: (payload: LoginRequest) =>
      AuthService.login({
        ...payload,
        email: payload.email.trim().toLowerCase(),
      }),
    onSuccess: async (response) => {
      const { tokens, user } = extractAuthData(response);
      if (tokens.accessToken) {
        await loginStore(tokens, user);
        queryClient.setQueryData(AUTH_QUERY_KEYS.me, user);
        queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.me });
      }
    },
  });
}

/**
 * Hook for User Registration via TanStack Query Mutation
 */
export function useRegister() {
  const setPendingEmail = useAuthStore((state) => state.setPendingEmail);

  return useMutation({
    mutationFn: (payload: RegisterRequest) =>
      AuthService.register({
        ...payload,
        email: payload.email.trim().toLowerCase(),
        firstName: payload.firstName.trim(),
        lastName: payload.lastName.trim(),
      }),
    onSuccess: (_, variables) => {
      setPendingEmail(variables.email.trim().toLowerCase());
    },
  });
}

/**
 * Hook for Forgot Password Request
 */
export function useForgotPassword() {
  const setPendingEmail = useAuthStore((state) => state.setPendingEmail);

  return useMutation({
    mutationFn: (payload: ForgotPasswordRequest) =>
      AuthService.forgotPassword({
        ...payload,
        email: payload.email.trim().toLowerCase(),
      }),
    onSuccess: (_, variables) => {
      setPendingEmail(variables.email.trim().toLowerCase());
    },
  });
}

export function useVerifyOtp() {
  return useMutation({
    mutationFn: (payload: VerifyOtpRequest) =>
      AuthService.verifyOtp({
        email: payload.email.trim().toLowerCase(),
        otp: String(payload.otp).trim(),
      }),
  });
}

/**
 * Hook for Resending Verification OTP
 */
export function useResendOtp() {
  return useMutation({
    mutationFn: (payload: ResendOtpRequest) =>
      AuthService.resendOtp({
        email: payload.email.trim().toLowerCase(),
      }),
  });
}

/**
 * Hook for Resetting Password
 */
export function useResetPassword() {
  const setPendingEmail = useAuthStore((state) => state.setPendingEmail);

  return useMutation({
    mutationFn: (payload: ResetPasswordRequest) =>
      AuthService.resetPassword({
        email: payload.email.trim().toLowerCase(),
        otp: String(payload.otp).trim(),
        password: payload.password,
      }),
    onSuccess: () => {
      setPendingEmail(null);
    },
  });
}

/**
 * Hook for Google OAuth Login
 */
export function useGoogleAuth() {
  const queryClient = useQueryClient();
  const loginStore = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: (payload: GoogleAuthRequest) => AuthService.googleAuth(payload),
    onSuccess: async (response) => {
      const { tokens, user } = extractAuthData(response);
      if (tokens.accessToken) {
        await loginStore(tokens, user);
        queryClient.setQueryData(AUTH_QUERY_KEYS.me, user);
        queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.me });
      }
    },
  });
}

/**
 * Hook for User Logout
 */
export function useLogout() {
  const queryClient = useQueryClient();
  const logoutStore = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: () => AuthService.logout(),
    onSettled: async () => {
      await logoutStore();
      queryClient.clear();
    },
  });
}

/**
 * Hook for Current User Profile Query
 */
export function useCurrentUser() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setUser = useAuthStore((state) => state.setUser);

  return useQuery({
    queryKey: AUTH_QUERY_KEYS.me,
    queryFn: async () => {
      const response = await AuthService.getMe();
      const user = mapApiUserToStoreUser(response.data || response);
      setUser(user);
      return user;
    },
    enabled: isAuthenticated,
  });
}
