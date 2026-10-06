import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Package,
  Heart,
  CreditCard,
  MapPin,
  Bell,
  Moon,
  Sun,
  ShieldCheck,
  HelpCircle,
  LogOut,
  ChevronRight,
} from 'lucide-react-native';
import { Screen } from '@/components/layout';
import { Button, Switch } from '@/components/ui';
import { useAuthStore, useLogout } from '@/features/auth';
import { usePushNotifications } from '@/features/notifications';
import { useTheme } from '@/theme';
import { AppRoute } from '@/routes';

export default function AccountScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { isDark, toggleTheme } = useTheme();
  const logoutMutation = useLogout();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { permissionStatus, requestPermission } = usePushNotifications();

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logoutMutation.mutateAsync();
    } catch {
      // Ignored: logout state reset is already handled internally
    } finally {
      setIsLoggingOut(false);
      router.replace(AppRoute.signIn as any);
    }
  };

  const handleNotificationPress = async () => {
    if (permissionStatus !== 'granted') {
      await requestPermission();
    }
  };

  const accountSections = [
    {
      title: 'Orders & Activity',
      items: [
        { label: 'My Orders', icon: Package },
        { label: 'Saved Wishlist', icon: Heart },
        { label: 'Payment Methods', icon: CreditCard },
        { label: 'Delivery Addresses', icon: MapPin },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          label: 'Notifications',
          icon: Bell,
          badge: permissionStatus === 'granted' ? 'Enabled' : 'Disabled',
          onPress: handleNotificationPress,
        },
        { label: 'Privacy & Security', icon: ShieldCheck },
        { label: 'Help & Support', icon: HelpCircle },
      ],
    },
  ];

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <Screen
      scroll
      safeArea={['top']}
      contentContainerStyle={{
        paddingBottom: 110,
      }}
    >
      {/* Profile Header */}
      <View className="px-5 pt-3 pb-5">
        <View className="p-5 rounded-3xl bg-primary dark:bg-surface-dark shadow-md">
          <View className="flex-row items-center gap-4">
            {user?.avatar ? (
              <Image
                source={{ uri: user.avatar }}
                className="w-16 h-16 rounded-full border-2 border-accent"
              />
            ) : (
              <View className="w-16 h-16 rounded-full bg-secondary items-center justify-center">
                <Text className="text-xl font-bold text-white">{userInitial}</Text>
              </View>
            )}

            <View className="flex-1">
              <Text className="text-h3 font-bold text-white">
                {user?.name || 'User Account'}
              </Text>
              {user?.email && (
                <Text className="text-body-sm text-[#D5CDC4]">
                  {user.email}
                </Text>
              )}
            </View>
          </View>
        </View>
      </View>

      {/* Dark Mode Toggle */}
      <View className="px-5 mb-4">
        <View className="p-4 rounded-2xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark flex-row items-center justify-between shadow-xs">
          <View className="flex-row items-center gap-3">
            <View className={`w-10 h-10 rounded-xl items-center justify-center ${isDark ? 'bg-primary/30' : 'bg-accent/15'}`}>
              {isDark ? (
                <Moon size={20} color="#E2B897" />
              ) : (
                <Sun size={20} color="#C27838" />
              )}
            </View>
            <View>
              <Text className="text-body-md font-semibold text-text-primary dark:text-text-primary-dark">
                Dark Mode
              </Text>
              <Text className="text-caption text-text-secondary dark:text-text-secondary-dark">
                {isDark ? 'Dark theme active' : 'Light theme active'}
              </Text>
            </View>
          </View>

          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            activeTrackColor="#C27838"
            inactiveTrackColor="#D5CDC4"
          />
        </View>
      </View>

      {/* Account Menu Sections */}
      <View className="px-5 gap-5 mb-5">
        {accountSections.map((section, idx) => (
          <View key={idx}>
            <Text className="text-caption font-bold uppercase tracking-wider text-text-muted dark:text-text-muted-dark mb-2 px-1">
              {section.title}
            </Text>

            <View className="rounded-2xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark divide-y divide-border dark:divide-border-dark shadow-xs overflow-hidden">
              {section.items.map((item, itemIdx) => {
                const Icon = item.icon;
                return (
                  <TouchableOpacity
                    key={itemIdx}
                    activeOpacity={0.7}
                    onPress={'onPress' in item ? (item as any).onPress : undefined}
                    className="flex-row items-center justify-between p-4"
                  >
                    <View className="flex-row items-center gap-3">
                      <Icon size={18} color={isDark ? '#A89F97' : '#786C64'} />
                      <Text className="text-body-md font-medium text-text-primary dark:text-text-primary-dark">
                        {item.label}
                      </Text>
                    </View>

                    <View className="flex-row items-center gap-2">
                      {'badge' in item && (
                        <View
                          className={`px-2 py-0.5 rounded-full ${
                            (item as any).badge === 'Enabled'
                              ? 'bg-emerald-100 dark:bg-emerald-950/60'
                              : 'bg-stone-200 dark:bg-stone-800'
                          }`}
                        >
                          <Text
                            className={`text-[11px] font-semibold ${
                              (item as any).badge === 'Enabled'
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-stone-500 dark:text-stone-400'
                            }`}
                          >
                            {(item as any).badge}
                          </Text>
                        </View>
                      )}
                      <ChevronRight size={16} color={isDark ? '#786C64' : '#A89F97'} />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
      </View>

      {/* Sign Out Button */}
      <View className="px-5 mb-4">
        <Button
          fullWidth
          size="lg"
          variant="outline"
          rounded="xl"
          isLoading={isLoggingOut}
          loadingText="Signing Out..."
          disabled={isLoggingOut}
          onPress={handleLogout}
          leftIcon={<LogOut size={16} color="#EF4444" />}
          className="border-red-200 dark:border-red-950 bg-red-50/40 dark:bg-red-950/20"
          textClassName="text-red-600 font-semibold"
        >
          Sign Out
        </Button>
      </View>
    </Screen>
  );
}
