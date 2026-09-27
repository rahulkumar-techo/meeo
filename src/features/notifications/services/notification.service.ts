import { apiClient } from '@/apis';
import { ApiRoute } from '@/routes';
import type {
  DeviceTokenPayload,
  DeviceTokenResponseData,
  NotificationApiResponse,
  InAppNotification,
} from '../types/notification.types';

export const NotificationService = {
  // Register or update FCM device push token with the backend
  registerDeviceToken: async (
    payload: DeviceTokenPayload
  ): Promise<NotificationApiResponse<DeviceTokenResponseData>> => {
    const response = await apiClient.post<
      NotificationApiResponse<DeviceTokenResponseData>
    >(ApiRoute.NOTIFICATIONS.REGISTER_DEVICE, payload);
    return response.data;
  },

  // Fetch count of unread in-app notifications
  getUnreadCount: async (): Promise<NotificationApiResponse<{ count: number }>> => {
    const response = await apiClient.get<
      NotificationApiResponse<{ count: number }>
    >(ApiRoute.NOTIFICATIONS.UNREAD_NOTIFICATIONS_COUNT);
    return response.data;
  },

  // Fetch all user in-app notifications
  getNotifications: async (): Promise<
    NotificationApiResponse<InAppNotification[]>
  > => {
    const response = await apiClient.get<
      NotificationApiResponse<InAppNotification[]>
    >(ApiRoute.NOTIFICATIONS.NOTIFICATIONS);
    return response.data;
  },

  // Mark single notification as read
  markAsRead: async (
    notificationId: string
  ): Promise<NotificationApiResponse<InAppNotification>> => {
    const response = await apiClient.patch<
      NotificationApiResponse<InAppNotification>
    >(ApiRoute.NOTIFICATIONS.READ_NOTIFICATION(notificationId));
    return response.data;
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<NotificationApiResponse<{ updated: number }>> => {
    const response = await apiClient.post<
      NotificationApiResponse<{ updated: number }>
    >(ApiRoute.NOTIFICATIONS.MARK_ALL_NOTIFICATION);
    return response.data;
  },
};

export default NotificationService;
