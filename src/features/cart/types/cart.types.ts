export interface CartProductBrand {
  id?: string;
  name?: string;
  slug?: string;
  logoUrl?: string;
}

export interface CartProductCategory {
  id?: string;
  name?: string;
  slug?: string;
}

export interface CartProductImage {
  id?: string;
  url: string;
  thumbnailUrl?: string;
  altText?: string;
}

export interface CartProduct {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  thumbnail?: string;
  imageUrl?: string;
  bannerImage?: { url: string; altText?: string };
  images?: CartProductImage[];
  category?: CartProductCategory | string;
  brand?: CartProductBrand | string;
}

export interface CartVariantAttribute {
  attribute: string;
  value: string;
}

export interface CartVariant {
  id?: string;
  sku?: string;
  barcode?: string;
  price?: string | number;
  compareAtPrice?: string | number;
  status?: string;
  attributes?: CartVariantAttribute[] | Record<string, any>;
}

export interface CartItemStockInfo {
  availableStock?: number;
  isAvailable?: boolean;
  isLowStock?: boolean;
}

export interface CartItem {
  id: string; // Cart Item UUID
  cartId?: string;
  variantId?: string;
  productId?: string;
  productVariantId?: string | null;
  quantity: number;
  unitPrice: number;
  compareAtPrice?: number | null;
  lineTotal: number;
  stockInfo?: CartItemStockInfo;
  product: CartProduct;
  variant?: CartVariant;
  createdAt?: string;
  updatedAt?: string;
  price?: number | string; // Fallback compatibility
}

export interface CartSummary {
  itemCount: number;
  totalItems: number;
  subtotal: number;
  currency: string;
}

export interface Cart {
  id: string;
  userId?: string;
  isGuest?: boolean;
  expiresAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  summary?: CartSummary;
  items: CartItem[];
  // Convenience fallbacks
  subtotal?: number;
  discount?: number;
  shipping?: number;
  total?: number;
  itemCount?: number;
  couponCode?: string;
}

export interface AddToCartPayload {
  variantId: string;
  quantity: number;
}

export interface UpdateCartItemPayload {
  quantity: number;
}

export interface CartApiResponse<T = Cart> {
  success: boolean;
  message?: string;
  data: T;
}
