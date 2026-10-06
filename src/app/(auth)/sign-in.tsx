import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { AlertCircle, Lock, Mail } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { Screen } from '@/components/layout';
import { Button } from '@/components/ui';
import {
  AuthDivider,
  AuthHeader,
  ControlledInput,
  SignInFormValues,
  signInSchema,
  SocialAuthButtons,
  useAuthStore,
  useGoogleAuth,
  useLogin,
} from '@/features/auth';
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { configureGoogleSignIn } from '@/lib';
import { AppRoute } from '@/routes';


export default function SignInScreen() {
  const router = useRouter();
  const passwordRef = useRef<TextInput>(null);

  const [socialError, setSocialError] = useState<string | null>(null);
  const [isSocialPending, setIsSocialPending] = useState(false);

  const loginMutation = useLogin();
  const googleAuthMutation = useGoogleAuth();

  const isEmailSubmitting = loginMutation.isPending;
  const isGoogleLoading = googleAuthMutation.isPending || isSocialPending;
  const isAnySubmitting = isEmailSubmitting || isGoogleLoading;
  const errorMessage =
    socialError ||
    (loginMutation.error as any)?.message ||
    (googleAuthMutation.error as any)?.message ||
    null;

  const { control, handleSubmit } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    mode: 'onBlur',
  });

  const setPendingEmail = useAuthStore((state) => state.setPendingEmail);

  const onSubmit = async (data: SignInFormValues) => {
    setSocialError(null);
    try {
      await loginMutation.mutateAsync({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
      });
      router.replace(AppRoute.home as any);
    } catch (err: any) {
      const status = err?.status || err?.response?.status;
      const msg = (err?.message || '').toLowerCase();
      if (status === 403 && (msg.includes('verify') || msg.includes('email'))) {
        const normalizedEmail = data.email.trim().toLowerCase();
        setPendingEmail(normalizedEmail);
        router.push({
          pathname: AppRoute.verifyOtp as any,
          params: { email: normalizedEmail },
        });
      }
    }
  };

  const handleSocialAuth = async (provider: 'google' | 'apple' | 'facebook') => {
    if (provider !== 'google') {
      Alert.alert(
        'Coming Soon',
        `${provider.charAt(0).toUpperCase() + provider.slice(1)} sign-in is not supported yet.`
      );
      return;
    }

    setSocialError(null);
    setIsSocialPending(true);

    try {
      configureGoogleSignIn();
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (isSuccessResponse(response)) {
        const idToken = response.data.idToken;
        if (!idToken) {
          setSocialError('Google sign-in failed: missing ID token.');
          return;
        }

        await googleAuthMutation.mutateAsync({ idToken });
        router.replace(AppRoute.home as any);
      }
    } catch (error: any) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            // Flow cancelled by user
            break;
          case statusCodes.IN_PROGRESS:
            // Sign in operation already in progress
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            Alert.alert(
              'Google Play Services',
              'Google Play Services is not available or outdated.'
            );
            break;
          default:
            setSocialError(error.message || 'Google sign-in failed.');
        }
      } else {
        setSocialError(error?.message || 'Google sign-in failed.');
      }
    } finally {
      setIsSocialPending(false);
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
            Welcome back
          </Text>
          <Text className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Good to see you again! Sign in to continue to Meeo.
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
            placeholder="Password"
            isPassword
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="password"
            textContentType="password"
            returnKeyType="done"
            onSubmitEditing={handleSubmit(onSubmit)}
            leftIcon={<Lock size={17} color="#94A3B8" />}
          />

          {/* Forgot Password Link */}
          <View className="items-end mt-0.5 mb-1">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push(AppRoute.forgotPassword as any)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Forgot password?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Submit Button */}
          <Button
            fullWidth
            size="lg"
            variant="dark"
            rounded="xl"
            isLoading={isEmailSubmitting}
            disabled={isAnySubmitting}
            loadingText="Signing In..."
            onPress={handleSubmit(onSubmit)}
            className="mt-1"
          >
            Sign In
          </Button>
        </View>

        {/* Divider */}
        <AuthDivider text="or continue with" />

        {/* Social Buttons */}
        <SocialAuthButtons
          disabled={isAnySubmitting}
          isGoogleLoading={isGoogleLoading}
          onGooglePress={() => handleSocialAuth('google')}
          onApplePress={() => handleSocialAuth('apple')}
          onFacebookPress={() => handleSocialAuth('facebook')}
        />
      </View>

      {/* Footer Switcher at the bottom */}
      <View className="flex-row items-center justify-center gap-1 pt-2 pb-1">
        <Text className="text-xs text-slate-500 dark:text-slate-400">
          {"Don't have an account?"}
        </Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.push(AppRoute.signUp as any)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text className="text-xs font-bold text-slate-900 dark:text-white">
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}
