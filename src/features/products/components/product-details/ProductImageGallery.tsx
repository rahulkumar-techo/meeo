import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Sparkles, Maximize2 } from 'lucide-react-native';
import { useTheme } from '@/theme';
import { ProductImageModal } from './ProductImageModal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface ProductImageGalleryProps {
  images: string[];
  activeIndex: number;
  onSelectIndex: (index: number) => void;
  isFeatured?: boolean;
}

export function ProductImageGallery({
  images,
  activeIndex,
  onSelectIndex,
  isFeatured,
}: ProductImageGalleryProps) {
  const { theme, isDark } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const thumbnailScrollRef = useRef<ScrollView>(null);
  const isProgrammaticScroll = useRef(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Sync scroll when activeIndex changes externally
  useEffect(() => {
    if (scrollViewRef.current) {
      isProgrammaticScroll.current = true;
      scrollViewRef.current.scrollTo({
        x: activeIndex * SCREEN_WIDTH,
        animated: true,
      });

      // Center thumbnail in view
      thumbnailScrollRef.current?.scrollTo({
        x: Math.max(0, activeIndex * 68 - (SCREEN_WIDTH / 2 - 34)),
        animated: true,
      });

      const timer = setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, 350);

      return () => clearTimeout(timer);
    }
  }, [activeIndex]);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (isProgrammaticScroll.current) return;
    const offsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    if (index !== activeIndex && index >= 0 && index < images.length) {
      onSelectIndex(index);
    }
  };

  const handleThumbnailPress = (index: number) => {
    if (index === activeIndex) return;
    onSelectIndex(index);
  };

  return (
    <View style={styles.container}>
      {/* Main Carousel */}
      <View style={styles.carouselWrapper}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          scrollEventThrottle={16}
        >
          {images.map((imgUrl, idx) => (
            <TouchableOpacity
              key={idx}
              activeOpacity={0.95}
              onPress={() => setIsModalVisible(true)}
              style={styles.imageSlide}
            >
              <Image
                source={{ uri: imgUrl }}
                style={styles.mainImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Tap to Zoom Indicator */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setIsModalVisible(true)}
          style={styles.zoomHintBtn}
        >
          <Maximize2 size={14} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Counter Badge */}
        {images.length > 1 && (
          <View style={styles.pageIndexBadge}>
            <Text style={styles.pageIndexText}>
              {activeIndex + 1} / {images.length}
            </Text>
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

      {/* Thumbnail Bar */}
      {images.length > 1 && (
        <ScrollView
          ref={thumbnailScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.thumbnailList}
        >
          {images.map((imgUrl, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <TouchableOpacity
                key={idx}
                activeOpacity={0.8}
                onPress={() => handleThumbnailPress(idx)}
                style={[
                  styles.thumbnailBtn,
                  {
                    borderColor: isSelected
                      ? theme.primary
                      : isDark
                      ? '#334155'
                      : '#E2E8F0',
                    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                    transform: [{ scale: isSelected ? 1.05 : 1 }],
                  },
                ]}
              >
                <Image
                  source={{ uri: imgUrl }}
                  style={styles.thumbnailImg}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* Fullscreen Gesture Zoom Modal */}
      <ProductImageModal
        visible={isModalVisible}
        images={images}
        initialIndex={activeIndex}
        onClose={() => setIsModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  carouselWrapper: {
    width: SCREEN_WIDTH,
    height: 350,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  imageSlide: {
    width: SCREEN_WIDTH,
    height: 350,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
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
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageIndexBadge: {
    position: 'absolute',
    bottom: 12,
    right: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pageIndexText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
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
  thumbnailList: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
  },
  thumbnailBtn: {
    width: 60,
    height: 60,
    borderRadius: 14,
    borderWidth: 2,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  thumbnailImg: {
    width: '100%',
    height: '100%',
  },
});

export default ProductImageGallery;
