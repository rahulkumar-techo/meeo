import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  TextInputProps,
} from 'react-native';
import { X } from 'lucide-react-native';
import { useTheme } from '../../theme';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isClearable?: boolean;
  onClear?: () => void;
  disabled?: boolean;
  containerClassName?: string;
  className?: string;
}

export function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  isClearable = false,
  onClear,
  value,
  onChangeText,
  disabled,
  containerClassName = '',
  className = '',
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const { isDark } = useTheme();

  const handleClear = () => {
    if (onChangeText) {
      onChangeText('');
    }
    onClear?.();
  };

  const hasValue = Boolean(value && value.length > 0);

  const borderClass = error
    ? 'border-error ring-1 ring-error'
    : isFocused
    ? 'border-primary ring-1 ring-primary'
    : 'border-border dark:border-slate-700';

  const bgClass = disabled
    ? 'bg-slate-100 dark:bg-slate-800 opacity-60'
    : 'bg-surface dark:bg-slate-800';

  return (
    <View className={`w-full gap-1.5 ${containerClassName}`}>
      {label && (
        <Text className="text-body-sm font-medium text-text-primary dark:text-slate-200">
          {label}
        </Text>
      )}

      <View
        className={`flex-row items-center px-3.5 min-h-[46px] rounded-lg border ${borderClass} ${bgClass} transition-colors`}
      >
        {leftIcon && <View className="mr-2.5">{leftIcon}</View>}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          editable={!disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
          className={`flex-1 text-body text-text-primary dark:text-slate-100 py-2.5 ${className}`}
          {...props}
        />

        {isClearable && hasValue && !disabled && (
          <TouchableOpacity
            onPress={handleClear}
            activeOpacity={0.7}
            className="p-1 -mr-1"
          >
            <X size={16} color={isDark ? '#94A3B8' : '#64748B'} />
          </TouchableOpacity>
        )}

        {rightIcon && <View className="ml-2">{rightIcon}</View>}
      </View>

      {error ? (
        <Text className="text-caption text-error font-medium ml-0.5">
          {error}
        </Text>
      ) : helperText ? (
        <Text className="text-caption text-text-secondary dark:text-slate-400 ml-0.5">
          {helperText}
        </Text>
      ) : null}
    </View>
  );
}
