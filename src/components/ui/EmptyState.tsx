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
      className={`w-full items-center justify-center px-4 py-8 ${className}`}
      {...props}
    >
      <View className="w-20 h-20 rounded-full bg-primary/10 dark:bg-primary/20 items-center justify-center mb-4">
        {icon || <ShoppingBag size={36} color="#8C5338" />}
      </View>

      <Text className="text-xl font-bold text-text-primary dark:text-text-primary-dark text-center mb-2 tracking-tight">
        {title}
      </Text>

      <Text className="text-sm text-text-secondary dark:text-text-secondary-dark text-center mb-6 max-w-[280px] leading-5">
        {description}
      </Text>

      <View className="w-full max-w-[200px] gap-2.5 items-center justify-center">
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

export default EmptyState;

