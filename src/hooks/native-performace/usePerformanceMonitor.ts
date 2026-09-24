import { useCallback, useEffect } from "react";
import { usePathname } from "expo-router";

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
 * Hook to profile a screen or component's mount-to-interactive transition.
 * 
 * Usage:
 * ```tsx
 * export default function CheckoutScreen() {
 *   useScreenProfiler("Checkout Screen");
 *   // ...
 * }
 * ```
 */
export function useScreenProfiler(customName?: string, thresholdMs = 150) {
  const pathname = usePathname();
  const screenName = customName || pathname;

  useEffect(() => {
    if (!__DEV__) return;
    const start = performance.now();
    const isInitialColdLaunch = !isColdLaunchComplete;

    const cancel = scheduleAfterPaint(() => {
      const duration = performance.now() - start;
      // Cold launch includes bundle load, store hydration, and splash dismiss (higher threshold)
      const effectiveThreshold = isInitialColdLaunch ? 500 : thresholdMs;
      const category = isInitialColdLaunch ? "Cold Launch" : "Navigation";

      logTiming(category, screenName, duration, effectiveThreshold);

      if (pathname === "/home" || pathname.includes("(tabs)")) {
        isColdLaunchComplete = true;
      }
    });

    return cancel;
  }, [screenName, thresholdMs, pathname]);
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
  thresholdMs = 120
) {
  if (!__DEV__) {
    return { stop: () => {} };
  }

  const start = performance.now();

  return {
    stop: (extraInfo?: string) => {
      return scheduleAfterPaint(() => {
        const duration = performance.now() - start;
        logTiming(category, label, duration, thresholdMs, extraInfo);
      });
    },
  };
}

/**
 * Universal hook providing profiling helpers for Buttons, Modals, BottomSheets, and Actions.
 * 
 * Usage:
 * ```tsx
 * const { profileAction, profileModal, profileBottomSheet, startTrace } = usePerformanceMonitor();
 * 
 * <Button onPress={() => profileAction("Add To Cart", () => addItem(item))} />
 * <Button onPress={() => profileBottomSheet("Filter Sheet", () => sheetRef.present())} />
 * ```
 */
export function usePerformanceMonitor() {
  // Wrap any synchronous or asynchronous button/action handler
  const profileAction = useCallback(
    <T,>(name: string, action: () => T, thresholdMs = 100): T => {
      if (!__DEV__) return action();

      const start = performance.now();
      const result = action();

      scheduleAfterPaint(() => {
        const duration = performance.now() - start;
        logTiming("Action", name, duration, thresholdMs);
      });

      return result;
    },
    []
  );

  // Profile modal presentations
  const profileModal = useCallback(
    (modalName: string, openFn: () => void, thresholdMs = 120) => {
      if (!__DEV__) return openFn();

      const start = performance.now();
      openFn();

      scheduleAfterPaint(() => {
        const duration = performance.now() - start;
        logTiming("Modal", modalName, duration, thresholdMs);
      });
    },
    []
  );

  // Profile bottom sheet presentations / dismissals
  const profileBottomSheet = useCallback(
    (sheetName: string, actionFn: () => void, thresholdMs = 120) => {
      if (!__DEV__) return actionFn();

      const start = performance.now();
      actionFn();

      scheduleAfterPaint(() => {
        const duration = performance.now() - start;
        logTiming("BottomSheet", sheetName, duration, thresholdMs);
      });
    },
    []
  );

  return {
    profileAction,
    profileModal,
    profileBottomSheet,
    startTrace,
  };
}

/*
1. 📱 Screens & Tabs (Automatic & Custom)
What it measures: From the moment a screen starts mounting until all child components, animations, and the JS thread finish rendering and become responsive to user touch.
How to use:
--
useScreenProfiler("Cart Screen"); // or leave empty for automatic route name
=====================>
2🔘 Buttons & Pressables
What it measures: The time from user tap, through state updates and re-renders, until the UI finishes responding.
How to use:
--
const { profileAction } = usePerformanceMonitor();
<Pressable onPress={() => profileAction("Apply Coupon Button", () => applyCoupon())}>
  <Text>Apply</Text>
</Pressable>
===============================>
. 3.📄 Bottom Sheets (@gorhom/bottom-sheet, etc.)
What it measures: Time taken to open/expand the bottom sheet until all contents inside the sheet are mounted and ready.
How to use:
tsx
const { profileBottomSheet } = usePerformanceMonitor();
const handleOpenSheet = () => {
  profileBottomSheet("Menu Filter Sheet", () => {
    bottomSheetRef.current?.present();
  });
};
=================================>
4.. 🪟 Modals & Popups
What it measures: Transition and render lag when opening alert dialogs, address pickers, or confirmation modals.
How to use:
tsx
const { profileModal } = usePerformanceMonitor();
const handleOpenReviewModal = () => {
  profileModal("Delivery Review Modal", () => {
    setIsModalVisible(true);
  });
};
====================================>
5. ⏳ Async Tasks, API Calls & Multi-Step Workflows
What it measures: Total user-perceived delay for long operations (e.g. fetching cart, calculating taxes, opening payment gateway).
How to use:
tsx
const trace = startTrace("Checkout Payment Init", "Action");
await initializePayment();
trace.stop();

*/ 