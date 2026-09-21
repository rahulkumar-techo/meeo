import React from 'react';
import { SharedValue } from 'react-native-reanimated';
import { Sparkles, Shirt, Smartphone, Laptop, Sparkle, Home as HomeIcon, Flame } from 'lucide-react-native';

export interface HomeHeaderCategory {
  id: string;
  name: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  isHot?: boolean;
}

export const DEFAULT_CATEGORIES: HomeHeaderCategory[] = [
  { id: 'for-you', name: 'For You', icon: Sparkles },
  { id: 'fashion', name: 'Fashion', icon: Shirt },
  { id: 'mobiles', name: 'Mobiles', icon: Smartphone },
  { id: 'electronics', name: 'Electronics', icon: Laptop },
  { id: 'beauty', name: 'Beauty', icon: Sparkle },
  { id: 'home', name: 'Home', icon: HomeIcon },
  { id: 'deals', name: 'Deals', icon: Flame, isHot: true },
];

export const COLLAPSIBLE_SECTION_HEIGHT = 100; // Top Bar (42) + Gap (8) + Promo Banner (38) + Gap (12)
export const STICKY_SECTION_HEIGHT = 108; // Search (44 + 6) + Categories Expanded (54) + gap (4)
export const STICKY_COLLAPSED_HEIGHT = 96; // Search (44 + 6) + Categories Collapsed (42) + gap (4)

export interface HomeHeaderProps {
  scrollY?: SharedValue<number>;
  headerOffset?: SharedValue<number>;
  address?: string;
  points?: number;
  promoText?: string;
  promoCode?: string;
  categories?: HomeHeaderCategory[];
  activeCategoryId?: string;
  onAddressPress?: () => void;
  onPointsPress?: () => void;
  onScannerPress?: () => void;
  onNotificationPress?: () => void;
  onSearchPress?: () => void;
  onFilterPress?: () => void;
  onMicPress?: () => void;
  onCategorySelect?: (categoryId: string) => void;
  onPromoPress?: () => void;
}
