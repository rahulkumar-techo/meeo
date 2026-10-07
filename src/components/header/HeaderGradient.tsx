import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { palette } from '@/theme/colors';

export interface HeaderGradientProps {
  isDark?: boolean;
  colors?: readonly [string, string, ...string[]];
  locations?: readonly [number, number, ...number[]];
}

export const HeaderGradient = memo(function HeaderGradient({
  isDark = false,
  colors,
  locations,
}: HeaderGradientProps) {
  // Warm luxury espresso, coffee, mocha & terracotta blend for light mode
  const defaultLightColors = [
    palette.primaryDark, // #1A1614 (Deep Roast Espresso)
    palette.primary,     // #2D2621 (Warm Coffee Charcoal)
    '#4A3B32',           // #4A3B32 (Rich Mocha)
    palette.secondary,   // #8C5338 (Terracotta Chestnut)
  ] as const;

  // Ultra-deep luxury dark espresso & warm charcoal blend for dark mode
  const defaultDarkColors = [
    palette.slate[950],  // #120F0D (Deepest Espresso Dark)
    palette.slate[900],  // #1C1714 (Dark Roast)
    '#28221E',           // #28221E (Mocha Surface Dark)
    '#3D342E',           // #3D342E (Warm Coffee Undertone)
  ] as const;

  const gradientColors = colors || (isDark ? defaultDarkColors : defaultLightColors);
  const gradientLocations = locations || [0, 0.35, 0.7, 1];

  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        { backgroundColor: isDark ? palette.slate[950] : palette.primaryDark },
      ]}
      pointerEvents="none"
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={gradientLocations}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
});

export default HeaderGradient;
