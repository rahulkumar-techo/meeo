import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { X } from 'lucide-react-native';
import { useTheme } from '../../theme';

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxHeight?: number | string;
  showCloseButton?: boolean;
}

export function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
}: BottomSheetProps) {
  const { isDark } = useTheme();

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end">
        {/* Backdrop */}
        <TouchableWithoutFeedback onPress={onClose}>
          <View className="absolute inset-0 bg-black/60" />
        </TouchableWithoutFeedback>

        {/* Sheet Content */}
        <View className="w-full bg-surface dark:bg-slate-900 rounded-t-[24px] border-t border-border dark:border-slate-800 max-h-[85%] pb-8 pt-3 shadow-2xl">
          {/* Drag handle */}
          <View className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 self-center mb-3" />

          {/* Header */}
          {(title || showCloseButton) && (
            <View className="flex-row items-center justify-between px-5 pb-3 border-b border-border/60 dark:border-slate-800">
              <Text className="text-h3 font-bold text-text-primary dark:text-slate-100">
                {title || ''}
              </Text>

              {showCloseButton && (
                <TouchableOpacity
                  onPress={onClose}
                  activeOpacity={0.7}
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center -mr-1"
                >
                  <X size={16} color={isDark ? '#CBD5E1' : '#475569'} />
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Body */}
          <ScrollView
            className="px-5 pt-4"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
