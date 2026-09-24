import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Share,
  Alert,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Heart, Share2 } from 'lucide-react-native';
import { useGetProductById } from '../hooks/product.hook';
import type { Product, ProductVariant } from '../types/product.types';
import { useAddToCart } from '@/features/cart';
import { ErrorState } from '@/components/ui/ErrorState';
import { useTheme } from '@/theme';
import { DUMMY_100_PRODUCTS } from '@/temp_data/dummyProducts';

// Modular product-details components
import {
  ProductImageGallery,
  ProductHeaderInfo,
  ProductVariantSelector,
  ProductGuarantees,
  ProductDescription,
  ProductSpecifications,
  ProductBottomBar,
  ProductDetailsSkeleton,
} from '../components/product-details';

interface ProductDetailsScreenProps {
  productId: string;
}

export function ProductDetailsScreen({ productId }: ProductDetailsScreenProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Fetch real product details by ID immediately in parallel with screen slide
  const { data, isLoading, isError, error, refetch, isRefetching } =
    useGetProductById(productId);

  // Add to cart mutation with automatic redirection to cart tab
  const { mutate: addToCart, isPending: isAddingToCart } = useAddToCart({
    onSuccess: () => {
      router.push('/(tabs)/cart');
    },
    onError: (err: any) => {
      Alert.alert(
        'Unable to add to bag',
        err?.response?.data?.message || err?.message || 'Please try again.'
      );
    },
  });

  // Extract product object from API response or fallback to dummy
  const product: Product | null = useMemo(() => {
    if (data?.data && typeof data.data === 'object' && !Array.isArray(data.data)) {
      return data.data as Product;
    }
    // Fallback in dev if matching ID found in dummy dataset
    const dummyMatch = DUMMY_100_PRODUCTS.find((p) => p.id === productId);
    if (dummyMatch) {
      return {
        ...dummyMatch,
        name: dummyMatch.title,
        description:
          'High-performance product engineered with premium materials for maximum durability and everyday excellence.',
        specifications: {
          Overview: {
            Brand: dummyMatch.brand,
            Model: dummyMatch.title,
            Rating: `${dummyMatch.rating} / 5.0`,
          },
        },
        images: [{ id: '1', url: dummyMatch.imageUrl }],
        variants: [
          {
            id: 'v1',
            sku: 'DEFAULT',
            price: dummyMatch.price,
            compareAtPrice: dummyMatch.originalPrice,
            status: 'ACTIVE',
          },
        ],
      } as unknown as Product;
    }
    return null;
  }, [data, productId]);

  // Gallery images list
  const galleryImages = useMemo(() => {
    if (!product) return [];
    const imgs: string[] = [];

    if (product.images && product.images.length > 0) {
      product.images.forEach((img) => {
        if (img?.url) imgs.push(img.url);
      });
    }

    if (imgs.length === 0 && product.bannerImage?.url) {
      imgs.push(product.bannerImage.url);
    }

    if (imgs.length === 0 && product.imageUrl) {
      imgs.push(product.imageUrl);
    }

    if (imgs.length === 0) {
      imgs.push('https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80');
    }

    return imgs;
  }, [product]);

  // Active selected variant and prices
  const activeVariant: ProductVariant | undefined =
    product?.variants && product.variants.length > 0
      ? product.variants[selectedVariantIndex] || product.variants[0]
      : undefined;

  const currentPrice = useMemo(() => {
    if (activeVariant?.price) return Number(activeVariant.price);
    if (product?.price) return Number(product.price);
    return 0;
  }, [activeVariant, product]);

  const comparePrice = useMemo(() => {
    if (activeVariant?.compareAtPrice) return Number(activeVariant.compareAtPrice);
    if (product?.originalPrice) return Number(product.originalPrice);
    return undefined;
  }, [activeVariant, product]);

  const handleShare = useCallback(async () => {
    try {
      await Share.share({
        message: `Check out ${product?.name || 'this product'} on MEEO!`,
      });
    } catch {
      // Ignored
    }
  }, [product]);

  const handleSelectVariant = useCallback((index: number) => {
    setSelectedVariantIndex(index);
  }, []);

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    const variantId =
      activeVariant?.id ||
      (product.variants && product.variants.length > 0
        ? product.variants[0]?.id
        : product.id);

    if (!variantId) return;

    addToCart({
      variantId,
      quantity,
    });
  }, [product, activeVariant, quantity, addToCart]);

  const handleBuyNow = useCallback(() => {
    if (!product) return;
    const variantId =
      activeVariant?.id ||
      (product.variants && product.variants.length > 0
        ? product.variants[0]?.id
        : product.id);

    if (!variantId) return;

    addToCart(
      {
        variantId,
        quantity,
      },
      {
        onSuccess: () => {
          router.push('/(tabs)/cart');
        },
      }
    );
  }, [product, activeVariant, quantity, addToCart, router]);

  // Loading Skeleton State
  if (isLoading && !product) {
    return <ProductDetailsSkeleton />;
  }

  // Error State
  if (isError && !product) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: isDark ? theme.background : '#F8FAFC',
            paddingTop: insets.top,
          },
        ]}
      >
        <View style={styles.topNav}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[
              styles.navIconBtn,
              { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' },
            ]}
          >
            <ArrowLeft size={20} color={isDark ? '#F8FAFC' : '#0F172A'} />
          </TouchableOpacity>
        </View>
        <ErrorState
          title="Product not found"
          message={error?.message || 'Unable to retrieve this product.'}
          onRetry={() => refetch()}
          isRetrying={isRefetching}
        />
      </View>
    );
  }

  if (!product) return null;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? theme.background : '#F8FAFC' },
      ]}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />

      {/* Floating Top Navigation Header */}
      <View
        style={[
          styles.topNav,
          { paddingTop: Math.max(insets.top, 12) + 8 },
        ]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.8}
          style={[
            styles.navIconBtn,
            { backgroundColor: isDark ? 'rgba(30, 41, 59, 0.85)' : 'rgba(255, 255, 255, 0.9)' },
          ]}
        >
          <ArrowLeft size={20} color={isDark ? '#F8FAFC' : '#0F172A'} />
        </TouchableOpacity>

        <View style={styles.topNavRight}>
          <TouchableOpacity
            onPress={handleShare}
            activeOpacity={0.8}
            style={[
              styles.navIconBtn,
              { backgroundColor: isDark ? 'rgba(30, 41, 59, 0.85)' : 'rgba(255, 255, 255, 0.9)' },
            ]}
          >
            <Share2 size={18} color={isDark ? '#F8FAFC' : '#0F172A'} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setIsWishlisted((prev) => !prev)}
            activeOpacity={0.8}
            style={[
              styles.navIconBtn,
              { backgroundColor: isDark ? 'rgba(30, 41, 59, 0.85)' : 'rgba(255, 255, 255, 0.9)' },
            ]}
          >
            <Heart
              size={18}
              color={isWishlisted ? '#EF4444' : isDark ? '#94A3B8' : '#64748B'}
              fill={isWishlisted ? '#EF4444' : 'transparent'}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content ScrollView */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: Math.max(insets.top, 12) + 56,
          paddingBottom: insets.bottom + 130,
        }}
      >
        {/* Modular 1: Image Gallery with Interactive Focused Sync */}
        <ProductImageGallery
          images={galleryImages}
          activeIndex={activeImageIndex}
          onSelectIndex={setActiveImageIndex}
          isFeatured={product.isFeatured}
        />

        {/* Modular Content Body */}
        <View style={styles.contentBody}>
          {/* Modular 2: Product Header Info (Title, Brand, Rating, Rupee Price) */}
          <ProductHeaderInfo
            product={product}
            currentPrice={currentPrice}
            comparePrice={comparePrice}
            currency="₹"
          />

          {/* Modular 3: Variant Selection */}
          {product.variants && product.variants.length > 0 && (
            <ProductVariantSelector
              variants={product.variants}
              selectedIndex={selectedVariantIndex}
              onSelectVariant={handleSelectVariant}
              currency="₹"
            />
          )}

          {/* Modular 4: Trust Badges & Guarantees */}
          <ProductGuarantees />

          {/* Modular 5: Expandable Description */}
          <ProductDescription description={product.description} />

          {/* Modular 6: Categorized Specifications */}
          <ProductSpecifications specifications={product.specifications} />
        </View>
      </ScrollView>

      {/* Modular 7: Sticky Bottom Action Bar with Rupee Total & Stepper */}
      <ProductBottomBar
        price={currentPrice}
        quantity={quantity}
        onQuantityChange={setQuantity}
        currency="₹"
        isAddingToCart={isAddingToCart}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topNav: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  topNavRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contentBody: {
    paddingHorizontal: 18,
    paddingTop: 12,
    gap: 16,
  },
});

export default ProductDetailsScreen;
