import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { authSession } from '@/lib/auth-session';
import { secureStorage } from '@/lib/secureStorage';
import type { AuthTokens } from '@/types/auth.types';
import { normalizeApiError } from './errors';
import { getBaseUrl } from './config';

export interface SetupApiClientOptions {
  getTokens?: () => Promise<AuthTokens | null>;
  updateTokens?: (tokens: AuthTokens) => Promise<void>;
  logout?: () => Promise<void>;
}

let isLoggingOut = false;

export function setLoggingOut(val: boolean) {
  isLoggingOut = val;
}

export function getLoggingOut(): boolean {
  return isLoggingOut;
}

/**
 * Attaches request and response interceptors to an Axios instance.
 */
export function attachInterceptors(
  apiInstance: AxiosInstance,
  options?: SetupApiClientOptions
) {
  // Request Interceptor: Synchronously inject auth token and guest sessionId
  apiInstance.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    let token = authSession.getAccessToken();

    // If not in memory yet, pull from secure storage
    if (!token) {
      const stored = options?.getTokens
        ? await options.getTokens()
        : await secureStorage.getTokens();

      if (stored?.accessToken) {
        token = stored.accessToken;
        authSession.setAccessToken(token);
      }
    }

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.withCredentials = true;

    // Inject guest session ID if present
    let sessionId = authSession.getSessionId();
    if (!sessionId) {
      sessionId = await secureStorage.getSessionId();
      if (sessionId) {
        authSession.setSessionId(sessionId);
      }
    }

    if (sessionId && config.headers) {
      config.headers['x-session-id'] = sessionId;
      config.headers['X-Session-Id'] = sessionId;
      config.headers['Session-Id'] = sessionId;
      config.headers['session-id'] = sessionId;
      config.headers['sessionId'] = sessionId;
      config.headers['Cookie'] = `sessionId=${sessionId}; session=${sessionId}`;
    }

    return config;
  });

  // Response Interceptor: HTML Response Guard, Session Capture, Silent 401 Refresh & Graceful Error Normalization
  apiInstance.interceptors.response.use(
    (res) => {
      // Automatically capture and persist guest sessionId from response payload or headers
      const resSessionId =
        res.data?.data?.sessionId ||
        res.data?.sessionId ||
        res.headers?.['x-session-id'] ||
        res.headers?.['session-id'];

      if (resSessionId && typeof resSessionId === 'string') {
        authSession.setSessionId(resSessionId);
        secureStorage.setSessionId(resSessionId);
      }

      // Guard against accidental SPA HTML index fallback for missing/unrouted backend endpoints
      if (
        typeof res.data === 'string' &&
        (res.data.trim().startsWith('<!doctype html') || res.data.trim().startsWith('<html'))
      ) {
        return Promise.reject(
          normalizeApiError({
            message: `Backend endpoint '${res.config.url}' returned HTML instead of JSON. Check if server endpoint exists.`,
            response: {
              status: 404,
              data: {
                message: `Backend endpoint '${res.config.url}' returned HTML instead of JSON.`,
              },
            },
          } as any)
        );
      }
      return res;
    },
    async (error: AxiosError<{ message?: string; error?: string }>) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      // Determine if the failed request is an authentication entrypoint
      const requestUrl = originalRequest?.url || '';
      const isAuthEndpoint =
        requestUrl.includes('/auth/login') ||
        requestUrl.includes('/auth/register') ||
        requestUrl.includes('/auth/verify-otp') ||
        requestUrl.includes('/auth/resend-otp') ||
        requestUrl.includes('/auth/forgot-password') ||
        requestUrl.includes('/auth/reset-password') ||
        requestUrl.includes('/auth/refresh');

      // Silent 401 Refresh only for protected routes (not login/register)
      if (
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry &&
        !isLoggingOut &&
        !isAuthEndpoint
      ) {
        originalRequest._retry = true;

        try {
          const stored = options?.getTokens
            ? await options.getTokens()
            : await secureStorage.getTokens();

          if (!stored?.refreshToken) {
            throw new Error('Session expired. Please sign in again.');
          }

          const refreshUrl = `${getBaseUrl()}/auth/refresh`;
          const { data } = await axios.post(
            refreshUrl,
            { refreshToken: stored.refreshToken },
            { headers: { 'Content-Type': 'application/json' } }
          );

          const newToken =
            data.token ||
            (data as any).accessToken ||
            data?.data?.token ||
            data?.data?.accessToken;

          if (!newToken) {
            throw new Error('Session expired. Please sign in again.');
          }

          authSession.setAccessToken(newToken);
          const newTokens: AuthTokens = {
            accessToken: newToken,
            refreshToken:
              (data as any).refreshToken ||
              data?.data?.refreshToken ||
              stored.refreshToken,
          };

          if (options?.updateTokens) {
            await options.updateTokens(newTokens);
          } else {
            await secureStorage.setTokens(newTokens);
          }

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }

          return apiInstance(originalRequest);
        } catch {
          authSession.clearSession();
          await secureStorage.clearTokens();

          if (options?.logout) {
            await options.logout();
          }

          return Promise.reject(normalizeApiError(error));
        }
      }

      return Promise.reject(normalizeApiError(error));
    }
  );
}
