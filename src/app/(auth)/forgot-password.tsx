import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, AlertCircle } from 'lucide-react-native';

import { Screen } from '@/components/layout';
import { Button } from '@/components/ui';
import { AppRoute } from '@/routes';
import {
  AuthHeader,
  ControlledInput,
  forgotPasswordSchema,
  ForgotPasswordFormValues,
  useForgotPassword,
} from '@/features/auth';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const forgotPasswordMutation = useForgotPassword();
  const [emailSent, setEmailSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const errorMessage = (forgotPasswordMutation.error as any)?.message || null;

  const { control, handleSubmit } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onBlur',
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setSubmittedEmail(data.email);
    try {
      await forgotPasswordMutation.mutateAsync({ email: data.email });
      setEmailSent(true);
    } catch {
      // Handled by TanStack mutation error
    }
  };

  const handleResend = async () => {
    if (!submittedEmail) return;
    try {
      await forgotPasswordMutation.mutateAsync({ email: submittedEmail });
    } catch {
      // Handled by mutation error
    }
  };

  // Screen 7 in design: Check your email (Email Sent State)
  if (emailSent) {
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
        {/* Top Header */}
        <AuthHeader showBack={true} />

        {/* Center Content */}
        <View className="flex-1 justify-center my-auto items-center py-4">
          {/* Icon Circle */}
          <View className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center mb-6">
            <Mail size={30} color="#2D2621" />
          </View>

          <Text className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white text-center">
            Check your email
          </Text>
          <Text className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center px-4 leading-5">
            We sent a 4-digit password reset code to{' '}
            <Text className="font-bold text-slate-900 dark:text-white">
              {submittedEmail}
            </Text>
          </Text>

          {/* Enter Code Button */}
          <View className="w-full mt-8 gap-3">
            <Button
              fullWidth
              size="lg"
              variant="primary"
              onPress={() => router.push(AppRoute.verifyOtp as any)}
              className="h-12 rounded-xl bg-[#2D2621] dark:bg-white active:bg-[#1A1614] border-0"
            >
              <Text className="text-sm font-bold text-white dark:text-slate-950">
                Enter Verification Code
              </Text>
            </Button>

            {/* Resend Action */}
            <View className="flex-row items-center justify-center gap-1 mt-2">
              <Text className="text-xs text-slate-500 dark:text-slate-400">
                {"Didn't receive the email?"}
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleResend}
                disabled={forgotPasswordMutation.isPending}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text className="text-xs font-bold text-slate-900 dark:text-white">
                  {forgotPasswordMutation.isPending ? 'Sending...' : 'Click to resend'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Footer Back Link */}
        <View className="flex-row items-center justify-center pt-2 pb-1">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push(AppRoute.signIn as any)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text className="text-xs font-bold text-slate-700 dark:text-slate-300">
              ← Back to Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </Screen>
    );
  }

  // Initial Forgot Password Form
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
        {/* Key Lock Icon */}
        <View className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 items-center justify-center mb-5">
          <Lock size={22} color="#2D2621" />
        </View>

        {/* Heading */}
        <View className="mb-6">
          <Text className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Forgot password?
          </Text>
          <Text className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-5">
            No worries! Enter your registered email and we will send you a 6-digit recovery code.
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
            name="email"
            placeholder="youremail@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            textContentType="emailAddress"
            returnKeyType="done"
            onSubmitEditing={handleSubmit(onSubmit)}
            leftIcon={<Mail size={17} color="#94A3B8" />}
            isClearable
          />

          {/* Submit Button */}
          <Button
            fullWidth
            size="lg"
            variant="primary"
            isLoading={forgotPasswordMutation.isPending}
            onPress={handleSubmit(onSubmit)}
            className="h-12 rounded-xl bg-[#2D2621] dark:bg-white active:bg-[#1A1614] border-0 mt-1"
          >
            <Text className="text-sm font-bold text-white dark:text-slate-950">
              Send Reset Code
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
