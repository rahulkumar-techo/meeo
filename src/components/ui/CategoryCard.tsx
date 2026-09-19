import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  Image,
  ImageSourcePropType,
  TouchableOpacityProps,
} from 'react-native';

export type CategoryCardVariant = 'circle' | 'tile' | 'pill';

export interface CategoryCardProps extends TouchableOpacityProps {
  label: string;
  itemCount?: number;
  imageUrl?: string | ImageSourcePropType;
  icon?: React.ReactNode;
  variant?: CategoryCardVariant;
  selected?: boolean;
  className?: string;
}

export function CategoryCard({
  label,
  itemCount,
  imageUrl,
  icon,
  variant = 'circle',
  selected = false,
  className = '',
  ...props
}: CategoryCardProps) {
  const imageSource =
    typeof imageUrl === 'string'
      ? { uri: imageUrl }
      : imageUrl || {
          uri: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&q=80',
        };

  if (variant === 'pill') {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        className={`flex-row items-center px-4 py-2 rounded-pill border gap-2 ${
          selected
            ? 'bg-primary border-primary'
            : 'bg-surface dark:bg-slate-800 border-border dark:border-slate-700'
        } ${className}`}
        {...props}
      >
        {icon && <View>{icon}</View>}
        <Text
          className={`text-body-sm font-semibold ${
            selected ? 'text-white' : 'text-text-primary dark:text-slate-200'
          }`}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  }

  if (variant === 'tile') {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        className={`p-3 rounded-card bg-surface dark:bg-slate-800/90 border ${
          selected
            ? 'border-primary ring-1 ring-primary'
            : 'border-border dark:border-slate-700/60'
        } items-center justify-center gap-2 shadow-sm ${className}`}
        {...props}
      >
        <View className="w-14 h-14 rounded-xl bg-primary-light/50 dark:bg-blue-950/50 items-center justify-center overflow-hidden">
          {icon ? (
            icon
          ) : (
            <Image
              source={imageSource}
              className="w-full h-full"
              resizeMode="cover"
            />
          )}
        </View>

        <View className="items-center">
          <Text
            numberOfLines={1}
            className="text-body-sm font-semibold text-text-primary dark:text-slate-100"
          >
            {label}
          </Text>
          {typeof itemCount === 'number' && (
            <Text className="text-caption text-text-secondary dark:text-slate-400">
              {itemCount} items
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  // Default: circle
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className={`items-center gap-1.5 ${className}`}
      {...props}
    >
      <View
        className={`w-16 h-16 rounded-full p-0.5 border-2 ${
          selected
            ? 'border-primary'
            : 'border-transparent bg-slate-100 dark:bg-slate-800'
        } items-center justify-center overflow-hidden shadow-sm`}
      >
        {icon ? (
          <View className="w-full h-full rounded-full bg-primary-light/50 dark:bg-blue-950/60 items-center justify-center">
            {icon}
          </View>
        ) : (
          <Image
            source={imageSource}
            className="w-full h-full rounded-full"
            resizeMode="cover"
          />
        )}
      </View>

      <Text
        numberOfLines={1}
        className="text-caption font-semibold text-text-primary dark:text-slate-200 text-center max-w-[72px]"
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
