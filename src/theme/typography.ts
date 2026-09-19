/**
 * Meeo Design System - Typography Tokens
 * Inter font scale with predefined styles for React Native and Tailwind mapping.
 */

export const typography = {
  fontFamily: {
    sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  fontSize: {
    display: 32,
    h1: 28,
    h2: 24,
    h3: 20,
    bodyLarge: 16,
    body: 14,
    bodySmall: 12,
    button: 14,
    caption: 11,
  },
  lineHeight: {
    display: 40,
    h1: 36,
    h2: 32,
    h3: 28,
    bodyLarge: 24,
    body: 20,
    bodySmall: 16,
    button: 20,
    caption: 14,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  styles: {
    display: {
      fontSize: 32,
      lineHeight: 40,
      fontWeight: '700' as const,
      letterSpacing: -0.5,
    },
    h1: {
      fontSize: 28,
      lineHeight: 36,
      fontWeight: '700' as const,
      letterSpacing: -0.4,
    },
    h2: {
      fontSize: 24,
      lineHeight: 32,
      fontWeight: '700' as const,
      letterSpacing: -0.3,
    },
    h3: {
      fontSize: 20,
      lineHeight: 28,
      fontWeight: '600' as const,
      letterSpacing: -0.2,
    },
    bodyLarge: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400' as const,
    },
    body: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '400' as const,
    },
    bodySmall: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '400' as const,
    },
    button: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '600' as const,
      letterSpacing: 0.1,
    },
    caption: {
      fontSize: 11,
      lineHeight: 14,
      fontWeight: '500' as const,
      letterSpacing: 0.2,
    },
  },
} as const;
