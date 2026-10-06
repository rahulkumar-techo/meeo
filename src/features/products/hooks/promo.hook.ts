import { useQuery, useMutation, UseQueryOptions } from '@tanstack/react-query';
import { PromoApiService } from '../services/promo.service';
import type {
  ActivePromotionsResponse,
  CartPreviewRequest,
  CartPreviewResponse,
  ValidateCodeRequest,
  ValidateCodeResponse,
  PromotionHistoryResponse,
} from '../types/promo.type';

export const PROMO_QUERY_KEYS = {
  all: ['promotions'] as const,
  active: () => [...PROMO_QUERY_KEYS.all, 'active'] as const,
  history: (params?: { page?: number; limit?: number }) =>
    [...PROMO_QUERY_KEYS.all, 'history', params ?? {}] as const,
};

type QueryOptionsWithoutKeyAndFn<TData, TError = Error> = Omit<
  UseQueryOptions<TData, TError, TData, any>,
  'queryKey' | 'queryFn'
>;

/**
 * Fetches currently active automatic promotions for storefront display.
 */
export const useGetActivePromotions = (
  options?: QueryOptionsWithoutKeyAndFn<ActivePromotionsResponse>
) => {
  return useQuery({
    queryKey: PROMO_QUERY_KEYS.active(),
    queryFn: () => PromoApiService.getActivePromotions(),
    staleTime: 0,
    refetchOnMount: 'always',
    ...options,
  });
};

/**
 * Fetches the authenticated customer's promotion redemption history.
 */
export const useGetMyPromotionHistory = (
  params?: { page?: number; limit?: number },
  options?: QueryOptionsWithoutKeyAndFn<PromotionHistoryResponse>
) => {
  return useQuery({
    queryKey: PROMO_QUERY_KEYS.history(params),
    queryFn: () => PromoApiService.getMyPromotionHistory(params),
    ...options,
  });
};

/**
 * Previews discount calculations for a cart — call on demand (not auto-fetched).
 */
export const usePreviewCartPromotions = () => {
  return useMutation<CartPreviewResponse, Error, CartPreviewRequest>({
    mutationFn: (payload) => PromoApiService.previewCartPromotions(payload),
  });
};

/**
 * Validates a single promo code against a subtotal — call on demand.
 */
export const useValidatePromoCode = () => {
  return useMutation<ValidateCodeResponse, Error, ValidateCodeRequest>({
    mutationFn: (payload) => PromoApiService.validatePromoCode(payload),
  });
};
