export const CART_QUERY_KEYS = {
  all: ['cart'] as const,
  details: () => [...CART_QUERY_KEYS.all, 'details'] as const,
};
