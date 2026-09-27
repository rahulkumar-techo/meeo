import { useEffect, useMemo } from 'react';
import { Platform, StatusBar as RNStatusBar } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { QueryClientProvider } from '@tanstack/react-query';
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';
import { ThemeProvider, useTheme } from '../theme';
import { useAuthStore } from '@/features/auth';
import { usePushNotifications } from '@/features/notifications';
import { queryClient } from '@/apis/query-client';
import { SkeletonProvider } from '@/components/ui/Skeleton';
import '../../global.css';
import { useScreenProfiler } from "@/hooks/native-performace/usePerformanceMonitor";
import { noneTransition } from '@/utils/screenTransitions';
import { useShallow } from 'zustand/react/shallow';

// Global navigation monitor tracking screen transition times in development mode
function NavigationPerformanceMonitor() {
  useScreenProfiler();
  return null;
}

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

function RootLayoutContent() {
  const { theme, isDark } = useTheme();

  // RootLayoutContent ke andar selector ko strict aur shallow karein:
  const { isAuthenticated, isHydrated } = useAuthStore(
    useShallow((s) => ({
      isAuthenticated: s.isAuthenticated,
      isHydrated: s.isHydrated,
    }))
  );
  // RootLayoutContent ke andar:
  const screenOptions = useMemo(() => ({
    ...noneTransition,
    contentStyle: {
      backgroundColor: theme.primary,
    }
  }), [theme.primary]);


  // Initialize push notifications handler, channel, and listeners
  usePushNotifications();

  useEffect(() => {
    // Restore persistent session on app start
    useAuthStore.getState().initializeAuth();

    if (Platform.OS === 'android') {
      RNStatusBar.setTranslucent(true);
      RNStatusBar.setBackgroundColor('transparent');
    }
  }, []);

  // Prevent evaluating Stack.Protected guards before auth session is hydrated
  if (!isHydrated) {
    return null;
  }

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <NavigationPerformanceMonitor />
      <Stack
        screenOptions={screenOptions}
      >
        <Stack.Protected guard={isAuthenticated}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name='(protected)' />
        </Stack.Protected>
        <Stack.Protected guard={!isAuthenticated}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <KeyboardProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <SkeletonProvider>
              <RootLayoutContent />
            </SkeletonProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </KeyboardProvider>
    </SafeAreaProvider>
  );
}
