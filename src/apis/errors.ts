import { AxiosError } from 'axios';

export interface ApiError {
  status?: number;
  message: string;
  errors?: Record<string, string[]> | any;
  code?: string;
  data?: any;
  isNetworkError?: boolean;
}

/**
 * Checks whether an error is caused by network failure (offline, timeout, refused connection).
 */
export function isNetworkError(error: any): boolean {
  if (!error) return false;
  return (
    !error.response ||
    error.isNetworkError ||
    error.code === 'ERR_NETWORK' ||
    error.code === 'ECONNABORTED' ||
    error.code === 'ECONNREFUSED' ||
    error.message?.toLowerCase().includes('network error') ||
    error.message?.toLowerCase().includes('timeout')
  );
}

/**
 * Normalizes Axios and backend errors into a consistent, user-friendly ApiError object.
 */
export function normalizeApiError(error: AxiosError<{ message?: string; error?: string; errors?: any }> | any): ApiError {
  if (!error || typeof error !== 'object') {
    return {
      message: String(error) || 'An unexpected error occurred.',
    };
  }

  // Handle network / offline / timeout errors
  if (!error.response) {
    if (error.code === 'ECONNABORTED' || error.message?.toLowerCase().includes('timeout')) {
      return {
        status: 408,
        message: 'Request timed out. Please check your internet connection.',
        isNetworkError: true,
      };
    }

    if (error.code === 'ERR_NETWORK' || error.message?.toLowerCase().includes('network error')) {
      return {
        status: 0,
        message: 'Unable to connect to the server. Please check your network or ensure backend server is running.',
        isNetworkError: true,
      };
    }

    return {
      status: 0,
      message: error.message || 'Unable to connect to server. Please check your internet connection.',
      isNetworkError: true,
    };
  }

  const { status, data } = error.response;
  const serverMessage =
    data?.message ||
    data?.error ||
    data?.msg ||
    data?.description ||
    (Array.isArray(data?.errors) && data.errors[0]?.message) ||
    (typeof data?.errors === 'string' ? data.errors : undefined);

  switch (status) {
    case 400:
      return {
        status,
        message: serverMessage || 'Invalid request. Please check your submitted information.',
        errors: data?.errors,
        data,
      };

    case 401:
      return {
        status,
        message: serverMessage || 'Invalid email or password. Please try again.',
        data,
      };

    case 403:
      return {
        status,
        message: serverMessage || 'Access forbidden. You do not have permission to perform this action.',
        data,
      };

    case 404:
      return {
        status,
        message: serverMessage || 'The requested resource was not found.',
        data,
      };

    case 409:
      return {
        status,
        message: serverMessage || 'A conflict occurred (e.g. email or record already exists).',
        errors: data?.errors,
        data,
      };

    case 422:
      return {
        status,
        message: serverMessage || 'Validation failed. Please verify your inputs.',
        errors: data?.errors,
        data,
      };

    case 429:
      return {
        status,
        message: serverMessage || 'Too many requests. Please try again in a few moments.',
        data,
      };

    case 500:
    case 502:
    case 503:
    case 504:
      return {
        status,
        message: serverMessage || 'Server encountered an issue. Please try again shortly.',
        data,
      };

    default:
      return {
        status,
        message: serverMessage || error.message || 'An unexpected error occurred.',
        data,
      };
  }
}
