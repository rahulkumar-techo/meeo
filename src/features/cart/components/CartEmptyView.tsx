import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ShoppingBag, ArrowRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme';

export function CartEmptyView() {
  const router = useRouter();
  const { theme, isDark } = useTheme();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconCircle,
          {
            backgroundColor: isDark
              ? 'rgba(37, 99, 235, 0.15)'
              : 'rgba(37, 99, 235, 0.08)',
          },
        ]}
      >
        <ShoppingBag size={42} color={theme.primary} />
      </View>

      <Text
        style={[
          styles.title,
          { color: isDark ? '#F8FAFC' : '#0F172A' },
        ]}
      >
        Your Shopping Bag is Empty
      </Text>

      <Text style={styles.subtitle}>
        Looks like you haven't added any items to your bag yet. Explore top products and great deals!
      </Text>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => router.push('/(tabs)')}
        style={[styles.shopBtn, { backgroundColor: theme.primary }]}
      >
        <Text style={styles.shopBtnText}>Start Shopping</Text>
        <ArrowRight size={18} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
    gap: 12,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
    marginBottom: 12,
  },
  shopBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  shopBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default CartEmptyView;
