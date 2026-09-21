import React, { memo, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';

import {
  HomeHeaderProps,
  DEFAULT_CATEGORIES,
  COLLAPSIBLE_SECTION_HEIGHT,
  STICKY_SECTION_HEIGHT,
  STICKY_COLLAPSED_HEIGHT,
} from './types';
import { HeaderGradient } from './HeaderGradient';
import { HomeHeaderTopBar } from './HomeHeaderTopBar';
import { HomeHeaderPromoBanner } from './HomeHeaderPromoBanner';
import { HomeHeaderSearchBar } from './HomeHeaderSearchBar';
import { HomeHeaderCategories } from './HomeHeaderCategories';

export * from './types';
export * from './HeaderGradient';

const HomeHeaderComponent = ({
  scrollY: externalScrollY,
  headerOffset: externalHeaderOffset,
  address = 'HOME Near A-one public school, N...',
  points = 1450,
  promoText = 'STARTS ON 9TH OCT: Extra 20% OFF',
  promoCode = 'MEEO20',
  categories = DEFAULT_CATEGORIES,
  activeCategoryId: controlledActiveCategoryId,
  onAddressPress,
  onPointsPress,
  onScannerPress,
  onNotificationPress,
  onSearchPress,
  onFilterPress,
  onMicPress,
  onCategorySelect,
  onPromoPress,
}: HomeHeaderProps) => {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();

  const internalScrollY = useSharedValue(0);
  const scrollY = externalScrollY ?? internalScrollY;
  const offset = externalHeaderOffset ?? scrollY;

  const [selectedCat, setSelectedCat] = useState(
    controlledActiveCategoryId || categories[0]?.id || 'for-you'
  );
  const activeCat = controlledActiveCategoryId ?? selectedCat;

  const topInset = Math.max(insets.top, 12);

  const handleCatSelect = (id: string) => {
    setSelectedCat(id);
    onCategorySelect?.(id);
  };

  // 1. Collapsible Container Animation (TopBar + Promo Banner)
  // Fades cleanly to 0 opacity with negative translateY
  const collapsibleAnimatedStyle = useAnimatedStyle(() => {
    const height = interpolate(
      offset.value,
      [0, COLLAPSIBLE_SECTION_HEIGHT],
      [COLLAPSIBLE_SECTION_HEIGHT, 0],
      Extrapolation.CLAMP
    );
    const opacity = interpolate(
      offset.value,
      [0, COLLAPSIBLE_SECTION_HEIGHT * 0.35, COLLAPSIBLE_SECTION_HEIGHT * 0.65],
      [1, 0.2, 0],
      Extrapolation.CLAMP
    );
    const translateY = interpolate(
      offset.value,
      [0, COLLAPSIBLE_SECTION_HEIGHT],
      [0, -25],
      Extrapolation.CLAMP
    );

    return { height, opacity, transform: [{ translateY }], overflow: 'hidden' };
  });

  // 2. Dynamic Outer Container Height
  const containerAnimatedStyle = useAnimatedStyle(() => {
    const collapsibleHeight = interpolate(
      offset.value,
      [0, COLLAPSIBLE_SECTION_HEIGHT],
      [COLLAPSIBLE_SECTION_HEIGHT, 0],
      Extrapolation.CLAMP
    );

    const stickyHeight = interpolate(
      offset.value,
      [0, COLLAPSIBLE_SECTION_HEIGHT],
      [STICKY_SECTION_HEIGHT, STICKY_COLLAPSED_HEIGHT],
      Extrapolation.CLAMP
    );

    const shadowOpacity = interpolate(
      scrollY.value,
      [0, 30],
      [0.15, 0.35],
      Extrapolation.CLAMP
    );

    return {
      height: topInset + stickyHeight + collapsibleHeight,
      shadowOpacity,
    };
  });

  return (
    <Animated.View
      style={[
        styles.header,
        {
          paddingTop: topInset,
        },
        containerAnimatedStyle,
      ]}
      pointerEvents="box-none"
    >
      {/* Premium Pink - Violet - Blue Gradient Background */}
      <HeaderGradient isDark={isDark} />

      {/* A. Collapsible Top Section */}
      <Animated.View
        style={[styles.collapsibleWrapper, collapsibleAnimatedStyle]}
        pointerEvents="auto"
      >
        <HomeHeaderTopBar
          address={address}
          points={points}
          onAddressPress={onAddressPress}
          onPointsPress={onPointsPress}
          onScannerPress={onScannerPress}
          onNotificationPress={onNotificationPress}
        />
        <HomeHeaderPromoBanner
          promoText={promoText}
          promoCode={promoCode}
          onPromoPress={onPromoPress}
        />
      </Animated.View>

      {/* B. Sticky Section (Search Bar + Category morphing) */}
      <View style={styles.stickyWrapper} pointerEvents="auto">
        <HomeHeaderSearchBar
          onSearchPress={onSearchPress}
          onScannerPress={onScannerPress}
          onMicPress={onMicPress}
          onFilterPress={onFilterPress}
        />
        <HomeHeaderCategories
          categories={categories}
          activeCategoryId={activeCat}
          offset={offset}
          onCategorySelect={handleCatSelect}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#1E1B4B',
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
      },
      android: { elevation: 6 },
    }),
  },
  collapsibleWrapper: {
    paddingHorizontal: 16,
    height: COLLAPSIBLE_SECTION_HEIGHT,
    justifyContent: 'flex-start',
    gap: 8,
    paddingBottom: 12,
  },
  stickyWrapper: {
    paddingHorizontal: 16,
  },
});

export const HomeHeader = memo(HomeHeaderComponent);
export default HomeHeader;
