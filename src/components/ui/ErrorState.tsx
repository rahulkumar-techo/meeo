import React from 'react';
import { View, Text, ViewProps } from 'react-native';
import { AlertCircle, RotateCcw } from 'lucide-react-native';
import { Button } from './Button';

export interface ErrorStateProps extends ViewProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryText?: string;
  isRetrying?: boolean;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'We encountered an error loading this content. Please check your connection and try again.',
  onRetry,
  retryText = 'Try Again',
  isRetrying = false,
  className = '',
  ...props
}: ErrorStateProps) {
  return (
    <View
      className={`items-center justify-center p-8 text-center max-w-md mx-auto ${className}`}
      {...props}
    >
      <View className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/60 items-center justify-center mb-4">
        <AlertCircle size={32} color="#DC2626" />
      </View>

      <Text className="text-lg font-bold text-text-primary dark:text-text-primary-dark text-center mb-1.5 tracking-tight">
        {title}
      </Text>

      <Text className="text-sm text-text-secondary dark:text-text-secondary-dark text-center mb-6 max-w-[280px] leading-5">
        {message}
      </Text>

      {onRetry && (
        <Button
          variant="primary"
          size="md"
          onPress={onRetry}
          isLoading={isRetrying}
          leftIcon={<RotateCcw size={16} color="#FFFFFF" />}
        >
          {retryText}
        </Button>
      )}
    </View>
  );
}

export default ErrorState;
