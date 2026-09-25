import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  TouchableOpacityProps,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../../theme';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'dark'
  | 'black'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'error'
  | 'success'
  | 'subtle';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ButtonRounded = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';

export interface ButtonProps extends TouchableOpacityProps {
  children?: React.ReactNode;
  title?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  rounded?: ButtonRounded;
  isLoading?: boolean;
  loading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
  textClassName?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function Button({
  children,
  title,
  variant = 'primary',
  size = 'md',
  rounded,
  isLoading = false,
  loading = false,
  loadingText,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  className = '',
  textClassName = '',
  style,
  textStyle,
  activeOpacity = 0.82,
  ...props
}: ButtonProps) {
  const { isDark } = useTheme();
  const isButtonLoading = isLoading || loading;
  const isButtonDisabled = disabled || isButtonLoading;

  // Size base styles
  const sizeContainerClasses: Record<ButtonSize, string> = {
    xs: 'min-h-[32px] py-1 px-2.5 gap-1',
    sm: 'min-h-[38px] py-1.5 px-3.5 gap-1.5',
    md: 'min-h-[46px] py-2.5 px-4 gap-2',
    lg: 'min-h-[52px] py-3 px-5 gap-2.5',
    xl: 'min-h-[58px] py-3.5 px-6 gap-3',
  };

  const defaultRoundedClasses: Record<ButtonSize, string> = {
    xs: 'rounded-md',
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    xl: 'rounded-2xl',
  };

  const explicitRoundedClasses: Record<ButtonRounded, string> = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
    full: 'rounded-full',
  };

  const sizeTextClasses: Record<ButtonSize, string> = {
    xs: 'text-[11px] font-semibold',
    sm: 'text-xs font-semibold',
    md: 'text-sm font-semibold',
    lg: 'text-base font-bold',
    xl: 'text-lg font-bold',
  };

  // Variant styles without pseudo-classes
  const variantContainerClasses: Record<ButtonVariant, string> = {
    primary: 'bg-primary shadow-xs',
    secondary: 'bg-secondary shadow-xs',
    accent: 'bg-accent shadow-xs',
    dark: 'bg-[#2D2621] dark:bg-white shadow-xs',
    black: 'bg-slate-950 dark:bg-white shadow-xs',
    outline: 'bg-transparent border border-border dark:border-slate-800',
    ghost: 'bg-transparent',
    danger: 'bg-error shadow-xs',
    error: 'bg-error shadow-xs',
    success: 'bg-success shadow-xs',
    subtle: 'bg-slate-100 dark:bg-slate-800/80',
  };

  const variantTextClasses: Record<ButtonVariant, string> = {
    primary: 'text-white',
    secondary: 'text-white',
    accent: 'text-white',
    dark: 'text-white dark:text-slate-950',
    black: 'text-white dark:text-slate-950',
    outline: 'text-text-primary dark:text-slate-100',
    ghost: 'text-text-primary dark:text-slate-100',
    danger: 'text-white',
    error: 'text-white',
    success: 'text-white',
    subtle: 'text-slate-900 dark:text-slate-100',
  };

  // Spinner loader color determination
  const getLoaderColor = () => {
    switch (variant) {
      case 'outline':
      case 'ghost':
      case 'subtle':
        return isDark ? '#FAF8F5' : '#2D2621';
      case 'dark':
      case 'black':
        return isDark ? '#120F0D' : '#FFFFFF';
      default:
        return '#FFFFFF';
    }
  };

  const roundedClass = rounded ? explicitRoundedClasses[rounded] : defaultRoundedClasses[size];
  const disabledClasses = isButtonDisabled ? 'opacity-50' : '';

  const content = title || children;

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={{ disabled: isButtonDisabled, busy: isButtonLoading }}
      activeOpacity={activeOpacity}
      disabled={isButtonDisabled}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
      className={`flex-row items-center justify-center ${
        fullWidth ? 'w-full' : 'self-start'
      } ${sizeContainerClasses[size]} ${roundedClass} ${variantContainerClasses[variant]} ${disabledClasses} ${className}`}
      {...props}
    >
      {isButtonLoading ? (
        <View className="flex-row items-center justify-center gap-2">
          <ActivityIndicator size="small" color={getLoaderColor()} />
          {loadingText ? (
            <Text
              style={[{ textAlign: 'center' }, textStyle]}
              className={`${sizeTextClasses[size]} ${variantTextClasses[variant]} font-medium text-center ${textClassName}`}
            >
              {loadingText}
            </Text>
          ) : null}
        </View>
      ) : (
        <>
          {leftIcon && <View className="items-center justify-center">{leftIcon}</View>}
          {typeof content === 'string' || typeof content === 'number' ? (
            <Text
              style={[{ textAlign: 'center' }, textStyle]}
              className={`${sizeTextClasses[size]} ${variantTextClasses[variant]} tracking-tight text-center ${textClassName}`}
            >
              {content}
            </Text>
          ) : (
            content
          )}
          {rightIcon && <View className="items-center justify-center">{rightIcon}</View>}
        </>
      )}
    </TouchableOpacity>
  );
}

export default Button;
