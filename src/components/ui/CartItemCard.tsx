import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { Plus, Minus, Trash2 } from 'lucide-react-native';
import { useTheme } from '../../theme';

export interface CartItemCardProps {
  id: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl?: string | ImageSourcePropType;
  variantInfo?: string;
  onIncrement?: () => void;
  onDecrement?: () => void;
  onRemove?: () => void;
  className?: string;
}

export function CartItemCard({
  title,
  price,
  quantity,
  imageUrl,
  variantInfo,
  onIncrement,
  onDecrement,
  onRemove,
  className = '',
}: CartItemCardProps) {
  const { isDark } = useTheme();

  const imageSource =
    typeof imageUrl === 'string'
      ? { uri: imageUrl }
      : imageUrl || {
          uri: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
        };

  return (
    <View
      className={`flex-row p-3.5 rounded-card bg-surface dark:bg-slate-800/90 border border-border dark:border-slate-700/60 gap-3.5 shadow-sm ${className}`}
    >
      <View className="w-20 h-20 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700">
        <Image
          source={imageSource}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>

      <View className="flex-1 justify-between py-0.5">
        <View className="flex-row items-start justify-between">
          <View className="flex-1 pr-2">
            <Text
              numberOfLines={1}
              className="text-body font-semibold text-text-primary dark:text-slate-100"
            >
              {title}
            </Text>
            {variantInfo && (
              <Text className="text-caption text-text-secondary dark:text-slate-400 mt-0.5">
                {variantInfo}
              </Text>
            )}
          </View>

          {onRemove && (
            <TouchableOpacity
              onPress={onRemove}
              activeOpacity={0.7}
              className="p-1 -mr-1"
            >
              <Trash2 size={16} color="#DC2626" />
            </TouchableOpacity>
          )}
        </View>

        <View className="flex-row items-center justify-between mt-2">
          <Text className="text-body font-bold text-text-primary dark:text-slate-100">
            ${(price * quantity).toFixed(2)}
          </Text>

          {/* Stepper */}
          <View className="flex-row items-center bg-slate-100 dark:bg-slate-700/80 rounded-lg p-0.5 border border-border/50 dark:border-slate-600/50">
            <TouchableOpacity
              onPress={onDecrement}
              activeOpacity={0.7}
              disabled={quantity <= 1}
              className={`w-7 h-7 items-center justify-center rounded-md bg-surface dark:bg-slate-800 ${
                quantity <= 1 ? 'opacity-40' : ''
              }`}
            >
              <Minus size={13} color={isDark ? '#F8FAFC' : '#0F172A'} />
            </TouchableOpacity>

            <Text className="text-body-sm font-bold text-text-primary dark:text-slate-100 min-w-[28px] text-center">
              {quantity}
            </Text>

            <TouchableOpacity
              onPress={onIncrement}
              activeOpacity={0.7}
              className="w-7 h-7 items-center justify-center rounded-md bg-surface dark:bg-slate-800"
            >
              <Plus size={13} color={isDark ? '#F8FAFC' : '#0F172A'} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
