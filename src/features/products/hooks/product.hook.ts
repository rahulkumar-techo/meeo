import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ProductApiService } from "../services/product.service";
import type {
  GetProductsParams,
  ProductsResponse,
  ProductDetailResponse,
  ProductAttributesResponse,
} from "../types/product.types";

/**
 * Query key factory for product queries
 */
export const PRODUCT_QUERY_KEYS = {
  all: ["products"] as const,
  lists: () => [...PRODUCT_QUERY_KEYS.all, "list"] as const,
  list: (params?: GetProductsParams) =>
    [...PRODUCT_QUERY_KEYS.lists(), params ?? {}] as const,
  details: () => [...PRODUCT_QUERY_KEYS.all, "detail"] as const,
  detail: (id?: string) =>
    [...PRODUCT_QUERY_KEYS.details(), id ?? ""] as const,
  slugs: () => [...PRODUCT_QUERY_KEYS.all, "slug"] as const,
  slug: (slug?: string) =>
    [...PRODUCT_QUERY_KEYS.slugs(), slug ?? ""] as const,
  attributes: (id?: string) =>
    [...PRODUCT_QUERY_KEYS.all, "attributes", id ?? ""] as const,
};

type QueryOptionsWithoutKeyAndFn<TData, TError = Error> = Omit<
  UseQueryOptions<TData, TError, TData, any>,
  "queryKey" | "queryFn"
>;

/**
 * Hook to fetch all products with optional filters and pagination
 */
export const useGetAllProducts = <TData = ProductsResponse>(
  params?: GetProductsParams,
  options?: QueryOptionsWithoutKeyAndFn<TData>
) => {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.list(params),
    queryFn: () => ProductApiService.getAllProducts(params) as Promise<TData>,
    staleTime: 0,
    refetchOnMount: 'always',
    ...options,
  });
};
/**
 * Hook to fetch single product details by product ID
 */
export const useGetProductById = <TData = ProductDetailResponse>(
  productId?: string,
  options?: QueryOptionsWithoutKeyAndFn<TData>
) => {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.detail(productId),
    queryFn: () =>
      ProductApiService.getProductById(productId!) as Promise<TData>,
    enabled: Boolean(productId) && (options?.enabled ?? true),
    staleTime: 0,
    refetchOnMount: 'always',
    ...options,
  });
};

/**
 * Hook to fetch product details by unique slug
 */
export const useGetProductBySlug = <TData = ProductDetailResponse>(
  slug?: string,
  options?: QueryOptionsWithoutKeyAndFn<TData>
) => {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.slug(slug),
    queryFn: () => ProductApiService.getProductBySlug(slug!) as Promise<TData>,
    enabled: Boolean(slug) && (options?.enabled ?? true),
    ...options,
  });
};

/**
 * Hook to fetch dynamic product attributes (e.g. Size, Color)
 */
export const useGetProductAttributes = <TData = ProductAttributesResponse>(
  productId?: string,
  options?: QueryOptionsWithoutKeyAndFn<TData>
) => {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.attributes(productId),
    queryFn: () =>
      ProductApiService.getProductAttributes(productId!) as Promise<TData>,
    enabled: Boolean(productId) && (options?.enabled ?? true),
    ...options,
  });
};