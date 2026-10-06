import { apiClient } from "@/apis";
import { ApiRoute } from "@/routes";

// Request & Response Payload Interfaces
export interface LoginRequest {
    email: string;
    password: string;
    deviceName?: string;
    deviceId?: string;
    rememberMe?: boolean;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface RegisterResponseData {
    user: {
        id: string;
        createdAt: Date | string;
        updatedAt: Date | string;
        email: string | null;
        firstName: string | null;
        lastName: string | null;
    };
    tempOtp?: string;
}

export interface VerifyOtpRequest {
    email: string;
    otp: string;
}

export interface VerifyOtpResponseData {
    email?: string;
    verified: boolean;
}

export interface VerifyResetOtpRequest {
    email: string;
    otp: string;
}

export interface VerifyResetOtpResponseData {
    email?: string;
    verified?: boolean;
}

export interface ResendOtpRequest {
    email: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    email: string;
    otp: string;
    password: string;
}

export interface GoogleAuthRequest {
    idToken?: string;
    deviceName?: string;
    deviceId?: string;
    accessToken?: string;
}

export interface RefreshTokenRequest {
    refreshToken?: string;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

export interface SetPasswordRequest {
    password: string;
}

export interface LinkGoogleRequest {
    idToken: string;
}

export interface AuthAccount {
    provider: 'PASSWORD' | 'GOOGLE' | string;
    linkedAt?: string;
}

export interface AuthResponse<T = any> {
    status?: string;
    success?: boolean;
    message?: string;
    data: T;
    token?: string;
    accessToken?: string;
    refreshToken?: string;
}

/**
 * Auth API Service
 * Encapsulates all authentication network operations (GET, POST, PATCH, DELETE).
 */
export const AuthService = {
    // ==========================================
    // POST Requests
    // ==========================================

    /**
     * Log in user with credentials.
     */
    login: async <T = any>(payload: LoginRequest): Promise<AuthResponse<T>> => {
        const response = await apiClient.post<AuthResponse<T>>(
            ApiRoute.AUTH.LOGIN,
            payload
        );
        return response.data;
    },

    /**
     * Register a new user account.
     */
    register: async <T = any>(
        payload: RegisterRequest
    ): Promise<AuthResponse<T>> => {
        const { firstName, lastName, email, password } = payload;
        const response = await apiClient.post<AuthResponse<T>>(
            ApiRoute.AUTH.SIGNUP,
            { firstName, lastName, email, password }
        );
        return response.data;
    },

    /**
     * Verify OTP code for email verification or password reset.
     */
    verifyOtp: async <T = any>(
        payload: VerifyOtpRequest,
    ): Promise<AuthResponse<T>> => {
        const response = await apiClient.post<AuthResponse<T>>(
            ApiRoute.AUTH.OTP_VERIFICATION,
            {
                email: payload.email,
                otp: payload.otp,
            },
        );
        return response.data;
    },

    /**
     * Resend OTP verification code to user email.
     */
    resendOtp: async <T = any>(
        payload: ResendOtpRequest,
    ): Promise<AuthResponse<T>> => {
        const response = await apiClient.post<AuthResponse<T>>(
            ApiRoute.AUTH.RESEND_OTP,
            payload,
        );
        return response.data;
    },

    /**
     * Request password reset link / OTP via email.
     */
    forgotPassword: async <T = any>(
        payload: ForgotPasswordRequest,
    ): Promise<AuthResponse<T>> => {
        const response = await apiClient.post<AuthResponse<T>>(
            ApiRoute.AUTH.FORGOT_PASSWORD,
            payload,
        );
        return response.data;
    },

    /**
     * Pre-validate OTP for password reset.
     */
    verifyResetOtp: async <T = any>(
        payload: VerifyResetOtpRequest,
    ): Promise<AuthResponse<T>> => {
        const response = await apiClient.post<AuthResponse<T>>(
            ApiRoute.AUTH.VERIFY_RESET_OTP,
            {
                email: payload.email,
                otp: payload.otp,
            },
        );
        return response.data;
    },

    /**
     * Reset password with verification code or token.
     */
    resetPassword: async <T = any>(
        payload: ResetPasswordRequest,
    ): Promise<AuthResponse<T>> => {
        const response = await apiClient.post<AuthResponse<T>>(
            ApiRoute.AUTH.RESET_PASSWORD,
            {
                email: payload.email,
                otp: payload.otp,
                password: payload.password,
            },
        );
        return response.data;
    },

    /**
     * Authenticate with Google OAuth token.
     */
    googleAuth: async <T = any>(
        payload: GoogleAuthRequest,
    ): Promise<AuthResponse<T>> => {
        const response = await apiClient.post<AuthResponse<T>>(
            ApiRoute.AUTH.GOOGLE_AUTH,
            payload,
        );
        return response.data;
    },

    /**
     * Refresh active access token using stored or provided refresh token.
     */
    refreshToken: async <T = any>(
        payload?: RefreshTokenRequest,
    ): Promise<AuthResponse<T>> => {
        const response = await apiClient.post<AuthResponse<T>>(
            ApiRoute.AUTH.REFRESH,
            payload,
        );
        return response.data;
    },

    /**
     * Explicit refresh access token alias.
     */
    refreshAccessToken: async <T = any>(
        refreshToken?: string,
    ): Promise<AuthResponse<T>> => {
        return AuthService.refreshToken<T>(refreshToken ? { refreshToken } : undefined);
    },

    /**
     * Log out current active session.
     */
    logout: async <T = any>(): Promise<AuthResponse<T>> => {
        const response = await apiClient.post<AuthResponse<T>>(
            ApiRoute.AUTH.LOGOUT,
        );
        return response.data;
    },

    /**
     * Log out all active sessions across devices.
     */
    logoutAll: async <T = any>(): Promise<AuthResponse<T>> => {
        const response = await apiClient.post<AuthResponse<T>>(
            ApiRoute.AUTH.LOGOUT_ALL,
        );
        return response.data;
    },

    // ==========================================
    // GET Requests
    // ==========================================

    /**
     * Fetch currently authenticated user profile.
     */
    getMe: async <T = any>(): Promise<AuthResponse<T>> => {
        try {
            const response = await apiClient.get<AuthResponse<T>>(ApiRoute.AUTH.ME);
            return response.data;
        } catch (err: any) {
            if (err?.status === 404 || err?.response?.status === 404) {
                const response = await apiClient.get<AuthResponse<T>>(ApiRoute.USER.PROFILE);
                return response.data;
            }
            throw err;
        }
    },

    /**
     * Retrieve active session list.
     */
    getSessions: async <T = any>(): Promise<AuthResponse<T>> => {
        const response = await apiClient.get<AuthResponse<T>>(
            ApiRoute.AUTH.SESSIONS,
        );
        return response.data;
    },

    /**
     * Alias for getSessions.
     */
    getSession: async <T = any>(): Promise<AuthResponse<T>> => {
        return AuthService.getSessions<T>();
    },

    /**
     * List connected sign-in methods (PASSWORD, GOOGLE).
     */
    getAccounts: async <T = any>(): Promise<AuthResponse<T>> => {
        const response = await apiClient.get<AuthResponse<T>>(
            ApiRoute.AUTH.ACCOUNTS,
        );
        return response.data;
    },

    /**
     * Change password for users with PASSWORD provider.
     */
    changePassword: async <T = any>(
        payload: ChangePasswordRequest,
    ): Promise<AuthResponse<T>> => {
        const response = await apiClient.post<AuthResponse<T>>(
            ApiRoute.AUTH.CHANGE_PASSWORD,
            payload,
        );
        return response.data;
    },

    /**
     * Set initial password for Google-only users.
     */
    setPassword: async <T = any>(
        payload: SetPasswordRequest,
    ): Promise<AuthResponse<T>> => {
        const response = await apiClient.post<AuthResponse<T>>(
            ApiRoute.AUTH.SET_PASSWORD,
            payload,
        );
        return response.data;
    },

    /**
     * Link Google account to current authenticated user.
     */
    linkGoogle: async <T = any>(
        payload: LinkGoogleRequest,
    ): Promise<AuthResponse<T>> => {
        const response = await apiClient.post<AuthResponse<T>>(
            ApiRoute.AUTH.LINK_GOOGLE,
            payload,
        );
        return response.data;
    },

    /**
     * Unlink a provider (PASSWORD or GOOGLE).
     */
    unlinkAccount: async <T = any>(
        provider: string,
    ): Promise<AuthResponse<T>> => {
        const response = await apiClient.delete<AuthResponse<T>>(
            ApiRoute.AUTH.UNLINK_ACCOUNT(provider),
        );
        return response.data;
    },

    // ==========================================
    // PATCH Requests
    // ==========================================

    /**
     * Generic patch helper for auth/session updates if needed.
     */
    updateSession: async <T = any>(
        sessionId: string,
        data: any,
    ): Promise<AuthResponse<T>> => {
        const response = await apiClient.patch<AuthResponse<T>>(
            ApiRoute.AUTH.SESSION_ID(sessionId),
            data,
        );
        return response.data;
    },

    // ==========================================
    // DELETE Requests
    // ==========================================

    /**
     * Revoke or delete a specific user session by session ID.
     */
    deleteSession: async <T = any>(
        sessionId: string,
    ): Promise<AuthResponse<T>> => {
        const response = await apiClient.delete<AuthResponse<T>>(
            ApiRoute.AUTH.SESSION_ID(sessionId),
        );
        return response.data;
    },
};

// Also export as AuthApi alias
export const AuthApi = AuthService;
export default AuthService;
