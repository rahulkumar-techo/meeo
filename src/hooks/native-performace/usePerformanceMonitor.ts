import { useCallback, useEffect, useRef } from "react";
import { useNavigationContainerRef } from "expo-router";

// Schedules execution after the current paint frame and JS work have completed
function scheduleAfterPaint(callback: () => void): () => void {
  let timerId: ReturnType<typeof setTimeout> | null = null;
  const frameId = requestAnimationFrame(() => {
    timerId = setTimeout(callback, 0);
  });

  return () => {
    cancelAnimationFrame(frameId);
    if (timerId) clearTimeout(timerId);
  };
}

let isColdLaunchComplete = false;

// Format timing log with emoji indicator based on threshold
function logTiming(
  category: "Navigation" | "Cold Launch" | "Action" | "Modal" | "BottomSheet" | "Task",
  name: string,
  durationMs: number,
  thresholdMs: number,
  extra?: string
) {
  if (!__DEV__) return;

  const isSlow = durationMs > thresholdMs;
  const emoji = isSlow ? "🐢 [SLOW]" : "⚡ [FAST]";
  const extraStr = extra ? ` (${extra})` : "";
  const message = `${emoji} [${category}] "${name}" took ${durationMs.toFixed(0)}ms${extraStr}`;

  if (isSlow) {
    console.warn(message);
  } else {
    console.log(message);
  }
}

/**
 * Hook to profile a screen or global navigation transitions.
 *
 * Usage in RootLayout:
 * ```tsx
 * function NavigationPerformanceMonitor() {
 *   useScreenProfiler();
 *   return null;
 * }
 * ```
 *
 * Usage in Screen:
 * ```tsx
 * export default function CheckoutScreen() {
 *   useScreenProfiler("Checkout Screen");
 *   // ...
 * }
 * ```
 */
export function useScreenProfiler(customName?: string, thresholdMs = 150) {
  let navigationRef: any = null;
  try {
    navigationRef = useNavigationContainerRef();
  } catch {
    navigationRef = null;
  }
  const nav = navigationRef;
  const lastRouteRef = useRef<string>("");

  useEffect(() => {
    if (!__DEV__ || !nav) return;

    const start = performance.now();
    const isInitialColdLaunch = !isColdLaunchComplete;

    const initialRouteName =
      customName || (nav.isReady?.() ? nav.getCurrentRoute?.()?.name : null) || "Initial Screen";

    const cancelInitial = scheduleAfterPaint(() => {
      const duration = performance.now() - start;
      const effectiveThreshold = isInitialColdLaunch ? 500 : thresholdMs;
      const category = isInitialColdLaunch ? "Cold Launch" : "Navigation";

      logTiming(category, initialRouteName, duration, effectiveThreshold);
      isColdLaunchComplete = true;
    });

    // Listen for navigation state transitions safely after initial cold launch
    const unsubscribe = nav.addListener?.("state", () => {
      if (!isColdLaunchComplete) return;

      const currentRoute = nav.isReady?.() ? nav.getCurrentRoute?.() : null;
      const currentName = customName || currentRoute?.name || "Screen";

      // Prevent duplicate logs for the exact same route state tick
      if (lastRouteRef.current === currentName && !customName) return;
      lastRouteRef.current = currentName;

      const navStart = performance.now();
      scheduleAfterPaint(() => {
        const navDuration = performance.now() - navStart;
        logTiming("Navigation", currentName, navDuration, thresholdMs);
      });
    });

    return () => {
      cancelInitial();
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [customName, thresholdMs, nav]);
}

/**
 * Imperative manual trace for modals, bottom sheets, or multi-step operations.
 *
 * Usage:
 * ```tsx
 * const trace = startTrace("Filter BottomSheet Open", "BottomSheet");
 * bottomSheetRef.current?.present();
 * trace.stop(); // will log when UI becomes interactive
 * ```
 */
export function startTrace(
  label: string,
  category: "Modal" | "BottomSheet" | "Action" | "Task" = "Task",
  thresholdMs = 100
) {
  if (!__DEV__) {
    return { stop: () => {} };
  }

  const start = performance.now();

  return {
    stop: (extra?: string) => {
      scheduleAfterPaint(() => {
        const duration = performance.now() - start;
        logTiming(category, label, duration, thresholdMs, extra);
      });
    },
  };
}

/**
 * Wrapper hook to measure interactive button / touchable handlers.
 *
 * Usage:
 * ```tsx
 * const { profileAction } = useActionProfiler();
 * <Button onPress={() => profileAction("Add To Cart", () => addItem(item))} />
 * ```
 */
export function useActionProfiler() {
  const profileAction = useCallback(
    (actionName: string, actionFn: () => void | Promise<void>, thresholdMs = 100) => {
      if (!__DEV__) {
        actionFn();
        return;
      }

      const start = performance.now();
      const result = actionFn();

      if (result instanceof Promise) {
        result.finally(() => {
          scheduleAfterPaint(() => {
            const duration = performance.now() - start;
            logTiming("Action", actionName, duration, thresholdMs, "Async");
          });
        });
      } else {
        scheduleAfterPaint(() => {
          const duration = performance.now() - start;
          logTiming("Action", actionName, duration, thresholdMs);
        });
      }
    },
    []
  );

  return { profileAction };
}