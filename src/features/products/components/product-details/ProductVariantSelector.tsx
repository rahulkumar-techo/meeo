import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import { useTheme } from '@/theme';
import type { ProductVariant } from '../../types/product.types';

export interface ProductVariantSelectorProps {
  variants: ProductVariant[];
  selectedIndex: number;
  onSelectVariant: (index: number) => void;
  currency?: string;
}

export function ProductVariantSelector({
  variants,
  selectedIndex,
  onSelectVariant,
  currency = '₹',
}: ProductVariantSelectorProps) {
  const { theme, isDark } = useTheme();

  if (!variants || variants.length <= 1) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text
          style={[
            styles.heading,
            { color: isDark ? '#F8FAFC' : '#0F172A' },
          ]}
        >
          Select Variant / Model
        </Text>
        <Text style={styles.countText}>{variants.length} available</Text>
      </View>

      <View style={styles.chipsContainer}>
        {variants.map((variant, index) => {
          const isSelected = index === selectedIndex;
          const formattedPrice = Number(variant.price).toLocaleString('en-IN', {
            minimumFractionDigits: 0,
          });

          const attributeLabel =
            variant.attributeValues && variant.attributeValues.length > 0
              ? variant.attributeValues
                  .map((av) => av.attributeValue?.value)
                  .filter(Boolean)
                  .join(' / ')
              : '';

          const displayLabel = attributeLabel || variant.sku || `Option ${index + 1}`;

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
                      ? '#1E3A8A'
                      : '#EFF6FF'
                    : isDark
                    ? '#1E293B'
                    : '#FFFFFF',
                },
              ]}
            >
              <View style={styles.cardHeader}>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.skuText,
                    {
                      color: isSelected
                        ? isDark
                          ? '#93C5FD'
                          : '#1D4ED8'
                        : isDark
                        ? '#CBD5E1'
                        : '#334155',
                      fontWeight: isSelected ? '700' : '600',
                    },
                  ]}
                >
                  {displayLabel}
                </Text>

                {isSelected && (
                  <View
                    style={[
                      styles.checkCircle,
                      { backgroundColor: theme.primary },
                    ]}
                  >
                    <Check size={11} color="#FFFFFF" strokeWidth={3} />
                  </View>
                )}
              </View>

              <Text
                style={[
                  styles.priceText,
                  {
                    color: isSelected
                      ? isDark
                        ? '#E2B897'
                        : '#2D2621'
                      : isDark
                      ? '#A89F97'
                      : '#786C64',
                    fontWeight: isSelected ? '800' : '600',
                  },
                ]}
              >
                {currency}{formattedPrice}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginTop: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heading: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  countText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  variantCard: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minWidth: '47%',
    flexGrow: 1,
    justifyContent: 'space-between',
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 6,
  },
  skuText: {
    fontSize: 13,
    flex: 1,
  },
  checkCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceText: {
    fontSize: 14,
    marginTop: 2,
  },
});

export default ProductVariantSelector;
