import React, { useMemo, memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
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

export const CartItemRow = memo(function CartItemRow({
  item,
  onIncrement,
  onDecrement,
  onRemove,
  currency = '₹',
  isUpdating = false,
}: CartItemRowProps) {
  const { isDark } = useTheme();

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
      className={`rounded-2xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark px-3 py-2.5 flex-row items-center gap-3 shadow-sm ${isUpdating ? 'opacity-85' : 'opacity-100'
        }`}
    >
      {/* Left: Product Image */}
      <View className="w-[88px] h-[88px] rounded-xl overflow-hidden bg-surface-subtle dark:bg-surface-subtle-dark items-center justify-center p-1">
        <Image
          source={{ uri: imageUrl }}
          style={{ width: '100%', height: '100%' }}
          contentFit="contain"
          transition={150}
          cachePolicy="memory-disk"
        />
      </View>

      {/* Right: Product Details, Price & Stepper */}
      <View className="flex-1 h-[88px] justify-between">
        {/* Top: Brand, Delete & Title */}
        <View className="gap-0.5">
          <View className="flex-row items-center justify-between">
            {brandName ? (
              <Text
                className="text-[10px] font-bold tracking-wider text-text-secondary dark:text-text-secondary-dark flex-1 mr-2"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {brandName.toUpperCase()}
              </Text>
            ) : (
              <View className="flex-1" />
            )}

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onRemove}
              disabled={isUpdating}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              className={`p-0.5 ${isUpdating ? 'opacity-40' : 'opacity-100'}`}
            >
              <Trash2 size={15} color="#EF4444" />
            </TouchableOpacity>
          </View>

          {/* Product Title (1-Line Truncated) */}
          <Text
            className="text-sm font-bold text-text-primary dark:text-text-primary-dark tracking-tight leading-[18px]"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.product?.name || 'Product'}
          </Text>

          {/* Variant Attribute Badges */}
          {attributeBadges.length > 0 && (
            <View className="flex-row items-center gap-1 mt-0.5">
              {attributeBadges.slice(0, 2).map((badge, idx) => (
                <View
                  key={idx}
                  className="px-1.5 py-0.5 rounded border border-border dark:border-border-dark bg-surface-subtle dark:bg-surface-subtle-dark max-w-[120px]"
                >
                  <Text
                    className="text-[10px] font-semibold text-text-secondary dark:text-text-secondary-dark"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {badge.label}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Low Stock Notice */}
          {item.stockInfo?.isLowStock && (
            <Text
              className="text-[10px] font-semibold text-amber-500"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              Only {item.stockInfo.availableStock} left!
            </Text>
          )}
        </View>

        {/* Bottom Row: Price & Quantity Stepper */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-1.5">
            <Text className="text-base font-extrabold tracking-tight text-text-primary dark:text-text-primary-dark">
              {currency}{formattedLineTotal}
            </Text>

            {formattedComparePrice && (
              <Text className="text-xs text-text-muted dark:text-text-muted-dark line-through font-medium">
                {currency}{formattedComparePrice}
              </Text>
            )}

            {discountPercent && (
              <View className="bg-emerald-500/10 px-1.5 py-0.5 rounded">
                <Text className="text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                  {discountPercent}% OFF
                </Text>
              </View>
            )}
          </View>

          {/* Quantity Stepper */}
          <View className="flex-row items-center border border-border dark:border-border-dark rounded-xl bg-surface-subtle dark:bg-surface-subtle-dark h-7 px-1">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onDecrement}
              disabled={isUpdating}
              className={`w-[22px] h-[22px] items-center justify-center ${isUpdating ? 'opacity-30' : 'opacity-100'}`}
            >
              <Minus size={12} color={isDark ? '#FAF8F5' : '#2D2621'} />
            </TouchableOpacity>

            <Text className="text-xs font-bold text-text-primary dark:text-text-primary-dark px-1.5 min-w-[18px] text-center">
              {item.quantity}
            </Text>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onIncrement}
              disabled={isUpdating}
              className={`w-[22px] h-[22px] items-center justify-center ${isUpdating ? 'opacity-30' : 'opacity-100'}`}
            >
              <Plus size={12} color={isDark ? '#FAF8F5' : '#2D2621'} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
});

export default CartItemRow;