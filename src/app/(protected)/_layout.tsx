import { Stack } from 'expo-router';
import { useTheme } from '@/theme';
import { useMemo } from 'react';
import { noneTransition } from '@/utils/screenTransitions';

export default function ProtectedLayout() {
  const { theme } = useTheme();

  const screenOptions = useMemo(() => ({
    ...noneTransition,
    contentStyle: {
      backgroundColor: theme.background,
    }
  }), [theme.background]);

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="product/[productId]" />
      <Stack.Screen name="checkout" />
      <Stack.Screen name="address" />
    </Stack>
  );
}
