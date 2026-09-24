import api from "@/apis";
import { ApiRoute } from "@/routes";
import type { ApiResponse } from "@/types/api-response.type";

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
}

export const paymentApi = {
  /**
   * 1. Initialize payment gateway session (e.g. Razorpay Order)
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
   * 2. Poll or check payment status after client payment completes
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