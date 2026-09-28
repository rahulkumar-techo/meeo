import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from "@tanstack/react-query";

import { CartApiService } from "../services/cart.service";
import type {
  Cart,
  AddToCartPayload,
  UpdateCartItemPayload,
  CartApiResponse,
} from "../types/cart.types";
import { CHECKOUT_QUERY_KEYS } from "../../checkout/hooks/checkout.hook";

/**
 * Cart query key factory
 */
export const CART_QUERY_KEYS = {
  all: ["cart"] as const,
  details: () => [...CART_QUERY_KEYS.all, "details"] as const,
};

type QueryOptionsWithoutKeyAndFn<TData, TError = Error> = Omit<
  UseQueryOptions<TData, TError, TData, any>,
  "queryKey" | "queryFn"
>;

/**
 * Hook to fetch active shopping cart with 5-minute stale cache
 */
export const useGetCart = <TData = CartApiResponse<Cart>>(
  options?: QueryOptionsWithoutKeyAndFn<TData>
) => {
  return useQuery({
    queryKey: CART_QUERY_KEYS.details(),
    queryFn: () => CartApiService.getCart() as Promise<TData>,
    staleTime: 1000 * 60 * 5, // 5 minutes fresh cache
    gcTime: 1000 * 60 * 10,   // 10 minutes cache persistence
    ...options,
  });
};

/**
 * Hook to add item to cart with automatic cache invalidation
 */
export const useAddToCart = (
  options?: UseMutationOptions<CartApiResponse<Cart>, Error, AddToCartPayload>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddToCartPayload) => CartApiService.addToCart(payload),
    onSuccess: (...args: any[]) => {
      const serverResponse = args[0];
      if (serverResponse?.data?.items && Array.isArray(serverResponse.data.items)) {
        queryClient.setQueryData(CART_QUERY_KEYS.details(), serverResponse);
      }
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: CHECKOUT_QUERY_KEYS.all });
      (options?.onSuccess as any)?.(...args);
    },
    onSettled: (...args: any[]) => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: CHECKOUT_QUERY_KEYS.all });
      (options?.onSettled as any)?.(...args);
    },
    ...options,
  });
};

/**
 * Hook to update item quantity in cart with Optimistic UI updates
 */
export const useUpdateCartItem = (
  options?: UseMutationOptions<
    CartApiResponse<Cart>,
    Error,
    { cartItemId: string; payload: UpdateCartItemPayload },
    { previousCart?: CartApiResponse<Cart> }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cartItemId, payload }) =>
      CartApiService.updateCartItem(cartItemId, payload),
    onMutate: async ({ cartItemId, payload }) => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEYS.details() });

      const previousCart = queryClient.getQueryData<CartApiResponse<Cart>>(
        CART_QUERY_KEYS.details()
      );

      if (previousCart?.data?.items) {
        const newQty = payload.quantity;
        const updatedItems = previousCart.data.items.map((item) => {
          if (item.id === cartItemId || item.variantId === cartItemId) {
            const unitPrice = Number(item.unitPrice ?? item.variant?.price ?? item.price ?? 0);
            return {
              ...item,
              quantity: newQty,
              lineTotal: unitPrice * newQty,
            };
          }
          return item;
        });

        const newSubtotal = updatedItems.reduce(
          (sum, it) => sum + Number(it.lineTotal || 0),
          0
        );
        const newTotalItems = updatedItems.reduce(
          (sum, it) => sum + (it.quantity || 0),
          0
        );

        queryClient.setQueryData<CartApiResponse<Cart>>(
          CART_QUERY_KEYS.details(),
          {
            ...previousCart,
            data: {
              ...previousCart.data,
              items: updatedItems,
              summary: {
                itemCount: updatedItems.length,
                totalItems: newTotalItems,
                subtotal: newSubtotal,
                currency: previousCart.data.summary?.currency || "INR",
              },
            },
          }
        );
      }

      return { previousCart };
    },
    onError: (...args: any[]) => {
      const context = args[2];
      if (context?.previousCart) {
        queryClient.setQueryData(CART_QUERY_KEYS.details(), context.previousCart);
      }
      (options?.onError as any)?.(...args);
    },
    onSuccess: (...args: any[]) => {
      const data = args[0];
      if (data?.data) {
        queryClient.setQueryData(CART_QUERY_KEYS.details(), data);
      }
      queryClient.invalidateQueries({ queryKey: CHECKOUT_QUERY_KEYS.all });
      (options?.onSuccess as any)?.(...args);
    },
    onSettled: (...args: any[]) => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: CHECKOUT_QUERY_KEYS.all });
      (options?.onSettled as any)?.(...args);
    },
    ...options,
  });
};

