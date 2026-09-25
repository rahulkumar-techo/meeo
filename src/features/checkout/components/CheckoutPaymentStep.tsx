import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Smartphone,
  Banknote,
  CheckCircle2,
  Circle,
  ShieldCheck,
  Lock,
  CreditCard,
} from 'lucide-react-native';
import { useTheme } from '@/theme';
import { checkoutService } from '../services/checkout.service';
import { useValidateCheckout } from '../hooks/checkout.hook';
import { useRazorpayPayment } from '../hooks/razorpay.hook';
import { useGetCart, CART_QUERY_KEYS } from '@/features/cart';
import { queryClient } from '@/apis/query-client';
import { Button } from '@/components/ui';
import type { UserAddress } from '@/features/address/validations/address.validation';
import type { PaymentMethod } from '../types/checkout.types';

export interface CheckoutPaymentStepProps {
  selectedAddress: UserAddress;
  onOrderSuccess: (orderId: string, orderNumber: string) => void;
}

export function CheckoutPaymentStep({
  selectedAddress,
  onOrderSuccess,
}: CheckoutPaymentStepProps) {
  const router = useRouter();
  const { isDark } = useTheme();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [processingStage, setProcessingStage] = useState<string>('');

  const { initiatePayment, isProcessing: isRazorpayLoading } = useRazorpayPayment();

  const isProcessing = isProcessingOrder || isRazorpayLoading;

  // Validate checkout pricing & summary from server
  const { data: validationData } = useValidateCheckout({
    shippingAddressId: selectedAddress.id,
    billingAddressId: selectedAddress.id,
    currency: 'INR',
  });

  const { data: cartData } = useGetCart();

  const validatedSummary = validationData?.data?.summary;
  const grandTotal =
    validatedSummary?.grandTotal ??
    cartData?.data?.summary?.subtotal ??
    0;

  const formattedTotal = grandTotal.toLocaleString('en-IN');

  const handlePay = async () => {
    if (!selectedAddress?.id) {
      Alert.alert('Address Missing', 'Please select a delivery address first.');
      return;
    }

    setIsProcessingOrder(true);
    setProcessingStage('Creating order...');

    try {
      // Step 1: Create Order
      const orderRes = await checkoutService.createOrder({
        shippingAddressId: selectedAddress.id,
        billingAddressId: selectedAddress.id,
        paymentMethod,
        currency: 'INR',
      });

      const order = orderRes?.data;
      if (!order?.id) {
        throw new Error('Order creation failed. Please try again.');
      }

      if (paymentMethod === 'UPI') {
        // Step 2: Open Razorpay modal via useRazorpayPayment hook
        setProcessingStage('Opening Razorpay...');
        const paymentRes = await initiatePayment({
          orderId: order.id,
          orderNumber: order.orderNumber,
          prefill: {
            name: selectedAddress.recipientName,
            contact: selectedAddress.phone || '',
          },
          onSuccess: async () => {
            onOrderSuccess(order.id, order.orderNumber);
          },
        });

        if (!paymentRes) {
          // Payment was cancelled or failed (alert handled by hook)
          return;
        }
      } else {
        // Cash on Delivery: Direct completion & client-side cart reset
        queryClient.setQueryData(CART_QUERY_KEYS.details(), null);
        queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.all });
        queryClient.invalidateQueries({ queryKey: ['orders'] });
        onOrderSuccess(order.id, order.orderNumber);
      }
    } catch (err: any) {
      Alert.alert(
        'Payment / Order Error',
        err?.response?.data?.message || err?.message || 'Failed to complete payment. Please try again.'
      );
    } finally {
      setIsProcessingOrder(false);
      setProcessingStage('');
    }
  };

  return (
    <View className="flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 24,
          gap: 14,
        }}
      >
        {/* Total Payable Banner */}
        <View className="flex-row justify-between items-center p-4 rounded-2xl border bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <View>
            <Text className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total Payable Amount
            </Text>
            <Text className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              ₹{formattedTotal}
            </Text>
          </View>
          <View className="flex-row items-center gap-1 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-1.5 rounded-lg">
            <Lock size={13} color="#16A34A" />
            <Text className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400 uppercase">
              100% SECURE
            </Text>
          </View>
        </View>

        <Text className="text-sm font-bold text-slate-900 dark:text-white mt-1">
          Choose Payment Method
        </Text>

        {/* 1. UPI Payment Option */}
        <TouchableOpacity
          activeOpacity={0.85}
          disabled={isProcessing}
          onPress={() => setPaymentMethod('UPI')}
          className={`border rounded-2xl p-4 ${
            paymentMethod === 'UPI'
              ? 'bg-primary-light/70 dark:bg-stone-900 border-[#2D2621] dark:border-[#E2B897]'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
          }`}
        >
          <View className="flex-row items-center gap-3">
            {paymentMethod === 'UPI' ? (
              <CheckCircle2
                size={20}
                color={isDark ? '#E2B897' : '#2D2621'}
              />
            ) : (
              <Circle size={20} color={isDark ? '#64748B' : '#94A3B8'} />
            )}
            <View className="w-10 h-10 rounded-xl items-center justify-center bg-primary-light/80 dark:bg-stone-800">
              <Smartphone size={20} color={isDark ? '#E2B897' : '#2D2621'} />
            </View>
            <View className="flex-1 gap-0.5">
              <View className="flex-row items-center gap-1.5">
                <Text className="text-sm font-bold text-slate-900 dark:text-white">
                  UPI & Online (Razorpay)
                </Text>
                <View className="bg-amber-100 dark:bg-amber-950/60 px-1.5 py-0.5 rounded">
                  <Text className="text-[9px] font-extrabold text-amber-700 dark:text-amber-400">
                    FASTEST
                  </Text>
                </View>
              </View>
              <Text className="text-xs text-slate-500 dark:text-slate-400">
                Google Pay, PhonePe, Paytm, Cards & UPI Apps
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* 2. Cash on Delivery (COD) Option */}
        <TouchableOpacity
          activeOpacity={0.85}
          disabled={isProcessing}
          onPress={() => setPaymentMethod('COD')}
          className={`border rounded-2xl p-4 ${
            paymentMethod === 'COD'
              ? 'bg-primary-light/70 dark:bg-stone-900 border-[#2D2621] dark:border-[#E2B897]'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
          }`}
        >
          <View className="flex-row items-center gap-3">
            {paymentMethod === 'COD' ? (
              <CheckCircle2
                size={20}
                color={isDark ? '#E2B897' : '#2D2621'}
              />
            ) : (
              <Circle size={20} color={isDark ? '#64748B' : '#94A3B8'} />
            )}
            <View className="w-10 h-10 rounded-xl items-center justify-center bg-emerald-100 dark:bg-emerald-900/40">
              <Banknote size={20} color="#16A34A" />
            </View>
            <View className="flex-1 gap-0.5">
              <Text className="text-sm font-bold text-slate-900 dark:text-white">
                Cash on Delivery (COD)
              </Text>
              <Text className="text-xs text-slate-500 dark:text-slate-400">
                Pay in cash or scan QR upon delivery at your doorstep
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Shipping Destination Summary */}
        <View className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 gap-1">
          <Text className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Shipping to:
          </Text>
          <Text className="text-xs font-semibold text-slate-900 dark:text-white">
            {selectedAddress.recipientName} ({selectedAddress.city}, {selectedAddress.postalCode})
          </Text>
        </View>

        {/* Trust Badges */}
        <View className="flex-row items-center justify-center gap-1.5 py-1">
          <ShieldCheck size={15} color="#16A34A" />
          <Text className="text-[11px] font-medium text-slate-500 dark:text-slate-400 text-center flex-1">
            Encrypted 256-bit secure payments & instant refund guarantee
          </Text>
        </View>
      </ScrollView>

      {/* Footer Place Order Button */}
      <View className="flex-row justify-between items-center px-4 py-3 border-t border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-950">
        <View className="gap-0.5">
          <Text className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            Total Amount
          </Text>
          <Text className="text-lg font-extrabold text-slate-900 dark:text-white">
            ₹{formattedTotal}
          </Text>
        </View>

        <Button
          variant="dark"
          size="md"
          rounded="2xl"
          isLoading={isProcessing}
          loadingText={processingStage || 'Processing...'}
          onPress={handlePay}
          className="min-w-[180px] px-6"
        >
          {paymentMethod === 'COD' ? 'Place Order (COD)' : 'Pay with Razorpay'}
        </Button>
      </View>
    </View>
  );
}

export default CheckoutPaymentStep;
