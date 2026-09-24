import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Lock, AlertCircle } from 'lucide-react-native';

import { Screen } from '@/components/layout';
import { Button } from '@/components/ui';
import { AppRoute } from '@/routes';
import {
  AuthHeader,
  ControlledInput,
  ControlledCheckbox,
  SocialAuthButtons,
  AuthDivider,
  signUpSchema,
  SignUpFormValues,
  useRegister,
  useGoogleAuth,
} from '@/features/auth';

export default function SignUpScreen() {
  const router = useRouter();

  const lastNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const registerMutation = useRegister();
  const googleAuthMutation = useGoogleAuth();

  const isSubmitting = registerMutation.isPending || googleAuthMutation.isPending;
  const errorMessage =
    (registerMutation.error as any)?.message ||
    (googleAuthMutation.error as any)?.message ||
    null;

  const { control, handleSubmit } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      agreeToTerms: false,
    },
    mode: 'onBlur',
  });

  const onSubmit = async (data: SignUpFormValues) => {
    try {
      const response = await registerMutation.mutateAsync({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      });

      const resData = (response as any)?.data || response;
      if (response?.token || resData?.token || resData?.accessToken) {
        router.replace(AppRoute.home as any);
      } else {
        router.push(AppRoute.verifyOtp as any);
      }
    } catch {
      // Handled by TanStack Query state
    }
  };

  const handleSocialAuth = async (provider: 'google' | 'apple' | 'facebook') => {
    if (provider === 'google') {
      try {
        await googleAuthMutation.mutateAsync({});
        router.replace(AppRoute.home as any);
      } catch {
        // Handled by mutation error
      }
    }
  };

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
        {/* Heading */}
        <View className="mb-6">
          <Text className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Create your account
          </Text>
          <Text className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Join Meeo and start your shopping journey today.
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
          {/* First Name & Last Name in 2 Columns */}
          <View className="flex-row gap-2.5">
            <View className="flex-1">
              <ControlledInput
                control={control}
                name="firstName"
                label="First Name"
                placeholder="John"
                autoCapitalize="words"
                autoCorrect={false}
                autoComplete="name-given"
                textContentType="givenName"
                returnKeyType="next"
                onSubmitEditing={() => lastNameRef.current?.focus()}
                blurOnSubmit={false}
                leftIcon={<User size={16} color="#94A3B8" />}
                isClearable
              />
            </View>
            <View className="flex-1">
              <ControlledInput
                inputRef={lastNameRef}
                control={control}
                name="lastName"
                label="Last Name"
                placeholder="Doe"
                autoCapitalize="words"
                autoCorrect={false}
                autoComplete="name-family"
                textContentType="familyName"
                returnKeyType="next"
                onSubmitEditing={() => emailRef.current?.focus()}
                blurOnSubmit={false}
                leftIcon={<User size={16} color="#94A3B8" />}
                isClearable
              />
            </View>
          </View>

          <ControlledInput
            inputRef={emailRef}
            control={control}
            name="email"
            label="Email"
            placeholder="youremail@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            textContentType="emailAddress"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
            blurOnSubmit={false}
            leftIcon={<Mail size={17} color="#94A3B8" />}
            isClearable
          />

          <ControlledInput
            inputRef={passwordRef}
            control={control}
            name="password"
            label="Password"
            placeholder="••••••••"
            isPassword
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="newPassword"
            returnKeyType="done"
            onSubmitEditing={handleSubmit(onSubmit)}
            leftIcon={<Lock size={17} color="#94A3B8" />}
          />

          {/* Terms & Privacy */}
          <View className="my-1">
            <ControlledCheckbox
              control={control}
              name="agreeToTerms"
              label={
                <Text className="text-xs text-slate-600 dark:text-slate-400 leading-4">
                  I agree to the{' '}
                  <Text className="font-bold text-slate-900 dark:text-white">Terms of Service</Text>{' '}
                  and{' '}
                  <Text className="font-bold text-slate-900 dark:text-white">Privacy Policy</Text>
                </Text>
              }
            />
          </View>

          {/* Submit Button */}
          <Button
            fullWidth
            size="lg"
            variant="primary"
            isLoading={isSubmitting}
            onPress={handleSubmit(onSubmit)}
            className="h-12 rounded-xl bg-[#2D2621] dark:bg-white active:bg-[#1A1614] border-0"
          >
            <Text className="text-sm font-bold text-white dark:text-slate-950">
              Create Account
            </Text>
          </Button>
        </View>

        {/* Divider */}
        <AuthDivider text="or sign up with" />

        {/* Social Buttons */}
        <SocialAuthButtons
          disabled={isSubmitting}
          onGooglePress={() => handleSocialAuth('google')}
          onApplePress={() => handleSocialAuth('apple')}
          onFacebookPress={() => handleSocialAuth('facebook')}
        />
      </View>

      {/* Footer Switcher */}
      <View className="flex-row items-center justify-center gap-1 pt-2 pb-1">
        <Text className="text-xs text-slate-500 dark:text-slate-400">
          Already have an account?
        </Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.push(AppRoute.signIn as any)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text className="text-xs font-bold text-slate-900 dark:text-white">
            Sign In
          </Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}
