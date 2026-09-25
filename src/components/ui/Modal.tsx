import React from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
import { Button, ButtonVariant } from './Button';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  isConfirmLoading?: boolean;
  confirmVariant?: ButtonVariant;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  icon,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  isConfirmLoading = false,
  confirmVariant = 'primary',
}: ModalProps) {
  return (
    <RNModal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center p-6">
        {/* Backdrop */}
        <TouchableWithoutFeedback onPress={onClose}>
          <View className="absolute inset-0 bg-black/60" />
        </TouchableWithoutFeedback>

        {/* Modal Card */}
        <View className="w-full max-w-sm bg-surface dark:bg-slate-900 rounded-card p-5 border border-border dark:border-slate-800 shadow-xl gap-4">
          {icon && <View className="self-center mb-1">{icon}</View>}

          <View className="gap-1.5 items-center text-center">
            <Text className="text-h3 font-bold text-text-primary dark:text-slate-100 text-center">
              {title}
            </Text>
            {description && (
              <Text className="text-body text-text-secondary dark:text-slate-400 text-center">
                {description}
              </Text>
            )}
          </View>

          {children}

          <View className="flex-row items-center gap-2.5 pt-2">
            <Button
              variant="outline"
              size="md"
              onPress={onClose}
              className="flex-1"
            >
              {cancelText}
            </Button>

            {onConfirm && (
              <Button
                variant={confirmVariant}
                size="md"
                onPress={onConfirm}
                isLoading={isConfirmLoading}
                className="flex-1"
              >
                {confirmText}
              </Button>
            )}
          </View>
        </View>
      </View>
    </RNModal>
  );
}
