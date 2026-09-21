import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  isDark?: boolean;
}

export const HeaderGradient = memo(({ isDark = false }: Props) => {
  // Solid luxury blue colors (100% opaque, no transparency)
  const lightColors = [
    '#1E3A8A', // Deep sapphire blue
    '#3730A3', // Rich indigo
    '#4F46E5', // Vibrant indigo
    '#6366F1', // Soft royal blue
  ] as const;

  const darkColors = [
    '#0B1120', // Deep navy
    '#111827', // Charcoal navy
    '#1E1B4B', // Deep indigo
    '#312E81', // Dark violet
  ] as const;

  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        { backgroundColor: isDark ? '#0B1120' : '#1E3A8A' },
      ]}
      pointerEvents="none"
    >
      <LinearGradient
        colors={isDark ? darkColors : lightColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={[0, 0.35, 0.7, 1]}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
});

export default HeaderGradient;

