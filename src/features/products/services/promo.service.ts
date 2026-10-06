import { apiClient } from '@/apis';
import { ApiRoute } from '@/routes';
import type {
  ActivePromotionsResponse,
  CartPreviewRequest,
  CartPreviewResponse,
  ValidateCodeRequest,
  ValidateCodeResponse,
  PromotionHistoryResponse,
} from '../types/promo.type';

export const PromoApiService = {
  /**
   * GET /promotions/active
   * Lists currently active automatic promotions for storefront banners.
   */
  async getActivePromotions(): Promise<ActivePromotionsResponse> {
    const response = await apiClient.get<ActivePromotionsResponse>(
      ApiRoute.PROMOTIONS.PROMOTION_VALIDATION
    );
    return response.data;
  },

  /**
   * POST /promotions/promotion-preview
   * Calculates discounts and item-level allocations for cart items.
   */
  async previewCartPromotions(payload: CartPreviewRequest): Promise<CartPreviewResponse> {
    const response = await apiClient.post<CartPreviewResponse>(
      ApiRoute.PROMOTIONS.PROMOTIONS_PREVIEW,
      payload
    );
    return response.data;
  },

  /**
   * POST /promotions/validate-code
   * Verifies if a promo code is active, eligible, and within usage limit.
   */
  async validatePromoCode(payload: ValidateCodeRequest): Promise<ValidateCodeResponse> {
    const response = await apiClient.post<ValidateCodeResponse>(
      ApiRoute.PROMOTIONS.PROMOTIONS_VALIDATECODE,
      payload
    );
    return response.data;
  },

  /**
   * GET /promotions/my-history
   * Customer's own past promotion redemptions across orders.
   */
  async getMyPromotionHistory(params?: { page?: number; limit?: number }): Promise<PromotionHistoryResponse> {
    const response = await apiClient.get<PromotionHistoryResponse>(
      ApiRoute.PROMOTIONS.PRMOTION_HISTORY,
      { params }
    );
    return response.data;
  },
};
