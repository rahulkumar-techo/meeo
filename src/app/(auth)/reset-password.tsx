import React, { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, AlertCircle, Sparkles } from 'lucide-react-native';

import { Screen } from '@/components/layout';
import { Button } from '@/components/ui';
import { AppRoute } from '@/routes';
import {
  AuthHeader,
  ControlledInput,
  resetPasswordSchema,
  ResetPasswordFormValues,
  useResetPassword,
} from '@/features/auth';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const confirmPasswordRef = useRef<TextInput>(null);

  const resetPasswordMutation = useResetPassword();
  const [isSuccess, setIsSuccess] = useState(false);

  const errorMessage = (resetPasswordMutation.error as any)?.message || null;

  const { control, handleSubmit } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    mode: 'onBlur',
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    try {
      await resetPasswordMutation.mutateAsync({
        password: data.password,
      });
      setIsSuccess(true);
    } catch {
      // Handled by mutation error
    }
  };

  // Screen 10 in design: You're all set! (Success State)
  if (isSuccess) {
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
        <View className="h-6" />

        <View className="flex-1 justify-center my-auto py-4">
          {/* Centered Celebration Badge */}
          <View className="w-16 h-16 rounded-full bg-[#2D2621] dark:bg-white items-center justify-center self-center mb-6">
            <Sparkles size={28} color="#FFF" />
          </View>

          {/* Heading */}
          <Text className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white text-center">
            {"You're all set!"}
          </Text>
          <Text className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center px-4 leading-5">
            Your password has been successfully reset. You can now sign in with your new credentials.
          </Text>

          {/* Action Button */}
          <View className="w-full mt-8">
            <Button
              fullWidth
              size="lg"
              variant="primary"
              onPress={() => router.replace(AppRoute.signIn as any)}
              className="h-12 rounded-xl bg-[#2D2621] dark:bg-white active:bg-[#1A1614] border-0"
            >
              <Text className="text-sm font-bold text-white dark:text-slate-950">
                Back to Sign In
              </Text>
            </Button>
          </View>
        </View>

        <View className="py-2" />
      </Screen>
    );
  }

  // Active Reset Password Form
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
        {/* Lock Icon */}
        <View className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 items-center justify-center mb-5">
          <Lock size={22} color="#2D2621" />
        </View>

        {/* Heading */}
        <View className="mb-6">
          <Text className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Set new password
          </Text>
          <Text className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-5">
            Create a strong password that you do not use on other accounts.
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

        {/* Form Inputs */}
        <View className="gap-3">
          <ControlledInput
            control={control}
            name="password"
            label="New Password"
            placeholder="••••••••"
            isPassword
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="newPassword"
            returnKeyType="next"
            onSubmitEditing={() => confirmPasswordRef.current?.focus()}
            blurOnSubmit={false}
            leftIcon={<Lock size={17} color="#94A3B8" />}
          />

          <ControlledInput
            inputRef={confirmPasswordRef}
            control={control}
            name="confirmPassword"
            label="Confirm New Password"
            placeholder="••••••••"
            isPassword
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="newPassword"
            returnKeyType="done"
            onSubmitEditing={handleSubmit(onSubmit)}
            leftIcon={<Lock size={17} color="#94A3B8" />}
          />

          {/* Submit Button */}
          <Button
            fullWidth
            size="lg"
            variant="primary"
            isLoading={resetPasswordMutation.isPending}
            onPress={handleSubmit(onSubmit)}
            className="h-12 rounded-xl bg-[#2D2621] dark:bg-white active:bg-[#1A1614] border-0 mt-2"
          >
            <Text className="text-sm font-bold text-white dark:text-slate-950">
              Reset Password
            </Text>
          </Button>
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
