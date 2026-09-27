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

  // Fetch products via REST TanStack Query hook
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAllProducts(params);

  const isRefreshing = externalRefreshing ?? internalRefreshing;

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

  // Extract products array from REST API response
  const products: Product[] = useMemo(() => {
    const rawData = data?.data;
    let items: Product[] = [];

    if (Array.isArray(rawData)) {
      items = rawData;
    } else if (Array.isArray(rawData?.items)) {
      items = rawData.items;
    } else if (Array.isArray(data)) {
      items = data as Product[];
    }

    if (items.length > 0) {
      return items;
    }

    // Use dummy data fallback only when query is complete and offline or no records returned
    if (!isLoading && fallbackToDummyData && (!data || items.length === 0)) {
      return DUMMY_100_PRODUCTS.slice(0, 20) as unknown as Product[];
    }

    return [];
  }, [data, isLoading, fallbackToDummyData]);

  const keyExtractor = useCallback(
    (item: Product, index: number) => item.id || `product-${index}`,
    []
  );

  const renderProductItem = useCallback(
    ({ item, index }: { item: Product; index: number }) => (
      <View
        className={`flex-1 mb-3 ${index % 2 === 0 ? 'pr-1.5' : 'pl-1.5'}`}
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
      <View
        className="flex-1 bg-background dark:bg-background-dark"
        style={contentContainerStyle}
      >
        {ListHeaderComponent}
        <View className="flex-row flex-wrap mt-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <View
              key={index}
              style={{ width: '50%' }}
              className={`mb-3 ${index % 2 === 0 ? 'pr-1.5' : 'pl-1.5'}`}
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
      <View
        className="flex-1 bg-background dark:bg-background-dark"
        style={contentContainerStyle}
      >
        {ListHeaderComponent}
        <ErrorState
          title="Could not load products"
          message={error?.message || 'Please check your connection and try again.'}
          onRetry={() => refetch()}
          isRetrying={isRefreshing}
        />
      </View>
    );
  }

  // Empty state when no items found
  if (!isLoading && products.length === 0) {
    return (
      <View
        className="flex-1 bg-background dark:bg-background-dark"
        style={contentContainerStyle}
      >
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
    <View className="flex-1 bg-background dark:bg-background-dark">
      <AnimatedFlashList
        data={products}
        keyExtractor={keyExtractor}
        renderItem={renderProductItem}
        estimatedItemSize={estimatedItemSize}
        numColumns={numColumns}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
        contentContainerStyle={contentContainerStyle}
        onScroll={onScroll}
        scrollEventThrottle={scrollEventThrottle}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            progressViewOffset={progressViewOffset}
            tintColor={theme.primary}
            colors={[theme.primary]}
            progressBackgroundColor={isDark ? '#28221E' : '#FAF7F2'}
          />
        }
      />
    </View>
  );
}

export default ProductListsSection;
