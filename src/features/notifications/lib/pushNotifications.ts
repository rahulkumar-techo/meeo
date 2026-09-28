import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import type {
  NotificationPermissionStatus,
  PushPlatform,
} from '../types/notification.types';

// Configure foreground notification presentation behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    priority: Notifications.AndroidNotificationPriority.HIGH,
  }),
});

// Configure default notification channel for Android 8.0+
export async function setupNotificationChannels(): Promise<void> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#208AEF',
      enableLights: true,
      enableVibrate: true,
      showBadge: true,
    });
  }
}

// Determine active push platform
export function getPushPlatform(): PushPlatform {
  if (Platform.OS === 'android') return 'android';
  if (Platform.OS === 'ios') return 'ios';
  return 'web';
}

// Generate descriptive user-agent string for device identification
export function getDeviceUserAgent(): string {
  if (Platform.OS === 'web') {
    return typeof navigator !== 'undefined' && navigator.userAgent
      ? navigator.userAgent
      : 'Mozilla/5.0 (Meeo Web Client)';
  }

  const appVersion = Constants.expoConfig?.version || '1.0.0';
  const osName = Platform.OS === 'android' ? 'Android' : 'iOS';
  const osVersion = Platform.Version || '';
  const deviceModel = Device.modelName || Device.productName || 'Mobile Device';

  return `MeeoApp/${appVersion} (${osName} ${osVersion}; ${deviceModel})`;
}

// Check current system notification permissions without prompting user
export async function getNotificationPermissionStatus(): Promise<NotificationPermissionStatus> {
  if (Platform.OS === 'web' && typeof window === 'undefined') {
    return 'unsupported';
  }

  try {
    const settings = await Notifications.getPermissionsAsync();
    if (settings.granted) return 'granted';
    if (settings.status === Notifications.PermissionStatus.DENIED) return 'denied';
    return 'undetermined';
  } catch {
    return 'unsupported';
  }
}

// Prompt system permission dialog to user
export async function requestNotificationPermissions(): Promise<NotificationPermissionStatus> {
  try {
    const settings = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
      },
    });

    if (settings.granted) {
      await setupNotificationChannels();
      return 'granted';
    }

    if (settings.status === Notifications.PermissionStatus.DENIED) {
      return 'denied';
    }

    return 'undetermined';
  } catch {
    return 'unsupported';
  }
}

// Retrieve FCM / APNs device push token with graceful fallback
export async function fetchPushDeviceToken(): Promise<string | null> {
  // 1. Try native device push token (FCM on Android / APNs on iOS)
  try {
    const deviceToken = await Notifications.getDevicePushTokenAsync();
    if (
      deviceToken?.data &&
      typeof deviceToken.data === 'string' &&
      deviceToken.data.length >= 10
    ) {
      return deviceToken.data;
    }
  } catch (nativeErr) {
    if (__DEV__) {
      console.log(
        '[PushNotification] Native device token not available, trying Expo push token fallback:',
        nativeErr
      );
    }
  }

  // 2. Fallback to Expo Push Token
  try {
    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ??
      Constants.easConfig?.projectId;

    const expoToken = await Notifications.getExpoPushTokenAsync(
      projectId ? { projectId } : undefined
    );

    if (
      expoToken?.data &&
      typeof expoToken.data === 'string' &&
      expoToken.data.length >= 10
    ) {
      return expoToken.data;
    }
  } catch (expoErr) {
    if (__DEV__) {
      console.log(
        '[PushNotification] Expo push token fetch error:',
        expoErr
      );
    }
  }

  // 3. In development/emulator environment, use a fallback token so backend registration is never blocked
  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    const devFallbackToken = `fcm_dev_${Platform.OS}_token_${Math.random().toString(36).substring(2, 12)}`;
    console.log('[PushNotification] Generated development fallback push token:', devFallbackToken);
    return devFallbackToken;
  }

  return null;
}
