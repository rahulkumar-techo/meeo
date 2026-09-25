/**
 * Meeo Design System - Color Tokens
 * Premium, warm luxury espresso & terracotta e-commerce palette with full light & dark mode support.
 */

export const palette = {
  // Brand Primary (Warm Espresso / Deep Coffee)
  primary: '#2D2621',
  primaryDark: '#1A1614',
  primaryLight: '#F5EBE6',

  // Secondary & Accent (Terracotta & Warm Bronze Gold)
  secondary: '#8C5338',
  secondaryLight: '#F9EFEA',
  accent: '#C27838',
  accentLight: '#FDF3E7',

  // Status & Feedback
  success: '#16A34A',
  successLight: '#DCFCE7',
  warning: '#D97706',
  warningLight: '#FEF3C7',
  error: '#DC2626',
  errorLight: '#FEE2E2',
  info: '#8C5338',
  infoLight: '#F9EFEA',

  // Warm Neutral Scales (Warm Stone / Taupe)
  slate: {
    50: '#FAF8F5',
    100: '#F3EFEA',
    200: '#E8E2DA',
    300: '#D5CDC4',
    400: '#A89F97',
    500: '#786C64',
    600: '#5A5049',
    700: '#3D352F',
    800: '#28221E',
    900: '#1C1714',
    950: '#120F0D',
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
  background: '#FAF8F5',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceSubtle: '#F3EFEA',

  // Semantic typography
  textPrimary: '#2D2621',
  textSecondary: '#786C64',
  textMuted: '#A89F97',
  textInverse: '#FFFFFF',

  // Semantic borders & controls
  border: '#E8E2DA',
  borderFocus: palette.primary,
  disabled: '#D5CDC4',
  disabledText: '#A89F97',
  disabledBackground: '#F3EFEA',

  // Overlays
  backdrop: 'rgba(45, 38, 33, 0.65)',
  cardShadow: 'rgba(45, 38, 33, 0.08)',
} as const;

export const darkColors = {
  primary: '#E2B897', // Warm Cashmere / Almond Gold in dark mode for readability
  primaryDark: '#C27838',
  primaryLight: '#3A2E26',
  secondary: '#D98A6C',
  secondaryLight: '#42281D',
  accent: '#E5A663',
  accentLight: '#4A3219',
  success: '#22C55E',
  successLight: '#14532D',
  warning: '#F59E0B',
  warningLight: '#78350F',
  error: '#EF4444',
  errorLight: '#7F1D1D',
  info: '#D98A6C',
  infoLight: '#42281D',

  // Semantic surfaces & backgrounds
  background: '#120F0D',
  surface: '#1C1714',
  surfaceElevated: '#28221E',
  surfaceSubtle: '#181411',

  // Semantic typography
  textPrimary: '#FAF8F5',
  textSecondary: '#A89F97',
  textMuted: '#786C64',
  textInverse: '#2D2621',

  // Semantic borders & controls
  border: '#2E2620',
  borderFocus: '#E2B897',
  disabled: '#3D352F',
  disabledText: '#786C64',
  disabledBackground: '#1C1714',

  // Overlays
  backdrop: 'rgba(0, 0, 0, 0.8)',
  cardShadow: 'rgba(0, 0, 0, 0.5)',
} as const;

export type ColorTheme = {
  [K in keyof typeof lightColors]: string;
};
