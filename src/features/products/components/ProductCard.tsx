import React, { useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageSourcePropType,
  StyleSheet,
} from 'react-native';
import { Image } from 'expo-image';
import type { Product } from '../types/product.types';


/// always keep  the first vaiant item data . 
export interface ProductCardProps {
  product?: Product;
  id?: string;
  title?: string;
  price?: number;
  originalPrice?: number;
  imageUrl?: string | ImageSourcePropType;
  brand?: string;
  category?: string;
  currency?: string;
  onPress?: (product?: any) => void;
  className?: string;
}

import { Package } from 'lucide-react-native';

// Shared module-level formatter: avoids costly Intl re-initialization on every render
const inrFormatter = new Intl.NumberFormat('en-IN', {
  maximumFractionDigits: 2,
});

function ProductCardComponent({
  product,
  title: propTitle,
  price: propPrice,
  originalPrice: propOriginalPrice,
  imageUrl: propImageUrl,
  brand: propBrand,
  currency = '₹',
  onPress,
  className = '',
}: ProductCardProps) {
  // Resolve product title
  const title = propTitle ?? product?.name ?? product?.title ?? '';

  useEffect(() => {
    const imageUrl = product?.variants?.[0]?.images?.[0]?.url;

    if (!imageUrl) return;
    if (!product) return;
    console.log(JSON.stringify(imageUrl, null, 2))
  }, [product])

  // Resolve product brand
  const brand =
    propBrand ??
    (typeof product?.brand === 'object' ? product?.brand?.name : product?.brand);

  // Resolve current price
  const rawPrice =
    propPrice ??
    (product?.variants?.[0]?.price !== undefined
      ? Number(product.variants[0].price)
      : product?.minPrice ?? product?.price ?? 0);

  // Resolve original/compare-at price for discount calculations
  const rawOriginalPrice =
    propOriginalPrice ??
    (product?.variants?.[0]?.compareAtPrice !== undefined
      ? Number(product.variants[0].compareAtPrice)
      : product?.maxPrice ?? product?.originalPrice);

  // Single source of truth for product image (no dummy fallbacks)
  const imageSource: string | ImageSourcePropType | undefined =
    product?.variants?.[0]?.images?.[0]?.url;

  const hasDiscount = Boolean(rawOriginalPrice && rawOriginalPrice > rawPrice);
  const discountPercent = hasDiscount && rawOriginalPrice
    ? Math.round(((rawOriginalPrice - rawPrice) / rawOriginalPrice) * 100)
    : 0;

  const formattedPrice = inrFormatter.format(rawPrice);
  const formattedOriginalPrice = rawOriginalPrice ? inrFormatter.format(rawOriginalPrice) : null;

  const handlePress = useCallback(() => {
    if (onPress) {
      onPress(product);
    }
  }, [onPress, product]);

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.85}
      style={styles.cardContainer}
    >
      {/* Product Image Container (Responsive Aspect Ratio) */}
      <View style={styles.imageBox}>
        {imageSource ? (
          <Image
            source={typeof imageSource === 'string' ? { uri: imageSource } : imageSource}
            style={styles.fullImage}
            contentFit="cover"
            priority="normal"
            cachePolicy="memory-disk"
            transition={0}
            recyclingKey={typeof imageSource === 'string' ? imageSource : undefined}
          />
        ) : (
          <View style={styles.placeholderBox}>
            <Package size={28} color="#94A3B8" />
          </View>
        )}
      </View>

      {/* Product Details */}
      <View style={styles.detailsContainer}>
        {/* Brand Name */}
        {brand ? (
          <Text
            numberOfLines={1}
            style={styles.brandText}
          >
            {brand}
          </Text>
        ) : null}

        {/* Title (Single line truncated) */}
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={styles.titleText}
        >
          {title}
        </Text>

        {/* Pricing Row */}
        <View style={styles.priceRow}>
          <Text style={styles.priceText}>
            {currency}{formattedPrice}
          </Text>

          {hasDiscount && formattedOriginalPrice ? (
            <Text style={styles.originalPriceText}>
              {currency}{formattedOriginalPrice}
            </Text>
          ) : null}

          {hasDiscount && discountPercent > 0 ? (
            <Text style={styles.discountText}>
              {discountPercent}% OFF
            </Text>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    paddingBottom: 4,
  },
  imageBox: {
    width: '100%',
    aspectRatio: 1 / 1.15,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#F5EFEB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
  placeholderBox: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5EFEB',
  },
  detailsContainer: {
    paddingTop: 6,
    paddingHorizontal: 2,
  },
  brandText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    color: '#8C5338',
    marginBottom: 1,
  },
  titleText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#1F2937',
    lineHeight: 15,
    marginBottom: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 2,
  },
  priceText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#111827',
  },
  originalPriceText: {
    fontSize: 10.5,
    fontWeight: '500',
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  discountText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#10B981',
  },
});

export const ProductCard = React.memo(ProductCardComponent);
export default ProductCard;
