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
    isFetching,
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

    if (Array.isArray(rawData)) {
      return rawData;
    }
    if (Array.isArray(rawData?.items)) {
      return rawData.items;
    }
    if (Array.isArray(data)) {
      return data as Product[];
    }

    return [];
  }, [data]);

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

  // Render Skeleton, Error, or Empty state directly in ListEmptyComponent
  const renderEmptyComponent = useCallback(() => {
    if (isLoading || isFetching) {
      return (
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
      );
    }

    if (isError) {
      return (
        <View className="py-6">
          <ErrorState
            title="Could not load products"
            message={error?.message || 'Please check your connection and try again.'}
            onRetry={() => refetch()}
            isRetrying={isRefreshing}
          />
        </View>
      );
    }

    return (
      <View className="py-6">
        <EmptyState
          title="No Products Found"
          description="We couldn't find any products matching your criteria."
          actionText="Refresh"
          onActionPress={() => refetch()}
        />
      </View>
    );
  }, [isLoading, isFetching, isError, error, isRefreshing, refetch]);

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <AnimatedFlashList
        data={products}
        keyExtractor={keyExtractor}
        renderItem={renderProductItem}
        estimatedItemSize={estimatedItemSize}
        numColumns={numColumns}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={renderEmptyComponent}
        ListFooterComponent={products.length > 0 ? ListFooterComponent : null}
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
