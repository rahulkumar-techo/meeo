import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { Heart, Plus } from 'lucide-react-native';
import { PriceBlock } from './PriceBlock';
import { Rating } from './Rating';
import { Badge } from './Badge';
import { useTheme } from '../../theme';

export interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  imageUrl?: string | ImageSourcePropType;
  brand?: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
  tag?: string;
  isWishlisted?: boolean;
  onPress?: () => void;
  onWishlistToggle?: () => void;
  onAddToCart?: () => void;
  variant?: 'vertical' | 'horizontal';
  className?: string;
}

export function ProductCard({
  title,
  price,
  originalPrice,
  imageUrl,
  brand,
  rating = 4.8,
  reviewCount,
  tag,
  isWishlisted = false,
  onPress,
  onWishlistToggle,
  onAddToCart,
  variant = 'vertical',
  className = '',
}: ProductCardProps) {
  const { isDark } = useTheme();

  const isHorizontal = variant === 'horizontal';

  // Fallback placeholder image if none provided
  const imageSource =
    typeof imageUrl === 'string'
      ? { uri: imageUrl }
      : imageUrl || {
          uri: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
        };

  if (isHorizontal) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.9}
        className={`flex-row p-3 rounded-card bg-surface dark:bg-slate-800/90 border border-border dark:border-slate-700/60 gap-3.5 shadow-sm ${className}`}
      >
        <View className="relative w-24 h-24 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700">
          <Image
            source={imageSource}
            className="w-full h-full"
            resizeMode="cover"
          />
          {tag && (
            <View className="absolute top-1.5 left-1.5">
              <Badge variant="primary" size="sm">
                {tag}
              </Badge>
            </View>
          )}
        </View>

        <View className="flex-1 justify-between py-0.5">
          <View>
            {brand && (
              <Text className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary dark:text-slate-400 mb-0.5">
                {brand}
              </Text>
            )}
            <Text
              numberOfLines={2}
              className="text-body font-semibold text-text-primary dark:text-slate-100"
            >
              {title}
            </Text>
          </View>

          <View className="flex-row items-center justify-between mt-2">
            <PriceBlock
              price={price}
              originalPrice={originalPrice}
              size="sm"
            />

            <TouchableOpacity
              onPress={onAddToCart}
              activeOpacity={0.8}
              className="w-8 h-8 rounded-full bg-primary items-center justify-center active:scale-95"
            >
              <Plus size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      className={`rounded-card bg-surface dark:bg-slate-800/90 border border-border dark:border-slate-700/60 overflow-hidden shadow-sm ${className}`}
    >
      {/* Product Image & Wishlist Button */}
      <View className="relative w-full aspect-square bg-slate-100 dark:bg-slate-700/50">
        <Image
          source={imageSource}
          className="w-full h-full"
          resizeMode="cover"
        />

        {/* Top Badges */}
        <View className="absolute top-2.5 left-2.5 flex-row flex-wrap gap-1">
          {tag && (
            <Badge variant="primary" size="sm">
              {tag}
            </Badge>
          )}
        </View>

        {/* Wishlist Button */}
        <TouchableOpacity
          onPress={onWishlistToggle}
          activeOpacity={0.8}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/80 backdrop-blur-md items-center justify-center shadow-sm"
        >
          <Heart
            size={16}
            color={isWishlisted ? '#DC2626' : isDark ? '#94A3B8' : '#64748B'}
            fill={isWishlisted ? '#DC2626' : 'transparent'}
          />
        </TouchableOpacity>
      </View>

      {/* Product Details */}
      <View className="p-3 gap-2">
        {brand && (
          <Text className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary dark:text-slate-400">
            {brand}
          </Text>
        )}

        <Text
          numberOfLines={2}
          className="text-body font-semibold text-text-primary dark:text-slate-100 leading-5"
        >
          {title}
        </Text>

        <Rating
          rating={rating}
          reviewCount={reviewCount}
          compact
          size="sm"
        />

        {/* Price & Add to Cart Action */}
        <View className="flex-row items-center justify-between pt-1 mt-auto">
          <PriceBlock
            price={price}
            originalPrice={originalPrice}
            size="md"
          />

          <TouchableOpacity
            onPress={onAddToCart}
            activeOpacity={0.8}
            className="w-9 h-9 rounded-lg bg-primary items-center justify-center active:scale-95 shadow-sm"
          >
            <Plus size={18} color="#FFFFFF" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}
