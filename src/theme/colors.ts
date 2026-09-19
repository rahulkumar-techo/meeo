/**
 * Meeo Design System - Color Tokens
 * Clean, premium, minimal e-commerce palette with full light & dark mode support.
 */

export const palette = {
  // Brand Primary
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  primaryLight: '#DBEAFE',

  // Secondary & Accent
  secondary: '#7C3AED',
  secondaryLight: '#EDE9FE',
  accent: '#F59E0B',
  accentLight: '#FEF3C7',

  // Status & Feedback
  success: '#16A34A',
  successLight: '#DCFCE7',
  warning: '#D97706',
  warningLight: '#FEF3C7',
  error: '#DC2626',
  errorLight: '#FEE2E2',
  info: '#0284C7',
  infoLight: '#E0F2FE',

  // Neutral Scales (Slate)
  slate: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
    950: '#0B0F17',
  },

  // Pure
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

export const lightColors = {
  primary: palette.primary,
  primaryDark: palette.primaryDark,
  primaryLight: palette.primaryLight,
  secondary: palette.secondary,
  secondaryLight: palette.secondaryLight,
  accent: palette.accent,
  accentLight: palette.accentLight,
  success: palette.success,
  successLight: palette.successLight,
  warning: palette.warning,
  warningLight: palette.warningLight,
  error: palette.error,
  errorLight: palette.errorLight,
  info: palette.info,
  infoLight: palette.infoLight,

  // Semantic surfaces & backgrounds
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceSubtle: '#F1F5F9',

  // Semantic typography
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  textInverse: '#FFFFFF',

  // Semantic borders & controls
  border: '#E2E8F0',
  borderFocus: palette.primary,
  disabled: '#CBD5E1',
  disabledText: '#94A3B8',
  disabledBackground: '#F1F5F9',

  // Overlays
  backdrop: 'rgba(15, 23, 42, 0.6)',
  cardShadow: 'rgba(15, 23, 42, 0.06)',
} as const;

export const darkColors = {
  primary: '#3B82F6', // slightly lighter for dark mode readability
  primaryDark: palette.primary,
  primaryLight: '#1E3A8A',
  secondary: '#8B5CF6',
  secondaryLight: '#3B1F6E',
  accent: '#FBBF24',
  accentLight: '#78350F',
  success: '#22C55E',
  successLight: '#14532D',
  warning: '#F59E0B',
  warningLight: '#78350F',
  error: '#EF4444',
  errorLight: '#7F1D1D',
  info: '#38BDF8',
  infoLight: '#0C4A6E',

  // Semantic surfaces & backgrounds
  background: '#0B0F17',
  surface: '#161F30',
  surfaceElevated: '#1E293B',
  surfaceSubtle: '#111827',

  // Semantic typography
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  textInverse: '#0F172A',

  // Semantic borders & controls
  border: '#1E293B',
  borderFocus: '#3B82F6',
  disabled: '#334155',
  disabledText: '#64748B',
  disabledBackground: '#1E293B',

  // Overlays
  backdrop: 'rgba(0, 0, 0, 0.75)',
  cardShadow: 'rgba(0, 0, 0, 0.35)',
} as const;

export type ColorTheme = {
  [K in keyof typeof lightColors]: string;
};
