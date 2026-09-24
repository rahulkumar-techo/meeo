import { apiClient } from "@/apis";
import { ApiRoute } from "@/routes";
import type {
  GetProductsParams,
  ProductsResponse,
  ProductDetailResponse,
  ProductAttributesResponse,
} from "../types/product.types";

/**
 * Product API Service
 * Reference: app-docs/product.customer.md
 */
export const ProductApiService = {
  /**
   * 1. List Products (Storefront Listing & Grid)
   * GET /api/v1/products
   */
  async getAllProducts(params?: GetProductsParams): Promise<ProductsResponse> {
    const response = await apiClient.get<ProductsResponse>(
      ApiRoute.PRODUCT.PRODUCTS,
      { params }
    );
    return response.data;
  },

  /**
   * 2. Get Product by ID
   * GET /api/v1/products/:id
   */
  async getProductById(productId: string): Promise<ProductDetailResponse> {
    const response = await apiClient.get<ProductDetailResponse>(
      ApiRoute.PRODUCT.PRODUCT_DETAILS(productId)
    );
    return response.data;
  },

  /**
   * 3. Get Product by Slug
   * GET /api/v1/products/slug/:slug
   */
  async getProductBySlug(slug: string): Promise<ProductDetailResponse> {
    const response = await apiClient.get<ProductDetailResponse>(
      ApiRoute.PRODUCT.PRODUCT_SLUGS(slug)
    );
    return response.data;
  },

  /**
   * 4. Get Product Attributes Matrix
   * GET /api/v1/products/:id/attributes
   */
  async getProductAttributes(
    productId: string
  ): Promise<ProductAttributesResponse> {
    const response = await apiClient.get<ProductAttributesResponse>(
      ApiRoute.PRODUCT.PRODUCT_ATTRIBUTES(productId)
    );
    return response.data;
  },
};

export const ProductService = ProductApiService;
export default ProductApiService;