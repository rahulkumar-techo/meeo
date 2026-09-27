import { create } from 'zustand';
import { NotificationService } from '../services/notification.service';
import {
  getNotificationPermissionStatus,
  requestNotificationPermissions,
  fetchPushDeviceToken,
  getPushPlatform,
  getDeviceUserAgent,
  setupNotificationChannels,
} from '../lib/pushNotifications';
import type { NotificationPermissionStatus } from '../types/notification.types';

interface NotificationState {
  pushToken: string | null;
  permissionStatus: NotificationPermissionStatus;
  isRegistered: boolean;
  isRegistering: boolean;
  isCardDismissed: boolean;
  error: string | null;
}

interface NotificationActions {
  checkPermission: () => Promise<NotificationPermissionStatus>;
  syncDeviceToken: (isAuthenticated?: boolean) => Promise<boolean>;
  requestPermissionAndRegister: (isAuthenticated?: boolean) => Promise<boolean>;
  registerCurrentToken: () => Promise<boolean>;
  dismissCard: () => void;
  resetCardDismissal: () => void;
  setPushToken: (token: string | null) => void;
}

export type NotificationStore = NotificationState & NotificationActions;

const initialState: NotificationState = {
  pushToken: null,
  permissionStatus: 'undetermined',
  isRegistered: false,
  isRegistering: false,
  isCardDismissed: false,
  error: null,
};

export const useNotificationStore = create<NotificationStore>()((set, get) => ({
  ...initialState,

  checkPermission: async () => {
    const status = await getNotificationPermissionStatus();
    set({ permissionStatus: status });
    return status;
  },

  // Checks permission, retrieves push token, and registers with backend if granted
  syncDeviceToken: async (isAuthenticated = true) => {
    if (get().isRegistered || get().isRegistering) {
      return false;
    }

    const status = await getNotificationPermissionStatus();
    set({ permissionStatus: status });

    if (status !== 'granted') {
      return false;
    }

    await setupNotificationChannels();
    let token = get().pushToken;
    if (!token) {
      token = await fetchPushDeviceToken();
      if (token) {
        set({ pushToken: token });
      }
    }

    if (!token || get().isRegistered || get().isRegistering) {
      return false;
    }

    set({ isRegistering: true, error: null });

    try {
      const platform = getPushPlatform();
      const userAgent = getDeviceUserAgent();

      if (typeof __DEV__ !== 'undefined' && __DEV__) {
        console.log('[NotificationService] Registering device token to backend:', {
          token,
          platform,
          userAgent,
        });
      }

      const response = await NotificationService.registerDeviceToken({
        token,
        platform,
        userAgent,
      });

      if (typeof __DEV__ !== 'undefined' && __DEV__) {
        console.log('[NotificationService] Device registered successfully:', response);
      }

      set({ isRegistered: true, isCardDismissed: true });
      return true;
    } catch (err: any) {
      if (typeof __DEV__ !== 'undefined' && __DEV__) {
        console.warn(
          '[NotificationService] Device registration failed:',
          err?.response?.data || err?.message
        );
      }
      const errorMessage =
        err?.response?.data?.message || err?.message || 'Error registering device';
      set({ error: errorMessage });
      return false;
    } finally {
      set({ isRegistering: false });
    }
  },

  requestPermissionAndRegister: async (isAuthenticated = true) => {
    set({ isRegistering: true, error: null });

    try {
      const status = await requestNotificationPermissions();
      set({ permissionStatus: status });

      if (status !== 'granted') {
        set({ isRegistering: false });
        return false;
      }

      await setupNotificationChannels();
      const token = await fetchPushDeviceToken();

      if (!token) {
        set({
          isRegistering: false,
          error: 'Failed to generate device push token',
        });
        return false;
      }

      set({ pushToken: token });

      const platform = getPushPlatform();
      const userAgent = getDeviceUserAgent();

      if (typeof __DEV__ !== 'undefined' && __DEV__) {
        console.log('[NotificationService] Sending POST /api/v1/notifications/devices:', {
          token,
          platform,
          userAgent,
        });
      }

      const response = await NotificationService.registerDeviceToken({
        token,
        platform,
        userAgent,
      });

      if (typeof __DEV__ !== 'undefined' && __DEV__) {
        console.log('[NotificationService] Server response:', response);
      }

      set({ isRegistered: true, isCardDismissed: true });
      return true;
    } catch (err: any) {
      if (typeof __DEV__ !== 'undefined' && __DEV__) {
        console.warn(
          '[NotificationService] Failed to register device:',
          err?.response?.data || err?.message
        );
      }
      const errorMessage =
        err?.response?.data?.message || err?.message || 'Error registering device';
      set({ error: errorMessage });
      return false;
    } finally {
      set({ isRegistering: false });
    }
  },

  registerCurrentToken: async () => {
    const { pushToken, isRegistered, isRegistering } = get();
    if (!pushToken || isRegistered || isRegistering) return false;

    set({ isRegistering: true, error: null });

    try {
      const platform = getPushPlatform();
      const userAgent = getDeviceUserAgent();

      if (typeof __DEV__ !== 'undefined' && __DEV__) {
        console.log('[NotificationService] Registering existing token:', {
          token: pushToken,
          platform,
          userAgent,
        });
      }

      const response = await NotificationService.registerDeviceToken({
        token: pushToken,
        platform,
        userAgent,
      });

      if (typeof __DEV__ !== 'undefined' && __DEV__) {
        console.log('[NotificationService] Registration response:', response);
      }

      set({ isRegistered: true, isCardDismissed: true });
      return true;
    } catch (err: any) {
      if (typeof __DEV__ !== 'undefined' && __DEV__) {
        console.warn(
          '[NotificationService] Registration failed:',
          err?.response?.data || err?.message
        );
      }
      const errorMessage =
        err?.response?.data?.message || err?.message || 'Error registering device';
      set({ error: errorMessage });
      return false;
    } finally {
      set({ isRegistering: false });
    }
  },

  dismissCard: () => {
    set({ isCardDismissed: true });
  },

  resetCardDismissal: () => {
    set({ isCardDismissed: false });
  },

  setPushToken: (token) => {
    set({ pushToken: token });
  },
}));

export default useNotificationStore;
