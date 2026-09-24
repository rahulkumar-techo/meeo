import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, AlertCircle, Check } from 'lucide-react-native';

import { Screen } from '@/components/layout';
import { Button } from '@/components/ui';
import { AppRoute } from '@/routes';
import {
  AuthHeader,
  ControlledOtpInput,
  verifyOtpSchema,
  VerifyOtpFormValues,
  useAuthStore,
  useVerifyOtp,
  useForgotPassword,
} from '@/features/auth';

export default function VerifyOtpScreen() {
  const router = useRouter();
  const pendingEmail = useAuthStore((state) => state.pendingEmail);

  const verifyOtpMutation = useVerifyOtp();
  const resendMutation = useForgotPassword();

  const isSubmitting = verifyOtpMutation.isPending || resendMutation.isPending;
  const errorMessage =
    (verifyOtpMutation.error as any)?.message ||
    (resendMutation.error as any)?.message ||
    null;

  const [resendTimer, setResendTimer] = useState(45);
  const [isVerified, setIsVerified] = useState(false);

  const { control, handleSubmit } = useForm<VerifyOtpFormValues>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      code: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    let interval: any;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleResend = async () => {
    if (resendTimer > 0 || !pendingEmail) return;
    try {
      await resendMutation.mutateAsync({ email: pendingEmail });
      setResendTimer(45);
    } catch {
      // Handled by mutation error
    }
  };

  const onSubmit = async (data: VerifyOtpFormValues) => {
    try {
      await verifyOtpMutation.mutateAsync({
        email: pendingEmail || undefined,
        otp: data.code,
      });
      setIsVerified(true);
    } catch {
      // Handled by mutation error
    }
  };

  // Screen 10 in design: Verified Success state
  if (isVerified) {
    return (
      <Screen
        safeArea={['top', 'bottom']}
        backgroundColor="#FAFAFA"
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'space-between',
          paddingHorizontal: 22,
          paddingTop: 8,
          paddingBottom: 20,
        }}
      >
        <AuthHeader showBack={false} />

        <View className="flex-1 justify-center my-auto items-center py-4">
          <View className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 items-center justify-center mb-6">
            <Check size={32} color="#10B981" />
          </View>

          <Text className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white text-center">
            Code Verified!
          </Text>
          <Text className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center px-6 leading-5">
            Your identity has been confirmed. You can now set up your new account password.
          </Text>

          <View className="w-full mt-8">
            <Button
              fullWidth
              size="lg"
              variant="primary"
              onPress={() => router.push(AppRoute.resetPassword as any)}
              className="h-12 rounded-xl bg-[#2D2621] dark:bg-white active:bg-[#1A1614] border-0"
            >
              <Text className="text-sm font-bold text-white dark:text-slate-950">
                Create New Password
              </Text>
            </Button>
          </View>
        </View>

        <View className="py-2" />
      </Screen>
    );
  }

  // Active OTP Entry Screen
  return (
    <Screen
      scroll
      keyboard
      safeArea={['top', 'bottom']}
      backgroundColor="#FAFAFA"
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 22,
        paddingTop: 8,
        paddingBottom: 20,
      }}
    >
      {/* Top Header */}
      <AuthHeader showBack={true} />

      {/* Main Centered Content Block */}
      <View className="flex-1 justify-center my-auto py-4">
        {/* Mail Icon */}
        <View className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 items-center justify-center mb-5">
          <Mail size={22} color="#2D2621" />
        </View>

        {/* Heading */}
        <View className="mb-6">
          <Text className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Enter verification code
          </Text>
          <Text className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-5">
            We sent a 4-digit code to{' '}
            <Text className="font-bold text-slate-900 dark:text-white">
              {pendingEmail || 'your email'}
            </Text>
            . Enter it below to continue.
          </Text>
        </View>

        {/* Error Alert */}
        {errorMessage && (
          <View className="flex-row items-center gap-2.5 p-3 mb-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50">
            <AlertCircle size={15} color="#EF4444" />
            <Text className="text-xs text-red-600 dark:text-red-400 font-medium flex-1">
              {errorMessage}
            </Text>
          </View>
        )}

        {/* OTP Input Component */}
        <View className="gap-6 my-2">
          <ControlledOtpInput control={control} name="code" length={4} />

          {/* Submit Button */}
          <Button
            fullWidth
            size="lg"
            variant="primary"
            isLoading={isSubmitting}
            onPress={handleSubmit(onSubmit)}
            className="h-12 rounded-xl bg-[#2D2621] dark:bg-white active:bg-[#1A1614] border-0 mt-2"
          >
            <Text className="text-sm font-bold text-white dark:text-slate-950">
              Verify Code
            </Text>
          </Button>

          {/* Resend OTP */}
          <View className="flex-row items-center justify-center gap-1">
            <Text className="text-xs text-slate-500 dark:text-slate-400">
              {"Didn't receive code?"}
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleResend}
              disabled={resendTimer > 0 || isSubmitting}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text
                className={`text-xs font-bold ${
                  resendTimer > 0
                    ? 'text-slate-400 dark:text-slate-600'
                    : 'text-slate-900 dark:text-white'
                }`}
              >
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Footer Return Link */}
      <View className="flex-row items-center justify-center pt-2 pb-1">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.push(AppRoute.signIn as any)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text className="text-xs font-bold text-slate-900 dark:text-white">
            ← Back to Sign In
          </Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}
