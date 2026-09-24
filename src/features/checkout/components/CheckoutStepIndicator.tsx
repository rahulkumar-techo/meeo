import React from 'react';
import { View, Text } from 'react-native';
import { Check, MapPin, FileText, CreditCard } from 'lucide-react-native';
import { useTheme } from '@/theme';

export interface CheckoutStepIndicatorProps {
  currentStep: 1 | 2 | 3;
}

const STEPS = [
  { id: 1, title: 'Address', icon: MapPin },
  { id: 2, title: 'Review', icon: FileText },
  { id: 3, title: 'Payment', icon: CreditCard },
];

export function CheckoutStepIndicator({ currentStep }: CheckoutStepIndicatorProps) {
  const { isDark } = useTheme();

  return (
    <View className="px-4 py-3">
      <View className="flex-row items-center justify-between">
        {STEPS.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          const Icon = step.icon;

          return (
            <React.Fragment key={step.id}>
              {/* Step Circle & Label */}
              <View className="items-center gap-1.5">
                <View
                  className={`w-8 h-8 rounded-full border-2 items-center justify-center ${
                    isCompleted
                      ? 'bg-emerald-600 border-emerald-600'
                      : isActive
                      ? 'bg-[#2D2621] border-[#2D2621] dark:bg-white dark:border-white'
                      : 'bg-slate-100 border-slate-300 dark:bg-slate-800 dark:border-slate-700'
                  }`}
                >
                  {isCompleted ? (
                    <Check size={14} color="#FFFFFF" strokeWidth={3} />
                  ) : (
                    <Icon
                      size={14}
                      color={
                        isActive
                          ? isDark
                            ? '#0F172A'
                            : '#FFFFFF'
                          : isDark
                          ? '#94A3B8'
                          : '#64748B'
                      }
                      strokeWidth={2.4}
                    />
                  )}
                </View>

                <Text
                  className={`text-xs ${
                    isActive
                      ? 'font-bold text-slate-900 dark:text-white'
                      : isCompleted
                      ? 'font-semibold text-emerald-600 dark:text-emerald-400'
                      : 'font-semibold text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {step.title}
                </Text>
              </View>

              {/* Connecting Line between steps */}
              {index < STEPS.length - 1 && (
                <View
                  className={`flex-1 h-0.5 mx-2 mb-4.5 ${
                    currentStep > index + 1
                      ? 'bg-emerald-600'
                      : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
}

export default CheckoutStepIndicator;
