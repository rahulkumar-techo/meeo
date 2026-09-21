export interface GetProductsParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  brandId?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
  status?: string;
  [key: string]: any;
}

export interface ProductBannerImage {
  url: string;
  altText?: string;
  thumbnailUrl?: string;
}

export interface ProductImage {
  id: string;
  fileId?: string;
  url: string;
  thumbnailUrl?: string;
  altText?: string;
  sortOrder?: number;
  width?: number;
  height?: number;
  size?: number;
  productId?: string;
  productVariantId?: string | null;
  reviewId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
}

export interface ProductBrand {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
}

export interface ProductVariant {
  id: string;
  sku: string;
  price: string | number;
  compareAtPrice?: string | number;
  status?: string;
  attributes?: Record<string, any>;
  stock?: number;
}

export interface ProductCount {
  variants?: number;
  reviews?: number;
  [key: string]: any;
}

export interface Product {
  id: string;
  categoryId: string;
  brandId: string;
  createdById?: string;
  name: string;
  slug: string;
  description: string;
  status: string;
  isFeatured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  bannerImage?: ProductBannerImage | null;
  specifications?: Record<string, any>;
  category?: ProductCategory;
  brand?: ProductBrand;
  images: ProductImage[];
  imageUrl?: string;
  variants: ProductVariant[];
  _count?: ProductCount;
  // UI helper aliases
  title?: string;
  price?: number;
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;
  tag?: string;
  isWishlisted?: boolean;
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
  message: string;
  data: ProductPaginationData;
}

export interface ProductDetailResponse {
  success: boolean;
  message: string;
  data: Product;
}

export interface GenericApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}
