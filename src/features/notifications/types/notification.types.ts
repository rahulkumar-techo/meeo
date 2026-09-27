export type PushPlatform = 'web' | 'android' | 'ios';

export type NotificationPermissionStatus =
  | 'granted'
  | 'denied'
  | 'undetermined'
  | 'unsupported';

export interface DeviceTokenPayload {
  token: string;
  platform: PushPlatform;
  userAgent?: string;
}

export interface DeviceTokenResponseData {
  id: string;
  userId: string;
  token: string;
  platform: PushPlatform | string;
  isActive: boolean;
  lastUsedAt: string;
}

export interface NotificationApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

export interface InAppNotification {
  id: string;
  userId: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
}
