import { create } from 'zustand';
import type { CartPreviewData } from '@/features/products/types/promo.type';

interface PromoState {
  appliedCode: string | null;
  preview: CartPreviewData | null;
  setPromo: (code: string, preview: CartPreviewData) => void;
  clearPromo: () => void;
}

/**
 * Shared promo state across Cart and Checkout.
 * Customer saves a coupon in Cart; Checkout reads it for validation and order creation.
 */
export const usePromoStore = create<PromoState>((set) => ({
  appliedCode: null,
  preview: null,
  setPromo: (code, preview) => set({ appliedCode: code, preview }),
  clearPromo: () => set({ appliedCode: null, preview: null }),
}));
