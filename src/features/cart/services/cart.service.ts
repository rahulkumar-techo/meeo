import { apiClient } from "@/apis";
import { ApiRoute } from "@/routes";
import type {
  Cart,
  AddToCartPayload,
  UpdateCartItemPayload,
  CartApiResponse,
} from "../types/cart.types";

export const CartApiService = {
  /**
   * Fetch currently active shopping cart
   */
  async getCart(): Promise<CartApiResponse<Cart>> {
    const response = await apiClient.get<CartApiResponse<Cart>>(
      ApiRoute.CART.CART
    );
    return response.data;
  },

  /**
   * Add a product/variant to the active cart
   */
  async addToCart(payload: AddToCartPayload): Promise<CartApiResponse<Cart>> {
    const response = await apiClient.post<CartApiResponse<Cart>>(
      ApiRoute.CART.CART_ITEMS,
      payload
    );
    return response.data;
  },

  /**
   * Update item quantity in cart
   */
  async updateCartItem(
    cartItemId: string,
    payload: UpdateCartItemPayload
  ): Promise<CartApiResponse<Cart>> {
    const response = await apiClient.patch<CartApiResponse<Cart>>(
      ApiRoute.CART.UPDATE_CART_ITEMS(cartItemId),
      payload
    );
    return response.data;
  },

  /**
   * Remove a single item from active cart
   */
  async removeCartItem(cartItemId: string): Promise<CartApiResponse<Cart>> {
    const response = await apiClient.delete<CartApiResponse<Cart>>(
      ApiRoute.CART.DELETE_CART_ITEMS(cartItemId)
    );
    return response.data;
  },

  /**
   * Clear all items from active cart
   */
  async clearCart(): Promise<CartApiResponse<any>> {
    const response = await apiClient.delete<CartApiResponse<any>>(
      ApiRoute.CART.DELETE_ALL_ITEMS
    );
    return response.data;
  },

  /**
   * Merge guest cart items into user cart after authentication
   */
  async mergeCart(items: any[]): Promise<CartApiResponse<Cart>> {
    const response = await apiClient.post<CartApiResponse<Cart>>(
      ApiRoute.CART.MERGE_CART,
      { items }
    );
    return response.data;
  },
};

export const CartService = CartApiService;
export default CartApiService;
