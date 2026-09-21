import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  RefreshControl,
  StyleProp,
  ViewStyle,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { FlashList } from '@shopify/flash-list';
import { ProductCard } from '../components/ProductCard';
import { useGetAllProducts } from '../hooks/product.hook';
import type { GetProductsParams, Product } from '../types/product.types';
import { SkeletonProductCard } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { useTheme } from '@/theme';
import { DUMMY_100_PRODUCTS } from '@/temp_data/dummyProducts';

const AnimatedFlashList = Animated.createAnimatedComponent(
  FlashList
) as React.ComponentType<any>;

export interface ProductListsSectionProps {
  params?: GetProductsParams;
  onScroll?: any;
  ListHeaderComponent?: React.ReactElement | null;
  ListFooterComponent?: React.ReactElement | null;
  contentContainerStyle?: StyleProp<ViewStyle>;
  onProductPress?: (product: Product) => void;
  onWishlistToggle?: (product: Product) => void;
  numColumns?: number;
  estimatedItemSize?: number;
  showsVerticalScrollIndicator?: boolean;
  scrollEventThrottle?: number;
  fallbackToDummyData?: boolean;
  refreshing?: boolean;
  onRefresh?: () => Promise<any> | void;
  progressViewOffset?: number;
}

export function ProductListsSection({
  params,
  onScroll,
  ListHeaderComponent,
  ListFooterComponent,
  contentContainerStyle,
  onProductPress,
  onWishlistToggle,
  numColumns = 2,
  estimatedItemSize = 290,
  showsVerticalScrollIndicator = false,
  scrollEventThrottle = 16,
  fallbackToDummyData = true,
  refreshing: externalRefreshing,
  onRefresh: externalOnRefresh,
  progressViewOffset = 0,
}: ProductListsSectionProps) {
  const { theme, isDark } = useTheme();
  const [internalRefreshing, setInternalRefreshing] = useState(false);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useGetAllProducts(params);

  // Handle pull-to-refresh
  const handleRefresh = useCallback(async () => {
    if (externalOnRefresh) {
      setInternalRefreshing(true);
      try {
        await externalOnRefresh();
      } finally {
        setInternalRefreshing(false);
      }
      return;
    }

    setInternalRefreshing(true);
    try {
      await refetch();
    } finally {
      setInternalRefreshing(false);
    }
  }, [externalOnRefresh, refetch]);

  const isRefreshing = externalRefreshing ?? (isRefetching || internalRefreshing);

  // Extract products array from various API response shapes
  const products: Product[] = useMemo(() => {
    const apiItems =
      data?.data?.items ??
      (Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []);

    if (apiItems.length > 0) {
      return apiItems as Product[];
    }

    // Use dummy data as fallback if enabled and API returned no items
    if (fallbackToDummyData && (!data || apiItems.length === 0)) {
      return DUMMY_100_PRODUCTS as unknown as Product[];
    }

    return [];
  }, [data, fallbackToDummyData]);

  const keyExtractor = useCallback(
    (item: Product) => item.id || String(Math.random()),
    []
  );

  const renderProductItem = useCallback(
    ({ item, index }: { item: Product; index: number }) => (
      <View
        style={[
          styles.productCol,
          {
            paddingLeft: index % 2 === 0 ? 0 : 6,
            paddingRight: index % 2 === 0 ? 6 : 0,
          },
        ]}
      >
        <ProductCard
          product={item}
          onPress={() => onProductPress?.(item)}
          onWishlistToggle={() => onWishlistToggle?.(item)}
        />
      </View>
    ),
    [onProductPress, onWishlistToggle]
  );

  // Initial loading skeleton grid
  if (isLoading && products.length === 0) {
    return (
      <View style={[styles.container, contentContainerStyle]}>
        {ListHeaderComponent}
        <View style={styles.skeletonGrid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.productCol,
                {
                  paddingLeft: i % 2 === 0 ? 0 : 6,
                  paddingRight: i % 2 === 0 ? 6 : 0,
                },
              ]}
            >
              <SkeletonProductCard />
            </View>
          ))}
        </View>
      </View>
    );
  }

  // Error state with retry
  if (isError && products.length === 0) {
    return (
      <View style={[styles.container, contentContainerStyle]}>
        {ListHeaderComponent}
        <ErrorState
          title="Could not load products"
          message={error?.message || 'Please check your connection and try again.'}
          onRetry={() => refetch()}
          isRetrying={isRefetching}
        />
      </View>
    );
  }

  // Empty state
  if (!isLoading && products.length === 0) {
    return (
      <View style={[styles.container, contentContainerStyle]}>
        {ListHeaderComponent}
        <EmptyState
          title="No Products Found"
          description="We couldn't find any products matching your criteria."
          actionText="Refresh"
          onActionPress={() => refetch()}
        />
      </View>
    );
  }

  return (
    <AnimatedFlashList
      data={products}
      keyExtractor={keyExtractor}
      renderItem={renderProductItem}
      estimatedItemSize={estimatedItemSize}
      numColumns={numColumns}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
      onScroll={onScroll}
      scrollEventThrottle={scrollEventThrottle}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      contentContainerStyle={contentContainerStyle}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          progressViewOffset={progressViewOffset}
          tintColor={theme.primary}
          colors={[theme.primary]}
          progressBackgroundColor={isDark ? '#1E293B' : '#FFFFFF'}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  productCol: {
    flex: 1,
    marginBottom: 12,
  },
  skeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
});

export default ProductListsSection;
