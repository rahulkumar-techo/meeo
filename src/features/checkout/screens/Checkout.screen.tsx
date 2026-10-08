import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, ShieldCheck } from 'lucide-react-native';
import { Screen } from '@/components/layout';
import { useTheme } from '@/theme';
import { usePromoStore } from '@/features/cart/store/usePromoStore';
import type { UserAddress } from '@/features/address/validations/address.validation';
import {
  CheckoutStepIndicator,
  CheckoutAddressStep,
  CheckoutReviewStep,
  CheckoutPaymentStep,
  OrderSuccessModal,
} from '../components';

export function CheckoutScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const appliedCode = usePromoStore((s) => s.appliedCode);

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [selectedAddress, setSelectedAddress] = useState<UserAddress | null>(null);
  const [orderSuccess, setOrderSuccess] = useState<{
    isOpen: boolean;
    orderId: string;
    orderNumber: string;
  }>({
    isOpen: false,
    orderId: '',
    orderNumber: '',
  });

  const handleBack = useCallback(() => {
    if (currentStep === 3) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(1);
    } else {
      router.back();
    }
  }, [currentStep, router]);

  const handleOrderSuccess = useCallback((orderId: string, orderNumber: string) => {
    setOrderSuccess({
      isOpen: true,
      orderId,
      orderNumber,
    });
  }, []);

  return (
    <Screen
      safeArea={['top', 'bottom']}
      horizontalPadding={false}
      style={{ flex: 1 }}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
      />

      {/* Top Header Bar */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-slate-200/60 dark:border-slate-800">
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleBack}
          className="w-10 h-10 rounded-full items-center justify-center bg-slate-100 dark:bg-slate-800"
        >
          <ArrowLeft size={20} color={isDark ? '#F8FAFC' : '#0F172A'} />
        </TouchableOpacity>

        <View className="items-center gap-0.5">
          <Text className="text-base font-bold text-slate-900 dark:text-white">
            Checkout
          </Text>
          <View className="flex-row items-center gap-1">
            <ShieldCheck size={12} color="#16A34A" />
            <Text className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
              Secure Checkout
            </Text>
          </View>
        </View>

        <View className="w-10" />
      </View>

      {/* Step Indicator with Checkmarks */}
      <CheckoutStepIndicator currentStep={currentStep} />

      {/* Step Views */}
      <View className="flex-1">
        {currentStep === 1  && (
          <CheckoutAddressStep
            selectedAddress={selectedAddress}
            onSelectAddress={setSelectedAddress}
            onProceed={() => {
              if (selectedAddress) {
                setCurrentStep(2);
              }
            }}
          />
        )}

        {currentStep === 2 && selectedAddress && (
          <CheckoutReviewStep
            selectedAddress={selectedAddress}
            promoCode={appliedCode ?? undefined}
            onChangeAddress={() => setCurrentStep(1)}
            onProceedToPayment={() => setCurrentStep(3)}
          />
        )}

        {currentStep === 3 && selectedAddress && (
          <CheckoutPaymentStep
            selectedAddress={selectedAddress}
            promoCode={appliedCode ?? undefined}
            onOrderSuccess={handleOrderSuccess}
          />
        )}
      </View>

      {/* Order Success Celebratory Modal */}
      <OrderSuccessModal
        visible={orderSuccess.isOpen}
        orderNumber={orderSuccess.orderNumber}
        onClose={() => setOrderSuccess({ isOpen: false, orderId: '', orderNumber: '' })}
      />
    </Screen>
  );
}

export default CheckoutScreen;

