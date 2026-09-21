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
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Zap size={20} color="#F59E0B" />
            <Text
              style={[
                styles.sectionTitle,
                { color: isDark ? '#F8FAFC' : '#0F172A' },
              ]}
            >
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
    [isDark]
  );

  const listFooter = useMemo(
    () => (
      <View style={{ marginTop: 24 }}>
        {/* Trending Section */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <TrendingUp size={20} color={theme.primary} />
            <Text
              style={[
                styles.sectionTitle,
                { color: isDark ? '#F8FAFC' : '#0F172A' },
              ]}
            >
              Trending Now
            </Text>
          </View>
        </View>

        <View style={styles.trendingBanner}>
          <View style={styles.trendingTextCol}>
            <Text style={styles.trendingBannerSub}>LIMITED TIME OFFER</Text>
            <Text style={styles.trendingBannerHeading}>
              Save up to 40% on Premium Tech
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.shopNowBtn,
                { backgroundColor: isDark ? '#2563EB' : '#0F172A' },
              ]}
            >
              <Text style={styles.shopNowText}>Shop Deals</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    ),
    [isDark, theme.primary]
  );

  return (
    <View
      style={[
        styles.screen,
        { backgroundColor: isDark ? theme.background : '#F8FAFC' },
      ]}
    >
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
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: headerHeight + 8,
            paddingBottom: insets.bottom + 90,
          },
        ]}
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

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 4,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  trendingBanner: {
    backgroundColor: '#DBEAFE',
    borderRadius: 16,
    padding: 18,
    marginTop: 4,
    marginBottom: 16,
  },
  trendingTextCol: {
    gap: 6,
  },
  trendingBannerSub: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1D4ED8',
    letterSpacing: 0.5,
  },
  trendingBannerHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E3A8A',
  },
  shopNowBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 6,
  },
  shopNowText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
