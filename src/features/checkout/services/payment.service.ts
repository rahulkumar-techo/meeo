import api from "@/apis";
import { ApiRoute } from "@/routes";
import type { ApiResponse } from "@/types/api-response.type";

// ===============================
// Request / Response Interfaces
// ===============================

export interface InitializePaymentPayload {
  orderId: string;
  provider?: "RAZORPAY" | "STRIPE";
  paymentMethod?: string;
  returnUrl?: string;
  currency?: string;
}

export interface InitializePaymentData {
  paymentId: string;
  orderId: string;
  orderNumber: string;
  provider: string;
  providerPaymentId: string; // Razorpay Order ID (order_XXXX)
  clientSecret: string; // Razorpay Key ID
  checkoutUrl?: string;
  status: string;
  amount: number;
  currency: string;
  attemptNumber?: number;
}

export interface VerifyPaymentPayload {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface FailPaymentPayload {
  orderId: string;
  failureCode?: string;
  failureMessage?: string;
}

export interface RetryPaymentPayload {
  paymentId: string;
  paymentMethod?: string;
}

// ===============================
// Payment API Service
// ===============================

export const paymentApi = {
  /**
   * 1. Initialize payment session with Razorpay / Stripe
   * POST /api/v1/payments/initialize
   */
  async initializePayment(
    payload: InitializePaymentPayload
  ): Promise<ApiResponse<InitializePaymentData>> {
    const { data } = await api.post<ApiResponse<InitializePaymentData>>(
      ApiRoute.PAYMENTS.INITIALIZE,
      payload
    );
    return data;
  },

  /**
   * 2. Verify Razorpay payment signature after modal success
   * POST /api/v1/payments/verify
   */
  async verifyPayment(
    payload: VerifyPaymentPayload
  ): Promise<ApiResponse<any>> {
    const { data } = await api.post<ApiResponse<any>>(
      ApiRoute.PAYMENTS.VERIFY,
      payload
    );
    return data;
  },

  /**
   * 3. Record payment failure or cancellation on backend
   * POST /api/v1/payments/fail
   */
  async failPayment(
    payload: FailPaymentPayload
  ): Promise<ApiResponse<any>> {
    const { data } = await api.post<ApiResponse<any>>(
      ApiRoute.PAYMENTS.FAIL,
      payload
    );
    return data;
  },

  /**
   * 4. Retry payment for an existing order with a new attempt
   * POST /api/v1/payments/retry
   */
  async retryPayment(
    payload: RetryPaymentPayload
  ): Promise<ApiResponse<InitializePaymentData>> {
    const { data } = await api.post<ApiResponse<InitializePaymentData>>(
      ApiRoute.PAYMENTS.RETRY,
      payload
    );
    return data;
  },

  /**
   * 5. Poll or check payment status
   * GET /api/v1/payments/:id
   */
  async getPaymentStatus(paymentId: string): Promise<ApiResponse<any>> {
    const { data } = await api.get<ApiResponse<any>>(
      ApiRoute.PAYMENTS.GET_PAYMENT(paymentId)
    );
    return data;
  },
};

export const paymentService = paymentApi;
export default paymentApi;