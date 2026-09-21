import axios from 'axios';
import { API_CONFIG, BASE_URL, getBaseUrl } from './config';
import { attachInterceptors, SetupApiClientOptions, setLoggingOut, getLoggingOut } from './interceptors';
import { normalizeApiError, isNetworkError, ApiError } from './errors';
import { secureStorage } from '@/lib/secureStorage';
import { authSession } from '@/lib/auth-session';

/**
 * Primary Axios client instance.
 */
export const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: API_CONFIG.headers,
});

export const apiClient = api;

let isConfigured = false;

/**
 * Configures the API client with custom token handlers or logout callbacks.
 */
export function setupApiClient(options?: SetupApiClientOptions) {
  if (isConfigured) return;
  isConfigured = true;
  attachInterceptors(api, options);
}

// Auto-initialize standard interceptors immediately
setupApiClient();

export {
  BASE_URL,
  getBaseUrl,
  API_CONFIG,
  setLoggingOut,
  getLoggingOut,
  normalizeApiError,
  isNetworkError,
  secureStorage,
  authSession,
};

export type { ApiError, SetupApiClientOptions };
export default api;
