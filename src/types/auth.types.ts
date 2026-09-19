export type UserRole = 'customer' | 'admin' | 'delivery' | string;

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface User {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  phoneVerified?: boolean;
  avatar?: string;
  avatarUrl?: string;
  profileImage?: string;
  role?: UserRole;
  [key: string]: any;
}
