import React from 'react';
import { View, Text, ViewProps } from 'react-native';

export type BadgeVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'neutral'
  | 'discount';

export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends ViewProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  className?: string;
}

export function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  icon,
  className = '',
  ...props
}: BadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 rounded-sm gap-1',
    md: 'px-2.5 py-1 rounded-md gap-1.5',
  }[size];

  const textClasses = {
    sm: 'text-[10px] font-semibold leading-3',
    md: 'text-caption font-semibold leading-4',
  }[size];

  const variantContainerClasses = {
    primary: 'bg-primary-light dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900',
    secondary: 'bg-secondary-light dark:bg-purple-950/60 border border-purple-200 dark:border-purple-900',
    success: 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900',
    warning: 'bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900',
    error: 'bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900',
    neutral: 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700',
    discount: 'bg-error dark:bg-red-600',
  }[variant];

  const variantTextClasses = {
    primary: 'text-primary dark:text-blue-300',
    secondary: 'text-secondary dark:text-purple-300',
    success: 'text-success dark:text-emerald-300',
    warning: 'text-warning dark:text-amber-300',
    error: 'text-error dark:text-rose-300',
    neutral: 'text-text-secondary dark:text-slate-300',
    discount: 'text-white font-bold',
  }[variant];

  return (
    <View
      className={`flex-row items-center self-start ${sizeClasses} ${variantContainerClasses} ${className}`}
      {...props}
    >
      {icon && <View>{icon}</View>}
      {React.isValidElement(children) && !Array.isArray(children) ? (
        children
      ) : (
        <Text className={`${textClasses} ${variantTextClasses} tracking-tight`}>
          {children}
        </Text>
      )}
    </View>
  );
}
