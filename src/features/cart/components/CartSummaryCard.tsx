import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowRight, Truck, Tag, ShieldCheck } from 'lucide-react-native';
import { useTheme } from '@/theme';

export interface CartSummaryCardProps {
  subtotal: number;
  discount?: number;
  shipping?: number;
  freeShippingThreshold?: number;
  onCheckout: () => void;
  currency?: string;
  isCheckingOut?: boolean;
}

export function CartSummaryCard({
  subtotal,
  discount = 0,
  shipping: explicitShipping,
  freeShippingThreshold = 999,
  onCheckout,
  currency = '₹',
  isCheckingOut = false,
}: CartSummaryCardProps) {
  const { theme, isDark } = useTheme();

  const isFreeShipping = subtotal >= freeShippingThreshold;
  const shipping = explicitShipping ?? (isFreeShipping || subtotal === 0 ? 0 : 70);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const total = Math.max(0, subtotal - discount + shipping);

  const formattedSubtotal = subtotal.toLocaleString('en-IN', { minimumFractionDigits: 0 });
  const formattedDiscount = discount.toLocaleString('en-IN', { minimumFractionDigits: 0 });
  const formattedShipping = shipping === 0 ? 'FREE' : `${currency}${shipping}`;
  const formattedTotal = total.toLocaleString('en-IN', { minimumFractionDigits: 0 });

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
          borderColor: isDark ? '#334155' : '#E2E8F0',
        },
      ]}
    >
      {/* Free Shipping Progress Indicator */}
      {subtotal > 0 && (
        <View
          style={[
            styles.deliveryBanner,
            {
              backgroundColor: isFreeShipping
                ? isDark
                  ? '#064E3B'
                  : '#ECFDF5'
                : isDark
                ? '#1E3A8A'
                : '#EFF6FF',
            },
          ]}
        >
          <View style={styles.deliveryBannerTop}>
            <Truck
              size={16}
              color={isFreeShipping ? '#10B981' : theme.primary}
            />
            <Text
              style={[
                styles.deliveryBannerText,
                {
                  color: isFreeShipping
                    ? isDark
                      ? '#6EE7B7'
                      : '#047857'
                    : isDark
                    ? '#93C5FD'
                    : '#1D4ED8',
                },
              ]}
            >
              {isFreeShipping
                ? '🎉 You unlocked FREE standard delivery!'
                : `Add ${currency}${remainingForFreeShipping.toLocaleString('en-IN')} more for FREE delivery`}
            </Text>
          </View>

          {/* Progress bar */}
          <View
            style={[
              styles.progressBarTrack,
              { backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : '#E2E8F0' },
            ]}
          >
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${progressPercent}%`,
                  backgroundColor: isFreeShipping ? '#10B981' : theme.primary,
                },
              ]}
            />
          </View>
        </View>
      )}

      <Text
        style={[
          styles.heading,
          { color: isDark ? '#F8FAFC' : '#0F172A' },
        ]}
      >
        Price Details
      </Text>

      {/* Breakdown Rows */}
      <View style={styles.breakdownList}>
        <View style={styles.row}>
          <Text style={[styles.rowLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
            Bag Subtotal
          </Text>
          <Text style={[styles.rowValue, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
            {currency}{formattedSubtotal}
          </Text>
        </View>

        {discount > 0 && (
          <View style={styles.row}>
            <Text style={[styles.rowLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
              Coupon / Discount
            </Text>
            <Text style={styles.discountValue}>
              -{currency}{formattedDiscount}
            </Text>
          </View>
        )}

        <View style={styles.row}>
          <Text style={[styles.rowLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
            Delivery Fee
          </Text>
          <Text
            style={[
              styles.rowValue,
              shipping === 0 && styles.freeShippingText,
              { color: shipping === 0 ? '#10B981' : isDark ? '#F8FAFC' : '#0F172A' },
            ]}
          >
            {formattedShipping}
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.divider,
          { backgroundColor: isDark ? '#334155' : '#F1F5F9' },
        ]}
      />

      {/* Total Row */}
      <View style={styles.totalRow}>
        <View>
          <Text style={[styles.totalLabel, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
            Total Amount
          </Text>
          <Text style={styles.taxLabel}>Including all taxes</Text>
        </View>

        <Text style={[styles.totalAmount, { color: theme.primary }]}>
          {currency}{formattedTotal}
        </Text>
      </View>

      {/* Checkout Button */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onCheckout}
        disabled={isCheckingOut || subtotal === 0}
        style={[
          styles.checkoutBtn,
          { backgroundColor: theme.primary },
          (isCheckingOut || subtotal === 0) && { opacity: 0.5 },
        ]}
      >
        <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
        <ArrowRight size={18} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  deliveryBanner: {
    padding: 10,
    borderRadius: 12,
    gap: 8,
  },
  deliveryBannerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deliveryBannerText: {
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
  },
  progressBarTrack: {
    height: 5,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  heading: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  breakdownList: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  rowValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  discountValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10B981',
  },
  freeShippingText: {
    color: '#10B981',
    fontWeight: '800',
  },
  divider: {
    height: 1,
    marginVertical: 2,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '800',
  },
  taxLabel: {
    fontSize: 11,
    color: '#94A3B8',
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: 14,
    marginTop: 4,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  checkoutBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default CartSummaryCard;
