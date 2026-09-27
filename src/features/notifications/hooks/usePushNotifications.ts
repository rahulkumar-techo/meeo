import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { useAuthStore } from '@/features/auth';
import { useNotificationStore } from '../store/useNotificationStore';

export function usePushNotifications() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const pushToken = useNotificationStore((s) => s.pushToken);
  const permissionStatus = useNotificationStore((s) => s.permissionStatus);
  const isRegistered = useNotificationStore((s) => s.isRegistered);
  const isRegistering = useNotificationStore((s) => s.isRegistering);
  const isCardDismissed = useNotificationStore((s) => s.isCardDismissed);
  const error = useNotificationStore((s) => s.error);

  const checkPermission = useNotificationStore((s) => s.checkPermission);
  const syncDeviceToken = useNotificationStore((s) => s.syncDeviceToken);
  const requestPermissionAndRegister = useNotificationStore(
    (s) => s.requestPermissionAndRegister
  );
  const registerCurrentToken = useNotificationStore(
    (s) => s.registerCurrentToken
  );
  const dismissCard = useNotificationStore((s) => s.dismissCard);

  const notificationListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    // Check permission and sync device token in background without blocking screen transitions
    const timerId = setTimeout(() => {
      syncDeviceToken(isAuthenticated);
    }, 200);

    // Listen for incoming notifications while app is in foreground
    notificationListener.current =
      Notifications.addNotificationReceivedListener((_notification) => {
        // Handle foreground notification received
      });

    // Listen for user interaction when tapping a notification banner
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;
        // Handle deep-link routing or custom navigation based on notification payload
      });

    return () => {
      clearTimeout(timerId);
      // Clean up event subscriptions on unmount
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [isAuthenticated, syncDeviceToken]);

  // Sync token to backend when user becomes authenticated or token updates
  useEffect(() => {
    if (isAuthenticated && pushToken && !isRegistered && !isRegistering) {
      registerCurrentToken();
    }
  }, [isAuthenticated, pushToken, isRegistered, isRegistering, registerCurrentToken]);

  // Permission card is shown if permission has not been granted and user has not dismissed it
  const shouldShowPermissionCard =
    permissionStatus !== 'granted' &&
    permissionStatus !== 'unsupported' &&
    !isCardDismissed;

  const handleRequestPermission = async () => {
    return requestPermissionAndRegister(isAuthenticated);
  };

  return {
    pushToken,
    permissionStatus,
    isRegistered,
    isRegistering,
    isCardDismissed,
    error,
    shouldShowPermissionCard,
    requestPermission: handleRequestPermission,
    dismissCard,
  };
}

export default usePushNotifications;
