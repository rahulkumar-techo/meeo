import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Star } from 'lucide-react-native';
import { useTheme } from '@/theme';
import type { Product } from '../../types/product.types';

export interface ProductHeaderInfoProps {
  product: Product;
  currentPrice: number;
  comparePrice?: number;
  currency?: string;
}

export function ProductHeaderInfo({
  product,
  currentPrice,
  comparePrice,
  currency = '₹',
}: ProductHeaderInfoProps) {
  const { theme, isDark } = useTheme();

  const brandName =
    typeof product.brand === 'object' ? product.brand?.name : product.brand;

  const hasDiscount = Boolean(comparePrice && comparePrice > currentPrice);
  const discountPercent =
    hasDiscount && comparePrice
      ? Math.round(((comparePrice - currentPrice) / comparePrice) * 100)
      : 0;

  const formattedPrice = currentPrice.toLocaleString('en-IN', {
    minimumFractionDigits: 0,
  });

  const formattedComparePrice = comparePrice
    ? comparePrice.toLocaleString('en-IN', {
        minimumFractionDigits: 0,
      })
    : null;

  return (
    <View style={styles.container}>
      {/* Brand & Category Row */}
      <View style={styles.badgeRow}>
        {brandName && (
          <View
            style={[
              styles.brandPill,
              { backgroundColor: isDark ? 'rgba(37, 99, 235, 0.15)' : 'rgba(37, 99, 235, 0.08)' },
            ]}
          >
            <Text style={[styles.brandText, { color: theme.primary }]}>
              {brandName.toUpperCase()}
            </Text>
          </View>
        )}

        {product.category?.name && (
          <View
            style={[
              styles.categoryPill,
              { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' },
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                { color: isDark ? '#94A3B8' : '#64748B' },
              ]}
            >
              {product.category.name}
            </Text>
          </View>
        )}
      </View>

      {/* Product Title */}
      <Text
        style={[
          styles.title,
          { color: isDark ? '#F8FAFC' : '#0F172A' },
        ]}
      >
        {product.name || product.title}
      </Text>

      {/* Rating & Stock Status */}
      <View style={styles.ratingStockRow}>
        <View
          style={[
            styles.ratingPill,
            { backgroundColor: isDark ? '#451A03' : '#FEF3C7' },
          ]}
        >
          <Star size={13} color="#F59E0B" fill="#F59E0B" />
          <Text style={styles.ratingScore}>
            {(product.rating ?? 4.8).toFixed(1)}
          </Text>
          {typeof product.reviewCount === 'number' && (
            <Text style={styles.ratingCount}>
              ({product.reviewCount} reviews)
            </Text>
          )}
        </View>

        <View style={styles.stockBadge}>
          <View style={styles.stockDot} />
          <Text style={styles.stockText}>
            {product.status === 'ACTIVE' ? 'In Stock' : product.status || 'In Stock'}
          </Text>
        </View>
      </View>

      {/* Price & Discount Section */}
      <View style={styles.priceRow}>
        <Text
          style={[
            styles.mainPrice,
            { color: isDark ? '#F8FAFC' : '#0F172A' },
          ]}
        >
          {currency}{formattedPrice}
        </Text>

        {hasDiscount && formattedComparePrice && (
          <Text style={styles.comparePrice}>
            {currency}{formattedComparePrice}
          </Text>
        )}

        {hasDiscount && discountPercent > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountBadgeText}>
              {discountPercent}% OFF
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  brandText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  categoryPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
    letterSpacing: -0.3,
  },
  ratingStockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingScore: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D97706',
  },
  ratingCount: {
    fontSize: 11,
    color: '#B45309',
  },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stockDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  stockText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
    marginTop: 2,
  },
  mainPrice: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  comparePrice: {
    fontSize: 16,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  discountBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#15803D',
  },
});

export default ProductHeaderInfo;
