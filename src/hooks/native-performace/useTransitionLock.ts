import { useState, useEffect } from "react";
import { InteractionManager } from "react-native";

interface UseTransitionLockOptions {
  /**
   * Maximum safety timeout in ms before forcing unlock.
   * @default 50
   */
  maxWaitTime?: number;
}

/**
 * High-performance hook that uses React Native's native InteractionManager
 * to schedule heavy tasks right after screen transitions with zero perceptible delay.
 */
export function useTransitionLock(options?: UseTransitionLockOptions): boolean {
  const [isTransitionComplete, setIsTransitionComplete] = useState(false);
  const maxWaitTime = options?.maxWaitTime ?? 50;

  useEffect(() => {
    let isMounted = true;

    // 1. InteractionManager fires as soon as active screen animations complete
    const interactionPromise = InteractionManager.runAfterInteractions(() => {
      if (isMounted) {
        setIsTransitionComplete(true);
      }
    });

    // 2. Ultra-low fallback timer (50ms) to ensure zero lag
    const fallbackTimer = setTimeout(() => {
      if (isMounted) {
        setIsTransitionComplete(true);
      }
    }, maxWaitTime);

    return () => {
      isMounted = false;
      if (interactionPromise && typeof interactionPromise.cancel === "function") {
        interactionPromise.cancel();
      }
      clearTimeout(fallbackTimer);
    };
  }, [maxWaitTime]);

  return isTransitionComplete;
}

export default useTransitionLock;
