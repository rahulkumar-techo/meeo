import React from 'react';
import { View, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Skeleton } from '@/components/ui/Skeleton';
import { useTheme } from '@/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function ProductDetailsSkeleton() {
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? theme.background : '#F8FAFC' },
      ]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: Math.max(insets.top, 12) + 50,
          paddingBottom: insets.bottom + 90,
        }}
      >
        {/* Image Carousel Skeleton */}
        <View style={styles.imageSkeletonWrapper}>
          <Skeleton height={320} width={SCREEN_WIDTH - 32} borderRadius={20} />
        </View>

        {/* Thumbnails Row */}
        <View style={styles.thumbnailRow}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} width={58} height={58} borderRadius={12} />
          ))}
        </View>

        {/* Details Skeleton */}
        <View style={styles.contentSkeleton}>
          <Skeleton height={22} width={100} borderRadius={6} />
          <Skeleton height={30} width="85%" borderRadius={8} />
          <View style={styles.row}>
            <Skeleton height={24} width={80} borderRadius={6} />
            <Skeleton height={24} width={90} borderRadius={6} />
          </View>
          <Skeleton height={36} width={140} borderRadius={8} />

          {/* Variants skeleton */}
          <View style={styles.variantBlock}>
            <Skeleton height={20} width={120} borderRadius={4} />
            <View style={styles.row}>
              <Skeleton height={50} width="47%" borderRadius={12} />
              <Skeleton height={50} width="47%" borderRadius={12} />
            </View>
          </View>

          {/* Guarantees skeleton */}
          <Skeleton height={120} width="100%" borderRadius={14} />

          {/* Specs skeleton */}
          <Skeleton height={140} width="100%" borderRadius={14} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageSkeletonWrapper: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  thumbnailRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  contentSkeleton: {
    paddingHorizontal: 18,
    gap: 14,
    paddingTop: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  variantBlock: {
    gap: 8,
  },
});

export default ProductDetailsSkeleton;
