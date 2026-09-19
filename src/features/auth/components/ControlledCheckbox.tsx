import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Check } from "lucide-react-native";

export interface ControlledCheckboxProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label: React.ReactNode;
  containerClassName?: string;
  disabled?: boolean;
}

export function ControlledCheckbox<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  containerClassName = "",
  disabled = false,
}: ControlledCheckboxProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const isChecked = Boolean(value);

        return (
          <View className={`gap-1 ${containerClassName}`}>
            <TouchableOpacity
              activeOpacity={0.7}
              disabled={disabled}
              onPress={() => onChange(!isChecked)}
              className="flex-row items-center gap-2.5"
            >
              <View
                className={`w-4.5 h-4.5 rounded-md items-center justify-center border transition-all ${
                  isChecked
                    ? "bg-slate-950 dark:bg-white border-slate-950 dark:border-white"
                    : error
                      ? "border-red-500 bg-transparent"
                      : "border-slate-300 dark:border-slate-700 bg-transparent"
                } ${disabled ? "opacity-50" : ""}`}
              >
                {isChecked && (
                  <Check
                    size={11}
                    color="#1E293B"
                    className="text-white dark:text-slate-950"
                    strokeWidth={3.5}
                  />
                )}
              </View>

              {typeof label === "string" ? (
                <Text className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  {label}
                </Text>
              ) : (
                <View>{label}</View>
              )}
            </TouchableOpacity>

            {error?.message && (
              <Text className="text-xs text-red-500 font-medium ml-7">
                {error.message}
              </Text>
            )}
          </View>
        );
      }}
    />
  );
}
