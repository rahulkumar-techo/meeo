import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Image } from 'expo-image';
import { Sparkles, Maximize2, ImageOff } from 'lucide-react-native';
import { useTheme } from '@/theme';
import { ProductImageModal } from './ProductImageModal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
export const CAROUSEL_FIXED_HEIGHT = 380;

export interface GalleryImageItem {
  url: string;
  thumbnailUrl?: string;
}

export interface ProductImageGalleryProps {
  images: (string | GalleryImageItem)[];
  activeIndex: number;
  onSelectIndex: (index: number) => void;
  isFeatured?: boolean;
}

const getImageUrl = (item: string | GalleryImageItem): string => {
  return typeof item === 'string' ? item : item.url;
};

const getThumbnailUrl = (item: string | GalleryImageItem): string | undefined => {
  return typeof item === 'string' ? item : (item.thumbnailUrl || item.url);
};

export function ProductImageGallery({
  images,
  activeIndex,
  onSelectIndex,
  isFeatured,
}: ProductImageGalleryProps) {
  const { theme, isDark } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const isProgrammaticScroll = useRef(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Sync scroll when activeIndex changes externally (e.g. variant selected)
  useEffect(() => {
    if (scrollViewRef.current) {
      isProgrammaticScroll.current = true;
      scrollViewRef.current.scrollTo({
        x: activeIndex * SCREEN_WIDTH,
        animated: false,
      });

      const timer = setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, 80);

      return () => clearTimeout(timer);
    }
  }, [activeIndex, images]);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (isProgrammaticScroll.current) return;
      const offsetX = e.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / SCREEN_WIDTH);
      if (index !== activeIndex && index >= 0 && index < images.length) {
        onSelectIndex(index);
      }
    },
    [activeIndex, images.length, onSelectIndex]
  );

  const handleDotPress = useCallback(
    (index: number) => {
      if (index === activeIndex) return;
      onSelectIndex(index);
    },
    [activeIndex, onSelectIndex]
  );

  const rawStringImages = images.map(getImageUrl);

  return (
    <View style={styles.container}>
      {/* Main Carousel with strictly fixed height */}
      <View
        style={[
          styles.carouselWrapper,
          { backgroundColor: isDark ? theme.surface : '#FFFFFF' },
        ]}
      >
        {images.length === 0 ? (
          <View style={styles.emptyContainer}>
            <ImageOff size={42} color={isDark ? '#475569' : '#94A3B8'} />
            <Text style={[styles.emptyText, { color: isDark ? '#64748B' : '#94A3B8' }]}>
              No image available
            </Text>
          </View>
        ) : (
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleScroll}
            scrollEventThrottle={16}
          >
            {images.map((item, idx) => {
              const imgUrl = getImageUrl(item);
              const thumbUrl = getThumbnailUrl(item);

              return (
                <TouchableOpacity
                  key={imgUrl || `slide-${idx}`}
                  activeOpacity={0.95}
                  onPress={() => setIsModalVisible(true)}
                  style={styles.imageSlide}
                >
                  <Image
                    key={imgUrl}
                    source={{ uri: imgUrl }}
                    placeholder={thumbUrl ? { uri: thumbUrl } : undefined}
                    style={styles.mainImage}
                    contentFit="contain"
                    priority={idx === 0 || idx === activeIndex ? 'high' : 'normal'}
                    cachePolicy="memory-disk"
                    transition={0}
                  />
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        {/* Tap to Zoom Indicator */}
        {images.length > 0 && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setIsModalVisible(true)}
            style={styles.zoomHintBtn}
          >
            <Maximize2 size={13} color="#FFFFFF" />
          </TouchableOpacity>
        )}

        {/* Counter Badge */}
        {images.length > 1 && (
          <View style={styles.pageIndexBadge}>
            <Text style={styles.pageIndexText}>
              {activeIndex + 1} / {images.length}
            </Text>
          </View>
        )}

        {/* Bottom Centered Pagination Dots for multi-image variants */}
        {images.length > 1 && (
          <View style={styles.paginationDotsContainer}>
            {images.map((_, idx) => {
              const isSelected = idx === activeIndex;
              return (
                <TouchableOpacity
                  key={`dot-${idx}`}
                  activeOpacity={0.7}
                  onPress={() => handleDotPress(idx)}
                  style={[
                    styles.paginationDot,
                    isSelected
                      ? [styles.paginationDotActive, { backgroundColor: theme.primary }]
                      : {
                          backgroundColor: isDark
                            ? 'rgba(255, 255, 255, 0.35)'
                            : 'rgba(15, 23, 42, 0.25)',
                        },
                  ]}
                />
              );
            })}
          </View>
        )}

        {/* Featured Pill */}
        {isFeatured && (
          <View style={styles.featuredBadge}>
            <Sparkles size={12} color="#F59E0B" />
            <Text style={styles.featuredBadgeText}>FEATURED</Text>
          </View>
        )}
      </View>

      {/* Fullscreen Gesture Zoom Modal */}
      <ProductImageModal
        visible={isModalVisible}
        images={rawStringImages}
        initialIndex={activeIndex}
        onClose={() => setIsModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: CAROUSEL_FIXED_HEIGHT,
  },
  carouselWrapper: {
    width: SCREEN_WIDTH,
    height: CAROUSEL_FIXED_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  imageSlide: {
    width: SCREEN_WIDTH,
    height: CAROUSEL_FIXED_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  zoomHintBtn: {
    position: 'absolute',
    bottom: 12,
    left: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageIndexBadge: {
    position: 'absolute',
    bottom: 12,
    right: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 12,
  },
  pageIndexText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  paginationDotsContainer: {
    position: 'absolute',
    bottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  paginationDotActive: {
    width: 16,
    height: 6,
    borderRadius: 3,
  },
  featuredBadge: {
    position: 'absolute',
    top: 12,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  featuredBadgeText: {
    color: '#F59E0B',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  emptyContainer: {
    width: SCREEN_WIDTH,
    height: CAROUSEL_FIXED_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyText: {
    fontSize: 13,
    fontWeight: '600',
  },
});

export default ProductImageGallery;
