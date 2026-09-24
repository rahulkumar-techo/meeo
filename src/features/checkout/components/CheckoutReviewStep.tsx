import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { MapPin, ArrowRight, ShieldCheck, Tag } from 'lucide-react-native';
import { useTheme } from '@/theme';
import { useGetCart } from '@/features/cart';
import { useValidateCheckout } from '../hooks/checkout.hook';
import type { UserAddress } from '@/features/address/validations/address.validation';
import type { CartItem } from '@/features/cart/types/cart.types';

export interface CheckoutReviewStepProps {
  selectedAddress: UserAddress;
  onChangeAddress: () => void;
  onProceedToPayment: () => void;
}

const FALLBACK_IMAGE_URI =
  'https://ik.imagekit.io/ww7mydmoc/ChatGPT%20Image%20Sep%2024,%202026,%2009_28_12%20AM.png';

export function CheckoutReviewStep({
  selectedAddress,
  onChangeAddress,
  onProceedToPayment,
}: CheckoutReviewStepProps) {
  const { isDark } = useTheme();

  // Validate checkout pricing & inventory from server for this address
  const { data: validationData, isLoading: isValidating } = useValidateCheckout({
    shippingAddressId: selectedAddress.id,
    billingAddressId: selectedAddress.id,
    currency: 'INR',
  });

  // Get cart fallback if validation is loading or empty
  const { data: cartData, isLoading: isCartLoading } = useGetCart();

  const validatedSummary = validationData?.data?.summary;
  const validatedItems = validationData?.data?.items;
  const validatedCoupon = validationData?.data?.coupon;

  const cartItems: CartItem[] = Array.isArray(cartData?.data?.items)
    ? cartData.data.items
    : [];

  const subtotal =
    validatedSummary?.subtotal ??
    cartData?.data?.summary?.subtotal ??
    cartItems.reduce(
      (acc, it) =>
        acc +
        Number(it.lineTotal || Number(it.unitPrice || 0) * (it.quantity || 1)),
      0
    );

  const discount = validatedSummary?.discountTotal ?? 0;
  const shippingFee = validatedSummary?.shippingTotal ?? 0;
  const taxFee = validatedSummary?.taxTotal ?? 0;
  const grandTotal =
    validatedSummary?.grandTotal ??
    Math.max(0, subtotal - discount + shippingFee + taxFee);

  const formattedSubtotal = subtotal.toLocaleString('en-IN');
  const formattedDiscount = discount.toLocaleString('en-IN');
  const formattedShipping = shippingFee === 0 ? 'FREE' : `₹${shippingFee.toLocaleString('en-IN')}`;
  const formattedTax = taxFee.toLocaleString('en-IN');
  const formattedTotal = grandTotal.toLocaleString('en-IN');

  const displayItems = Array.isArray(validatedItems) && validatedItems.length > 0
    ? validatedItems
    : cartItems;

  return (
    <View className="flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 24,
          gap: 12,
        }}
      >
        {/* 1. Delivery Address Card */}
        <View className="border rounded-2xl p-4 gap-2 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center gap-1.5">
              <MapPin size={17} color={isDark ? '#94A3B8' : '#2D2621'} />
              <Text className="text-sm font-bold text-slate-900 dark:text-white">
                Deliver to:
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onChangeAddress}
              className="px-2 py-1"
            >
              <Text className="text-xs font-bold text-[#2D2621] dark:text-white underline">
                Change
              </Text>
            </TouchableOpacity>
          </View>

          <View className="gap-0.5 mt-1">
            <View className="flex-row items-center gap-2 mb-0.5">
              <Text className="text-sm font-bold text-slate-900 dark:text-white">
                {selectedAddress.recipientName}
              </Text>
              {selectedAddress.label && (
                <View className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">
                  <Text className="text-[10px] font-bold uppercase text-slate-600 dark:text-slate-400">
                    {selectedAddress.label}
                  </Text>
                </View>
              )}
            </View>
            <Text className="text-xs text-slate-600 dark:text-slate-300 leading-4">
              {selectedAddress.addressLine1}
              {selectedAddress.addressLine2 ? `, ${selectedAddress.addressLine2}` : ''}
            </Text>
            <Text className="text-xs text-slate-600 dark:text-slate-300 leading-4">
              {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.postalCode}
            </Text>
            {selectedAddress.phone && (
              <Text className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
                Mobile: {selectedAddress.phone}
              </Text>
            )}
          </View>
        </View>

        {/* 2. Order Items Review List */}
        <View className="border rounded-2xl p-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <Text className="text-sm font-bold text-slate-900 dark:text-white mb-3">
            Order Items ({displayItems.length})
          </Text>

          {isCartLoading || isValidating ? (
            <View className="py-4 items-center justify-center">
              <ActivityIndicator
                size="small"
                color={isDark ? '#FFFFFF' : '#2D2621'}
              />
            </View>
          ) : (
            <View className="gap-3">
              {displayItems.map((item: any, idx: number) => {
                const itemImg =
                  item.variantSnapshot?.thumbnail ||
                  item.product?.thumbnail ||
                  item.product?.imageUrl ||
                  item.product?.images?.[0]?.url ||
                  FALLBACK_IMAGE_URI;

                const name = item.productName || item.product?.name || 'Product';
                const sku = item.sku || item.variant?.sku;
                const price = Number(item.unitPrice || item.variant?.price || 0);
                const qty = item.quantity || 1;

                return (
                  <View
                    key={item.cartItemId || item.id || idx}
                    className="flex-row items-center gap-3"
                  >
                    <Image
                      source={{ uri: itemImg }}
                      className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800"
                      contentFit="cover"
                      transition={200}
                    />
                    <View className="flex-1 gap-0.5">
                      <Text
                        numberOfLines={1}
                        className="text-xs font-semibold text-slate-900 dark:text-white"
                      >
                        {name}
                      </Text>

                      {sku && (
                        <Text className="text-[11px] text-slate-500 dark:text-slate-400">
                          SKU: {sku}
                        </Text>
                      )}

                      <View className="flex-row items-center justify-between mt-0.5">
                        <Text className="text-xs font-bold text-slate-900 dark:text-white">
                          ₹{price.toLocaleString('en-IN')}
                        </Text>
                        <Text className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                          Qty: {qty}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* 3. Price Details Breakdown */}
        <View className="border rounded-2xl p-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <Text className="text-sm font-bold text-slate-900 dark:text-white mb-3">
            Price Details
          </Text>

          <View className="gap-2">
            <View className="flex-row justify-between items-center">
              <Text className="text-xs text-slate-600 dark:text-slate-400">
                Bag Total
              </Text>
              <Text className="text-xs font-semibold text-slate-900 dark:text-white">
                ₹{formattedSubtotal}
              </Text>
            </View>

            {discount > 0 && (
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center gap-1">
                  <Tag size={12} color="#16A34A" />
                  <Text className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    Coupon / Savings {validatedCoupon?.code ? `(${validatedCoupon.code})` : ''}
                  </Text>
                </View>
                <Text className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  - ₹{formattedDiscount}
                </Text>
              </View>
            )}

            {taxFee > 0 && (
              <View className="flex-row justify-between items-center">
                <Text className="text-xs text-slate-600 dark:text-slate-400">
                  Taxes & Charges
                </Text>
                <Text className="text-xs font-semibold text-slate-900 dark:text-white">
                  + ₹{formattedTax}
                </Text>
              </View>
            )}

            <View className="flex-row justify-between items-center">
              <Text className="text-xs text-slate-600 dark:text-slate-400">
                Delivery Fee
              </Text>
              <Text
                className={`text-xs font-semibold ${
                  shippingFee === 0
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-900 dark:text-white'
                }`}
              >
                {formattedShipping}
              </Text>
            </View>

            <View className="h-px bg-slate-200 dark:bg-slate-800 my-1" />

            <View className="flex-row justify-between items-center">
              <Text className="text-sm font-bold text-slate-900 dark:text-white">
                Total Amount
              </Text>
              <Text className="text-base font-extrabold text-slate-900 dark:text-white">
                ₹{formattedTotal}
              </Text>
            </View>
          </View>
        </View>

        {/* Safe Shopping Guarantee */}
        <View className="flex-row items-center justify-center gap-1.5 py-1">
          <ShieldCheck size={15} color="#16A34A" />
          <Text className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            100% Secure Checkout & Genuine Products
          </Text>
        </View>
      </ScrollView>

      {/* Footer CTA */}
      <View className="flex-row justify-between items-center px-4 py-3 border-t border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-950">
        <View className="gap-0.5">
          <Text className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            Total Payable
          </Text>
          <Text className="text-lg font-extrabold text-slate-900 dark:text-white">
            ₹{formattedTotal}
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onProceedToPayment}
          className="flex-row items-center gap-2 px-5 py-3 rounded-2xl bg-[#2D2621] dark:bg-white active:bg-[#1A1614]"
        >
          <Text className="text-sm font-bold text-white dark:text-slate-950">
            Proceed to Payment
          </Text>
          <ArrowRight size={16} color={isDark ? '#0F172A' : '#FFFFFF'} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default CheckoutReviewStep;
