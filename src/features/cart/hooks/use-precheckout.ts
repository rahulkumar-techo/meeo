import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ADDRESS_QUERY_KEYS, addressApiService } from '@/features/address';
import { CHECKOUT_QUERY_KEYS, checkoutApi } from '@/features/checkout';
import type { CartItem } from '../types/cart.types';

export const usePrecheckoutDataLoad = (items: CartItem[] = []) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Only prefetch if the cart has items
    if (!items || items.length === 0) return;

    const prefetchCheckoutData = async () => {
      try {
        // 1. Prefetch address list into React Query cache
        await queryClient.prefetchQuery({
          queryKey: ADDRESS_QUERY_KEYS.lists(),
          queryFn: () => addressApiService.getAddresses(),
          staleTime: 1000 * 60 * 5, // 5 minutes fresh
        });

        // 2. Find default or first address from cached addresses
        const cachedAddresses = queryClient.getQueryData<any>(ADDRESS_QUERY_KEYS.lists());
        const addressList = Array.isArray(cachedAddresses?.data) ? cachedAddresses.data : [];
        const defaultAddress = addressList.find((a: any) => a.isDefault) || addressList[0];

        // 3. Prefetch checkout bill validation for the default address
        if (defaultAddress?.id) {
          const payload = {
            shippingAddressId: defaultAddress.id,
            billingAddressId: defaultAddress.id,
            currency: 'INR',
          };

          await queryClient.prefetchQuery({
            queryKey: CHECKOUT_QUERY_KEYS.validation(payload),
            queryFn: () => checkoutApi.validateCheckout(payload),
            staleTime: 1000 * 30, // 30 seconds fresh
          });
        }
      } catch (error) {
        // Silently catch background prefetch errors so cart screen is unaffected
      }
    };

    prefetchCheckoutData();
  }, [items.length, queryClient]);
};