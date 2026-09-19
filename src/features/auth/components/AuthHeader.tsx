import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { useRouter } from "expo-router";
import { AppRoute } from "@/routes";

export interface AuthHeaderProps {
  /** Optional title displayed in the header */
  title?: string;
  /** Optional subtitle text */
  subtitle?: string;
  /** Whether to show the top back navigation button. Defaults to true. */
  showBack?: boolean;
  /** Optional custom back action. Defaults to router back / fallback to home. */
  onBackPress?: () => void;
  /** Optional custom right accessory element (e.g. logo, badge) */
  rightElement?: React.ReactNode;
  /** Optional Tailwind className for the outer container */
  className?: string;
}

/**
 * Reusable authentication top navigation and header component.
 */
export function AuthHeader({
  title,
  subtitle,
  showBack = true,
  onBackPress,
  rightElement,
  className = "",
}: AuthHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(AppRoute.home as any);
    }
  };

  return (
    <View className={`w-full ${className}`}>
      {/* Top Navigation Row */}
      <View className="flex-row items-center justify-between min-h-[36px]">
        {showBack ? (
          <TouchableOpacity
            onPress={handleBack}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            className="w-9 h-9 -ml-1 items-center justify-center rounded-full"
          >
            <ChevronLeft
              size={22}
              color="#1E293B"
              className="text-slate-800 dark:text-slate-200"
            />
          </TouchableOpacity>
        ) : (
          <View className="w-9" />
        )}

        {rightElement ? <View>{rightElement}</View> : <View className="w-9" />}
      </View>

      {/* Optional Heading and Subtitle */}
      {(title || subtitle) && (
        <View className="mt-4 mb-6">
          {title && (
            <Text className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {title}
            </Text>
          )}
          {subtitle && (
            <Text className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {subtitle}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

export default AuthHeader;
