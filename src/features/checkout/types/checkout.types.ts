import { ApiResponse } from "@/types/api-response.type";
import { UserAddress } from "@/features/address/validations/address.validation";

export type PaymentMethod = "UPI" | "COD";

export interface ValidateCheckoutPayload {
  shippingAddressId?: string;
  billingAddressId?: string;
  shippingAddress?: Partial<UserAddress>;
  couponCode?: string;
  currency?: string;
}

export interface CheckoutSummary {
  itemCount: number;
  totalUnits: number;
  subtotal: number;
  discountTotal: number;
  shippingTotal: number;
  taxTotal: number;
  grandTotal: number;
  currency: string;
}

export interface CheckoutCoupon {
  code: string;
  type: string;
  discountAmount: number;
}

export interface CheckoutItem {
  cartItemId?: string;
  variantId?: string;
  productId?: string;
  productName: string;
  sku?: string;
  unitPrice: number;
  compareAtPrice?: number;
  quantity: number;
  lineTotal: number;
  availableStock?: number;
  variantSnapshot?: {
    sku?: string;
    thumbnail?: string;
    attributes?: Array<{ attribute: string; value: string }>;
  };
}

export interface CheckoutValidationData {
  isValid: boolean;
  summary: CheckoutSummary;
  coupon?: CheckoutCoupon | null;
  promotions?: any[];
  shippingAddress?: Partial<UserAddress>;
  items: CheckoutItem[];
}

export interface CreateOrderPayload {
  shippingAddressId: string;
  billingAddressId?: string;
  couponCode?: string;
  notes?: string;
  currency?: string;
  paymentMethod?: PaymentMethod;
}

export interface OrderFinancials {
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  shippingTotal: number;
  grandTotal: number;
  currency: string;
}

export interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface CreatedOrder {
  id: string;
  orderNumber: string;
  userId: string;
  status: string;
  financials: OrderFinancials;
  items: OrderItem[];
}

export type CheckoutValidationResponse = ApiResponse<CheckoutValidationData>;
export type CreateOrderResponse = ApiResponse<CreatedOrder>;
