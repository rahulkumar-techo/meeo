import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { Heart, Star } from 'lucide-react-native';
import { useTheme } from '@/theme';
import type { Product } from '../types/product.types';

export interface ProductCardProps {
  product?: Product;
  id?: string;
  title?: string;
  price?: number;
  originalPrice?: number;
  imageUrl?: string | ImageSourcePropType;
  brand?: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
  tag?: string;
  isWishlisted?: boolean;
  currency?: string;
  onPress?: () => void;
  onWishlistToggle?: () => void;
  variant?: 'vertical' | 'horizontal';
  className?: string;
}

export function ProductCard({
  product,
  id,
  title: propTitle,
  price: propPrice,
  originalPrice: propOriginalPrice,
  imageUrl: propImageUrl,
  brand: propBrand,
  rating: propRating,
  reviewCount: propReviewCount,
  tag: propTag,
  isWishlisted: propIsWishlisted,
  currency = '₹',
  onPress,
  onWishlistToggle,
  variant = 'vertical',
  className = '',
}: ProductCardProps) {
  const { theme, isDark } = useTheme();

  const isHorizontal = variant === 'horizontal';

  // Resolve properties from either prop directly or product object
  const title = propTitle ?? product?.name ?? product?.title ?? '';
  const brand =
    propBrand ??
    (typeof product?.brand === 'object' ? product?.brand?.name : product?.brand);

  const rawPrice =
    propPrice ??
    (product?.variants?.[0]?.price
      ? Number(product.variants[0].price)
      : product?.price ?? 0);

  const rawOriginalPrice =
    propOriginalPrice ??
    (product?.variants?.[0]?.compareAtPrice
      ? Number(product.variants[0].compareAtPrice)
      : product?.originalPrice);

  const resolvedImageUrl =
    propImageUrl ??
    product?.images?.[0]?.url ??
    product?.bannerImage?.url ??
    product?.imageUrl;

  const rating = propRating ?? product?.rating ?? 4.8;
  const reviewCount = propReviewCount ?? product?.reviewCount;
  const tag =
    propTag ??
    (product?.isFeatured ? 'Featured' : product?.tag);
  const isWishlisted = propIsWishlisted ?? product?.isWishlisted ?? false;

  const hasDiscount = Boolean(rawOriginalPrice && rawOriginalPrice > rawPrice);
  const discountPercent = hasDiscount && rawOriginalPrice
    ? Math.round(((rawOriginalPrice - rawPrice) / rawOriginalPrice) * 100)
    : 0;

  const formattedPrice = rawPrice.toLocaleString('en-IN', {
    minimumFractionDigits: rawPrice % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });

  const formattedOriginalPrice = rawOriginalPrice
    ? rawOriginalPrice.toLocaleString('en-IN', {
        minimumFractionDigits: rawOriginalPrice % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 2,
      })
    : null;

  const imageSource =
    typeof resolvedImageUrl === 'string'
      ? { uri: resolvedImageUrl }
      : resolvedImageUrl || {
          uri: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
        };

  if (isHorizontal) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        className={`flex-row p-2 bg-transparent gap-3 ${className}`}
      >
        {/* Product Image without background container */}
        <View className="relative w-28 h-32 items-center justify-center">
          <Image
            source={imageSource}
            className="w-full h-full"
            resizeMode="contain"
          />

          {/* Rating overlay on bottom-left of image */}
          <View className="absolute bottom-1.5 left-1.5 flex-row items-center bg-black/60 dark:bg-black/75 px-1.5 py-0.5 rounded-md gap-0.5">
            <Star size={10} color="#FBBF24" fill="#FBBF24" />
            <Text className="text-[10px] font-bold text-white">
              {rating.toFixed(1)}
            </Text>
          </View>
        </View>

        {/* Product Details */}
        <View className="flex-1 justify-center py-1">
          {brand && (
            <Text className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-0.5">
              {brand}
            </Text>
          )}

          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1"
          >
            {title}
          </Text>

          <View className="flex-row items-center flex-wrap gap-1.5 mt-1">
            <Text className="text-base font-bold text-slate-900 dark:text-slate-100">
              {currency}{formattedPrice}
            </Text>

            {hasDiscount && formattedOriginalPrice && (
              <Text className="text-xs text-slate-400 dark:text-slate-500 line-through">
                {currency}{formattedOriginalPrice}
              </Text>
            )}

            {hasDiscount && discountPercent > 0 && (
              <Text className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {discountPercent}% OFF
              </Text>
            )}
          </View>
        </View>

        {onWishlistToggle && (
          <TouchableOpacity
            onPress={onWishlistToggle}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            className="self-start p-1.5"
          >
            <Heart
              size={18}
              color={isWishlisted ? '#EF4444' : isDark ? '#94A3B8' : '#64748B'}
              fill={isWishlisted ? '#EF4444' : 'transparent'}
            />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className={`bg-transparent overflow-hidden ${className}`}
    >
      {/* Slightly larger Product Image Container without background */}
      <View className="relative w-full aspect-[1/1.12] items-center justify-center">
        <Image
          source={imageSource}
          className="w-full h-full"
          resizeMode="contain"
        />

        {/* Top Badges (e.g. Featured / Tag) */}
        {tag && (
          <View className="absolute top-2 left-2 bg-slate-900/80 dark:bg-white/90 px-2 py-0.5 rounded-full">
            <Text className="text-[10px] font-bold uppercase tracking-wider text-white dark:text-slate-900">
              {tag}
            </Text>
          </View>
        )}

        {/* Wishlist Button Overlay */}
        {onWishlistToggle && (
          <TouchableOpacity
            onPress={onWishlistToggle}
            activeOpacity={0.8}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/70 dark:bg-slate-900/70 items-center justify-center shadow-xs"
          >
            <Heart
              size={15}
              color={isWishlisted ? '#EF4444' : isDark ? '#E2E8F0' : '#475569'}
              fill={isWishlisted ? '#EF4444' : 'transparent'}
            />
          </TouchableOpacity>
        )}

        {/* Rating Overlay on bottom-left inside image */}
        <View className="absolute bottom-2 left-2 flex-row items-center bg-black/60 dark:bg-black/75 px-1.5 py-0.5 rounded-md gap-1">
          <Star size={10} color="#FBBF24" fill="#FBBF24" />
          <Text className="text-[11px] font-bold text-white leading-none">
            {rating.toFixed(1)}
          </Text>
          {typeof reviewCount === 'number' && (
            <Text className="text-[10px] text-white/75 font-medium leading-none">
              ({reviewCount > 999 ? `${(reviewCount / 1000).toFixed(1)}k` : reviewCount})
            </Text>
          )}
        </View>
      </View>

      {/* Product Details */}
      <View className="pt-2 pb-1 px-1">
        {/* Brand */}
        {brand && (
          <Text className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-0.5">
            {brand}
          </Text>
        )}

        {/* 1-Line Truncated Title */}
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          className="text-sm font-semibold text-slate-900 dark:text-slate-100"
        >
          {title}
        </Text>

        {/* Price & Discount Row */}
        <View className="flex-row items-center flex-wrap gap-1.5 mt-1.5">
          <Text className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            {currency}{formattedPrice}
          </Text>

          {hasDiscount && formattedOriginalPrice && (
            <Text className="text-xs text-slate-400 dark:text-slate-500 line-through">
              {currency}{formattedOriginalPrice}
            </Text>
          )}

          {hasDiscount && discountPercent > 0 && (
            <Text className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              {discountPercent}% OFF
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default ProductCard;
