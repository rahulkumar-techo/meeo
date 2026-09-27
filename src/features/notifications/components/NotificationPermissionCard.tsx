import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Bell, BellRing, CheckCircle2, Sparkles, X, Package, Tag } from 'lucide-react-native';
import { usePushNotifications } from '../hooks/usePushNotifications';
import { useTheme } from '@/theme';

export interface NotificationPermissionCardProps {
  onPermissionGranted?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export function NotificationPermissionCard({
  onPermissionGranted,
  onDismiss,
  className = '',
}: NotificationPermissionCardProps) {
  const { isDark } = useTheme();
  const {
    shouldShowPermissionCard,
    isRegistering,
    permissionStatus,
    requestPermission,
    dismissCard,
  } = usePushNotifications();

  // Do not render if already granted or explicitly dismissed
  if (!shouldShowPermissionCard) {
    return null;
  }

  const handleEnable = async () => {
    const success = await requestPermission();
    if (success && onPermissionGranted) {
      onPermissionGranted();
    }
  };

  const handleDismiss = () => {
    dismissCard();
    if (onDismiss) {
      onDismiss();
    }
  };

  return (
    <View
      className={`mx-4 my-3 p-5 rounded-3xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark shadow-sm overflow-hidden relative ${className}`}
    >
      {/* Background Accent Glow */}
      <View
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-accent/10 dark:bg-accent/5 pointer-events-none"
      />

      {/* Dismiss Button */}
      <TouchableOpacity
        onPress={handleDismiss}
        activeOpacity={0.7}
        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-background dark:bg-background-dark items-center justify-center border border-border/60 dark:border-border-dark/60 z-10"
        accessibilityLabel="Dismiss notification prompt"
      >
        <X size={16} color={isDark ? '#A89F97' : '#786C64'} />
      </TouchableOpacity>

      {/* Header Info */}
      <View className="flex-row items-start gap-3.5 pr-8">
        <View className="w-12 h-12 rounded-2xl bg-accent/15 dark:bg-accent/25 items-center justify-center border border-accent/20">
          <BellRing size={22} color="#C27838" />
        </View>

        <View className="flex-1">
          <View className="flex-row items-center gap-1.5 mb-1">
            <Text className="text-body-md font-bold text-text-primary dark:text-text-primary-dark">
              Stay in the Loop
            </Text>
            <Sparkles size={14} color="#F59E0B" />
          </View>
          <Text className="text-caption text-text-secondary dark:text-text-secondary-dark leading-4">
            Get instant updates on order deliveries, price drops, and exclusive flash deals.
          </Text>
        </View>
      </View>

      {/* Benefit Highlights */}
      <View className="mt-4 pt-3 border-t border-border/60 dark:border-border-dark/60 flex-row justify-between items-center">
        <View className="flex-row items-center gap-1.5">
          <Package size={14} color={isDark ? '#E2B897' : '#C27838'} />
          <Text className="text-caption font-medium text-text-secondary dark:text-text-secondary-dark">
            Order tracking
          </Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <Tag size={14} color={isDark ? '#E2B897' : '#C27838'} />
          <Text className="text-caption font-medium text-text-secondary dark:text-text-secondary-dark">
            Exclusive deals
          </Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <CheckCircle2 size={14} color="#10B981" />
          <Text className="text-caption font-medium text-text-secondary dark:text-text-secondary-dark">
            Fast alerts
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="mt-4 flex-row items-center gap-2.5">
        <TouchableOpacity
          onPress={handleEnable}
          disabled={isRegistering}
          activeOpacity={0.8}
          className="flex-1 py-3 px-4 rounded-xl bg-primary dark:bg-accent items-center justify-center shadow-xs flex-row gap-2"
        >
          {isRegistering ? (
            <>
              <ActivityIndicator size="small" color="#FFFFFF" />
              <Text className="text-body-sm font-semibold text-white">
                Enabling...
              </Text>
            </>
          ) : (
            <>
              <Bell size={16} color="#FFFFFF" />
              <Text className="text-body-sm font-semibold text-white">
                Enable Notifications
              </Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleDismiss}
          disabled={isRegistering}
          activeOpacity={0.7}
          className="py-3 px-4 rounded-xl bg-transparent items-center justify-center border border-border dark:border-border-dark"
        >
          <Text className="text-body-sm font-medium text-text-secondary dark:text-text-secondary-dark">
            Not Now
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default NotificationPermissionCard;
