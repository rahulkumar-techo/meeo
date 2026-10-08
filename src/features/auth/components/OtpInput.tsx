import React, { useRef } from "react";
import {
  View,
  TextInput,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from "react-native";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { useTheme } from "@/theme";

export interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean;
}

export function OtpInput({
  length = 4,
  value = "",
  onChange,
  hasError = false,
}: OtpInputProps) {
  const { isDark } = useTheme();
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleChangeText = (text: string, index: number) => {
    const cleaned = text.replace(/[^0-9]/g, "");

    // Handling multi-character paste or autofill
    if (cleaned.length > 1) {
      const pasted = cleaned.slice(0, length);
      onChange(pasted);
      const nextFocusIndex = Math.min(pasted.length, length - 1);
      inputRefs.current[nextFocusIndex]?.focus();
      return;
    }

    const currentDigits = Array.from({ length }, (_, i) => value[i] || "");
    const newDigits = [...currentDigits];
    newDigits[index] = cleaned;
    const combined = newDigits.join("");
    onChange(combined);

    if (cleaned && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    if (e.nativeEvent.key === "Backspace") {
      const currentVal = value[index] || "";
      if (!currentVal && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  return (
    <View className="flex-row justify-between items-center w-full gap-2.5">
      {Array.from({ length }).map((_, index) => {
        const isFilled = Boolean(value[index]);
        return (
          <TextInput
            key={index}
            ref={(ref) => {
              inputRefs.current[index] = ref;
            }}
            value={value[index] || ""}
            onChangeText={(text) => handleChangeText(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            keyboardType="number-pad"
            maxLength={length}
            selectTextOnFocus
            textAlign="center"
            placeholderTextColor={isDark ? "#475569" : "#CBD5E1"}
            className={`flex-1 h-14 rounded-2xl text-center text-xl font-bold text-slate-900 dark:text-white border transition-all ${
              hasError
                ? "border-red-500 bg-red-50/20 dark:bg-red-950/20"
                : isFilled
                  ? "border-slate-900 dark:border-white bg-white dark:bg-slate-900"
                  : "border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40"
            }`}
          />
        );
      })}
    </View>
  );
}

export interface ControlledOtpInputProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  length?: number;
}

export function ControlledOtpInput<TFieldValues extends FieldValues>({
  control,
  name,
  length = 4,
}: ControlledOtpInputProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <OtpInput
          length={length}
          value={value || ""}
          onChange={onChange}
          hasError={Boolean(error)}
        />
      )}
    />
  );
}
