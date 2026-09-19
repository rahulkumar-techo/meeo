import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TextInputProps,
} from "react-native";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Eye, EyeOff, X } from "lucide-react-native";
import { useTheme } from "@/theme";

export interface ControlledInputProps<
  TFieldValues extends FieldValues,
> extends Omit<TextInputProps, "value" | "onChangeText"> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isPassword?: boolean;
  isClearable?: boolean;
  containerClassName?: string;
  className?: string;
  disabled?: boolean;
  inputRef?: React.RefObject<TextInput | null> | React.RefObject<TextInput>;
}

export function ControlledInput<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  helperText,
  leftIcon,
  rightIcon,
  isPassword = false,
  isClearable = false,
  containerClassName = "",
  className = "",
  disabled = false,
  inputRef,
  ...textInputProps
}: ControlledInputProps<TFieldValues>) {
  const { isDark } = useTheme();
  const [isFocused, setIsFocused] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange, onBlur, value, ref },
        fieldState: { error },
      }) => {
        const hasValue = Boolean(value && String(value).length > 0);

        const borderClass = error
          ? "border-red-500 bg-red-50/10"
          : isFocused
            ? "border-slate-800 dark:border-slate-200 bg-white dark:bg-slate-900"
            : "border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900";

        return (
          <View className={`w-full ${containerClassName}`}>
            <View
              className={`flex-row items-center px-3.5 h-[52px] rounded-xl border ${borderClass} shadow-2xs transition-all`}
            >
              {/* Left icon */}
              {leftIcon && (
                <View className="mr-2.5 opacity-60">{leftIcon}</View>
              )}

              {/* Input & Optional Integrated Mini Label */}
              <View className="flex-1 justify-center py-1">
                {label && (
                  <Text className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">
                    {label}
                  </Text>
                )}
                <TextInput
                  ref={(node) => {
                    if (typeof ref === "function") ref(node);
                    if (inputRef && "current" in inputRef) {
                      (inputRef as any).current = node;
                    }
                  }}
                  value={
                    value !== undefined && value !== null ? String(value) : ""
                  }
                  onChangeText={onChange}
                  onBlur={() => {
                    setIsFocused(false);
                    onBlur();
                  }}
                  onFocus={(e) => {
                    setIsFocused(true);
                    textInputProps.onFocus?.(e);
                  }}
                  editable={!disabled}
                  secureTextEntry={isPassword && !showPassword}
                  placeholderTextColor={isDark ? "#64748B" : "#94A3B8"}
                  className={`text-sm font-medium text-slate-900 dark:text-slate-100 p-0 m-0 ${className}`}
                  {...textInputProps}
                />
              </View>

              {/* Clear button */}
              {isClearable && hasValue && !disabled && !isPassword && (
                <TouchableOpacity
                  onPress={() => onChange("")}
                  activeOpacity={0.7}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  className="p-1 -mr-1 opacity-50"
                >
                  <X size={15} color={isDark ? "#94A3B8" : "#64748B"} />
                </TouchableOpacity>
              )}

              {/* Password eye toggle */}
              {isPassword && (
                <TouchableOpacity
                  onPress={() => setShowPassword((prev) => !prev)}
                  activeOpacity={0.7}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  className="p-1 -mr-1 opacity-60"
                >
                  {showPassword ? (
                    <EyeOff size={18} color={isDark ? "#94A3B8" : "#64748B"} />
                  ) : (
                    <Eye size={18} color={isDark ? "#94A3B8" : "#64748B"} />
                  )}
                </TouchableOpacity>
              )}

              {/* Custom right icon */}
              {rightIcon && !isPassword && (
                <View className="ml-2 opacity-60">{rightIcon}</View>
              )}
            </View>

            {/* Error / Helper */}
            {error?.message ? (
              <Text className="text-xs text-red-500 font-medium ml-1 mt-1">
                {error.message}
              </Text>
            ) : helperText ? (
              <Text className="text-xs text-slate-400 dark:text-slate-500 ml-1 mt-1">
                {helperText}
              </Text>
            ) : null}
          </View>
        );
      }}
    />
  );
}
