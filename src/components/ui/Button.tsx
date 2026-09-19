import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  TouchableOpacityProps,
} from 'react-native';
import { useTheme } from '../../theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends TouchableOpacityProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const { isDark } = useTheme();

  // Size styles
  const sizeContainerClasses = {
    sm: 'py-2 px-3 min-h-[36px] rounded-md gap-1.5',
    md: 'py-3 px-4 min-h-[44px] rounded-lg gap-2',
    lg: 'py-3.5 px-6 min-h-[52px] rounded-card gap-2.5',
  }[size];

  const sizeTextClasses = {
    sm: 'text-xs font-semibold',
    md: 'text-btn font-semibold',
    lg: 'text-base font-semibold',
  }[size];

  // Variant styles
  const variantContainerClasses = {
    primary: 'bg-primary active:bg-primary-dark shadow-sm',
    secondary: 'bg-secondary active:opacity-90 shadow-sm',
    outline: 'bg-transparent border border-border dark:border-slate-700 active:bg-slate-100 dark:active:bg-slate-800',
    ghost: 'bg-transparent active:bg-slate-100 dark:active:bg-slate-800',
    danger: 'bg-error active:opacity-90 shadow-sm',
  }[variant];

  const variantTextClasses = {
    primary: 'text-white',
    secondary: 'text-white',
    outline: 'text-text-primary dark:text-slate-100',
    ghost: 'text-text-primary dark:text-slate-100',
    danger: 'text-white',
  }[variant];

  const disabledClasses = disabled || isLoading
    ? 'opacity-50 cursor-not-allowed'
    : 'active:scale-[0.98]';

  const loaderColor =
    variant === 'outline' || variant === 'ghost'
      ? isDark
        ? '#F8FAFC'
        : '#2563EB'
      : '#FFFFFF';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || isLoading}
      className={`flex-row items-center justify-center transition-all ${
        fullWidth ? 'w-full' : 'self-start'
      } ${sizeContainerClasses} ${variantContainerClasses} ${disabledClasses} ${className}`}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={loaderColor} />
      ) : (
        <>
          {leftIcon && <View className="mr-1">{leftIcon}</View>}
          {typeof children === 'string' ? (
            <Text
              className={`${sizeTextClasses} ${variantTextClasses} tracking-tight`}
            >
              {children}
            </Text>
          ) : (
            children
          )}
          {rightIcon && <View className="ml-1">{rightIcon}</View>}
        </>
      )}
    </TouchableOpacity>
  );
}
