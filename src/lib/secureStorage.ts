import * as SecureStore from 'expo-secure-store';
import type { AuthTokens } from '@/types/auth.types';

const ACCESS_TOKEN_KEY = 'user_access_token';
const REFRESH_TOKEN_KEY = 'user_refresh_token';
const USER_KEY = 'user_profile_data';

export const secureStorage = {
  async getTokens(): Promise<AuthTokens | null> {
    try {
      const [accessToken, refreshToken] = await Promise.all([
        SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
        SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
      ]);
      if (!accessToken && !refreshToken) return null;
      return {
        accessToken: accessToken || '',
        refreshToken: refreshToken || undefined,
      };
    } catch {
      return null;
    }
  },

  async setTokens(tokens: AuthTokens): Promise<void> {
    try {
      if (tokens.accessToken) {
        await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, tokens.accessToken);
      }
      if (tokens.refreshToken) {
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refreshToken);
      }
    } catch (error) {
      console.error('Failed to save tokens in secureStorage:', error);
    }
  },

  async getUser<T = any>(): Promise<T | null> {
    try {
      const raw = await SecureStore.getItemAsync(USER_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  async setUser(user: any): Promise<void> {
    try {
      if (user) {
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
      } else {
        await SecureStore.deleteItemAsync(USER_KEY);
      }
    } catch (error) {
      console.error('Failed to save user profile in secureStorage:', error);
    }
  },

  async clearTokens(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);
    } catch (error) {
      console.error('Failed to clear tokens in secureStorage:', error);
    }
  },
};
