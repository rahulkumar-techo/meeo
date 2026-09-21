import React, { memo, useRef, useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Platform,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  cancelAnimation,
  SharedValue,
} from 'react-native-reanimated';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { ChevronRight, Sparkles } from 'lucide-react-native';
import { useTheme } from '@/theme';

export type BannerActionType =
  | 'PRODUCT_LIST'
  | 'MARKETING_PROMO'
  | 'PRODUCT_DETAILS'
  | 'WEBVIEW';

export interface BannerTarget {
  category_id?: string;
  filter_tag?: string;
  promo_id?: string;
  bg_color?: string;
  product_id?: string;
  url?: string;
  screen_title?: string;
}

export interface BannerItem {
  banner_id: string;
  image_url: string;
  title: string;
  action_type: BannerActionType;
  target: BannerTarget;
}

export const DEFAULT_BANNERS: BannerItem[] = [
  {
    banner_id: 'b1_electronics',
    image_url:
      'https://images.unsplash.com/photo-1664455340023-214c33a9d0bd?q=80&w=1332&auto=format&fit=crop',
    title: 'Mega Laptop Deals - Up to 40% Off',
    action_type: 'PRODUCT_LIST',
    target: {
      category_id: 'laptops_intel_v5',
      filter_tag: 'discount_40',
      screen_title: 'Intel Core Laptops',
    },
  },
  {
    banner_id: 'b2_bank_ad',
    image_url:
      'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=1170&auto=format&fit=crop',
    title: 'HDFC Instant 10% Cashback',
    action_type: 'MARKETING_PROMO',
    target: {
      promo_id: 'hdfc_cc_festive_05',
      bg_color: '#003399',
      screen_title: 'Partner Bank Offers',
    },
  },
  {
    banner_id: 'b3_single_product',
    image_url:
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1200&auto=format&fit=crop',
    title: 'iPhone 16 Pro - Pre-book Now',
    action_type: 'PRODUCT_DETAILS',
    target: {
      product_id: 'prod_apple_16pro_128',
      screen_title: 'Product Overview',
    },
  },
  {
    banner_id: 'b4_game_zone',
    image_url:
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop',
    title: 'Play & Win SuperCoins Daily!',
    action_type: 'WEBVIEW',
    target: {
      url: 'https://my-ecommerce-rewards.com',
      screen_title: 'Lucky Spin Zone',
    },
  },
];

interface Props {
  banners?: BannerItem[];
  autoPlayInterval?: number;
  onPressBanner?: (banner: BannerItem) => void;
}

// Connected Progress Bar Segment
const ProgressBarSegment = memo(
  ({
    index,
    currentIndex,
    progress,
    isDark,
    onPress,
  }: {
    index: number;
    currentIndex: number;
    progress: SharedValue<number>;
    isDark: boolean;
    onPress: () => void;
  }) => {
    const fillStyle = useAnimatedStyle(() => {
      'worklet';
      if (index < currentIndex) {
        return { width: '100%' };
      }
      if (index > currentIndex) {
        return { width: '0%' };
      }
      return {
        width: `${progress.value * 100}%`,
      };
    });

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        style={[
          styles.segmentTrack,
          {
            backgroundColor: isDark
              ? 'rgba(255, 255, 255, 0.22)'
              : 'rgba(15, 23, 42, 0.14)',
          },
        ]}
      >
        <Animated.View
          style={[
            styles.segmentFill,
            {
              backgroundColor: isDark ? '#60A5FA' : '#2563EB',
            },
            fillStyle,
          ]}
        />
      </TouchableOpacity>
    );
  }
);

