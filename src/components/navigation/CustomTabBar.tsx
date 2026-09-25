import React, { useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  LayoutChangeEvent,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  withSpring,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  Home,
  SquarePlay,
  Grid2x2,
  User,
  ShoppingCart,
  type LucideIcon,
} from 'lucide-react-native';
import { useTheme } from '@/theme';
import { useGetCart } from '@/features/cart';

export interface CustomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

interface TabConfig {
  name: string;
  label: string;
  badgeCount?: number;
  Icon: LucideIcon;
}

// Left Main Navigation Tabs
const MAIN_TABS: TabConfig[] = [
  {
    name: 'index',
    label: 'Home',
    Icon: Home,
  },
  {
    name: 'play',
    label: 'Play',
    Icon: SquarePlay,
  },
  {
    name: 'categories',
    label: 'Categories',
    Icon: Grid2x2,
  },
  {
    name: 'cart',
    label: 'Cart',
    Icon: ShoppingCart,
  },
];

export const CustomTabBar: React.FC<CustomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();

  const currentRouteName = state.routes[state.index]?.name || 'index';
  const isAccountFocused = currentRouteName === 'account';
  const bottomInset = insets.bottom;

  // Real-time cart item count for badge
  const { data: cartData } = useGetCart();
  const cartBadgeCount =
    cartData?.data?.summary?.itemCount ??
    cartData?.data?.summary?.totalItems ??
    (Array.isArray(cartData?.data?.items) ? cartData.data.items.length : 0);

  const layoutsRef = useRef<{ [key: string]: { x: number; width: number } }>({});
  const activeTargetRef = useRef<string | null>(null);
  const indicatorX = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);
  const indicatorOpacity = useSharedValue(0);
  const hasInitialized = useRef(false);

  // Smoothly transfer active highlight to focused tab in main pill
  const animateToTab = useCallback(
    (tabName: string, immediate = false) => {
      if (tabName === 'account') {
        activeTargetRef.current = 'account';
        indicatorOpacity.value = withTiming(0, { duration: 100 });
        return;
      }

      const layout = layoutsRef.current[tabName];
      if (!layout || layout.width === 0) return;

      // Prevent duplicate triggers if already animating towards target
      if (!immediate && activeTargetRef.current === tabName && hasInitialized.current) {
        return;
      }
      activeTargetRef.current = tabName;

      if (immediate || !hasInitialized.current) {
        indicatorX.value = layout.x;
        indicatorWidth.value = layout.width;
        indicatorOpacity.value = withTiming(1, { duration: 80 });
        hasInitialized.current = true;
      } else {
        indicatorX.value = withTiming(layout.x, {
          duration: 180,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });
        indicatorWidth.value = withTiming(layout.width, {
          duration: 180,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });
        indicatorOpacity.value = withTiming(1, { duration: 80 });
      }
    },
    [indicatorOpacity, indicatorWidth, indicatorX]
  );

  const handleTabLayout = useCallback(
    (tabName: string, e: LayoutChangeEvent) => {
      const { x, width } = e.nativeEvent.layout;
      layoutsRef.current[tabName] = { x, width };

      if (tabName === currentRouteName && !hasInitialized.current) {
        animateToTab(tabName, true);
      }
    },
    [animateToTab, currentRouteName]
  );

  useEffect(() => {
    animateToTab(currentRouteName);
  }, [currentRouteName, animateToTab]);

  // Animated sliding pill highlight
  const animatedHighlightStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: indicatorX.value }],
      width: indicatorWidth.value,
      opacity: indicatorOpacity.value,
    };
  });

  const activeColor = isDark ? '#E2B897' : '#2D2621'; // Warm luxury espresso / Cashmere gold
  const inactiveColor = isDark ? '#A89F97' : '#786C64';

  //positioning the gap between safe bottom edge and tabs
  const bottomPosition = bottomInset > 0 ? bottomInset + 4 : 14;

  const handlePressAccount = () => {

    animateToTab('account');

    const event = navigation.emit({
      type: 'tabPress',
      target: 'account',
      canPreventDefault: true,
    });

    if (!isAccountFocused && !event.defaultPrevented) {
      navigation.navigate('account');
    }
  };

  return (
    <View pointerEvents="box-none" style={styles.root}>
      {/* Container holding Left Main Pill + Right Separate Account Button */}
      <View
        pointerEvents="box-none"
        style={[
          styles.rowContainer,
          {
            bottom: bottomPosition,
          },
        ]}
      >
        {/* 1. Left Main Floating Navigation Pill */}
        <View
          style={[
            styles.mainPill,
            {
              backgroundColor: isDark
                ? 'rgba(30, 41, 59, 0.88)'
                : 'rgba(255, 255, 255, 0.90)',
              borderColor: isDark
                ? 'rgba(51, 65, 85, 0.65)'
                : 'rgba(255, 255, 255, 0.85)',
            },
          ]}
        >
          <BlurView
            intensity={Platform.OS === 'ios' ? 85 : 75}
            tint={isDark ? 'dark' : 'systemMaterialLight'}
            style={[StyleSheet.absoluteFill, { borderRadius: 32, overflow: 'hidden' }]}
          />

          {/* Smooth Sliding Active Tab Highlight */}
          <Animated.View
            pointerEvents="none"
            style={[
              styles.activeHighlight,
              {
                backgroundColor: isDark
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(37, 99, 235, 0.08)',
                borderColor: isDark
                  ? 'rgba(255, 255, 255, 0.12)'
                  : 'rgba(37, 99, 235, 0.12)',
              },
              animatedHighlightStyle,
            ]}
          />

          {MAIN_TABS.map((tab) => {
            const isFocused = currentRouteName === tab.name;
            const IconComponent = tab.Icon;
            const badgeCount =
              tab.name === 'cart' ? cartBadgeCount : tab.badgeCount;

            const onPress = () => {
             
              animateToTab(tab.name);

              const event = navigation.emit({
                type: 'tabPress',
                target: tab.name,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(tab.name);
              }
            };

            return (
              <TouchableOpacity
                key={tab.name}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={tab.label}
                onPress={onPress}
                onLayout={(e) => handleTabLayout(tab.name, e)}
                activeOpacity={0.75}
                style={styles.tabButton}
              >
                <View style={styles.iconWrapper}>
                  <IconComponent
                    size={21}
                    color={isFocused ? activeColor : inactiveColor}
                    strokeWidth={isFocused ? 2.4 : 1.8}
                  />

                  {typeof badgeCount === 'number' && badgeCount > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>
                        {badgeCount > 99 ? '99+' : badgeCount}
                      </Text>
                    </View>
                  )}
                </View>

                <Text
                  numberOfLines={1}
                  style={[
                    styles.tabLabel,
                    {
                      color: isFocused ? activeColor : inactiveColor,
                      fontWeight: isFocused ? '700' : '500',
                    },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 2. Separate Right Floating Account Button */}
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityState={isAccountFocused ? { selected: true } : {}}
          accessibilityLabel="Account"
          activeOpacity={0.8}
          onPress={handlePressAccount}
          style={[
            styles.accountButton,
            isAccountFocused
              ? {
                  backgroundColor: isDark
                    ? 'rgba(226, 184, 151, 0.25)'
                    : 'rgba(45, 38, 33, 0.12)',
                  borderColor: isDark ? '#E2B897' : '#2D2621',
                }
              : {
                  backgroundColor: isDark
                    ? 'rgba(30, 41, 59, 0.88)'
                    : 'rgba(255, 255, 255, 0.90)',
                  borderColor: isDark
                    ? 'rgba(51, 65, 85, 0.65)'
                    : 'rgba(255, 255, 255, 0.85)',
                },
          ]}
        >
          <BlurView
            intensity={Platform.OS === 'ios' ? 85 : 75}
            tint={isDark ? 'dark' : 'systemMaterialLight'}
            style={[StyleSheet.absoluteFill, { borderRadius: 28, overflow: 'hidden' }]}
          />
          <User
            size={22}
            color={isAccountFocused ? activeColor : inactiveColor}
            strokeWidth={isAccountFocused ? 2.4 : 1.8}
          />
          <Text
            numberOfLines={1}
            style={[
              styles.accountLabel,
              {
                color: isAccountFocused ? activeColor : inactiveColor,
                fontWeight: isAccountFocused ? '700' : '500',
              },
            ]}
          >
            Account
          </Text>
        </TouchableOpacity>
      </View>

      {/* 3. Bottom Safe Area Edge Blur Component */}
      {bottomInset > 0 && (
        <View
          pointerEvents="none"
          style={[
            styles.bottomSafeEdge,
            {
              height: bottomInset,
              backgroundColor: isDark
                ? 'rgba(15, 23, 42, 0.70)'
                : 'rgba(255, 255, 255, 0.70)',
            },
          ]}
        >
          <BlurView
            intensity={Platform.OS === 'ios' ? 90 : 80}
            tint={isDark ? 'dark' : 'systemMaterialLight'}
            style={StyleSheet.absoluteFill}
          />
          <View
            style={[
              styles.edgeTopBorder,
              {
                backgroundColor: isDark
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(0, 0, 0, 0.05)',
              },
            ]}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  rowContainer: {
    position: 'absolute',
    left: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mainPill: {
    flex: 1,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 32,
    borderWidth: 1.2,
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.14,
        shadowRadius: 14,
      },
      android: {
        elevation: 10,
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
      },
    }),
  },
  accountButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.14,
        shadowRadius: 14,
      },
      android: {
        elevation: 10,
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
      },
    }),
  },
  accountLabel: {
    fontSize: 9,
    marginTop: 1,
    textAlign: 'center',
    letterSpacing: -0.1,
  },
  activeHighlight: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    borderRadius: 24,
    borderWidth: 1,
    zIndex: 0,
  },
  bottomSafeEdge: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    zIndex: 0,
  },
  edgeTopBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 2,
    borderRadius: 24,
    zIndex: 2,
  },
  iconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    height: 25,
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 2,
    textAlign: 'center',
    letterSpacing: -0.1,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -11,
    backgroundColor: '#EF4444',
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
    lineHeight: 11,
  },
});
