import React from 'react';
import { View, Text, ViewProps } from 'react-native';
import { ShoppingBag } from 'lucide-react-native';
import { Button } from './Button';

export interface EmptyStateProps extends ViewProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionText?: string;
  onActionPress?: () => void;
  secondaryActionText?: string;
  onSecondaryActionPress?: () => void;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  actionText,
  onActionPress,
  secondaryActionText,
  onSecondaryActionPress,
  className = '',
  ...props
}: EmptyStateProps) {
  return (
    <View
      className={`items-center justify-center p-8 text-center max-w-md mx-auto ${className}`}
      {...props}
    >
      <View className="w-20 h-20 rounded-full bg-primary-light/60 dark:bg-blue-950/60 items-center justify-center mb-4">
        {icon || <ShoppingBag size={36} color="#2563EB" />}
      </View>

      <Text className="text-h2 font-bold text-text-primary dark:text-slate-100 text-center mb-2">
        {title}
      </Text>

      <Text className="text-body text-text-secondary dark:text-slate-400 text-center mb-6 max-w-[280px]">
        {description}
      </Text>

      <View className="w-full gap-2.5 max-w-[240px]">
        {actionText && onActionPress && (
          <Button
            variant="primary"
            size="md"
            fullWidth
            onPress={onActionPress}
          >
            {actionText}
          </Button>
        )}

        {secondaryActionText && onSecondaryActionPress && (
          <Button
            variant="ghost"
            size="md"
            fullWidth
            onPress={onSecondaryActionPress}
          >
            {secondaryActionText}
          </Button>
        )}
      </View>
    </View>
  );
}
