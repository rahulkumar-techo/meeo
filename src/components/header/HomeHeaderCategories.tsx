import React, { memo, useRef, useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, LayoutChangeEvent } from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  SharedValue,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import {
  HomeHeaderCategory,
  COLLAPSIBLE_SECTION_HEIGHT,
  CATEGORY_EXPANDED_HEIGHT,
  CATEGORY_MINIMIZED_HEIGHT,
} from './types';

export interface HomeHeaderCategoriesProps {
  categories: HomeHeaderCategory[];
  activeCategoryId: string;
  offset?: SharedValue<number>;
  activeIndicatorColor?: string;
  onCategorySelect?: (categoryId: string) => void;
}

export const HomeHeaderCategories = memo(({
  categories,
  activeCategoryId,
  offset,
  activeIndicatorColor = '#FFFFFF',
  onCategorySelect,
}: HomeHeaderCategoriesProps) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [localActiveId, setLocalActiveId] = useState(activeCategoryId);
  const layoutsRef = useRef<{ [id: string]: { x: number; width: number } }>({});

  const indicatorX = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);
  const indicatorOpacity = useSharedValue(0);
  const hasInitialized = useRef(false);

  // Move indicator to active category position
  const animateToCategory = useCallback((id: string, immediate = false) => {
    const layout = layoutsRef.current[id];
    if (!layout || layout.width === 0) return;

    if (immediate || !hasInitialized.current) {
      indicatorX.value = layout.x;
      indicatorWidth.value = layout.width;
      indicatorOpacity.value = withTiming(1, { duration: 80 });
      hasInitialized.current = true;
    } else {
      indicatorX.value = withSpring(layout.x, {
        damping: 24,
        stiffness: 360,
        mass: 0.35,
      });
      indicatorWidth.value = withSpring(layout.width, {
        damping: 24,
        stiffness: 360,
        mass: 0.35,
      });
      indicatorOpacity.value = withTiming(1, { duration: 50 });
    }

    // Auto-scroll to center the active category
    if (scrollViewRef.current && containerWidth > 0) {
      const targetScrollX = Math.max(0, layout.x - (containerWidth - layout.width) / 2);
      scrollViewRef.current.scrollTo({ x: targetScrollX, animated: !immediate });
    }
  }, [containerWidth, indicatorOpacity, indicatorWidth, indicatorX]);

  // Handle category layout measurement
  const handleItemLayout = (id: string, event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout;
    layoutsRef.current[id] = { x, width };

    if (id === activeCategoryId) {
      animateToCategory(id, !hasInitialized.current);
    }
  };

  // Sync activeCategoryId changes
  useEffect(() => {
    setLocalActiveId(activeCategoryId);
    animateToCategory(activeCategoryId);
  }, [activeCategoryId, animateToCategory]);

  // Instant tap handler
  const handlePress = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setLocalActiveId(id);
    animateToCategory(id);
    onCategorySelect?.(id);
  };

  // Sliding underline indicator animation
  const indicatorAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: indicatorX.value }],
      width: indicatorWidth.value,
      opacity: indicatorOpacity.value,
      backgroundColor: activeIndicatorColor,
    };
  });

  // Animated icon container: collapses cleanly in minimize mode
  const iconAnimatedStyle = useAnimatedStyle(() => {
    if (!offset) return { height: 44, opacity: 1 };

    const height = interpolate(
      offset.value,
      [0, COLLAPSIBLE_SECTION_HEIGHT],
      [44, 0],
      Extrapolation.CLAMP
    );
    const opacity = interpolate(
      offset.value,
      [0, COLLAPSIBLE_SECTION_HEIGHT * 0.6],
      [1, 0],
      Extrapolation.CLAMP
    );

    return {
      height,
      opacity,
      overflow: 'hidden',
    };
  });

  // Animated category bar container height (74px expanded -> 32px minimized)
  const containerAnimatedStyle = useAnimatedStyle(() => {
    if (!offset) return { height: CATEGORY_EXPANDED_HEIGHT };

    const height = interpolate(
      offset.value,
      [0, COLLAPSIBLE_SECTION_HEIGHT],
      [CATEGORY_EXPANDED_HEIGHT, CATEGORY_MINIMIZED_HEIGHT],
      Extrapolation.CLAMP
    );

    return { height };
  });

  return (
    <Animated.View
      style={[styles.container, containerAnimatedStyle]}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="always"
      >
        {/* Smooth Sliding Active Category Underline */}
        <Animated.View
          pointerEvents="none"
          style={[styles.slidingIndicator, indicatorAnimatedStyle]}
        />

        {categories.map((cat) => {
          const isSelected = (localActiveId || activeCategoryId) === cat.id;
          const IconComponent = cat.icon;

          return (
            <TouchableOpacity
              key={cat.id}
              activeOpacity={0.7}
              delayPressIn={0}
              onPress={() => handlePress(cat.id)}
              onLayout={(e) => handleItemLayout(cat.id, e)}
              style={styles.item}
            >
              {/* Category Icon / Image Container (Larger, human-visible, collapses in minimize mode) */}
              <Animated.View style={[styles.iconContainer, iconAnimatedStyle]}>
                <View
                  style={[
                    styles.iconBox,
                    isSelected
                      ? {
                          backgroundColor: 'rgba(255, 255, 255, 0.32)',
                          borderColor: '#FFFFFF',
                        }
                      : {
                          backgroundColor: 'rgba(255, 255, 255, 0.16)',
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                        },
                  ]}
                >
                  {cat.imageUrl ? (
                    <Image
                      source={{ uri: cat.imageUrl }}
                      style={styles.categoryImage}
                      contentFit="cover"
                      priority="high"
                      cachePolicy="memory-disk"
                      transition={100}
                    />
                  ) : IconComponent ? (
                    <IconComponent
                      size={22}
                      color={isSelected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.95)'}
                    />
                  ) : null}
                  {cat.isHot && <View style={styles.hotDot} />}
                </View>
              </Animated.View>

              {/* Category Name (Visible in both normal and minimized modes) */}
              <Text
                style={[
                  styles.name,
                  isSelected
                    ? { color: '#FFFFFF', fontWeight: '800' }
                    : { color: 'rgba(255, 255, 255, 0.85)', fontWeight: '600' },
                ]}
                numberOfLines={1}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    gap: 4,
    position: 'relative',
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    paddingTop: 1,
    paddingBottom: 4,
  },
  slidingIndicator: {
    position: 'absolute',
    bottom: 1,
    left: 0,
    height: 2.5,
    borderRadius: 1.25,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 6,
    zIndex: 99,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    marginBottom: 3,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  categoryImage: {
    width: 40,
    height: 40,
    borderRadius: 12,
  },
  name: {
    fontSize: 11,
    lineHeight: 14,
    includeFontPadding: false,
    letterSpacing: 0.1,
    textAlign: 'center',
  },
  hotDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#FDE047',
  },
});

export default HomeHeaderCategories;
