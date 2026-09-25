import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ArrowLeft, ShoppingBag, Bell, Moon, Sun } from 'lucide-react-native';
import { useTheme } from '../../theme';

export interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  cartCount?: number;
  onCartPress?: () => void;
  notificationCount?: number;
  onNotificationPress?: () => void;
  showThemeToggle?: boolean;
  rightAction?: React.ReactNode;
  className?: string;
}

export function Header({
  title = 'Meeo',
  showBack = false,
  onBack,
  cartCount,
  onCartPress,
  notificationCount,
  onNotificationPress,
  showThemeToggle = false,
  rightAction,
  className = '',
}: HeaderProps) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <View
      className={`flex-row items-center justify-between px-4 py-3 bg-surface/90 dark:bg-slate-900/90 border-b border-border/80 dark:border-slate-800 ${className}`}
    >
      {/* Left side: Back Button or Brand Title */}
      <View className="flex-row items-center gap-3">
        {showBack && (
          <TouchableOpacity
            onPress={onBack}
            activeOpacity={0.7}
            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center -ml-1"
          >
            <ArrowLeft size={20} color={isDark ? '#F8FAFC' : '#0F172A'} />
          </TouchableOpacity>
        )}

        <Text className="text-h2 font-bold text-text-primary dark:text-slate-100 tracking-tight">
          {title}
        </Text>
      </View>

      {/* Right side actions */}
      <View className="flex-row items-center gap-2">
        {showThemeToggle && (
          <TouchableOpacity
            onPress={toggleTheme}
            activeOpacity={0.7}
            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center"
          >
            {isDark ? (
              <Sun size={18} color="#F59E0B" />
            ) : (
              <Moon size={18} color="#64748B" />
            )}
          </TouchableOpacity>
        )}

        {typeof notificationCount === 'number' && (
          <TouchableOpacity
            onPress={onNotificationPress}
            activeOpacity={0.7}
            className="relative w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center"
          >
            <Bell size={18} color={isDark ? '#F8FAFC' : '#0F172A'} />
            {notificationCount > 0 && (
              <View className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-error items-center justify-center">
                <Text className="text-[9px] font-bold text-white">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )}

        {typeof cartCount === 'number' && (
          <TouchableOpacity
            onPress={onCartPress}
            activeOpacity={0.7}
            className="relative w-10 h-10 rounded-full bg-primary-light/80 dark:bg-stone-900 items-center justify-center"
          >
            <ShoppingBag size={18} color="#2D2621" />
            {cartCount > 0 && (
              <View className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-primary items-center justify-center">
                <Text className="text-[10px] font-bold text-white">
                  {cartCount > 99 ? '99+' : cartCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )}

        {rightAction}
      </View>
    </View>
  );
}
