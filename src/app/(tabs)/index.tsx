import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import {
  useSharedValue,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  HomeHeader,
  COLLAPSIBLE_SECTION_HEIGHT,
  STICKY_SECTION_HEIGHT,
} from '@/components/header/HomeHeader';
import { HomeBanner } from '@/components/banner/HomeBanner';
import { ProductListsSection } from '@/features/products';
import { useTheme } from '@/theme';
import { TrendingUp, Zap } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { AppRoute } from '@/routes';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { theme, isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('for-you');

  // SharedValues run 100% on native UI thread for smooth 60/120fps scrolling
  const scrollY = useSharedValue(0);
  const lastScrollY = useSharedValue(0);
  const headerOffset = useSharedValue(0); // 0 (expanded) to COLLAPSIBLE_SECTION_HEIGHT (collapsed)

  const headerHeight =
    Math.max(insets.top, 12) +
    COLLAPSIBLE_SECTION_HEIGHT +
    STICKY_SECTION_HEIGHT;

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      'worklet';
      const currentY = event.contentOffset.y;
      const diff = currentY - lastScrollY.value;

      if (currentY <= 0) {
        headerOffset.value = 0;
      } else {
        headerOffset.value = Math.min(
          COLLAPSIBLE_SECTION_HEIGHT,
          Math.max(0, headerOffset.value + diff)
        );
      }

      scrollY.value = currentY;
      lastScrollY.value = currentY;
    },
  });

  const handleCategorySelect = useCallback((catId: string) => {
    setActiveTab(catId);
  }, []);

  const listHeader = useMemo(
    () => (
      <View>
        {/* Featured Promotional Banners Slider */}
        <HomeBanner />

        {/* Flash Deals / Product Section Header */}
        <View className="flex-row items-center justify-between mb-3 mt-1">
          <View className="flex-row items-center gap-1.5">
            <Zap size={20} color="#F59E0B" />
            <Text className="text-lg font-bold text-text-primary dark:text-text-primary-dark">
              All Products
            </Text>
          </View>
          <View className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60">
            <Text className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              ⚡ FlashList Powered
            </Text>
          </View>
        </View>
      </View>
    ),
    []
  );

  const listFooter = useMemo(
    () => (
      <View className="mt-6">
        {/* Trending Section */}
        <View className="flex-row items-center justify-between mb-3 mt-1">
          <View className="flex-row items-center gap-1.5">
            <TrendingUp size={20} color={theme.primary} />
            <Text className="text-lg font-bold text-text-primary dark:text-text-primary-dark">
              Trending Now
            </Text>
          </View>
        </View>

        <View className="bg-secondary/15 dark:bg-secondary/25 rounded-2xl p-4.5 mt-1 mb-4">
          <View className="gap-1.5">
            <Text className="text-[11px] font-extrabold tracking-wider text-secondary dark:text-secondary-light">
              LIMITED TIME OFFER
            </Text>
            <Text className="text-lg font-extrabold text-text-primary dark:text-text-primary-dark">
              Save up to 40% on Premium Tech
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              className="self-start px-3.5 py-2 rounded-xl mt-1.5 bg-primary dark:bg-primary-light"
            >
              <Text className="font-bold text-xs text-white dark:text-primary-dark">
                Shop Deals
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    ),
    [theme.primary]
  );

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />

      {/* Sticky Animated Header with Reverse-Scroll Immediate Reveal */}
      <HomeHeader
        scrollY={scrollY}
        headerOffset={headerOffset}
        activeCategoryId={activeTab}
        onCategorySelect={handleCategorySelect}
        onSearchPress={() => { }}
        onFilterPress={() => { }}
        onScannerPress={() => { }}
        onNotificationPress={() => { }}
      />

      {/* Reusable Product List Section with FlashList and React Query API */}
      <ProductListsSection
        params={{
          categoryId: activeTab !== 'for-you' ? activeTab : undefined,
        }}
        onScroll={scrollHandler}
        progressViewOffset={headerHeight}
        ListHeaderComponent={listHeader}
        ListFooterComponent={listFooter}
        contentContainerStyle={{
          paddingHorizontal: 8,
          paddingTop: headerHeight + 8,
          paddingBottom: insets.bottom + 90,
        }}
        onProductPress={(product) => {
          // Navigation / product detail handling
          router.push({
            pathname: AppRoute.product_details,
            params: { productId: product.id }
          })
        }}
        onWishlistToggle={(product) => {
          // Wishlist toggle handling
        }}
      />
    </View>
  );
}
