import { HomeBanner } from '@/components/banner/HomeBanner';
import {
  COLLAPSIBLE_SECTION_HEIGHT,
  HomeHeader,
  STICKY_SECTION_HEIGHT,
  type HomeHeaderCategory,
} from '@/components/header';
import { NotificationPermissionCard } from '@/features/notifications';
import { ProductListsSection } from '@/features/products';
import { useGetAllCategory } from '@/features/products/hooks/category-query';
import { AppRoute } from '@/routes';
import { useTheme } from '@/theme';
import { useRouter } from 'expo-router';
import { Sparkles, TrendingUp } from 'lucide-react-native';
import { useCallback, useMemo, useState } from 'react';
import {
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { theme, isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('for-you');

  const { data: categoryData } = useGetAllCategory();

  // Combine static "For You" root tab with dynamic backend categories
  const categories: HomeHeaderCategory[] = useMemo(() => {
    const rootCategory: HomeHeaderCategory = {
      id: 'for-you',
      name: 'For You',
      icon: Sparkles,
    };

    if (!categoryData || categoryData.length === 0) {
      return [rootCategory];
    }

    const dynamicCategories: HomeHeaderCategory[] = categoryData.map((cat) => ({
      id: cat.id,
      name: cat.name,
      imageUrl: cat.imageUrl || undefined,
      sortOrder: cat.sortOrder,
      slug: cat.slug,
    }));

    return [rootCategory, ...dynamicCategories];
  }, [categoryData]);


  // SharedValues run 100% on native UI thread for smooth 60/120fps scrolling

  const scrollY = useSharedValue(0);
  const lastScrollY = useSharedValue(0);
  const headerOffset = useSharedValue(0); // 0 (expanded) to COLLAPSIBLE_SECTION_HEIGHT (collapsed)

  const topInset = insets.top > 0 ? insets.top : (Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 0);

  const headerHeight =
    topInset +
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
        {/* Push Notification Permission Card Banner */}
        <NotificationPermissionCard />

        {/* Featured Promotional Banners Slider */}
        <HomeBanner />

        {/* Flash Deals / Product Section Header */}
        <View className="flex-row items-center justify-between mb-3 mt-1 px-2 ">
          <Text className="text-lg font-bold text-text-primary dark:text-text-primary-dark">
            Suggested For You
          </Text>
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

  const queryParams = useMemo(
    () => ({
      categoryId: activeTab !== 'for-you' ? activeTab : undefined,
    }),
    [activeTab]
  );

  const handleProductPress = useCallback(
    (product: any) => {
      router.push({
        pathname: AppRoute.product_details,
        params: { productId: product.id },
      });
    },
    [router]
  );

  const handleWishlistToggle = useCallback((_product: any) => {
    // Wishlist toggle handling
  }, []);

  const noop = useCallback(() => { }, []);

  const contentContainerStyle = useMemo(
    () => ({
      paddingHorizontal: 2,
      paddingTop: headerHeight,
      paddingBottom: insets.bottom + 90,
    }),
    [headerHeight, insets.bottom]
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
        categories={categories}
        activeCategoryId={activeTab}
        onCategorySelect={handleCategorySelect}
        onSearchPress={() => router.push(AppRoute.search_screen as any)}
        onFilterPress={noop}
        onScannerPress={noop}
        onNotificationPress={noop}
      />


      {/* Reusable Product List Section with FlashList and React Query API */}


      <ProductListsSection
        params={queryParams}
        onScroll={scrollHandler}
        progressViewOffset={headerHeight}
        ListHeaderComponent={listHeader}
        ListFooterComponent={listFooter}
        contentContainerStyle={contentContainerStyle}
        onProductPress={handleProductPress}
        onWishlistToggle={handleWishlistToggle}
      />

    </View>
  );
}
