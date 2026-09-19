import React from 'react';
import { View, TextInput, TouchableOpacity, TextInputProps } from 'react-native';
import { Search, X, SlidersHorizontal } from 'lucide-react-native';
import { useTheme } from '../../theme';

export interface SearchBarProps extends TextInputProps {
  onClear?: () => void;
  onFilterPress?: () => void;
  showFilter?: boolean;
  filterActive?: boolean;
  containerClassName?: string;
}

export function SearchBar({
  value,
  onChangeText,
  onClear,
  onFilterPress,
  showFilter = false,
  filterActive = false,
  placeholder = 'Search products, brands, categories...',
  containerClassName = '',
  ...props
}: SearchBarProps) {
  const { isDark } = useTheme();

  const handleClear = () => {
    onChangeText?.('');
    onClear?.();
  };

  const hasValue = Boolean(value && value.length > 0);

  return (
    <View className={`flex-row items-center gap-2 w-full ${containerClassName}`}>
      <View className="flex-1 flex-row items-center bg-slate-100 dark:bg-slate-800/80 px-3.5 py-2 min-h-[46px] rounded-card border border-transparent dark:border-slate-700/50">
        <Search
          size={18}
          color={isDark ? '#94A3B8' : '#64748B'}
          style={{ marginRight: 8 }}
        />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
          className="flex-1 text-body text-text-primary dark:text-slate-100 py-1"
          returnKeyType="search"
          {...props}
        />
        {hasValue && (
          <TouchableOpacity
            onPress={handleClear}
            activeOpacity={0.7}
            className="p-1 rounded-full bg-slate-200 dark:bg-slate-700"
          >
            <X size={14} color={isDark ? '#CBD5E1' : '#475569'} />
          </TouchableOpacity>
        )}
      </View>

      {showFilter && (
        <TouchableOpacity
          onPress={onFilterPress}
          activeOpacity={0.8}
          className={`min-h-[46px] min-w-[46px] items-center justify-center rounded-card border ${
            filterActive
              ? 'bg-primary border-primary'
              : 'bg-surface dark:bg-slate-800 border-border dark:border-slate-700'
          }`}
        >
          <SlidersHorizontal
            size={18}
            color={filterActive ? '#FFFFFF' : isDark ? '#F8FAFC' : '#0F172A'}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}
