/**
 * Meeo Design System - Border Radius Tokens
 * Standard radii: Small (6px), Medium (10px), Large (14px), Card (16px), Pill (999px)
 */

export const borderRadius = {
  none: 0,
  sm: 6,
  md: 10,
  lg: 14,
  card: 16,
  full: 9999,
  pill: 9999,
} as const;

export type BorderRadiusToken = keyof typeof borderRadius;
