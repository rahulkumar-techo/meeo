import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Share,
  Alert,
  StyleSheet,
  StatusBar,
  Text,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Heart, Share2 } from 'lucide-react-native';
import { useGetProductById } from '../hooks/product.hook';
import type { Product, ProductVariant } from '../types/product.types';
import { useAddToCart } from '@/features/cart';
import { ErrorState } from '@/components/ui/ErrorState';
import { useTheme } from '@/theme';

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
  ProductOffersContent,
} from '../components/product-details';
import Dropdown from '@/components/dropdown/Dropdown';

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
  const [isPullRefreshing, setIsPullRefreshing] = useState(false);

  if (!productId) throw new Error("ID not found")


  // Fetch full product details from backend API
  const { data, isLoading, isError, error, refetch } =
    useGetProductById(productId);

  const handlePullRefresh = useCallback(async () => {
    setIsPullRefreshing(true);
    await refetch();
    setIsPullRefreshing(false);
  }, [refetch]);

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

  // Extract real product object from API response
  const product: Product | null = useMemo(() => {
    if (!data) return null;
    const raw: any = (data as any)?.data ?? data;
    if (raw && typeof raw === 'object' && !Array.isArray(raw) && raw.id) {
      return raw as Product;
    }
    return null;
  }, [data]);

  // Active selected variant and prices
  const activeVariant: ProductVariant | undefined =
    product?.variants && product.variants.length > 0
      ? product.variants[selectedVariantIndex] || product.variants[0]
      : undefined;

  // Build Flipkart-style gallery images:
  // 1. Prioritize active variant's images ONLY
  // 2. If active variant has no separate images, match product image at variant index
  // 3. Fallback to product's general images
  // 4. Fallback to banner image
  const galleryImages = useMemo(() => {
    if (!product) return [];

    // 1. If active variant has images, display ONLY this variant's images!
    if (activeVariant?.images && activeVariant.images.length > 0) {
      const variantList = activeVariant.images
        .filter((img) => Boolean(img?.url))
        .map((img) => ({
          url: img.url,
          thumbnailUrl: img.thumbnailUrl || img.url,
        }));

      if (variantList.length > 0) {
        return variantList;
      }
    }

    // 2. If this variant has an image matching its index in product.images
    if (
      product.images &&
      product.images[selectedVariantIndex]?.url &&
      product.variants &&
      product.variants.length > 1
    ) {
      const matched = product.images[selectedVariantIndex];
      return [{ url: matched.url, thumbnailUrl: matched.thumbnailUrl || matched.url }];
    }

    // 3. Fallback to product general images only if active variant has no images
    if (product.images && product.images.length > 0) {
      const productList = product.images
        .filter((img) => Boolean(img?.url))
        .map((img) => ({
          url: img.url,
          thumbnailUrl: img.thumbnailUrl || img.url,
        }));

      if (productList.length > 0) {
        return productList;
      }
    }

    // 4. Fallback to banner image if needed
    if (product.bannerImage?.url) {
      return [
        {
          url: product.bannerImage.url,
          thumbnailUrl: product.bannerImage.thumbnailUrl || product.bannerImage.url,
        },
      ];
    }

    if (product.imageUrl) {
      return [{ url: product.imageUrl }];
    }

    return [];
  }, [product, activeVariant, selectedVariantIndex]);

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

  // Check if current variant is active and in-stock
  const isVariantAvailable = useMemo(() => {
    if (!activeVariant) return false;
    if (activeVariant.status && activeVariant.status.toUpperCase() !== 'ACTIVE') {
      return false;
    }
    const qty = activeVariant.inventory?.availableQuantity;
    if (qty !== undefined && qty !== null && qty <= 0) {
      return false;
    }
    return true;
  }, [activeVariant]);

  const handleShare = useCallback(async () => {
    try {
      await Share.share({
        message: `Check out ${product?.name || 'this product'} on MEEO!`,
      });
    } catch {
      // Ignored
    }
  }, [product]);

  // When variant changes, update selection and snap carousel to the variant's first image (Flipkart style)
  const handleSelectVariant = useCallback((index: number) => {
    setSelectedVariantIndex(index);
    setActiveImageIndex(0);
  }, []);

  const handleAddToCart = useCallback(() => {
    if (!product || !activeVariant) {
      Alert.alert('Unavailable', 'Please select an available variant.');
      return;
    }

    if (!isVariantAvailable) {
      Alert.alert('Unavailable', 'This product variant is currently unavailable or inactive.');
      return;
    }

    addToCart({
      variantId: activeVariant.id,
      quantity,
    });
  }, [product, activeVariant, isVariantAvailable, quantity, addToCart]);

  const handleBuyNow = useCallback(() => {
    if (!product || !activeVariant) {
      Alert.alert('Unavailable', 'Please select an available variant.');
      return;
    }

    if (!isVariantAvailable) {
      Alert.alert('Unavailable', 'This product variant is currently unavailable or inactive.');
      return;
    }

    addToCart(
      {
        variantId: activeVariant.id,
        quantity,
      },
      {
        onSuccess: () => {
          router.push('/(tabs)/cart');
        },
      }
    );
  }, [product, activeVariant, isVariantAvailable, quantity, addToCart, router]);

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
          onRetry={handlePullRefresh}
          isRetrying={isPullRefreshing}
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
      {/* Status bar height spacer to prevent content from rendering under translucent bar */}
      <View style={{ height: insets.top, backgroundColor: isDark ? theme.background : '#F8FAFC' }} />
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
        refreshControl={
          <RefreshControl
            refreshing={isPullRefreshing}
            onRefresh={handlePullRefresh}
            tintColor={theme.primary}
            colors={[theme.primary]}
          />
        }
        contentContainerStyle={{
          // paddingTop: Math.max(insets.top, 12) + 56,
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

        {/* Modular 2: Variant Selection - Listed right under the carousel (Flipkart / Amazon style) */}
        {product.variants && product.variants.length > 0 && (
          <View style={styles.variantSectionWrapper}>
            <ProductVariantSelector
              variants={product.variants}
              selectedIndex={selectedVariantIndex}
              onSelectVariant={handleSelectVariant}
              currency="₹"
              fallbackImageUrl={galleryImages[0]?.url}
              productImages={product.images}
            />
          </View>
        )}

        {/* Modular Content Body */}
        <View style={styles.contentBody}>
          {/* Modular 3: Product Header Info (Title, Brand, Rating, Rupee Price) */}
          <ProductHeaderInfo
            product={product}
            currentPrice={currentPrice}
            comparePrice={comparePrice}
            availableQuantity={activeVariant?.inventory?.availableQuantity}
            currency="₹"
          />

          <Dropdown
            title="Apply offers for maximum savings"
            defaultOpen={true}
            headerBg="#1A3A6B"
            titleColor="#FFFFFF"
          >
            <ProductOffersContent
              productId={product.id}
              variantId={activeVariant?.id ?? null}
              categoryId={product.category?.id ?? null}
              brandId={product.brand?.id ?? null}
              productName={product.name}
              unitPrice={currentPrice}
              quantity={quantity}
            />
          </Dropdown>

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
        isAvailable={isVariantAvailable}
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
  variantSectionWrapper: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
  },
  contentBody: {
    paddingHorizontal: 18,
    paddingTop: 8,
    gap: 16,
  },
});

export default ProductDetailsScreen;
