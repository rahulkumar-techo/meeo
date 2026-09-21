import { apiClient } from "@/apis";
import { ApiRoute } from "@/routes";
import type {
  GetProductsParams,
  ProductsResponse,
  ProductDetailResponse,
  GenericApiResponse,
} from "../types/product.types";

export const ProductApiService = {
  /**
   * Fetch all products with pagination and filters
   */
  async getAllProducts(params?: GetProductsParams): Promise<ProductsResponse> {
    const response = await apiClient.get<ProductsResponse>(
      ApiRoute.PRODUCT.PRODUCTS,
      { params }
    );
    return response.data;
  },

  /**
   * Fetch single product details by product ID
   */
  async getProductById(productId: string): Promise<ProductDetailResponse> {
    const response = await apiClient.get<ProductDetailResponse>(
      ApiRoute.PRODUCT.PRODUCT_DETAILS(productId)
    );
    return response.data;
  },

  /**
   * Fetch single product details by slug
   */
  async getProductBySlug(slug: string): Promise<ProductDetailResponse> {
    const response = await apiClient.get<ProductDetailResponse>(
      ApiRoute.PRODUCT.PRODUCT_SLUGS(slug)
    );
    return response.data;
  },

  /**
   * Fetch product unique attributes
   */
  async getProductAttributes(
    productId: string
  ): Promise<GenericApiResponse<any>> {
    const response = await apiClient.get<GenericApiResponse<any>>(
      ApiRoute.PRODUCT.PRODUCT_ATTRIBUTES(productId)
    );
    return response.data;
  },
};

export const ProductService = ProductApiService;
export default ProductApiService;