import type { ComponentProps } from "react";
import type { Stack } from "expo-router";


// import { theme } from "@/themes";

// Screen options type derived from expo-router's Stack
type StackScreenOptions = NonNullable<
  ComponentProps<typeof Stack>["screenOptions"]
>;

/**
 * ── Unified App-Wide Screen Transition ─────────────────────────────────
 *
 * Single consistent native transition across all screens in the app:
 * - Native GPU-accelerated horizontal slide (`slide_from_right`).
 * - Fast & snappy (180ms) for instant responsiveness.
 * - Interactive swipe gestures enabled (`gestureEnabled: true`).
 * - Solid theme background to eliminate white/blank screen flashes.
 */
export const screenTransition: StackScreenOptions = {
  headerShown: false,
  animation: "slide_from_right",
  animationDuration: 180,
  gestureEnabled: true,
  gestureDirection: "horizontal",

  // Performance Boosters
  freezeOnBlur: true, // Suspends rendering of hidden screens to save CPU/RAM
  // contentStyle: {
  //   backgroundColor: theme.colors.background.primary,
  // },
};

export const fadeTransition: StackScreenOptions = {
  headerShown: false,
  animation: "fade",
  animationDuration: 150,
  gestureEnabled: false,
  freezeOnBlur: true,
  // contentStyle: {
  //   backgroundColor: theme.colors.background.primary,
  // },
};

export const noneTransition: StackScreenOptions = {
  headerShown: false,
  animation: "none",
  gestureEnabled: true,
  freezeOnBlur: true,
};

export default screenTransition;

