import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { categoryService } from "../services/category.service";
import type { ProductCategory } from "../types/category.type";

export const CATEGORY_QUERY_KEYS = {
  all: ["category"] as const,
  root: () => [...CATEGORY_QUERY_KEYS.all, "root"] as const,
};

export interface ProductCategoryResponse {
  success?: boolean;
  statusCode?: number;
  message?: string;
  items?: any[];
  data?: any[];
}

type QueryOptionsWithoutKeyFn<TData = ProductCategory[]> = Omit<
  UseQueryOptions<ProductCategoryResponse, Error, TData>,
  "queryKey" | "queryFn"
>;

/**
 * Hook to fetch root categories, mapped directly to selected ProductCategory fields
 */
export const useGetAllCategory = <TData = ProductCategory[]>(
  options?: QueryOptionsWithoutKeyFn<TData>
) => {
  return useQuery({
    queryKey: CATEGORY_QUERY_KEYS.root(),
    queryFn: () => categoryService.getAllRootCategories<ProductCategoryResponse>(),
    select: (response: any) => {
      // Robust extraction for all response shapes
      const rawList: any[] = Array.isArray(response)
        ? response
        : (response?.items ?? response?.data?.items ?? response?.data ?? []);

      // Extract and map only selected properties
      const mappedList: ProductCategory[] = rawList.map((item: any) => ({
        id: item?.id ?? '',
        name: item?.name ?? '',
        imageUrl: item?.imageUrl ?? '',
        status: item?.status ?? 'ACTIVE',
        sortOrder: item?.sortOrder ?? item?.sortedOrder ?? 0,
        slug: item?.slug ?? '',
      }));

      // Filter ACTIVE and sort by sortOrder ascending
      return mappedList
        .filter((item) => item.status === "ACTIVE")
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)) as unknown as TData;
    },
    staleTime: 10 * 60 * 1000, // 5 minutes
    ...options,
  });
};


