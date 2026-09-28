import React, { memo, useState } from 'react';
import { Platform, StyleSheet, View, StatusBar as RNStatusBar } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';

import { HeaderGradient } from './HeaderGradient';
import { HomeHeaderCategories } from './HomeHeaderCategories';
import { HomeHeaderSearchBar } from './HomeHeaderSearchBar';
import { HomeHeaderTopBar } from './HomeHeaderTopBar';
import {
  COLLAPSIBLE_SECTION_HEIGHT,
  DEFAULT_CATEGORIES,
  HomeHeaderProps,
  TOP_BAR_HEIGHT,
  SEARCH_BAR_HEIGHT,
  CATEGORY_EXPANDED_HEIGHT,
  CATEGORY_MINIMIZED_HEIGHT,
} from './types';

export * from './HeaderGradient';
export * from './types';

const HomeHeaderComponent = ({
  // Shared Values
  scrollY: externalScrollY,
  headerOffset: externalHeaderOffset,

  // Sizing & Spacing Configuration
  topInsetOffset,

  // Top Bar Props
  address = 'Select Location',
  deliverToLabel = 'Deliver to',
  points = 0,
  showAddress = true,
  showPoints = true,
  showScanner = true,
  showNotification = true,
  hasNotification = true,

  // Search Bar Props
  searchPlaceholder = 'Search products, brands & categories...',
  showSearchBar = true,
  showMic = true,

  // Category Bar Props
  categories = DEFAULT_CATEGORIES,
  activeCategoryId: controlledActiveCategoryId,
  showCategories = true,
  activeIndicatorColor = '#FFFFFF',

  // Event Handlers
  onAddressPress,
  onPointsPress,
  onScannerPress,
  onNotificationPress,
  onSearchPress,
  onFilterPress,
  onMicPress,
  onCategorySelect,

  // Custom Slots & Styling Overrides
  gradientColors,
  gradientLocations,
  style,
  renderCustomTopBar,
  renderCustomSearchBar,
  renderCustomCategories,
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

  // Safe status bar top inset
  const defaultTopInset = insets.top > 0 ? insets.top : (Platform.OS === 'android' ? (RNStatusBar.currentHeight ?? 24) : 0);
  const topInset = topInsetOffset !== undefined ? topInsetOffset : defaultTopInset;

  const handleCatSelect = (id: string) => {
    setSelectedCat(id);
    onCategorySelect?.(id);
  };

  // 1. Collapsible TopBar Animation (Collapses to 0 on scroll down)
  const topBarAnimatedStyle = useAnimatedStyle(() => {
    const height = interpolate(
      offset.value,
      [0, COLLAPSIBLE_SECTION_HEIGHT],
      [TOP_BAR_HEIGHT, 0],
      Extrapolation.CLAMP
    );
    const opacity = interpolate(
      offset.value,
      [0, COLLAPSIBLE_SECTION_HEIGHT * 0.6],
      [1, 0],
      Extrapolation.CLAMP
    );
    const paddingBottom = interpolate(
      offset.value,
      [0, COLLAPSIBLE_SECTION_HEIGHT],
      [4, 0],
      Extrapolation.CLAMP
    );

    return {
      height,
      opacity,
      paddingBottom,
      overflow: 'hidden',
    };
  });

  // 2. Dynamic Outer Container Height (Includes TopBar + SearchBar + Categories)
  const containerAnimatedStyle = useAnimatedStyle(() => {
    const currentTopBarHeight = interpolate(
      offset.value,
      [0, COLLAPSIBLE_SECTION_HEIGHT],
      [TOP_BAR_HEIGHT, 0],
      Extrapolation.CLAMP
    );

    const currentCategoryHeight = showCategories
      ? interpolate(
          offset.value,
          [0, COLLAPSIBLE_SECTION_HEIGHT],
          [CATEGORY_EXPANDED_HEIGHT, CATEGORY_MINIMIZED_HEIGHT],
          Extrapolation.CLAMP
        )
      : 0;

    const shadowOpacity = interpolate(
      scrollY.value,
      [0, 30],
      [0.15, 0.35],
      Extrapolation.CLAMP
    );

    return {
      height: topInset + (showSearchBar ? SEARCH_BAR_HEIGHT : 0) + currentTopBarHeight + currentCategoryHeight,
      shadowOpacity,
    };
  });

  return (
    <Animated.View
      style={[
        styles.header,
        { paddingTop: topInset },
        containerAnimatedStyle,
        style,
      ]}
      pointerEvents="box-none"
    >
      {/* Background Gradient */}
      <HeaderGradient
        isDark={isDark}
        colors={gradientColors}
        locations={gradientLocations}
      />

      {/* Section 1: Collapsible TopBar (Collapses in minimize mode) */}
      <Animated.View
        style={[
          styles.topBarWrapper,
          topBarAnimatedStyle,
        ]}
        pointerEvents="auto"
      >
        {renderCustomTopBar ? (
          renderCustomTopBar()
        ) : (
          <HomeHeaderTopBar
            address={address}
            deliverToLabel={deliverToLabel}
            points={points}
            showAddress={showAddress}
            showPoints={showPoints}
            showScanner={showScanner}
            showNotification={showNotification}
            hasNotification={hasNotification}
            onAddressPress={onAddressPress}
            onPointsPress={onPointsPress}
            onScannerPress={onScannerPress}
            onNotificationPress={onNotificationPress}
          />
        )}
      </Animated.View>

      {/* Section 2: SearchBar (Always visible in both normal and minimized modes) */}
      {showSearchBar && (
        <View style={styles.searchBarWrapper} pointerEvents="auto">
          {renderCustomSearchBar ? (
            renderCustomSearchBar()
          ) : (
            <HomeHeaderSearchBar
              placeholder={searchPlaceholder}
              showMic={showMic}
              showScanner={showScanner}
              onSearchPress={onSearchPress}
              onScannerPress={onScannerPress}
              onMicPress={onMicPress}
              onFilterPress={onFilterPress}
            />
          )}
        </View>
      )}

      {/* Section 3: Categories Bar (Collapses icons to text-only tabs in minimize mode) */}
      {showCategories && (
        <View style={styles.categoriesWrapper} pointerEvents="auto">
          {renderCustomCategories ? (
            renderCustomCategories()
          ) : (
            <HomeHeaderCategories
              categories={categories}
              activeCategoryId={activeCat}
              offset={offset}
              activeIndicatorColor={activeIndicatorColor}
              onCategorySelect={handleCatSelect}
            />
          )}
        </View>
      )}
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
    ...Platform.select({
      ios: {
        shadowColor: '#1E1B4B',
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
      },
      android: { elevation: 6 },
    }),
  },
  topBarWrapper: {
    paddingHorizontal: 4,
    justifyContent: 'center',
  },
  searchBarWrapper: {
    paddingHorizontal: 4,
    height: SEARCH_BAR_HEIGHT,
    justifyContent: 'center',
  },
  categoriesWrapper: {
    paddingHorizontal: 0,
  },
});

export const HomeHeader = memo(HomeHeaderComponent);
export default HomeHeader;
