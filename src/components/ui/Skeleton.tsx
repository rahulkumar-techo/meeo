import React, { useEffect } from 'react';
import { View, ViewProps } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

export interface SkeletonProps extends ViewProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  className?: string;
}

export function Skeleton({
  width = '100%',
  height = 20,
  borderRadius = 8,
  className = '',
  style,
  ...props
}: SkeletonProps) {
  const opacity = useSharedValue(0.35);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.85, {
        duration: 900,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height: height as any,
          borderRadius,
        },
        animatedStyle,
        style,
      ]}
      className={`bg-slate-200 dark:bg-slate-700 ${className}`}
      {...props}
    />
  );
}

export function SkeletonCircle({
  size = 48,
  className = '',
}: {
  size?: number;
  className?: string;
}) {
  return (
    <Skeleton
      width={size}
      height={size}
      borderRadius={size / 2}
      className={className}
    />
  );
}

export function SkeletonText({
  lines = 2,
  gap = 8,
  className = '',
}: {
  lines?: number;
  gap?: number;
  className?: string;
}) {
  return (
    <View style={{ gap }} className={`w-full ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          height={14}
          width={index === lines - 1 && lines > 1 ? '60%' : '100%'}
          borderRadius={4}
        />
      ))}
    </View>
  );
}

export function SkeletonProductCard({ className = '' }: { className?: string }) {
  return (
    <View
      className={`rounded-card bg-surface dark:bg-slate-800 border border-border dark:border-slate-700/60 p-3 gap-3 ${className}`}
    >
      <Skeleton height={140} borderRadius={12} />
      <Skeleton height={12} width="40%" borderRadius={4} />
      <SkeletonText lines={2} />
      <View className="flex-row items-center justify-between pt-1">
        <Skeleton height={20} width="45%" borderRadius={6} />
        <Skeleton height={32} width={32} borderRadius={8} />
      </View>
    </View>
  );
}
