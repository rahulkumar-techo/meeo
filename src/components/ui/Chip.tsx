import React from 'react';
import { TouchableOpacity, Text, View, TouchableOpacityProps } from 'react-native';
import { X } from 'lucide-react-native';
import { useTheme } from '../../theme';

export interface ChipProps extends TouchableOpacityProps {
  label: string;
  selected?: boolean;
  icon?: React.ReactNode;
  onRemove?: () => void;
  count?: number;
  className?: string;
}

export function Chip({
  label,
  selected = false,
  icon,
  onRemove,
  count,
  className = '',
  disabled,
  ...props
}: ChipProps) {
  const { isDark } = useTheme();

  const containerClasses = selected
    ? 'bg-primary border-primary'
    : 'bg-surface dark:bg-slate-800/90 border-border dark:border-slate-700';

  const textClasses = selected
    ? 'text-white font-semibold'
    : 'text-text-primary dark:text-slate-200 font-medium';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled}
      className={`flex-row items-center px-3.5 py-1.5 rounded-pill border ${containerClasses} gap-1.5 ${
        disabled ? 'opacity-50' : ''
      } ${className}`}
      {...props}
    >
      {icon && <View>{icon}</View>}

      <Text className={`text-body-sm ${textClasses} tracking-tight`}>{label}</Text>

      {typeof count === 'number' && (
        <View
          className={`px-1.5 py-0.5 rounded-full ${
            selected ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-700'
          }`}
        >
          <Text
            className={`text-[10px] font-bold ${
              selected ? 'text-white' : 'text-text-secondary dark:text-slate-300'
            }`}
          >
            {count}
          </Text>
        </View>
      )}

      {onRemove && (
        <TouchableOpacity
          onPress={onRemove}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          className="ml-0.5"
        >
          <X size={13} color={selected ? '#FFFFFF' : isDark ? '#94A3B8' : '#64748B'} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}
