import api from "@/apis";
import { ApiRoute } from "@/routes";
import type {
  CheckoutValidationResponse,
  ValidateCheckoutPayload,
  CreateOrderPayload,
  CreateOrderResponse,
} from "../types/checkout.types";

export const checkoutApi = {
  /**
   * 1. Validate order before checkout (verifies inventory, cart, pricing, taxes, coupon)
   * POST /api/v1/orders/validate-checkout
   */
  async validateCheckout(payload?: ValidateCheckoutPayload): Promise<CheckoutValidationResponse> {
    const { data } = await api.post<CheckoutValidationResponse>(
      ApiRoute.ORDERS.VALIDATE_CHECKOUT_ORDER,
      payload ?? {}
    );
    return data;
  },

  /**
   * 2. Transactional Order Placement & Checkout
   * POST /api/v1/orders/checkout
   */
  async createOrder(
    payload: CreateOrderPayload,
    idempotencyKey?: string
  ): Promise<CreateOrderResponse> {
    const headers: Record<string, string> = {};
    if (idempotencyKey) {
      headers["idempotency-key"] = idempotencyKey;
    }

    const { data } = await api.post<CreateOrderResponse>(
      ApiRoute.ORDERS.ORDER_CHECKOUT,
      payload,
      { headers: Object.keys(headers).length > 0 ? headers : undefined }
    );
    return data;
  },
};

export const checkoutService = checkoutApi;
export default checkoutApi;