export const HomeBanner = memo(
  ({
    banners = DEFAULT_BANNERS,
    autoPlayInterval = 4500,
    onPressBanner,
  }: Props) => {
    const { width } = useWindowDimensions();
    const { isDark } = useTheme();
    const scrollViewRef = useRef<Animated.ScrollView>(null);
    const progress = useSharedValue(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const isDragging = useRef(false);

    const totalBanners = banners.length;

    // Banner card geometry
    const bannerCardWidth = width - 32;
    const bannerCardHeight = Math.round(bannerCardWidth * 0.48);

    // Auto Play Interval & Smooth UI Progress Animation
    useEffect(() => {
      if (totalBanners <= 1 || autoPlayInterval <= 0) return;

      // Animate active progress segment smoothly on UI thread
      cancelAnimation(progress);
      progress.value = 0;
      progress.value = withTiming(1, {
        duration: autoPlayInterval,
        easing: Easing.linear,
      });

      const timer = setInterval(() => {
        if (isDragging.current) return;
        setCurrentIndex((prev) => {
          const next = (prev + 1) % totalBanners;
          scrollViewRef.current?.scrollTo({ x: next * width, animated: true });
          return next;
        });
      }, autoPlayInterval);

      return () => {
        clearInterval(timer);
        cancelAnimation(progress);
      };
    }, [currentIndex, totalBanners, autoPlayInterval, progress, width]);

    const handleMomentumScrollEnd = useCallback(
      (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        isDragging.current = false;
        const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
        setCurrentIndex(newIndex);
      },
      [width]
    );

    const handleScrollBeginDrag = useCallback(() => {
      isDragging.current = true;
      cancelAnimation(progress);
    }, [progress]);

    const handleSegmentPress = useCallback(
      (idx: number) => {
        if (idx === currentIndex) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        scrollViewRef.current?.scrollTo({ x: idx * width, animated: true });
        setCurrentIndex(idx);
      },
      [currentIndex, width]
    );

    const handleBannerPress = useCallback(
      (banner: BannerItem) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        onPressBanner?.(banner);
      },
      [onPressBanner]
    );

    const getActionTag = (actionType: BannerActionType) => {
      switch (actionType) {
        case 'PRODUCT_LIST':
          return 'Top Deals';
        case 'MARKETING_PROMO':
          return 'Bank Offer';
        case 'PRODUCT_DETAILS':
          return 'Featured';
        case 'WEBVIEW':
          return 'Rewards';
        default:
          return 'Special';
      }
    };

    return (
      <View style={styles.wrapper}>
        {/* Horizontal Carousel */}
        <Animated.ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScrollBeginDrag={handleScrollBeginDrag}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          decelerationRate="fast"
          style={{ width }}
        >
          {banners.map((item, index) => {
            const tagLabel = getActionTag(item.action_type);

            return (
              <View
                key={item.banner_id || index}
                style={[styles.slideContainer, { width }]}
              >
                <TouchableOpacity
                  activeOpacity={0.92}
                  onPress={() => handleBannerPress(item)}
                  style={[
                    styles.card,
                    {
                      width: bannerCardWidth,
                      height: bannerCardHeight,
                    },
                  ]}
                >
                  {/* Banner Image with high-performance caching */}
                  <Image
                    source={{ uri: item.image_url }}
                    style={StyleSheet.absoluteFill}
                    contentFit="cover"
                    transition={250}
                    cachePolicy="memory-disk"
                  />

                  {/* Gradient Overlay for Text Readability */}
                  <LinearGradient
                    colors={[
                      'transparent',
                      'rgba(0, 0, 0, 0.25)',
                      'rgba(0, 0, 0, 0.78)',
                    ]}
                    locations={[0.2, 0.55, 1]}
                    style={StyleSheet.absoluteFill}
                  />

                  {/* Top Tag Badge */}
                  <View style={styles.tagBadge}>
                    <Sparkles size={11} color="#FDE047" />
                    <Text style={styles.tagText}>{tagLabel}</Text>
                  </View>

                  {/* Bottom Content Area */}
                  <View style={styles.cardFooter}>
                    <Text style={styles.bannerTitle} numberOfLines={2}>
                      {item.title}
                    </Text>

                    <View style={styles.ctaButton}>
                      <Text style={styles.ctaText}>Explore</Text>
                      <ChevronRight size={13} color="#FFFFFF" />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
        </Animated.ScrollView>

        {/* Connected Smooth Progress Bar Segments */}
        {banners.length > 1 && (
          <View style={styles.progressBarContainer}>
            {banners.map((_, idx) => (
              <ProgressBarSegment
                key={idx}
                index={idx}
                currentIndex={currentIndex}
                progress={progress}
                isDark={isDark}
                onPress={() => handleSegmentPress(idx)}
              />
            ))}
          </View>
        )}
      </View>
    );
  }
);

export default HomeBanner;

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 10,
    alignItems: 'center',
  },
  slideContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'space-between',
    padding: 14,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.16,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  tagBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 20,
    gap: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 8,
  },
  bannerTitle: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 20,
    letterSpacing: -0.2,
    textShadowColor: 'rgba(0, 0, 0, 0.65)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(37, 99, 235, 0.92)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    gap: 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    marginTop: 12,
    paddingHorizontal: 20,
    width: '100%',
    maxWidth: 220,
    alignSelf: 'center',
  },
  segmentTrack: {
    flex: 1,
    height: 3.5,
    borderRadius: 2,
    overflow: 'hidden',
  },
  segmentFill: {
    height: '100%',
    borderRadius: 2,
  },
});