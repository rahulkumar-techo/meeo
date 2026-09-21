import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Truck, ShieldCheck, RotateCcw, Lock } from 'lucide-react-native';
import { useTheme } from '@/theme';

export function ProductGuarantees() {
  const { theme, isDark } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
          borderColor: isDark ? '#1E293B' : '#E2E8F0',
        },
      ]}
    >
      <View style={styles.item}>
        <View
          style={[
            styles.iconWrapper,
            { backgroundColor: isDark ? '#1E293B' : '#EFF6FF' },
          ]}
        >
          <Truck size={18} color={theme.primary} />
        </View>
        <View style={styles.textCol}>
          <Text
            style={[
              styles.title,
              { color: isDark ? '#F8FAFC' : '#0F172A' },
            ]}
          >
            Free & Fast Delivery
          </Text>
          <Text style={styles.sub}>Dispatched within 24 hours</Text>
        </View>
      </View>

      <View style={styles.item}>
        <View
          style={[
            styles.iconWrapper,
            { backgroundColor: isDark ? '#064E3B' : '#ECFDF5' },
          ]}
        >
          <ShieldCheck size={18} color="#10B981" />
        </View>
        <View style={styles.textCol}>
          <Text
            style={[
              styles.title,
              { color: isDark ? '#F8FAFC' : '#0F172A' },
            ]}
          >
            100% Authentic
          </Text>
          <Text style={styles.sub}>Direct from verified brand</Text>
        </View>
      </View>

      <View style={styles.item}>
        <View
          style={[
            styles.iconWrapper,
            { backgroundColor: isDark ? '#3B0764' : '#F5F3FF' },
          ]}
        >
          <RotateCcw size={18} color="#8B5CF6" />
        </View>
        <View style={styles.textCol}>
          <Text
            style={[
              styles.title,
              { color: isDark ? '#F8FAFC' : '#0F172A' },
            ]}
          >
            7 Days Easy Returns
          </Text>
          <Text style={styles.sub}>Hassle-free replacement policy</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    gap: 14,
    marginTop: 6,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: {
    flex: 1,
    gap: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
  },
  sub: {
    fontSize: 11,
    color: '#94A3B8',
  },
});

export default ProductGuarantees;
