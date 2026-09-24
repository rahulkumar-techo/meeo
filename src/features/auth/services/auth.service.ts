import { apiClient } from "@/apis";
import { ApiRoute } from "@/routes";

// Request & Response Payload Interfaces
export interface LoginRequest {
    email: string;
    password: string;
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
    tempOtp: string;
}

export interface VerifyOtpRequest {
    email?: string;
    code?: string;
    otp?: string;
}

export interface ResendOtpRequest {
    email: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    email?: string;
    code?: string;
    otp?: string;
    password: string;
}

export interface GoogleAuthRequest {
    idToken?: string;
    accessToken?: string;
}

export interface RefreshTokenRequest {
    refreshToken?: string;
}

export interface AuthResponse<T = any> {
    success: boolean;
    message?: string;
    data: T;
    token?: string;
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
        const otpValue = payload.otp || payload.code || '';
        const body: Record<string, any> = {
            otp: otpValue,
            code: otpValue,
        };
        if (payload.email) {
            body.email = payload.email;
        }
        const response = await apiClient.post<AuthResponse<T>>(
            ApiRoute.AUTH.OTP_VERIFICATION,
            body,
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
     * Reset password with verification code or token.
     */
    resetPassword: async <T = any>(
        payload: ResetPasswordRequest,
    ): Promise<AuthResponse<T>> => {
        const otpValue = payload.otp || payload.code;
        const body: Record<string, any> = {
            password: payload.password,
        };
        if (payload.email) body.email = payload.email;
        if (otpValue) {
            body.otp = otpValue;
            body.code = otpValue;
        }
        const response = await apiClient.post<AuthResponse<T>>(
            ApiRoute.AUTH.RESET_PASSWORD,
            body,
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
        const response = await apiClient.get<AuthResponse<T>>(ApiRoute.AUTH.ME);
        return response.data;
    },

    /**
     * Retrieve active session details.
     */
    getSession: async <T = any>(): Promise<AuthResponse<T>> => {
        const response = await apiClient.get<AuthResponse<T>>(
            ApiRoute.AUTH.SESSION,
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
