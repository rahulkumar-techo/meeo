import { Platform } from 'react-native';
import Constants from 'expo-constants';

/**
 * Dynamically resolves the API Base URL.
 * Automatically handles:
 * - Production / staging via EXPO_PUBLIC_API_URL or BASE_URL
 * - Physical device running Expo Go (extracts host machine IP from Constants)
 * - Android Emulator (10.0.2.2)
 * - iOS Simulator & Web (127.0.0.1)
 */
export function getBaseUrl(): string {
  const envUrl = process.env.EXPO_PUBLIC_API_URL || process.env.BASE_URL;
  if (envUrl) {
    let clean = envUrl.trim().replace(/\/+$/, '');
    // If running in Android emulator and URL points to localhost/127.0.0.1, map to 10.0.2.2
    if (Platform.OS === 'android') {
      clean = clean.replace('127.0.0.1', '10.0.2.2').replace('localhost', '10.0.2.2');
    }
    return clean;
  }

  // Extract dev machine IP from Expo host URI when developing locally
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.manifest2?.extra?.expoGo?.debuggerHost ||
    (Constants as any).manifest?.debuggerHost;

  if (hostUri) {
    const hostIp = hostUri.split(':')[0];
    if (hostIp) {
      return `http://${hostIp}:5000/api/v1`;
    }
  }

  // Android Emulator default loopback
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/api/v1';
  }

  // Default fallback for iOS Simulator & Web
  return 'http://127.0.0.1:5000/api/v1';
}

export const API_CONFIG = {
  get baseURL() {
    return getBaseUrl();
  },
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};
