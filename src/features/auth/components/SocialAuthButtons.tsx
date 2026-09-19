import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "@/theme";

export interface SocialAuthButtonsProps {
  onGooglePress?: () => void;
  onApplePress?: () => void;
  onFacebookPress?: () => void;
  disabled?: boolean;
}

function GoogleIcon() {
  return (
    <Svg width="19" height="19" viewBox="0 0 24 24">
      <Path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
      />
      <Path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.39 7.33 24 12 24z"
      />
      <Path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
      />
      <Path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.27 2.61 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </Svg>
  );
}

function AppleIcon({ color }: { color: string }) {
  return (
    <Svg width="19" height="19" viewBox="0 0 24 24" fill={color}>
      <Path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.41c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.61 1.34-.55.63-.99 1.66-.88 2.66 1.01.08 2.01-.5 2.57-1.15z" />
    </Svg>
  );
}

function FacebookIcon() {
  return (
    <Svg width="19" height="19" viewBox="0 0 24 24" fill="#1877F2">
      <Path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </Svg>
  );
}

export function SocialAuthButtons({
  onGooglePress,
  onApplePress,
  onFacebookPress,
  disabled = false,
}: SocialAuthButtonsProps) {
  const { isDark } = useTheme();

  return (
    <View className="flex-row items-center gap-2.5 w-full">
      {/* Google */}
      <TouchableOpacity
        activeOpacity={0.8}
        disabled={disabled}
        onPress={onGooglePress}
        className="flex-1 flex-row items-center justify-center gap-2 h-12 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs"
      >
        <GoogleIcon />
        <Text className="text-xs font-semibold text-slate-800 dark:text-slate-200">
          Google
        </Text>
      </TouchableOpacity>

      {/* Apple */}
      <TouchableOpacity
        activeOpacity={0.8}
        disabled={disabled}
        onPress={onApplePress}
        className="flex-1 flex-row items-center justify-center gap-2 h-12 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs"
      >
        <AppleIcon color={isDark ? "#F8FAFC" : "#0F172A"} />
        <Text className="text-xs font-semibold text-slate-800 dark:text-slate-200">
          Apple
        </Text>
      </TouchableOpacity>

      {/* Facebook */}
      <TouchableOpacity
        activeOpacity={0.8}
        disabled={disabled}
        onPress={onFacebookPress}
        className="flex-1 flex-row items-center justify-center gap-2 h-12 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs"
      >
        <FacebookIcon />
        <Text className="text-xs font-semibold text-slate-800 dark:text-slate-200">
          Facebook
        </Text>
      </TouchableOpacity>
    </View>
  );
}
