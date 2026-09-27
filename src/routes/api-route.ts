export const ApiRoute = {
  AUTH: {
    LOGIN: "/auth/login",
    SIGNUP: "/auth/register",
    OTP_VERIFICATION: "/auth/verify-otp",
    RESEND_OTP: "/auth/resend-otp",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    GOOGLE_AUTH: "/auth/google",
    REFRESH: "/auth/refresh",

    // PRIVATE ROUTES
    ME: "/auth/me",
    LOGOUT: "/auth/logout",
    LOGOUT_ALL: "/auth/logout-all",
    SESSION: "/auth/session",
    SESSION_ID: (sessionId: string) => `/auth/${sessionId}`,
  },

  USER: {
    PROFILE: "/user/profile", // GET
    ADDRESSES: "/user/addresses", // POST / GET
    UPDATE_ADDRESS: (addressId: string) => `/user/addresses/${addressId}`, // PATCH
    DELETE_ADDRESS: (addressId: string) => `/user/addresses/${addressId}`, // DELETE
    VERIFY_PHONE_NO: "/phone/request-otp", // POST - Send an SMS OTP to verify authenticated user's phone number
    UPDATE_PHONE_NO: "/user/phone", // PATCH - Verifies user phone number using OTP code and marks phoneVerified as true
  },

  PRODUCT: {
    PRODUCTS: "/products", // GET - get all products
    PRODUCT_DETAILS: (productId: string) => `/products/${productId}`, // GET - get single product details
    PRODUCTDETAILS: (productId: string) => `/products/${productId}`,
    PRODUCT_ATTRIBUTES: (productId: string) =>
      `/products/${productId}/attributes`, // Fetch all unique attributes (e.g. Color, Size) and active values
    PRODUCST_ATTRIBUTES: (productId: string) =>
      `/products/${productId}/attributes`,
    PRODUCT_SLUGS: (slug: string) => `/products/slug/${slug}`, // Fetch product by unique URL slug with relations
  },

  CATEGORIES: {
    CATEGORIES: "/categories", // GET - List categories with pagination
    CATEGORIES_TREE: "/categories/tree", // GET - category hierarchy tree
    CATEGORIES_BY_ID: (categoryId: string) => `/categories/${categoryId}`, // Fetch single category details by UUID
    CATEGORIES_BYID: (categoryId: string) => `/categories/${categoryId}`,
    CATEGORIES_SLUG: (slug: string) => `/categories/slug/${slug}`,
  },

  BRAND: {
    BRANDS: "/brands", // GET - all brands
    SINGLE_BRAND: (brandId: string) => `/brands/${brandId}`, // Retrieve a single brand by UUID with product counts
    BRAND_SLUG: (slug: string) => `/brands/slug/${slug}`, // Retrieve a single brand by unique URL slug
  },

  PRODUCT_VARIANT: {
    SINGLE_PRODUCT_VARIANT: (variantId: string) => `/variants/${variantId}`, // Fetch variant by UUID including parent product, dynamic attributes, stock
    VARIANT_SKU: (sku: string) => `/variants/sku/${sku}`, // Fetch variant by unique SKU barcode/identifier
  },

  CART: {
    CART: "/cart", // GET - active shopping cart
    CART_ITEMS: "/cart/items", // POST - Add item to cart
    UPDATE_CART_ITEMS: (cartId: string) => `/cart/items/${cartId}`, // Update item quantity in cart
    DELETE_CART_ITEMS: (cartId: string) => `/cart/items/${cartId}`, // Delete item from cart
    DELETE_ALL_ITEMS: "/cart", // DELETE - clear all cart items
    MERGE_CART: "/cart/merge", // POST - Merge guest cart after login
  },

  WISHLISTS: {
    WISHLISTS: "/wishlists", // GET - get all wishlists
    CREATE_WISHLISTS: "/wishlists", // POST - Adds a product to user's wishlist
    PRODUCT_WISHLISTS: (productId: string) =>
      `/wishlists/products/${productId}`, // Add product to wishlist by route param
    PRODUCT_WISHlISTS: (productId: string) =>
      `/wishlists/products/${productId}`,
    DELETE_PRODUCT_WISHLISTS: (productId: string) =>
      `/wishlists/products/${productId}`, // Removes product from wishlist
    DELETE_PRODUCT_WISHlISTS: (productId: string) =>
      `/wishlists/products/${productId}`,
    TRANSFER_TO_CART: (productId: string) =>
      `/wishlists/products/${productId}/move-to-cart`, // Move saved product directly into cart
  },

  ORDERS: {
    ORDERS: "/orders", // GET - List customer orders
    ORDER_DETAILS: (orderId: string) => `/orders/${orderId}`, // GET - order details by ID
    VALIDATE_CHECKOUT_ORDER: "/orders/validate-checkout", // Validates cart items, verifies stock, checks coupons, calculates totals
    ORDER_CHECKOUT: "/orders/checkout", // POST - Transactional Checkout & Order Creation
    ORDER_NUMBER: (orderNumber: string) => `/orders/number/${orderNumber}`, // Retrieves order details by order number
    ORDER_CANCEL: (orderId: string) => `/orders/${orderId}/cancel`, // Cancels an order and releases active inventory reservations
    ORDER_CANCLE: (orderId: string) => `/orders/${orderId}/cancel`,
  },

  PAYMENTS: {
    INITIALIZE: "/payments/initialize",
    VERIFY: "/payments/verify",
    FAIL: "/payments/fail",
    RETRY: "/payments/retry",
    GET_PAYMENT: (paymentId: string) => `/payments/${paymentId}`,
    PAYMENT_WEBHOOK: (provider: string) => `/payments/webhook/${provider}`,
    PAYMENT_INITIALIZE: "/payments/initialize",
    PAYMENT_RETRY: "/payments/retry",
    PAYMENT_DETAILS: (paymentId: string) => `/payments/${paymentId}`,
  },

  COUPONS: {
    COUPON_VALIDATE: "/coupons/validate", // POST - Preview coupon discount calculation
    COUPON_HISTORY: "/coupons/my-history", // GET - My coupon redemption history
  },

  REVIEWS: {
    PRODUCT_REVIEWS: (productId: string) => `/products/${productId}`, // GET - approved product reviews with star distribution
    PRODUCT_REVIEWS_SUMMARY: (productId: string) =>
      `/products/${productId}/summary`, // Average rating, total count, star distribution
    GET_MY_REVIEWS: "/reviews/my-reviews", // GET - customer submitted reviews with moderation status
    REVIEWS: "/reviews", // POST - submit rating and review
    UPDATE_REVIEWS: (reviewsId: string) => `/reviews/${reviewsId}`, // PUT - update review
    DELETE_REVIEWS: (reviewsId: string) => `/reviews/${reviewsId}`, // DELETE - delete review
    REPORT: (productId: string) => `/reviews/${productId}/report`, // Flags review for moderation
  },

  SEARCHES: {
    SEARCH: "/search", // Full-text product search with filtering, sorting, pagination
    SEARCH_SUGGESTIONS: "/search/suggestions", // Matching product titles, brand names, and category names
    SEARCH_SUGGESSTIONS: "/search/suggestions",
    SEARCH_FACETS: "/search/facets", // Facet filter counts
  },

  DISCOVERY: {
    DISCOVERY_FEATURED: "/discovery/featured", // Curated spotlight and featured products
    DISCOVERY_RELATED_PRODUCT: (productId: string) =>
      `/discovery/related/${productId}`, // Recommends similar products
    DISCOVERY_TRENDING: "/discovery/trending", // Popular, top-rated products
    DISCOVERY_NEW_ARRIVALS: "/discovery/new-arrivals", // Newly added active products
  },

  NOTIFICATIONS: {
    NOTIFICATIONS: "/notifications", // GET - all notifications
    UNREAD_NOTIFICATIONS_COUNT: "/notifications/unread-count", // Count of unread in-app notifications
    READ_NOTIFICATION: (notificationId: string) =>
      `/notifications/${notificationId}/read`, // PATCH - mark as read
    MARK_ALL_NOTIFICATION: "/notifications/mark-all-read", // POST - mark all notifications as read
    DELETE_NOTIFICATION: (notificationId: string) =>
      `/notifications/${notificationId}`, // DELETE - delete notification
    NOTIFICATION_PREFERENCES: "/notifications/preferences", // GET - channel & event preferences
    NOTIFICATION_PREFRENCES: "/notifications/preferences",
    UPDATE_NOTIFICATION_PREFERENCES: "/notifications/preferences", // PATCH/PUT - update preferences
    UPDATE_NOTIFICATION_PREFRENCES: "/notifications/preferences",
    REGISTER_DEVICE: "/notifications/devices", // POST - Register or update FCM device push token
    DEVICES: "/notifications/devices",
  },

  ADDRESS: {
    ADDRESSES: "/user/addresses", // POST / GET
    UPDATE_ADDRESS: (addressId: string) => `/user/addresses/${addressId}`, // PATCH
    DELETE_ADDRESS: (addressId: string) => `/user/addresses/${addressId}`, // DELETE
  },
} as const;
