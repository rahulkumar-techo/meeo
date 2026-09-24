import { useState, useCallback } from 'react';
import RazorpayCheckout from 'react-native-razorpay';
import {
  useInitializePayment,
  useVerifyPayment,
  useFailPayment,
  useRetryPayment,
} from './payment.hook';
import { useAuthStore } from '@/features/auth';

// ===============================
// Types & Interfaces
// ===============================

export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface PaymentPrefill {
  name?: string;
  email?: string;
  contact?: string;
}

export interface InitiatePaymentOptions {
  orderId: string;
  orderNumber?: string;
  prefill?: PaymentPrefill;
  onSuccess?: (response: RazorpaySuccessResponse, orderId: string) => void | Promise<void>;
  onError?: (error: any) => void;
}

export interface RetryPaymentOptions {
  paymentId: string;
  orderId: string;
  orderNumber?: string;
  paymentMethod?: string;
  prefill?: PaymentPrefill;
  onSuccess?: (response: RazorpaySuccessResponse, orderId: string) => void | Promise<void>;
  onError?: (error: any) => void;
}

/**
 * Clean hook to handle Razorpay checkout using TanStack Query mutation hooks.
 */
export function useRazorpayPayment() {
  const [isOpeningModal, setIsOpeningModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = useAuthStore((state) => state.user);

  // TanStack Query Mutations
  const initializePaymentMutation = useInitializePayment();
  const verifyPaymentMutation = useVerifyPayment();
  const failPaymentMutation = useFailPayment();
  const retryPaymentMutation = useRetryPayment();

  const isProcessing =
    isOpeningModal ||
    initializePaymentMutation.isPending ||
    verifyPaymentMutation.isPending ||
    failPaymentMutation.isPending ||
    retryPaymentMutation.isPending;

  // Helper for customer prefill info
  const getPrefillData = (customPrefill?: PaymentPrefill) => ({
    name: customPrefill?.name || user?.name || 'Customer',
    email: customPrefill?.email || user?.email || 'customer@example.com',
    contact: customPrefill?.contact || user?.phone || '9876543210',
  });

  /**
   * 1. Initiate fresh payment (Initialize -> Open Razorpay -> Verify on Success -> Record on Fail)
   */
  const initiatePayment = useCallback(
    async (options: InitiatePaymentOptions): Promise<RazorpaySuccessResponse | null> => {
      setError(null);

      try {
        // Step 1: Initialize payment session on backend via TanStack mutation
        const initRes = await initializePaymentMutation.mutateAsync({
          orderId: options.orderId,
          provider: 'RAZORPAY',
          currency: 'INR',
        });

        const paymentData = initRes.data;
        if (!paymentData) {
          throw new Error('Failed to initialize payment.');
        }

        // Step 2: Prepare Razorpay modal options
        const razorpayOptions = {
          key: paymentData.clientSecret,
          order_id: paymentData.providerPaymentId,
          amount: paymentData.amount,
          currency: paymentData.currency || 'INR',
          name: 'Meeo Store',
          description: `Order #${options.orderNumber || paymentData.orderNumber || options.orderId}`,
          image: 'https://res.cloudinary.com/meeo/avatars/user-1.jpg',
          prefill: getPrefillData(options.prefill),
          theme: { color: '#2D2621' },
        };

        // Step 3: Open Razorpay modal
        setIsOpeningModal(true);
        const result: RazorpaySuccessResponse = await RazorpayCheckout.open(razorpayOptions);
        setIsOpeningModal(false);

        // Step 4: Verify payment signature on backend via TanStack mutation
        await verifyPaymentMutation.mutateAsync({
          orderId: options.orderId,
          razorpayOrderId: result.razorpay_order_id,
          razorpayPaymentId: result.razorpay_payment_id,
          razorpaySignature: result.razorpay_signature,
        });

        // Step 5: Trigger success callback
        if (options.onSuccess) {
          await options.onSuccess(result, options.orderId);
        }

        return result;
      } catch (err: any) {
        setIsOpeningModal(false);
        const errorMsg = err?.description || err?.message || 'Payment cancelled or failed';
        setError(errorMsg);

        // Step 6: Notify backend about failure/cancellation via TanStack mutation
        try {
          await failPaymentMutation.mutateAsync({
            orderId: options.orderId,
            failureCode: err?.code ? String(err.code) : 'USER_CANCELLED',
            failureMessage: errorMsg,
          });
        } catch {
          // Failure recording should not block UI error flow
        }

        if (options.onError) {
          options.onError(err);
        }

        return null;
      }
    },
    [user, initializePaymentMutation, verifyPaymentMutation, failPaymentMutation]
  );

  /**
   * 2. Retry payment attempt (Retry -> Open Razorpay -> Verify on Success -> Record on Fail)
   */
  const retryPayment = useCallback(
    async (options: RetryPaymentOptions): Promise<RazorpaySuccessResponse | null> => {
      setError(null);

      try {
        // Step 1: Request fresh retry attempt from backend via TanStack mutation
        const retryRes = await retryPaymentMutation.mutateAsync({
          paymentId: options.paymentId,
          paymentMethod: options.paymentMethod,
        });

        const paymentData = retryRes.data;
        if (!paymentData) {
          throw new Error('Failed to initiate payment retry.');
        }

        // Step 2: Prepare Razorpay modal options
        const razorpayOptions = {
          key: paymentData.clientSecret,
          order_id: paymentData.providerPaymentId,
          amount: paymentData.amount,
          currency: paymentData.currency || 'INR',
          name: 'Meeo Store',
          description: `Retry Order #${options.orderNumber || paymentData.orderNumber || options.orderId}`,
          image: 'https://res.cloudinary.com/meeo/avatars/user-1.jpg',
          prefill: getPrefillData(options.prefill),
          theme: { color: '#2D2621' },
        };

        // Step 3: Open Razorpay modal
        setIsOpeningModal(true);
        const result: RazorpaySuccessResponse = await RazorpayCheckout.open(razorpayOptions);
        setIsOpeningModal(false);

        // Step 4: Verify payment signature on backend via TanStack mutation
        await verifyPaymentMutation.mutateAsync({
          orderId: options.orderId,
          razorpayOrderId: result.razorpay_order_id,
          razorpayPaymentId: result.razorpay_payment_id,
          razorpaySignature: result.razorpay_signature,
        });

        // Step 5: Trigger success callback
        if (options.onSuccess) {
          await options.onSuccess(result, options.orderId);
        }

        return result;
      } catch (err: any) {
        setIsOpeningModal(false);
        const errorMsg = err?.description || err?.message || 'Payment retry failed';
        setError(errorMsg);

        // Step 6: Notify backend about retry failure via TanStack mutation
        try {
          await failPaymentMutation.mutateAsync({
            orderId: options.orderId,
            failureCode: err?.code ? String(err.code) : 'RETRY_FAILED',
            failureMessage: errorMsg,
          });
        } catch {
          // Failure recording should not block UI error flow
        }

        if (options.onError) {
          options.onError(err);
        }

        return null;
      }
    },
    [user, retryPaymentMutation, verifyPaymentMutation, failPaymentMutation]
  );

  return {
    initiatePayment,
    retryPayment,
    isProcessing,
    error,
    // Expose underlying mutations for direct access if needed
    initializePaymentMutation,
    verifyPaymentMutation,
    failPaymentMutation,
    retryPaymentMutation,
  };
}

export default useRazorpayPayment;
