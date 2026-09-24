/**
 * =============================================================================
 * Product Domain Types & Customer API Interfaces
 * Reference: app-docs/product.customer.md
 * =============================================================================
 */

export interface GetProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  brandId?: string;
  isFeatured?: boolean;
  sortBy?: 'createdAt' | 'name' | 'updatedAt' | string;
  sortOrder?: 'asc' | 'desc';
  cursor?: string;
  [key: string]: any;
}

export interface ProductImage {
  id: string;
  url: string;
  thumbnailUrl?: string;
  altText?: string | null;
  sortOrder?: number;
  width?: number;
  height?: number;
  size?: number;
  productId?: string;
  productVariantId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug?: string;
  description?: string | null;
  imageUrl?: string | null;
  status?: string;
  parentId?: string | null;
}

export interface ProductBrand {
  id: string;
  name: string;
  slug?: string;
  logoUrl?: string | null;
  description?: string | null;
  status?: string;
}

export interface VariantInventory {
  availableQuantity: number;
  reorderLevel?: number;
  isInStock?: boolean;
  isLowStock?: boolean;
}

export interface AttributeDefinition {
  id: string;
  name: string;
}

export interface AttributeValueItem {
  id: string;
  value: string;
  attribute?: AttributeDefinition;
}

export interface VariantAttributeValue {
  attributeValue: AttributeValueItem;
}

export interface ProductVariant {
  id: string;
  productId?: string;
  sku: string;
  barcode?: string | null;
  price: string | number;
  compareAtPrice?: string | number | null;
  costPrice?: string | number | null;
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT' | 'ARCHIVED' | string;
  inventory?: VariantInventory | null;
  attributeValues?: VariantAttributeValue[];
  images?: ProductImage[];
  stock?: number;
}

export interface AttributeOptionValue {
  id: string;
  value: string;
}

export interface ProductAttributeGroup {
  id: string;
  name: string;
  values: AttributeOptionValue[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT' | 'ARCHIVED' | string;
  isFeatured?: boolean;
  seoTitle?: string | null;
  seoDescription?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  category?: ProductCategory;
  brand?: ProductBrand;
  images: ProductImage[];
  variants: ProductVariant[];

  // UI helper aliases for smooth backwards/cross compatibility
  title?: string;
  price?: number;
  minPrice?: number;
  maxPrice?: number;
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;
  tag?: string;
  isWishlisted?: boolean;
  imageUrl?: string;
  bannerImage?: { url: string } | null;
  specifications?: Record<string, any>;
  _count?: {
    variants?: number;
    reviews?: number;
  };
}

export interface ProductPaginationData {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductsResponse {
  success: boolean;
  statusCode?: number;
  message: string;
  data: ProductPaginationData;
}

export interface ProductDetailResponse {
  success: boolean;
  statusCode?: number;
  message: string;
  data: Product;
}

export interface ProductAttributesResponse {
  success: boolean;
  statusCode?: number;
  message: string;
  data: ProductAttributeGroup[];
}

export interface GenericApiResponse<T = any> {
  success: boolean;
  statusCode?: number;
  message: string;
  data: T;
}
