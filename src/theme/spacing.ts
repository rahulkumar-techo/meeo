/**
 * Meeo Design System - Spacing Tokens
 * 4px base scale: 4, 8, 12, 16, 20, 24, 32, 40, 48
 */

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
} as const;

export type SpacingToken = keyof typeof spacing;
