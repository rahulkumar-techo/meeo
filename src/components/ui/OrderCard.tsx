import React from 'react';
import { View, Text, Image } from 'react-native';
import { ArrowRight, Truck, CheckCircle2, Clock, AlertCircle } from 'lucide-react-native';
import { Badge, BadgeVariant } from './Badge';
import { Button } from './Button';

export type OrderStatus = 'delivered' | 'in_transit' | 'processing' | 'cancelled';

export interface OrderCardProps {
  orderId: string;
  date: string;
  status: OrderStatus;
  totalAmount: number;
  itemCount: number;
  itemImages?: string[];
  onTrackPress?: () => void;
  onDetailsPress?: () => void;
  className?: string;
}

export function OrderCard({
  orderId,
  date,
  status,
  totalAmount,
  itemCount,
  itemImages = [],
  onTrackPress,
  onDetailsPress,
  className = '',
}: OrderCardProps) {
  const statusConfig: Record<
    OrderStatus,
    { label: string; variant: BadgeVariant; icon: React.ReactNode }
  > = {
    delivered: {
      label: 'Delivered',
      variant: 'success',
      icon: <CheckCircle2 size={12} color="#16A34A" />,
    },
    in_transit: {
      label: 'In Transit',
      variant: 'primary',
      icon: <Truck size={12} color="#8C5338" />,
    },
    processing: {
      label: 'Processing',
      variant: 'warning',
      icon: <Clock size={12} color="#D97706" />,
    },
    cancelled: {
      label: 'Cancelled',
      variant: 'error',
      icon: <AlertCircle size={12} color="#DC2626" />,
    },
  };

  const currentStatus = statusConfig[status] || statusConfig.processing;

  return (
    <View
      className={`p-4 rounded-card bg-surface dark:bg-slate-800/90 border border-border dark:border-slate-700/60 shadow-sm gap-3.5 ${className}`}
    >
      {/* Top row: ID, Date, and Status */}
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-body-sm font-bold text-text-primary dark:text-slate-100">
            {orderId}
          </Text>
          <Text className="text-caption text-text-secondary dark:text-slate-400 mt-0.5">
            Placed on {date}
          </Text>
        </View>

        <Badge
          variant={currentStatus.variant}
          size="md"
          icon={currentStatus.icon}
        >
          {currentStatus.label}
        </Badge>
      </View>

      {/* Item thumbnails & count */}
      <View className="flex-row items-center justify-between py-1 border-y border-border/60 dark:border-slate-700/50">
        <View className="flex-row items-center gap-2">
          {itemImages.slice(0, 3).map((img, idx) => (
            <View
              key={idx}
              className="w-12 h-12 rounded-md overflow-hidden bg-slate-100 dark:bg-slate-700 border border-border/80 dark:border-slate-600"
            >
              <Image
                source={{ uri: img }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
          ))}
          {itemCount > 3 && (
            <View className="w-12 h-12 rounded-md bg-slate-100 dark:bg-slate-700 items-center justify-center border border-border dark:border-slate-600">
              <Text className="text-caption font-bold text-text-secondary dark:text-slate-300">
                +{itemCount - 3}
              </Text>
            </View>
          )}
        </View>

        <View className="items-end">
          <Text className="text-caption text-text-secondary dark:text-slate-400">
            Total ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </Text>
          <Text className="text-body font-bold text-text-primary dark:text-slate-100 mt-0.5">
            ${totalAmount.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="flex-row items-center justify-end gap-2 pt-0.5">
        <Button
          variant="outline"
          size="sm"
          onPress={onDetailsPress}
        >
          View Details
        </Button>

        {status === 'in_transit' && (
          <Button
            variant="primary"
            size="sm"
            onPress={onTrackPress}
            rightIcon={<ArrowRight size={14} color="#FFFFFF" />}
          >
            Track Order
          </Button>
        )}
      </View>
    </View>
  );
}
