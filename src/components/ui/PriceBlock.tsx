import React from 'react';
import { View, Text, ViewProps } from 'react-native';
import { Badge } from './Badge';

export interface PriceBlockProps extends ViewProps {
  price: number;
  originalPrice?: number;
  currency?: string;
  size?: 'sm' | 'md' | 'lg';
  showDiscountBadge?: boolean;
  className?: string;
}

export function PriceBlock({
  price,
  originalPrice,
  currency = '$',
  size = 'md',
  showDiscountBadge = true,
  className = '',
  ...props
}: PriceBlockProps) {
  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const currentPriceSizeClass = {
    sm: 'text-body font-bold',
    md: 'text-h3 font-bold',
    lg: 'text-h1 font-bold',
  }[size];

  const originalPriceSizeClass = {
    sm: 'text-caption line-through',
    md: 'text-body-sm line-through',
    lg: 'text-body line-through',
  }[size];

  const formattedPrice = price.toLocaleString('en-US', {
    minimumFractionDigits: price % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });

  const formattedOriginalPrice = originalPrice
    ? originalPrice.toLocaleString('en-US', {
        minimumFractionDigits: originalPrice % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 2,
      })
    : null;

  return (
    <View className={`flex-row items-baseline flex-wrap gap-1.5 ${className}`} {...props}>
      <Text className={`${currentPriceSizeClass} text-text-primary dark:text-slate-100 tracking-tight`}>
        {currency}{formattedPrice}
      </Text>

      {hasDiscount && formattedOriginalPrice && (
        <Text
          className={`${originalPriceSizeClass} text-text-secondary dark:text-slate-400`}
        >
          {currency}{formattedOriginalPrice}
        </Text>
      )}

      {hasDiscount && showDiscountBadge && discountPercent > 0 && (
        <Badge variant="discount" size="sm">
          -{discountPercent}%
        </Badge>
      )}
    </View>
  );
}
