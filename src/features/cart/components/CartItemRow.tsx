import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { Plus, Minus, Trash2 } from 'lucide-react-native';
import { useTheme } from '@/theme';
import type { CartItem } from '../types/cart.types';

export interface CartItemRowProps {
  item: CartItem;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
  currency?: string;
  isUpdating?: boolean;
}

export function CartItemRow({
  item,
  onIncrement,
  onDecrement,
  onRemove,
  currency = '₹',
  isUpdating = false,
}: CartItemRowProps) {
  const { theme, isDark } = useTheme();

  // 1. Resolve product image
  const imageUrl = useMemo(() => {
    if (item.product?.thumbnail) return item.product.thumbnail;
    if (item.product?.imageUrl) return item.product.imageUrl;
    if (item.product?.images && item.product.images.length > 0 && item.product.images[0]?.url) {
      return item.product.images[0].url;
    }
    if (item.product?.bannerImage?.url) return item.product.bannerImage.url;
    return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80';
  }, [item.product]);

  // 2. Resolve brand name
  const brandName = useMemo(() => {
    if (!item.product?.brand) return null;
    if (typeof item.product.brand === 'object' && item.product.brand.name) {
      return item.product.brand.name;
    }
    if (typeof item.product.brand === 'string') {
      return item.product.brand;
    }
    return null;
  }, [item.product?.brand]);

  // 3. Resolve variant attributes (e.g. Storage: 256GB, Color: Black Titanium)
  const attributeBadges = useMemo(() => {
    if (!item.variant?.attributes) return [];
    if (Array.isArray(item.variant.attributes)) {
      return item.variant.attributes.map((attr) => ({
        label: `${attr.attribute}: ${attr.value}`,
      }));
    }
    if (typeof item.variant.attributes === 'object') {
      return Object.entries(item.variant.attributes).map(([key, val]) => ({
        label: `${key}: ${String(val)}`,
      }));
    }
    return [];
  }, [item.variant?.attributes]);

  // 4. Prices
  const unitPrice = Number(item.unitPrice ?? item.variant?.price ?? item.price ?? 0);
  const compareAtPrice = item.compareAtPrice
    ? Number(item.compareAtPrice)
    : item.variant?.compareAtPrice
    ? Number(item.variant.compareAtPrice)
    : null;
  const lineTotal = Number(item.lineTotal ?? unitPrice * (item.quantity || 1));

  const formattedLineTotal = lineTotal.toLocaleString('en-IN', {
    minimumFractionDigits: 0,
  });

  const formattedUnitPrice = unitPrice.toLocaleString('en-IN', {
    minimumFractionDigits: 0,
  });

  const formattedComparePrice = compareAtPrice
    ? (compareAtPrice * (item.quantity || 1)).toLocaleString('en-IN', {
        minimumFractionDigits: 0,
      })
    : null;

  const discountPercent =
    compareAtPrice && compareAtPrice > unitPrice
      ? Math.round(((compareAtPrice - unitPrice) / compareAtPrice) * 100)
      : null;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
          borderColor: isDark ? '#334155' : '#E2E8F0',
          opacity: isUpdating ? 0.85 : 1,
        },
      ]}
    >
      {/* Top Section: Image, Info & Delete Button */}
      <View style={styles.topRow}>
        {/* Product Image Container */}
        <View
          style={[
            styles.imageContainer,
            { backgroundColor: isDark ? '#0F172A' : '#F8FAFC' },
          ]}
        >
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        {/* Product Info */}
        <View style={styles.infoContainer}>
          {/* Brand & Delete */}
          <View style={styles.brandRow}>
            {brandName ? (
              <Text
                style={[
                  styles.brandText,
                  { color: isDark ? '#94A3B8' : '#64748B' },
                ]}
                numberOfLines={1}
              >
                {brandName.toUpperCase()}
              </Text>
            ) : <View />}

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onRemove}
              disabled={isUpdating}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={[styles.deleteBtn, isUpdating && { opacity: 0.4 }]}
            >
              <Trash2 size={16} color="#EF4444" />
            </TouchableOpacity>
          </View>

          {/* Product Title */}
          <Text
            style={[
              styles.title,
              { color: isDark ? '#F8FAFC' : '#0F172A' },
            ]}
            numberOfLines={2}
          >
            {item.product?.name || 'Product'}
          </Text>

          {/* Variant Attribute Badges */}
          {attributeBadges.length > 0 && (
            <View style={styles.attributesContainer}>
              {attributeBadges.map((badge, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.attrBadge,
                    {
                      backgroundColor: isDark
                        ? 'rgba(51, 65, 85, 0.7)'
                        : '#F1F5F9',
                      borderColor: isDark ? '#475569' : '#E2E8F0',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.attrBadgeText,
                      { color: isDark ? '#CBD5E1' : '#475569' },
                    ]}
                  >
                    {badge.label}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Stock Notice if Low Stock */}
          {item.stockInfo?.isLowStock && (
            <Text style={styles.lowStockText}>
              Only {item.stockInfo.availableStock} left in stock!
            </Text>
          )}
        </View>
      </View>

      {/* Divider */}
      <View
        style={[
          styles.divider,
          { backgroundColor: isDark ? '#334155' : '#F1F5F9' },
        ]}
      />

      {/* Bottom Section: Price & Quantity Stepper */}
      <View style={styles.bottomRow}>
        {/* Prices Block */}
        <View style={styles.priceBlock}>
          <View style={styles.priceMainRow}>
            <Text
              style={[
                styles.totalPrice,
                { color: isDark ? '#F8FAFC' : '#0F172A' },
              ]}
            >
              {currency}{formattedLineTotal}
            </Text>

            {formattedComparePrice && (
              <Text style={styles.comparePrice}>
                {currency}{formattedComparePrice}
              </Text>
            )}

            {discountPercent && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountBadgeText}>
                  {discountPercent}% OFF
                </Text>
              </View>
            )}
          </View>

          {item.quantity > 1 && (
            <Text
              style={[
                styles.unitPriceText,
                { color: isDark ? '#94A3B8' : '#64748B' },
              ]}
            >
              {currency}{formattedUnitPrice} each
            </Text>
          )}
        </View>

        {/* Quantity Stepper with Active Indicator */}
        <View
          style={[
            styles.stepper,
            {
              backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
              borderColor: isDark ? '#334155' : '#E2E8F0',
            },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onDecrement}
            disabled={isUpdating}
            style={[
              styles.stepperBtn,
              isUpdating && { opacity: 0.3 },
            ]}
          >
            <Minus size={14} color={isDark ? '#F8FAFC' : '#0F172A'} />
          </TouchableOpacity>

          <Text
            style={[
              styles.quantityText,
              { color: isDark ? '#F8FAFC' : '#0F172A' },
            ]}
          >
            {item.quantity}
          </Text>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onIncrement}
            disabled={isUpdating}
            style={[
              styles.stepperBtn,
              isUpdating && { opacity: 0.3 },
            ]}
          >
            <Plus size={14} color={isDark ? '#F8FAFC' : '#0F172A'} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    gap: 12,
  },
  topRow: {
    flexDirection: 'row',
    gap: 12,
  },
  imageContainer: {
    width: 84,
    height: 84,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'space-between',
    gap: 4,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  deleteBtn: {
    padding: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 19,
    letterSpacing: -0.2,
  },
  attributesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 2,
  },
  attrBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  attrBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  lowStockText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#F59E0B',
    marginTop: 2,
  },
  divider: {
    height: 1,
    width: '100%',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceBlock: {
    gap: 2,
  },
  priceMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  totalPrice: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  comparePrice: {
    fontSize: 13,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
    fontWeight: '500',
  },
  discountBadge: {
    backgroundColor: 'rgba(22, 163, 74, 0.12)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountBadgeText: {
    color: '#16A34A',
    fontSize: 10,
    fontWeight: '700',
  },
  unitPriceText: {
    fontSize: 11,
    fontWeight: '500',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 4,
    height: 34,
  },
  stepperBtn: {
    width: 28,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 13,
    fontWeight: '700',
    paddingHorizontal: 8,
    minWidth: 20,
    textAlign: 'center',
  },
  stepperLoadingWrapper: {
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CartItemRow;
