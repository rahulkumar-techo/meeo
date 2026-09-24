import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton } from '@/components/ui/Skeleton';
import { useTheme } from '@/theme';

export function CartSkeleton() {
  const { isDark } = useTheme();

  return (
    <View style={styles.container}>
      {/* 3 Cart Item Skeletons */}
      <View style={styles.itemsList}>
        {Array.from({ length: 3 }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.itemCard,
              {
                backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                borderColor: isDark ? '#334155' : '#E2E8F0',
              },
            ]}
          >
            <Skeleton width={75} height={75} borderRadius={12} />
            <View style={styles.detailsCol}>
              <Skeleton width="40%" height={12} borderRadius={4} />
              <Skeleton width="85%" height={16} borderRadius={6} />
              <View style={styles.row}>
                <Skeleton width={70} height={18} borderRadius={6} />
                <Skeleton width={80} height={30} borderRadius={8} />
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Summary Card Skeleton */}
      <View
        style={[
          styles.summaryCard,
          {
            backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
            borderColor: isDark ? '#334155' : '#E2E8F0',
          },
        ]}
      >
        <Skeleton width="45%" height={20} borderRadius={6} />
        <View style={styles.gap10}>
          <View style={styles.row}>
            <Skeleton width="30%" height={14} borderRadius={4} />
            <Skeleton width="20%" height={14} borderRadius={4} />
          </View>
          <View style={styles.row}>
            <Skeleton width="30%" height={14} borderRadius={4} />
            <Skeleton width="20%" height={14} borderRadius={4} />
          </View>
        </View>
        <Skeleton width="100%" height={48} borderRadius={14} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 10,
    gap: 16,
  },
  itemsList: {
    gap: 12,
  },
  itemCard: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    gap: 12,
  },
  detailsCol: {
    flex: 1,
    justifyContent: 'space-between',
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 14,
    marginTop: 4,
  },
  gap10: {
    gap: 10,
  },
});

export default CartSkeleton;
