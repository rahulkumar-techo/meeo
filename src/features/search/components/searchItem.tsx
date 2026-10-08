import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { ChevronRight, Package, Star } from 'lucide-react-native';
import type { Product } from '@/features/products/types/product.types';

export interface SearchItemProps {
  product: Product;
  onPress: (product: Product) => void;
  currency?: string;
}

export const SearchItem = ({ product, onPress, currency = '₹' }: SearchItemProps) => {
  const title = product.name || product.title || 'Product';
  const brandName =
    typeof product.brand === 'object' ? product.brand?.name : product.brand;

  const rawPrice =
    product.variants?.[0]?.price !== undefined
      ? Number(product.variants[0].price)
      : product.minPrice ?? product.price ?? 0;

  const rawComparePrice =
    product.variants?.[0]?.compareAtPrice !== undefined
      ? Number(product.variants[0].compareAtPrice)
      : product.maxPrice ?? product.originalPrice;

  const hasDiscount = Boolean(rawComparePrice && rawComparePrice > rawPrice);
  const discountPercent =
    hasDiscount && rawComparePrice
      ? Math.round(((rawComparePrice - rawPrice) / rawComparePrice) * 100)
      : 0;

  const formattedPrice = !isNaN(rawPrice)
    ? rawPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })
    : String(rawPrice);

  const formattedComparePrice =
    rawComparePrice && !isNaN(rawComparePrice)
      ? rawComparePrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })
      : null;

  // Resolve best available thumbnail image on the product or variant
  const imageUrl =
    product.variants?.[0]?.images?.[0]?.thumbnailUrl ||
    product.variants?.[0]?.images?.[0]?.url ||
    product.images?.[0]?.thumbnailUrl ||
    product.images?.[0]?.url ||
    product.imageUrl;

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={() => onPress(product)}
      className="flex-row items-center p-3 mb-2.5 rounded-2xl bg-white dark:bg-stone-900 border border-slate-100 dark:border-stone-800 shadow-xs"
    >
      {/* Left-side Product Image Thumbnail */}
      <View
        className="rounded-xl overflow-hidden bg-slate-100 dark:bg-stone-800 items-center justify-center mr-3 border border-slate-200/60 dark:border-stone-800"
        style={{ width: 68, height: 68 }}
      >
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={{ width: '100%', height: '100%' }}
            contentFit="contain"
            cachePolicy="memory-disk"
            transition={150}
          />
        ) : (
          <Package size={24} color="#94A3B8" />
        )}
      </View>

      {/* Product Details (Right of image) */}
      <View className="flex-1 justify-center gap-0.5">
        {Boolean(brandName) && (
          <Text
            numberOfLines={1}
            className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-stone-400"
          >
            {brandName}
          </Text>
        )}

        <Text
          numberOfLines={2}
          className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug"
        >
          {title}
        </Text>

        {/* Pricing Row */}
        <View className="flex-row items-baseline gap-2 mt-1">
          <Text className="text-sm font-extrabold text-slate-900 dark:text-white">
            {currency}{formattedPrice}
          </Text>

          {hasDiscount && formattedComparePrice && (
            <Text className="text-xs text-slate-400 dark:text-stone-500 line-through">
              {currency}{formattedComparePrice}
            </Text>
          )}

          {discountPercent > 0 && (
            <Text className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {discountPercent}% off
            </Text>
          )}
        </View>

        {/* Optional Rating / Review Count */}
        {Boolean(product.rating) && (
          <View className="flex-row items-center gap-1 mt-0.5">
            <View className="flex-row items-center bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded-md gap-0.5">
              <Star size={10} color="#D97706" fill="#D97706" />
              <Text className="text-[10px] font-bold text-amber-700 dark:text-amber-400">
                {product.rating}
              </Text>
            </View>
            {Boolean(product.reviewCount) && (
              <Text className="text-[10px] text-slate-400 dark:text-stone-500">
                ({product.reviewCount})
              </Text>
            )}
          </View>
        )}
      </View>

      {/* Trailing Arrow */}
      <View className="ml-2">
        <ChevronRight size={18} color="#94A3B8" />
      </View>
    </TouchableOpacity>
  );
};

export default SearchItem;