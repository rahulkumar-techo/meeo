import { Stack } from 'expo-router';
import { useTheme } from '@/theme';

export default function ProtectedLayout() {
  const { isDark } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: {
          backgroundColor: isDark ? '#0B0F17' : '#F1F5F9',
        },
      }}
    >
      <Stack.Screen name="product/[productId]" />
      <Stack.Screen name="checkout" />
      <Stack.Screen name="address" />
    </Stack>
  );
}
