import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce fast-changing state values.
 * Useful for delaying search queries, auto-saving, and reducing redundant API/storage calls.
 *
 * @param value The value to debounce
 * @param delay Milliseconds to wait before updating debounced value (default: 400ms)
 */
export function useDebounce<T>(value: T, delay = 400): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
