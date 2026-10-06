import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Check, Layers } from 'lucide-react-native';
import { useTheme } from '@/theme';
import type { ProductVariant } from '../../types/product.types';

export interface ProductVariantSelectorProps {
  variants: ProductVariant[];
  selectedIndex: number;
  onSelectVariant: (index: number) => void;
  currency?: string;
  fallbackImageUrl?: string;
  productImages?: { url: string; thumbnailUrl?: string }[];
}

export function ProductVariantSelector({
  variants,
  selectedIndex,
  onSelectVariant,
  currency = '₹',
  fallbackImageUrl,
  productImages,
}: ProductVariantSelectorProps) {
  const { theme, isDark } = useTheme();

  if (!variants || variants.length <= 1) {
    return null;
  }

  // Selected variant
  const selectedVariant = variants[selectedIndex] || variants[0];

  // Helper to extract primary attribute name and value (e.g., colors -> "Silver White")
  const selectedLabel = useMemo(() => {
    if (!selectedVariant?.attributeValues || selectedVariant.attributeValues.length === 0) {
      return selectedVariant?.sku || `Option ${selectedIndex + 1}`;
    }

    const colorAttr = selectedVariant.attributeValues.find(
      (av) =>
        av.attributeValue?.attribute?.name?.toLowerCase().includes('color') ||
        av.attributeValue?.attribute?.name?.toLowerCase().includes('colour')
    );

    if (colorAttr?.attributeValue?.value) {
      return colorAttr.attributeValue.value;
    }

    return selectedVariant.attributeValues
      .map((av) => av.attributeValue?.value)
      .filter(Boolean)
      .join(' / ');
  }, [selectedVariant, selectedIndex]);

  return (
    <View style={styles.container}>
      {/* Header: Flipkart-style Attribute Heading with dynamic active name */}
      <View style={styles.headerRow}>
        <View style={styles.titleWrap}>
          <Text
            style={[
              styles.heading,
              { color: isDark ? '#94A3B8' : '#64748B' },
            ]}
          >
            Color / Option:{' '}
            <Text style={[styles.activeValueText, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
              {selectedLabel}
            </Text>
          </Text>
        </View>
        <Text style={styles.countText}>{variants.length} options</Text>
      </View>

      {/* Horizontal Scrollable Variant Cards with Image Thumbnails (Flipkart Style) */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {variants.map((variant, index) => {
          const isSelected = index === selectedIndex;

          // Variant Image: from variant.images, or productImages at index, or fallbackImageUrl
          const variantImage =
            variant.images?.[0]?.thumbnailUrl ||
            variant.images?.[0]?.url ||
            productImages?.[index]?.thumbnailUrl ||
            productImages?.[index]?.url ||
            fallbackImageUrl;

          // Extract option label
          const colorAttr = variant.attributeValues?.find(
            (av) =>
              av.attributeValue?.attribute?.name?.toLowerCase().includes('color') ||
              av.attributeValue?.attribute?.name?.toLowerCase().includes('colour')
          );
          const optionName =
            colorAttr?.attributeValue?.value ||
            variant.attributeValues?.map((av) => av.attributeValue?.value).filter(Boolean).join(' / ') ||
            variant.sku ||
            `Option ${index + 1}`;

          const numPrice = Number(variant.price);
          const formattedPrice = !isNaN(numPrice)
            ? numPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })
            : variant.price;

          const numComparePrice = variant.compareAtPrice ? Number(variant.compareAtPrice) : null;
          const hasDiscount = Boolean(numComparePrice && numComparePrice > numPrice);

          const isInactive = Boolean(variant.status && variant.status.toUpperCase() !== 'ACTIVE');
          const availableQuantity = variant.inventory?.availableQuantity;
          const isOutOfStock = availableQuantity !== undefined && availableQuantity <= 0;
          const isUnavailable = isInactive || isOutOfStock;

          return (
            <TouchableOpacity
              key={variant.id || index}
              activeOpacity={0.8}
              onPress={() => onSelectVariant(index)}
              style={[
                styles.variantCard,
                {
                  borderColor: isSelected
                    ? theme.primary
                    : isDark
                    ? '#334155'
                    : '#E2E8F0',
                  backgroundColor: isSelected
                    ? isDark
                      ? '#1E293B'
                      : '#FAF7F2'
                    : isDark
                    ? '#0F172A'
                    : '#FFFFFF',
                  opacity: isUnavailable ? 0.5 : 1,
                },
              ]}
            >
              {/* Variant Thumbnail Image or Icon placeholder */}
              <View style={styles.imageContainer}>
                {variantImage ? (
                  <Image
                    source={{ uri: variantImage }}
                    style={styles.variantThumbnail}
                    contentFit="cover"
                    cachePolicy="memory-disk"
                    transition={0}
                  />
                ) : (
                  <View style={styles.placeholderContainer}>
                    <Layers size={18} color={isDark ? '#64748B' : '#94A3B8'} />
                  </View>
                )}
                {isSelected && (
                  <View style={[styles.checkCircle, { backgroundColor: theme.primary }]}>
                    <Check size={9} color="#FFFFFF" strokeWidth={3} />
                  </View>
                )}
              </View>

              {/* Variant Details Text */}
              <View style={styles.variantInfo}>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.optionNameText,
                    {
                      color: isSelected
                        ? isDark
                          ? '#F8FAFC'
                          : '#0F172A'
                        : isDark
                        ? '#94A3B8'
                        : '#475569',
                      fontWeight: isSelected ? '700' : '600',
                    },
                  ]}
                >
                  {optionName}
                </Text>

                <View style={styles.priceRow}>
                  <Text
                    style={[
                      styles.priceText,
                      {
                        color: isSelected
                          ? isDark
                            ? '#E2B897'
                            : '#2D2621'
                          : isDark
                          ? '#CBD5E1'
                          : '#1E293B',
                      },
                    ]}
                  >
                    {currency}{formattedPrice}
                  </Text>

                  {hasDiscount && (
                    <Text style={styles.comparePriceText}>
                      {currency}{numComparePrice?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </Text>
                  )}
                </View>

                {/* Stock or Unavailable Tag */}
                {isInactive ? (
                  <Text style={styles.outOfStockText}>Unavailable</Text>
                ) : isOutOfStock ? (
                  <Text style={styles.outOfStockText}>Out of stock</Text>
                ) : availableQuantity !== undefined && availableQuantity <= 5 ? (
                  <Text style={styles.lowStockText}>Only {availableQuantity} left!</Text>
                ) : null}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    marginTop: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  titleWrap: {
    flex: 1,
  },
  heading: {
    fontSize: 13.5,
    fontWeight: '500',
  },
  activeValueText: {
    fontWeight: '800',
  },
  countText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  scrollContent: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  variantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
    minWidth: 160,
    maxWidth: 220,
    height: 64,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  imageContainer: {
    position: 'relative',
    width: 48,
    height: 48,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
  },
  placeholderContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(148, 163, 184, 0.15)',
  },
  variantThumbnail: {
    width: '100%',
    height: '100%',
  },
  checkCircle: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  variantInfo: {
    flex: 1,
    gap: 2,
  },
  optionNameText: {
    fontSize: 12.5,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  priceText: {
    fontSize: 13.5,
    fontWeight: '800',
  },
  comparePriceText: {
    fontSize: 10.5,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  lowStockText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D97706',
  },
  outOfStockText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#EF4444',
  },
});

export default ProductVariantSelector;
