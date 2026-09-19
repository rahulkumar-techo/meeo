import React from "react";
import { View, Text } from "react-native";

export interface MeeoLogoProps {
  /** Size variant: 'sm' (header/nav), 'md' (standard), 'lg' (auth hero) */
  size?: "sm" | "md" | "lg";
  /** Whether to show subtitle/tagline */
  showTagline?: boolean;
}

/**
 * Modern, high-fashion MEEO brand emblem.
 * Clean, minimalist typography with bold monogram.
 */
export function MeeoLogo({ size = "md", showTagline = false }: MeeoLogoProps) {
  const isLarge = size === "lg";
  const isSmall = size === "sm";

  const badgeSize = isLarge
    ? "w-13 h-13 rounded-2xl"
    : isSmall
      ? "w-8 h-8 rounded-lg"
      : "w-10 h-10 rounded-xl";
  const mSize = isLarge ? "text-2xl" : isSmall ? "text-sm" : "text-lg";
  const wordmarkSize = isLarge ? "text-2xl" : isSmall ? "text-base" : "text-xl";

  return (
    <View className="items-center justify-center gap-1.5">
      <View className="flex-row items-center gap-2.5">
        {/* Monogram Badge */}
        <View
          className={`${badgeSize} bg-slate-950 dark:bg-white items-center justify-center shadow-sm`}
        >
          <Text
            className={`${mSize} font-black text-white dark:text-slate-950 tracking-tighter`}
          >
            M
          </Text>
        </View>

        {/* Wordmark */}
        <Text
          className={`${wordmarkSize} font-black tracking-[0.25em] text-slate-900 dark:text-white uppercase`}
        >
          MEEO
        </Text>
      </View>

      {showTagline && (
        <Text className="text-[11px] font-medium tracking-[0.2em] text-slate-400 dark:text-slate-500 uppercase">
          Studio Edition
        </Text>
      )}
    </View>
  );
}
