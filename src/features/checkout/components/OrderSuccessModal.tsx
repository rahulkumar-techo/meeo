import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react-native';
import { useTheme } from '@/theme';

export interface OrderSuccessModalProps {
  visible: boolean;
  orderNumber: string;
  onClose: () => void;
}

export function OrderSuccessModal({
  visible,
  orderNumber,
  onClose,
}: OrderSuccessModalProps) {
  const router = useRouter();
  const { isDark } = useTheme();

  const handleGoHome = () => {
    onClose();
    router.replace('/(tabs)');
  };

  const handleViewOrders = () => {
    onClose();
    router.replace('/(tabs)/account');
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/65 justify-center items-center p-6">
        <View className="w-full rounded-3xl p-6 items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          {/* Animated Success Icon */}
          <View className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/60 items-center justify-center mb-1">
            <CheckCircle2 size={44} color="#16A34A" />
          </View>

          <Text className="text-xl font-extrabold text-slate-900 dark:text-white text-center">
            Order Placed Successfully!
          </Text>

          <Text className="text-xs text-slate-500 dark:text-slate-400 text-center leading-5 px-2">
            Thank you for your purchase. We have received your order and are preparing it for delivery.
          </Text>

          {orderNumber ? (
            <View className="w-full py-2.5 px-4 rounded-xl items-center gap-0.5 mt-1.5 bg-slate-100 dark:bg-slate-800/80">
              <Text className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Order Number
              </Text>
              <Text className="text-base font-extrabold text-slate-900 dark:text-white tracking-wide">
                {orderNumber}
              </Text>
            </View>
          ) : null}

          {/* Action Buttons */}
          <View className="w-full gap-2.5 mt-3">
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleViewOrders}
              className="flex-row items-center justify-center gap-2 py-3.5 rounded-2xl w-full bg-[#2D2621] dark:bg-white active:bg-[#1A1614]"
            >
              <Text className="text-sm font-bold text-white dark:text-slate-950">
                View My Orders
              </Text>
              <ArrowRight size={16} color={isDark ? '#0F172A' : '#FFFFFF'} />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleGoHome}
              className="flex-row items-center justify-center gap-1.5 py-2.5"
            >
              <ShoppingBag
                size={15}
                color={isDark ? '#CBD5E1' : '#475569'}
              />
              <Text className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Continue Shopping
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default OrderSuccessModal;
