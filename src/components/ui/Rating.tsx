import React from 'react';
import { View, Text, TouchableOpacity, ViewProps } from 'react-native';
import { Star } from 'lucide-react-native';
import { useTheme } from '../../theme';

export interface RatingProps extends ViewProps {
  rating: number;
  maxRating?: number;
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
  showStars?: boolean;
  showScore?: boolean;
  compact?: boolean;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
}

export function Rating({
  rating,
  maxRating = 5,
  reviewCount,
  size = 'md',
  showStars = true,
  showScore = true,
  compact = false,
  interactive = false,
  onRatingChange,
  className = '',
  ...props
}: RatingProps) {
  const { isDark } = useTheme();

  const iconSizes = {
    sm: 12,
    md: 15,
    lg: 20,
  }[size];

  const textSizes = {
    sm: 'text-caption',
    md: 'text-body-sm',
    lg: 'text-body',
  }[size];

  if (compact) {
    return (
      <View
        className={`flex-row items-center bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md gap-1 ${className}`}
        {...props}
      >
        <Star size={12} color="#F59E0B" fill="#F59E0B" />
        <Text className="text-caption font-bold text-amber-700 dark:text-amber-400">
          {rating.toFixed(1)}
        </Text>
        {typeof reviewCount === 'number' && (
          <Text className="text-[10px] text-text-secondary dark:text-slate-400">
            ({reviewCount > 999 ? `${(reviewCount / 1000).toFixed(1)}k` : reviewCount})
          </Text>
        )}
      </View>
    );
  }

  return (
    <View className={`flex-row items-center gap-1.5 ${className}`} {...props}>
      {showStars && (
        <View className="flex-row items-center gap-0.5">
          {Array.from({ length: maxRating }).map((_, index) => {
            const starValue = index + 1;
            const isFilled = rating >= starValue;
            const isHalf = rating >= starValue - 0.5 && rating < starValue;

            const StarIcon = (
              <Star
                key={index}
                size={iconSizes}
                color={isFilled || isHalf ? '#F59E0B' : isDark ? '#334155' : '#CBD5E1'}
                fill={isFilled ? '#F59E0B' : isHalf ? '#F59E0B' : 'transparent'}
              />
            );

            if (interactive && onRatingChange) {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => onRatingChange(starValue)}
                  activeOpacity={0.7}
                >
                  {StarIcon}
                </TouchableOpacity>
              );
            }

            return StarIcon;
          })}
        </View>
      )}

      {showScore && (
        <Text className={`${textSizes} font-bold text-text-primary dark:text-slate-100 ml-0.5`}>
          {rating.toFixed(1)}
        </Text>
      )}

      {typeof reviewCount === 'number' && (
        <Text className={`${textSizes} text-text-secondary dark:text-slate-400`}>
          ({reviewCount.toLocaleString()} {reviewCount === 1 ? 'review' : 'reviews'})
        </Text>
      )}
    </View>
  );
}
