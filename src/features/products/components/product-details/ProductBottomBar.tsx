import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ShoppingCart, ShoppingBag, Plus, Minus } from 'lucide-react-native';
import { useTheme } from '@/theme';

export interface ProductBottomBarProps {
  price: number;
  quantity: number;
  onQuantityChange: (qty: number) => void;
  onAddToCart?: () => void;
  onBuyNow?: () => void;
  currency?: string;
  isAddingToCart?: boolean;
}

export function ProductBottomBar({
  price,
  quantity,
  onQuantityChange,
  onAddToCart,
  onBuyNow,
  currency = '₹',
  isAddingToCart = false,
}: ProductBottomBarProps) {
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();

  const totalPrice = (price * quantity).toLocaleString('en-IN', {
    minimumFractionDigits: 0,
  });

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: Math.max(insets.bottom, 12),
          backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
          borderTopColor: isDark ? '#1E293B' : '#E2E8F0',
        },
      ]}
    >
      {/* Top Row: Total Price on Left, Quantity Stepper on Right */}
      <View style={styles.topRow}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Total Price</Text>
          <Text
            style={[
              styles.priceValue,
              { color: isDark ? '#F8FAFC' : '#0F172A' },
            ]}
          >
            {currency}{totalPrice}
          </Text>
        </View>

        {/* Quantity Stepper */}
        <View style={styles.quantityContainer}>
          <Text
            style={[
              styles.quantityLabel,
              { color: isDark ? '#94A3B8' : '#64748B' },
            ]}
          >
            Qty
          </Text>
          <View
            style={[
              styles.stepper,
              {
                backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
                borderColor: isDark ? '#334155' : '#E2E8F0',
              },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onQuantityChange(Math.max(1, quantity - 1))}
              disabled={quantity <= 1 || isAddingToCart}
              style={[
                styles.stepperBtn,
                (quantity <= 1 || isAddingToCart) && { opacity: 0.3 },
              ]}
            >
              <Minus size={14} color={isDark ? '#F8FAFC' : '#0F172A'} />
            </TouchableOpacity>

            <Text
              style={[
                styles.quantityText,
                { color: isDark ? '#F8FAFC' : '#0F172A' },
              ]}
            >
              {quantity}
            </Text>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onQuantityChange(quantity + 1)}
              disabled={isAddingToCart}
              style={[styles.stepperBtn, isAddingToCart && { opacity: 0.3 }]}
            >
              <Plus size={14} color={isDark ? '#F8FAFC' : '#0F172A'} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Bottom Row: Full-width Action Buttons */}
      <View style={styles.actionButtonsRow}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onAddToCart}
          disabled={isAddingToCart}
          style={[
            styles.cartBtn,
            {
              borderColor: theme.primary,
              backgroundColor: isDark ? '#1E293B' : '#EFF6FF',
              opacity: isAddingToCart ? 0.8 : 1,
            },
          ]}
        >
          {isAddingToCart ? (
            <>
              <ActivityIndicator size="small" color={theme.primary} />
              <Text style={[styles.cartBtnText, { color: theme.primary }]}>
                Adding to Bag...
              </Text>
            </>
          ) : (
            <>
              <ShoppingCart size={18} color={theme.primary} />
              <Text style={[styles.cartBtnText, { color: theme.primary }]}>
                Add to Cart
              </Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onBuyNow}
          disabled={isAddingToCart}
          style={[
            styles.buyBtn,
            {
              backgroundColor: theme.primary,
              opacity: isAddingToCart ? 0.6 : 1,
            },
          ]}
        >
          <ShoppingBag size={18} color="#FFFFFF" />
          <Text style={styles.buyBtnText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    zIndex: 30,
    elevation: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    gap: 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceContainer: {
    gap: 2,
  },
  priceLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  priceValue: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quantityLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 4,
    height: 36,
  },
  stepperBtn: {
    width: 28,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '700',
    paddingHorizontal: 8,
    minWidth: 24,
    textAlign: 'center',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cartBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    height: 48,
    borderRadius: 14,
  },
  cartBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  buyBtn: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: 14,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buyBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default ProductBottomBar;
