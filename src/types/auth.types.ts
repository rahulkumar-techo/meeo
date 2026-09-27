export type UserRole = 'customer' | 'admin' | 'delivery' | 'super_admin' | string;

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface User {
  id: string;
  userId?: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string | null;
  phoneVerified?: boolean;
  emailVerified?: boolean;
  avatar?: string | null;
  avatarUrl?: string | null;
  profileImage?: string | null;
  status?: string;
  role: UserRole;
  roles?: string[];
  createdAt?: string;
  updatedAt?: string;
  sessionId?: string;
  sessionExpiresAt?: string;
}
