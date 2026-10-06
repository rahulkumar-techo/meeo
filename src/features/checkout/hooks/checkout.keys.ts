import type { ValidateCheckoutPayload } from '../types/checkout.types';

export const CHECKOUT_QUERY_KEYS = {
  all: ['checkout'] as const,
  validation: (payload?: ValidateCheckoutPayload) =>
    [
      ...CHECKOUT_QUERY_KEYS.all,
      'validate',
      payload?.shippingAddressId ?? '',
      payload?.couponCode ?? '',
    ] as const,
};
