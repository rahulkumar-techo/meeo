import { apiClient } from "@/apis";
import { ApiRoute } from "@/routes";
import { authSession } from "@/lib/auth-session";
import { secureStorage } from "@/lib/secureStorage";
import type {
  Cart,
  AddToCartPayload,
  UpdateCartItemPayload,
  CartApiResponse,
} from "../types/cart.types";

/**
 * Retrieves session headers for guest cart persistence
 */
async function getSessionHeaders() {
  let sessionId = authSession.getSessionId();
  if (!sessionId) {
    sessionId = await secureStorage.getSessionId();
    if (sessionId) {
      authSession.setSessionId(sessionId);
    }
  }

  if (!sessionId) return {};

  return {
    "x-session-id": sessionId,
    "X-Session-Id": sessionId,
    "Session-Id": sessionId,
    "session-id": sessionId,
    sessionId: sessionId,
    Cookie: `sessionId=${sessionId}; session=${sessionId}`,
  };
}

/**
 * Captures and persists session ID from response
 */
function captureSession(data: any) {
  const sessionId =
    data?.data?.sessionId ||
    data?.sessionId ||
    data?.data?.session?.id;

  if (sessionId && typeof sessionId === "string") {
    authSession.setSessionId(sessionId);
    secureStorage.setSessionId(sessionId);
  }
}

export const CartApiService = {
  /**
   * Fetch currently active shopping cart
   */
  async getCart(): Promise<CartApiResponse<Cart>> {
    const headers = await getSessionHeaders();
    const sessionId = authSession.getSessionId();

    const response = await apiClient.get<CartApiResponse<Cart>>(
      ApiRoute.CART.CART,
      {
        headers,
        params: sessionId ? { sessionId } : undefined,
      }
    );

    captureSession(response.data);
    return response.data;
  },

  /**
   * Add a product/variant to the active cart
   */
  async addToCart(payload: AddToCartPayload): Promise<CartApiResponse<Cart>> {
    const headers = await getSessionHeaders();
    const sessionId = authSession.getSessionId();

    const response = await apiClient.post<CartApiResponse<Cart>>(
      ApiRoute.CART.CART_ITEMS,
      payload,
      {
        headers,
        params: sessionId ? { sessionId } : undefined,
      }
    );

    captureSession(response.data);
    return response.data;
  },

  /**
   * Update item quantity in cart
   */
  async updateCartItem(
    cartItemId: string,
    payload: UpdateCartItemPayload
  ): Promise<CartApiResponse<Cart>> {
    const headers = await getSessionHeaders();
    const sessionId = authSession.getSessionId();

    const response = await apiClient.patch<CartApiResponse<Cart>>(
      ApiRoute.CART.UPDATE_CART_ITEMS(cartItemId),
      payload,
      {
        headers,
        params: sessionId ? { sessionId } : undefined,
      }
    );

    captureSession(response.data);
    return response.data;
  },

  /**
   * Remove a single item from active cart
   */
  async removeCartItem(cartItemId: string): Promise<CartApiResponse<Cart>> {
    const headers = await getSessionHeaders();
    const sessionId = authSession.getSessionId();

    const response = await apiClient.delete<CartApiResponse<Cart>>(
      ApiRoute.CART.DELETE_CART_ITEMS(cartItemId),
      {
        headers,
        params: sessionId ? { sessionId } : undefined,
      }
    );

    captureSession(response.data);
    return response.data;
  },

  /**
   * Clear all items from active cart
   */
  async clearCart(): Promise<CartApiResponse<any>> {
    const headers = await getSessionHeaders();
    const sessionId = authSession.getSessionId();

    const response = await apiClient.delete<CartApiResponse<any>>(
      ApiRoute.CART.DELETE_ALL_ITEMS,
      {
        headers,
        params: sessionId ? { sessionId } : undefined,
      }
    );

    return response.data;
  },

  /**
   * Merge guest cart items into user cart after authentication
   */
  async mergeCart(items: any[]): Promise<CartApiResponse<Cart>> {
    const headers = await getSessionHeaders();
    const response = await apiClient.post<CartApiResponse<Cart>>(
      ApiRoute.CART.MERGE_CART,
      { items },
      { headers }
    );

    captureSession(response.data);
    return response.data;
  },
};

export const CartService = CartApiService;
export default CartApiService;
