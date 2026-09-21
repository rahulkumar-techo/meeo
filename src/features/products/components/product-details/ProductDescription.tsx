import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { useTheme } from '@/theme';

export interface ProductDescriptionProps {
  description?: string;
}

export function ProductDescription({ description }: ProductDescriptionProps) {
  const { theme, isDark } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!description) return null;

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.heading,
          { color: isDark ? '#F8FAFC' : '#0F172A' },
        ]}
      >
        Description
      </Text>

      <Text
        numberOfLines={isExpanded ? undefined : 4}
        style={[
          styles.text,
          { color: isDark ? '#94A3B8' : '#475569' },
        ]}
      >
        {description}
      </Text>

      {description.length > 160 && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setIsExpanded((prev) => !prev)}
          style={styles.toggleBtn}
        >
          <Text style={[styles.toggleText, { color: theme.primary }]}>
            {isExpanded ? 'Read Less' : 'Read More'}
          </Text>
          {isExpanded ? (
            <ChevronUp size={16} color={theme.primary} />
          ) : (
            <ChevronDown size={16} color={theme.primary} />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
    marginTop: 6,
  },
  heading: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  text: {
    fontSize: 14,
    lineHeight: 22,
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
    alignSelf: 'flex-start',
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '700',
  },
});

export default ProductDescription;
