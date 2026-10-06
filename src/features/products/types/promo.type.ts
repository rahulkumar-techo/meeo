/**
 * Promotion domain types — derived from API response shapes.
 */

export type PromotionType =
  | 'PERCENTAGE'
  | 'FIXED_DISCOUNT'
  | 'BUY_X_GET_Y'
  | 'FREE_SHIPPING'
  | 'PRODUCT_DISCOUNT'
  | 'CATEGORY_DISCOUNT'
  | 'BRAND_DISCOUNT'
  | 'FLASH_SALE';

export type PromotionStatus =
  | 'DRAFT'
  | 'SCHEDULED'
  | 'ACTIVE'
  | 'PAUSED'
  | 'EXPIRED'
  | 'ARCHIVED';

export type StackingRule =
  | 'EXCLUSIVE'
  | 'STACKABLE_WITH_OTHERS'
  | 'STACKABLE_WITH_COUPONS';

// --- GET /promotions/active ---

export interface ActivePromotion {
  id: string;
  name: string;
  slug: string;
  code?: string | null;
  description?: string | null;
  type: PromotionType;
  discountValue?: string | null;
  isAutomatic: boolean;
  startsAt?: string | null;
  endsAt?: string | null;
}

export interface ActivePromotionsResponse {
  status: string;
  data: ActivePromotion[];
}

// --- POST /promotions/promotion-preview ---

export interface CartPreviewItem {
  productId: string;
  variantId?: string | null;
  categoryId?: string | null;
  brandId?: string | null;
  productName: string;
  unitPrice: number;
  quantity: number;
}

export interface CartPreviewRequest {
  promoCode?: string | null;
  shippingFee?: number;
  items: CartPreviewItem[];
}

export interface AppliedPromotion {
  id: string;
  name: string;
  slug: string;
  code?: string | null;
  type: PromotionType;
  stackingRule: StackingRule;
  isAutomatic: boolean;
  discountAmount: number;
  isFreeShipping: boolean;
  freeShippingDiscount: number;
  matchedItemCount: number;
  description?: string | null;
}

export interface ItemAllocation {
  productId: string;
  variantId?: string | null;
  productName: string;
  originalLineTotal: number;
  discountAmount: number;
  finalLineTotal: number;
  appliedPromotionId: string;
  appliedPromotionName: string;
}

export interface CartPreviewData {
  originalSubtotal: number;
  discountSubtotal: number;
  shippingFee: number;
  shippingDiscount: number;
  finalShippingFee: number;
  isFreeShipping: boolean;
  grandTotal: number;
  totalDiscount: number;
  appliedPromotions: AppliedPromotion[];
  itemAllocations: ItemAllocation[];
}

export interface CartPreviewResponse {
  status: string;
  data: CartPreviewData;
}

// --- POST /promotions/validate-code ---

export interface ValidateCodeRequest {
  code: string;
  subtotal: number;
}

export interface ValidatedPromotion {
  id: string;
  name: string;
  code: string;
  type: PromotionType;
  discountValue?: string | null;
  minOrderSubtotal?: string | null;
}

export interface ValidateCodeData {
  valid: boolean;
  promotion?: ValidatedPromotion;
}

export interface ValidateCodeResponse {
  status: string;
  data: ValidateCodeData;
}

// --- GET /promotions/my-history ---

export interface PromotionUsage {
  id: string;
  promotionId: string;
  orderId: string;
  discountAmount: string;
  createdAt: string;
  promotion: {
    id: string;
    name: string;
    slug: string;
    code?: string | null;
    type: PromotionType;
  };
  order: {
    id: string;
    orderNumber: string;
    grandTotal: string;
    createdAt: string;
  };
}

export interface PromotionHistoryData {
  usages: PromotionUsage[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PromotionHistoryResponse {
  status: string;
  data: PromotionHistoryData;
}
