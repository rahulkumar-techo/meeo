export const BASE_URL =
  process.env.EXPO_PUBLIC_BASE_URL ||
  process.env.BASE_URL ||
  'https://meeo-server.onrender.com/api/v1';

export const getBaseUrl = (): string => BASE_URL;

export const API_CONFIG = {
  baseURL: BASE_URL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};
