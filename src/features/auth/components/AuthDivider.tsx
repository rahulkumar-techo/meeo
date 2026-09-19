import React from "react";
import { View, Text } from "react-native";

export interface AuthDividerProps {
  text?: string;
  className?: string;
}

export function AuthDivider({ text = "or", className = "" }: AuthDividerProps) {
  return (
    <View className={`flex-row items-center my-6 gap-3 ${className}`}>
      <View className="flex-1 h-[1px] bg-slate-200/70 dark:bg-slate-800" />
      <Text className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-widest">
        {text}
      </Text>
      <View className="flex-1 h-[1px] bg-slate-200/70 dark:bg-slate-800" />
    </View>
  );
}
