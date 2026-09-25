import React, { memo, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ArrowRight, Truck, Tag, ChevronDown, ChevronUp, Sparkles, ShieldCheck } from 'lucide-react-native';
import { useTheme } from '@/theme';
import { Button } from '@/components/ui';
import type { CartItem } from '../types/cart.types';

export interface CartSummaryCardProps {
  items?: CartItem[];
  subtotal: number;
  discount?: number;
  shipping?: number;
  freeShippingThreshold?: number;
  onCheckout: () => void;
  currency?: string;
  isCheckingOut?: boolean;
  couponCode?: string;
  couponDiscount?: number;
  initialExpanded?: boolean;
}

export const CartSummaryCard = memo(function CartSummaryCard({
  items = [],
  subtotal,
  discount = 0,
  shipping: explicitShipping,
  freeShippingThreshold = 999,
  onCheckout,
  currency = '₹',
  isCheckingOut = false,
  couponCode,
  couponDiscount = 0,
  initialExpanded = true,
}: CartSummaryCardProps) {
  const { theme, isDark } = useTheme();
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  // 1. Calculate Total Units & MRP
  const totalUnits = items.length > 0
    ? items.reduce((acc, it) => acc + Number(it.quantity || 1), 0)
    : 0;

  const totalMRP = items.length > 0
    ? items.reduce((acc, it) => {
        const qty = Number(it.quantity || 1);
        const mrp = Number(
          it.compareAtPrice ||
          it.variant?.compareAtPrice ||
          it.unitPrice ||
          it.price ||
          0
        );
        return acc + mrp * qty;
      }, 0)
    : subtotal;

  const mrpDiscount = Math.max(0, totalMRP - subtotal);
  const totalDiscount = discount + couponDiscount;
  const totalSavings = mrpDiscount + totalDiscount;

  // 2. Shipping Calculation
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const shipping = explicitShipping ?? (isFreeShipping || subtotal === 0 ? 0 : 70);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  // 3. Grand Total
  const total = Math.max(0, subtotal - totalDiscount + shipping);

  // Formatted display values
  const formattedMRP = totalMRP.toLocaleString('en-IN', { minimumFractionDigits: 0 });
  const formattedSubtotal = subtotal.toLocaleString('en-IN', { minimumFractionDigits: 0 });
  const formattedMRPDiscount = mrpDiscount.toLocaleString('en-IN', { minimumFractionDigits: 0 });
  const formattedDiscount = totalDiscount.toLocaleString('en-IN', { minimumFractionDigits: 0 });
  const formattedShipping = shipping === 0 ? 'FREE' : `${currency}${shipping}`;
  const formattedTotal = total.toLocaleString('en-IN', { minimumFractionDigits: 0 });
  const formattedSavings = totalSavings.toLocaleString('en-IN', { minimumFractionDigits: 0 });

  return (
    <View className="rounded-2xl border border-border dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden shadow-xs">
      {/* Free Shipping Progress Indicator Banner */}
      {subtotal > 0 && (
        <View
          className={`p-3 border-b border-border/60 dark:border-stone-800 gap-2 ${
            isFreeShipping
              ? 'bg-emerald-500/10'
              : 'bg-[#2D2621]/5 dark:bg-[#FAF8F5]/5'
          }`}
        >
          <View className="flex-row items-center gap-2">
            <Truck
              size={16}
              color={isFreeShipping ? '#10B981' : isDark ? '#E2B897' : '#8C5338'}
            />
            <Text
              className={`text-xs font-bold flex-1 ${
                isFreeShipping
                  ? 'text-emerald-700 dark:text-emerald-400'
                  : 'text-[#2D2621] dark:text-[#FAF8F5]'
              }`}
            >
              {isFreeShipping
                ? '🎉 You unlocked FREE standard delivery!'
                : `Add ${currency}${remainingForFreeShipping.toLocaleString('en-IN')} more for FREE delivery`}
            </Text>
          </View>

          {/* Progress bar */}
          <View className="h-1.5 rounded-full overflow-hidden bg-slate-200 dark:bg-stone-800">
            <View
              className={`h-full rounded-full ${
                isFreeShipping ? 'bg-emerald-600' : 'bg-[#8C5338] dark:bg-[#C27838]'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </View>
        </View>
      )}

      {/* Collapsible Header Toggle */}
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() => setIsExpanded((prev) => !prev)}
        className="flex-row justify-between items-center p-4 bg-slate-50/60 dark:bg-stone-800/30"
      >
        <View className="flex-row items-center gap-2">
          <Text className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white">
            Price Details
          </Text>
          {totalUnits > 0 && (
            <View className="px-2 py-0.5 rounded-full bg-slate-200/80 dark:bg-stone-700">
              <Text className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                {totalUnits} {totalUnits === 1 ? 'Item' : 'Items'}
              </Text>
            </View>
          )}
        </View>

        <View className="flex-row items-center gap-2">
          {!isExpanded && (
            <Text className="text-sm font-black text-slate-900 dark:text-white">
              {currency}{formattedTotal}
            </Text>
          )}
          <View className="w-6 h-6 rounded-full bg-slate-200/70 dark:bg-stone-700 items-center justify-center">
            {isExpanded ? (
              <ChevronUp size={15} color={isDark ? '#CBD5E1' : '#475569'} />
            ) : (
              <ChevronDown size={15} color={isDark ? '#CBD5E1' : '#475569'} />
            )}
          </View>
        </View>
      </TouchableOpacity>

      {/* Price Details Breakdown View */}
      {isExpanded && (
        <View className="px-4 pt-1 pb-4 gap-2.5">
          {/* 1. Total MRP */}
          {totalMRP > 0 && (
            <View className="flex-row justify-between items-center">
              <Text className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Total MRP {totalUnits > 0 ? `(${totalUnits} ${totalUnits === 1 ? 'item' : 'items'})` : ''}
              </Text>
              <Text className="text-xs font-semibold text-slate-900 dark:text-white">
                {currency}{formattedMRP}
              </Text>
            </View>
          )}

          {/* 2. Discount on MRP */}
          {mrpDiscount > 0 && (
            <View className="flex-row justify-between items-center">
              <Text className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Discount on MRP
              </Text>
              <Text className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                -{currency}{formattedMRPDiscount}
              </Text>
            </View>
          )}

          {/* 3. Subtotal */}
          <View className="flex-row justify-between items-center">
            <Text className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Bag Subtotal
            </Text>
            <Text className="text-xs font-semibold text-slate-900 dark:text-white">
              {currency}{formattedSubtotal}
            </Text>
          </View>

          {/* 4. Coupon Applied Discount */}
          {totalDiscount > 0 && (
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center gap-1.5">
                <Tag size={12} color="#16A34A" />
                <Text className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  Coupon / Discount {couponCode ? `(${couponCode})` : ''}
                </Text>
              </View>
              <Text className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                -{currency}{formattedDiscount}
              </Text>
            </View>
          )}

          {/* 5. Delivery Fee */}
          <View className="flex-row justify-between items-center">
            <Text className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Delivery Fee
            </Text>
            <Text
              className={`text-xs font-semibold ${
                shipping === 0
                  ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'text-slate-900 dark:text-white'
              }`}
            >
              {formattedShipping}
            </Text>
          </View>

          <View className="h-px my-1 bg-slate-200 dark:bg-stone-800" />

          {/* 6. Total Amount Payable */}
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-sm font-extrabold text-slate-900 dark:text-white">
                Total Amount
              </Text>
              <Text className="text-[10px] text-slate-500 dark:text-slate-400">
                Including all taxes
              </Text>
            </View>

            <Text className="text-lg font-black tracking-tight text-[#8C5338] dark:text-[#E2B897]">
              {currency}{formattedTotal}
            </Text>
          </View>

          {/* 7. Total Savings Celebration Banner */}
          {totalSavings > 0 && (
            <View className="flex-row items-center gap-1.5 mt-1 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-900/60">
              <Sparkles size={14} color="#16A34A" />
              <Text className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                You will save {currency}{formattedSavings} on this order
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Checkout Button & Guarantee */}
      <View className="p-4 pt-2 gap-2 border-t border-slate-100 dark:border-stone-800/80 bg-slate-50/40 dark:bg-stone-900/40">
        <Button
          variant="dark"
          size="lg"
          rounded="2xl"
          fullWidth
          onPress={onCheckout}
          disabled={isCheckingOut || subtotal === 0}
          isLoading={isCheckingOut}
          loadingText="Processing..."
          rightIcon={<ArrowRight size={18} color={isDark ? '#120F0D' : '#FFFFFF'} />}
        >
          Proceed to Checkout
        </Button>

        <View className="flex-row items-center justify-center gap-1.5 pt-1">
          <ShieldCheck size={13} color="#16A34A" />
          <Text className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
            100% Safe Payments & Free Easy Returns
          </Text>
        </View>
      </View>
    </View>
  );
});

export default CartSummaryCard;
