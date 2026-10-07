import { CART_QUERY_KEYS } from "@/features/cart/hooks/cart.keys";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { checkoutApi } from "../services/checkout.service";
import type {
  CheckoutValidationResponse,
  CreateOrderPayload,
  CreateOrderResponse,
  ValidateCheckoutPayload,
} from "../types/checkout.types";
import { CHECKOUT_QUERY_KEYS } from "./checkout.keys";

type QueryOptionsWithoutKeyAndFn<TData, TError = Error> = Omit<
  UseQueryOptions<TData, TError, TData, any>,
  "queryKey" | "queryFn"
>;

/**
 * 1. Hook to validate order pricing, inventory, coupons & taxes before checkout
 */
export const useValidateCheckout = <TData = CheckoutValidationResponse>(
  payload?: ValidateCheckoutPayload,
  options?: QueryOptionsWithoutKeyAndFn<TData>
) => {
  return useQuery({
    queryKey: CHECKOUT_QUERY_KEYS.validation(payload),
    queryFn: () => checkoutApi.validateCheckout(payload) as Promise<TData>,
    staleTime: 1000 * 30, // 30 seconds
    ...options,
  });
};

export type CreateOrderMutationArgs = {
  payload: CreateOrderPayload;
  idempotencyKey?: string;
};

/**
 * 2. Hook to place order
 */
export const useCreateOrder = (
  options?: UseMutationOptions<CreateOrderResponse, Error, CreateOrderMutationArgs | CreateOrderPayload>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (args: CreateOrderMutationArgs | CreateOrderPayload) => {
      if ("payload" in args) {
        return checkoutApi.createOrder(args.payload, args.idempotencyKey);
      }
      return checkoutApi.createOrder(args);
    },
    onSuccess: (...args: any[]) => {
      // Invalidate cart and checkout queries upon placing order
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: CHECKOUT_QUERY_KEYS.all });
      (options?.onSuccess as any)?.(...args);
    },
    ...options,
  });
};