/**
 * Hook to remove a single item from cart with Optimistic UI updates
 */
export const useRemoveCartItem = (
  options?: UseMutationOptions<
    CartApiResponse<Cart>,
    Error,
    string,
    { previousCart?: CartApiResponse<Cart> }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cartItemId: string) => CartApiService.removeCartItem(cartItemId),
    onMutate: async (cartItemId: string) => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEYS.details() });

      const previousCart = queryClient.getQueryData<CartApiResponse<Cart>>(
        CART_QUERY_KEYS.details()
      );

      if (previousCart?.data?.items) {
        const updatedItems = previousCart.data.items.filter(
          (item) => item.id !== cartItemId && item.variantId !== cartItemId
        );

        const newSubtotal = updatedItems.reduce(
          (sum, it) => sum + Number(it.lineTotal || 0),
          0
        );
        const newTotalItems = updatedItems.reduce(
          (sum, it) => sum + (it.quantity || 0),
          0
        );

        queryClient.setQueryData<CartApiResponse<Cart>>(
          CART_QUERY_KEYS.details(),
          {
            ...previousCart,
            data: {
              ...previousCart.data,
              items: updatedItems,
              summary: {
                itemCount: updatedItems.length,
                totalItems: newTotalItems,
                subtotal: newSubtotal,
                currency: previousCart.data.summary?.currency || "INR",
              },
            },
          }
        );
      }

      return { previousCart };
    },
    onError: (...args: any[]) => {
      const context = args[2];
      if (context?.previousCart) {
        queryClient.setQueryData(CART_QUERY_KEYS.details(), context.previousCart);
      }
      (options?.onError as any)?.(...args);
    },
    onSuccess: (...args: any[]) => {
      const data = args[0];
      if (data?.data) {
        queryClient.setQueryData(CART_QUERY_KEYS.details(), data);
      }
      queryClient.invalidateQueries({ queryKey: CHECKOUT_QUERY_KEYS.all });
      (options?.onSuccess as any)?.(...args);
    },
    onSettled: (...args: any[]) => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: CHECKOUT_QUERY_KEYS.all });
      (options?.onSettled as any)?.(...args);
    },
    ...options,
  });
};

/**
 * Hook to clear all items from cart
 */
export const useClearCart = (
  options?: UseMutationOptions<CartApiResponse<any>, Error, void>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => CartApiService.clearCart(),
    onSuccess: (...args: any[]) => {
      queryClient.setQueryData(CART_QUERY_KEYS.details(), {
        success: true,
        data: {
          items: [],
          summary: { itemCount: 0, totalItems: 0, subtotal: 0, currency: "INR" },
        },
      });
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: CHECKOUT_QUERY_KEYS.all });
      (options?.onSuccess as any)?.(...args);
    },
    ...options,
  });
};

/**
 * Hook to merge cart (if manually triggered)
 */
export const useMergeCart = (
  options?: UseMutationOptions<CartApiResponse<Cart>, Error, any[]>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (items: any[]) => CartApiService.mergeCart(items),
    onSuccess: (...args: any[]) => {
      const serverResponse = args[0];
      if (serverResponse?.data) {
        queryClient.setQueryData(CART_QUERY_KEYS.details(), serverResponse);
      }
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: CHECKOUT_QUERY_KEYS.all });
      (options?.onSuccess as any)?.(...args);
    },
    ...options,
  });
};

