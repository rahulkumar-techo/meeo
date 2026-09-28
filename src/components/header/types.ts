import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { SharedValue } from 'react-native-reanimated';
import { Sparkles, Shirt, Smartphone, Laptop, Sparkle, Home as HomeIcon, Flame } from 'lucide-react-native';

export interface HomeHeaderCategory {
  id: string;
  name: string;
  imageUrl?: string;
  icon?: React.ComponentType<{ size?: number; color?: string }>;
  isHot?: boolean;
  sortOrder?: number;
  slug?: string;
}

export const DEFAULT_CATEGORIES: HomeHeaderCategory[] = [];

// Default Layout Constants for Flipkart-style Header
export const TOP_BAR_HEIGHT = 42;
export const SEARCH_BAR_HEIGHT = 48;
export const CATEGORY_EXPANDED_HEIGHT = 74;
export const CATEGORY_MINIMIZED_HEIGHT = 32;

// Total delta height that collapses on scroll down (TopBar 42 + category icon collapse 42 = 84px)
export const COLLAPSIBLE_SECTION_HEIGHT = 84;
export const STICKY_SECTION_HEIGHT = SEARCH_BAR_HEIGHT + CATEGORY_MINIMIZED_HEIGHT; // 80px pinned below status bar

export interface HomeHeaderProps {
  // Reanimated scroll shared values
  scrollY?: SharedValue<number>;
  headerOffset?: SharedValue<number>;

  // Layout & Sizing Overrides
  collapsibleHeight?: number;
  stickyHeight?: number;
  topInsetOffset?: number;

  // Top Bar props
  address?: string;
  deliverToLabel?: string;
  points?: number;
  showAddress?: boolean;
  showPoints?: boolean;
  showScanner?: boolean;
  showNotification?: boolean;
  hasNotification?: boolean;

  // Search Bar props
  searchPlaceholder?: string;
  showSearchBar?: boolean;
  showMic?: boolean;

  // Category Bar props
  categories?: HomeHeaderCategory[];
  activeCategoryId?: string;
  showCategories?: boolean;
  activeIndicatorColor?: string;

  // Event Handlers
  onAddressPress?: () => void;
  onPointsPress?: () => void;
  onScannerPress?: () => void;
  onNotificationPress?: () => void;
  onSearchPress?: () => void;
  onFilterPress?: () => void;
  onMicPress?: () => void;
  onCategorySelect?: (categoryId: string) => void;

  // Styling & Custom Rendering Slots
  gradientColors?: readonly [string, string, ...string[]];
  gradientLocations?: readonly [number, number, ...number[]];
  style?: StyleProp<ViewStyle>;
  renderCustomTopBar?: () => React.ReactNode;
  renderCustomSearchBar?: () => React.ReactNode;
  renderCustomCategories?: () => React.ReactNode;
}
