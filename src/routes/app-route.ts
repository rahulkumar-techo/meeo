export const AppRoute = {
  home: "/",
  auth: "/(auth)/sign-in",
  signIn: "/(auth)/sign-in",
  signUp: "/(auth)/sign-up",
  forgotPassword: "/(auth)/forgot-password",
  verifyOtp: "/(auth)/verify-otp",
  resetPassword: "/(auth)/reset-password",
} as const;

export type AppRouteKey = keyof typeof AppRoute;
export type AppRoutePath = (typeof AppRoute)[AppRouteKey];

export default AppRoute;
