import {
  useQuery,
  useMutation,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import {
  paymentApi,
  InitializePaymentPayload,
  InitializePaymentData,
  VerifyPaymentPayload,
  FailPaymentPayload,
  RetryPaymentPayload,
} from "../services/payment.service";
import type { ApiResponse } from "@/types/api-response.type";
import { CART_QUERY_KEYS } from "@/features/cart";

// ===============================
// Query Key Factory
// ===============================

export const PAYMENT_QUERY_KEYS = {
  all: ["payments"] as const,
  details: (paymentId: string) => [...PAYMENT_QUERY_KEYS.all, paymentId] as const,
};

type QueryOptionsWithoutKeyAndFn<TData, TError = Error> = Omit<
  UseQueryOptions<TData, TError, TData, any>,
  "queryKey" | "queryFn"
>;

// ===============================
// TanStack Query Payment Hooks
// ===============================

/**
 * 1. Mutation hook to initialize payment session (Razorpay / Stripe)
 */
export const useInitializePayment = (
  options?: UseMutationOptions<ApiResponse<InitializePaymentData>, Error, InitializePaymentPayload>
) => {
  return useMutation({
    mutationFn: (payload: InitializePaymentPayload) =>
      paymentApi.initializePayment(payload),
    ...options,
  });
};

/**
 * 2. Mutation hook to verify payment signature on backend
 */
export const useVerifyPayment = (
  options?: UseMutationOptions<ApiResponse<any>, Error, VerifyPaymentPayload>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: VerifyPaymentPayload) =>
      paymentApi.verifyPayment(payload),
    onSuccess: (...args: any[]) => {
      // Clear cart and invalidate queries upon successful payment
      queryClient.setQueryData(CART_QUERY_KEYS.details(), null);
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      (options?.onSuccess as any)?.(...args);
    },
    ...options,
  });
};

/**
 * 3. Mutation hook to record payment failure or cancellation
 */
export const useFailPayment = (
  options?: UseMutationOptions<ApiResponse<any>, Error, FailPaymentPayload>
) => {
  return useMutation({
    mutationFn: (payload: FailPaymentPayload) =>
      paymentApi.failPayment(payload),
    ...options,
  });
};

/**
 * 4. Mutation hook to retry payment attempt for an existing order
 */
export const useRetryPayment = (
  options?: UseMutationOptions<ApiResponse<InitializePaymentData>, Error, RetryPaymentPayload>
) => {
  return useMutation({
    mutationFn: (payload: RetryPaymentPayload) =>
      paymentApi.retryPayment(payload),
    ...options,
  });
};

/**
 * 5. Query hook to fetch payment status / details
 */
export const usePaymentDetails = <TData = ApiResponse<any>>(
  paymentId: string,
  options?: QueryOptionsWithoutKeyAndFn<TData>
) => {
  return useQuery({
    queryKey: PAYMENT_QUERY_KEYS.details(paymentId),
    queryFn: () => paymentApi.getPaymentStatus(paymentId) as Promise<TData>,
    enabled: Boolean(paymentId),
    ...options,
  });
};
