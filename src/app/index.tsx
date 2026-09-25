import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import {
  ShoppingBag,
  Heart,
  Package,
  Compass,
  LogOut,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react-native';

import { Screen } from '@/components/layout';
import { Button } from '@/components/ui';
import { AppRoute } from '@/routes';
import { useAuthStore, useLogout } from '@/features/auth';

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, isHydrated, user } = useAuthStore();
  const logoutMutation = useLogout();

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.replace(AppRoute.signIn as any);
    }
  }, [isHydrated, isAuthenticated]);

  // Wait until session is restored from secure storage or redirecting
  if (!isHydrated || !isAuthenticated) {
    return (
      <View className="flex-1 items-center justify-center bg-[#FAFAFA] dark:bg-[#0B0F17]">
        <ActivityIndicator size="large" color="#2D2621" />
      </View>
    );
  }

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    router.replace(AppRoute.signIn as any);
  };

  const quickActions = [
    {
      title: 'Discover Trends',
      description: 'Explore curated collections & arrivals',
      icon: <Compass size={20} color="#6366F1" />,
      bg: 'bg-indigo-50 dark:bg-indigo-950/30',
    },
    {
      title: 'Shopping Cart',
      description: 'Review your saved bag and checkout',
      icon: <ShoppingBag size={20} color="#EC4899" />,
      bg: 'bg-pink-50 dark:bg-pink-950/30',
    },
    {
      title: 'Saved Wishlist',
      description: 'Keep track of favorite products',
      icon: <Heart size={20} color="#EF4444" />,
      bg: 'bg-red-50 dark:bg-red-950/30',
    },
    {
      title: 'Order History',
      description: 'Track ongoing & past deliveries',
      icon: <Package size={20} color="#10B981" />,
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    },
  ];

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'M';

  return (
    <Screen
      scroll
      safeArea={['top', 'bottom']}
      backgroundColor="#FAFAFA"
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 28,
      }}
    >
      {/* Top Welcome Bar */}
      <View className="flex-row items-center justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <View className="flex-row items-center gap-3">
          {user?.avatar ? (
            <Image
              source={{ uri: user.avatar }}
              className="w-12 h-12 rounded-full border border-slate-200"
            />
          ) : (
            <View className="w-12 h-12 rounded-full bg-[#2D2621] dark:bg-white items-center justify-center">
              <Text className="text-base font-bold text-white dark:text-slate-900">
                {userInitial}
              </Text>
            </View>
          )}

          <View>
            <View className="flex-row items-center gap-1.5">
              <Text className="text-base font-bold text-slate-900 dark:text-white">
                {user?.name || 'Welcome back'}
              </Text>
              <ShieldCheck size={16} color="#10B981" />
            </View>
            <Text className="text-xs text-slate-500 dark:text-slate-400">
              {user?.email || 'Authenticated Member'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleLogout}
          className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <LogOut size={18} color="#64748B" />
        </TouchableOpacity>
      </View>

      {/* Hero Banner Card */}
      <View className="my-5 p-5 rounded-2xl bg-[#2D2621] dark:bg-slate-900 shadow-sm">
        <View className="flex-row items-center gap-2 mb-2">
          <Sparkles size={16} color="#FBBF24" />
          <Text className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
            Premium Shopping
          </Text>
        </View>
        <Text className="text-xl font-bold text-white tracking-tight leading-7 mb-1">
          Explore curated styles & fast checkout
        </Text>
        <Text className="text-xs text-slate-300 leading-5 mb-4">
          Discover handpicked collections designed for quality, elegance, and everyday comfort.
        </Text>

        <Button
          size="sm"
          variant="subtle"
          rounded="xl"
          className="self-start px-4 h-9 bg-white text-slate-900"
          textClassName="text-slate-900 font-bold"
          onPress={() => router.push('/(tabs)')}
        >
          Start Exploring
        </Button>
      </View>

      {/* Quick Navigation Section */}
      <View className="mb-6">
        <Text className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 px-1">
          Quick Access
        </Text>

        <View className="gap-2.5">
          {quickActions.map((item, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.7}
              className="flex-row items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm"
            >
              <View className="flex-row items-center gap-3">
                <View className={`w-10 h-10 rounded-xl ${item.bg} items-center justify-center`}>
                  {item.icon}
                </View>
                <View>
                  <Text className="text-sm font-semibold text-slate-900 dark:text-white">
                    {item.title}
                  </Text>
                  <Text className="text-xs text-slate-500 dark:text-slate-400">
                    {item.description}
                  </Text>
                </View>
              </View>
              <ChevronRight size={18} color="#94A3B8" />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Sign Out Action Button */}
      <View className="pt-2">
        <Button
          fullWidth
          size="lg"
          variant="outline"
          rounded="xl"
          onPress={handleLogout}
          leftIcon={<LogOut size={16} color="#EF4444" />}
          className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
          textClassName="text-red-500 font-semibold"
        >
          Sign Out
        </Button>
      </View>
    </Screen>
  );
}
