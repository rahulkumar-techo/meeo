import React, { memo, useRef, useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, LayoutChangeEvent } from 'react-native';
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
import { HomeHeaderCategory, COLLAPSIBLE_SECTION_HEIGHT } from './types';

interface Props {
  categories: HomeHeaderCategory[];
  activeCategoryId: string;
  offset?: SharedValue<number>;
  onCategorySelect?: (categoryId: string) => void;
}

export const HomeHeaderCategories = memo(({
  categories,
  activeCategoryId,
  offset,
  onCategorySelect,
}: Props) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const layoutsRef = useRef<{ [id: string]: { x: number; width: number } }>({});

  const indicatorX = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);
  const indicatorOpacity = useSharedValue(0);
  const hasInitialized = useRef(false);

  // Smoothly move indicator to the target category
  const animateToCategory = useCallback((id: string, immediate = false) => {
    const layout = layoutsRef.current[id];
    if (!layout || layout.width === 0) return;

    if (immediate || !hasInitialized.current) {
      indicatorX.value = layout.x;
      indicatorWidth.value = layout.width;
      indicatorOpacity.value = withTiming(1, { duration: 120 });
      hasInitialized.current = true;
    } else {
      indicatorX.value = withSpring(layout.x, {
        damping: 22,
        stiffness: 280,
        mass: 0.5,
      });
      indicatorWidth.value = withSpring(layout.width, {
        damping: 22,
        stiffness: 280,
        mass: 0.5,
      });
      indicatorOpacity.value = withTiming(1, { duration: 80 });
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

  // Re-animate when activeCategoryId changes
  useEffect(() => {
    animateToCategory(activeCategoryId);
  }, [activeCategoryId, animateToCategory]);

  const handlePress = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onCategorySelect?.(id);
  };

  // Animated sliding indicator style
  const indicatorAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: indicatorX.value }],
      width: indicatorWidth.value,
      opacity: indicatorOpacity.value,
    };
  });

  // Animate the icon collapse on scroll (Expanded: Icon + Text -> Collapsed: Text only)
  const iconAnimatedStyle = useAnimatedStyle(() => {
    if (!offset) return { height: 26, opacity: 1, marginBottom: 2 };

    const height = interpolate(
      offset.value,
      [0, COLLAPSIBLE_SECTION_HEIGHT * 0.6],
      [26, 0],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      offset.value,
      [0, COLLAPSIBLE_SECTION_HEIGHT * 0.45],
      [1, 0],
      Extrapolation.CLAMP
    );

    const marginBottom = interpolate(
      offset.value,
      [0, COLLAPSIBLE_SECTION_HEIGHT * 0.6],
      [2, 0],
      Extrapolation.CLAMP
    );

    return {
      height,
      opacity,
      marginBottom,
      overflow: 'hidden',
    };
  });

  // Animate the category container height (54px expanded -> 42px collapsed)
  const containerAnimatedStyle = useAnimatedStyle(() => {
    if (!offset) return { height: 54 };

    const height = interpolate(
      offset.value,
      [0, COLLAPSIBLE_SECTION_HEIGHT],
      [54, 42],
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
      >
        {/* Smooth Sliding Active Category Underline */}
        <Animated.View
          pointerEvents="none"
          style={[styles.slidingIndicator, indicatorAnimatedStyle]}
        />

        {categories.map((cat) => {
          const isSelected = activeCategoryId === cat.id;
          const IconComponent = cat.icon;

          return (
            <TouchableOpacity
              key={cat.id}
              activeOpacity={0.75}
              onPress={() => handlePress(cat.id)}
              onLayout={(e) => handleItemLayout(cat.id, e)}
              style={styles.item}
            >
              {/* Icon Container with subtle active glow */}
              <Animated.View style={[styles.iconContainer, iconAnimatedStyle]}>
                <View
                  style={[
                    styles.iconBox,
                    isSelected
                      ? {
                          backgroundColor: 'rgba(255, 255, 255, 0.25)',
                          borderColor: 'rgba(255, 255, 255, 0.5)',
                        }
                      : {
                          backgroundColor: 'transparent',
                          borderColor: 'transparent',
                        },
                  ]}
                >
                  <IconComponent
                    size={18}
                    color={isSelected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.85)'}
                  />
                  {cat.isHot && <View style={styles.hotDot} />}
                </View>
              </Animated.View>

              {/* Category Name */}
              <Text
                style={[
                  styles.name,
                  isSelected
                    ? { color: '#FFFFFF', fontWeight: '800' }
                    : { color: 'rgba(255, 255, 255, 0.82)', fontWeight: '600' },
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
    height: 54,
    justifyContent: 'center',
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    gap: 8,
    position: 'relative',
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingTop: 2,
    paddingBottom: 6,
  },
  slidingIndicator: {
    position: 'absolute',
    bottom: 2,
    left: 0,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#FFFFFF',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.6,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 10,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 26,
    marginBottom: 2,
  },
  iconBox: {
    width: 26,
    height: 26,
    borderRadius: 7,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  name: {
    fontSize: 12,
    lineHeight: 16,
    includeFontPadding: false,
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  hotDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#FDE047',
  },
});

