import React from 'react';
import { View, Text, TextStyle, ViewStyle } from 'react-native';
import { IndianRupee } from 'lucide-react-native';

interface PriceProps {
  amount: string | number;
  size?: number;
  color?: string;
  style?: TextStyle;
  containerStyle?: ViewStyle;
  strikethrough?: boolean;
}

/**
 * Renders an Indian Rupee icon + amount side by side.
 * Use instead of the glyph character to avoid encoding issues.
 */
export function Price({
  amount,
  size = 13,
  color = '#0F172A',
  style,
  containerStyle,
  strikethrough = false,
}: PriceProps) {
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 1 }, containerStyle]}>
      <IndianRupee size={size - 1} color={color} strokeWidth={2.5} />
      <Text
        style={[
          { fontSize: size, color, fontWeight: '700' },
          strikethrough && { textDecorationLine: 'line-through' },
          style,
        ]}
      >
        {typeof amount === 'number' ? amount.toLocaleString('en-IN') : amount}
      </Text>
    </View>
  );
}