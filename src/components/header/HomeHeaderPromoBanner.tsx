import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Tag, ArrowRight } from 'lucide-react-native';

interface Props {
  promoText: string;
  promoCode: string;
  onPromoPress?: () => void;
}

export const HomeHeaderPromoBanner = memo(({
  promoText,
  promoCode,
  onPromoPress,
}: Props) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPromoPress}
      style={styles.container}
    >
      <View style={styles.leftRow}>
        <View style={styles.tagBadge}>
          <Tag size={10} color="#7C3AED" />
          <Text style={styles.tagText}>{promoCode}</Text>
        </View>
        <Text style={styles.text} numberOfLines={1}>
          {promoText}
        </Text>
      </View>
      <ArrowRight size={14} color="#FFFFFF" />
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 6,
    gap: 7,
  },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    gap: 3,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#7C3AED',
    letterSpacing: 0.5,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },
});
