declare const __DEV__: boolean;

// Determine environment
export const isDevelopment =
  typeof __DEV__ !== 'undefined' ? Boolean(__DEV__) : process.env.NODE_ENV !== 'production';

// Production URLs (Render Server)
const PROD_BASE_URL =
  process.env.EXPO_PUBLIC_PROD_BASE_URL ||
  process.env.EXPO_PUBLIC_BASE_URL ||
  'https://meeo-server.onrender.com/api/v1';

const PROD_GRAPHQL_URL =
  process.env.EXPO_PUBLIC_PROD_GRAPHQL_URL ||
  process.env.EXPO_PUBLIC_GRAPHQL_URL ||
  'https://meeo-server.onrender.com/graphql';

// Local / Development URLs
const DEV_BASE_URL =
  process.env.EXPO_PUBLIC_LOCAL_BASE_URL ||
  process.env.LOCAL_EXPO_PUBLIC_BASE_URL ||
  process.env.LOCAL_EXPO_PUBLIC_BASE_UR ||
  process.env.LOCAL_BASE_URL ||
  PROD_BASE_URL;

const DEV_GRAPHQL_URL =
  process.env.EXPO_PUBLIC_LOCAL_GRAPHQL_URL ||
  process.env.LOCAL_EXPO_PUBLIC_GRAPHQL_URL ||
  PROD_GRAPHQL_URL;

// Active endpoints based on current environment
// export const BASE_URL = isDevelopment ? DEV_BASE_URL : PROD_BASE_URL;
export const BASE_URL = "https://meeo-server.onrender.com/api/v1"
export const GRAPHQL_URL = isDevelopment ? DEV_GRAPHQL_URL : PROD_GRAPHQL_URL;

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
