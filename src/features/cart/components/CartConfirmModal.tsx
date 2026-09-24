import React, { useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Trash2, AlertCircle, AlertTriangle } from 'lucide-react-native';
import { useTheme } from '@/theme';

export interface CartConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  type?: 'danger' | 'warning' | 'primary';
  itemName?: string;
}

export function CartConfirmModal({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Remove',
  cancelText = 'Keep Item',
  isLoading = false,
  type = 'danger',
  itemName,
}: CartConfirmModalProps) {
  const { theme, isDark } = useTheme();

  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      scale.value = withSpring(1, { damping: 20, stiffness: 300 });
      opacity.value = withTiming(1, { duration: 150 });
    } else {
      scale.value = withTiming(0.9, { duration: 120 });
      opacity.value = withTiming(0, { duration: 120 });
    }
  }, [visible, opacity, scale]);

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const isDanger = type === 'danger';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={isLoading ? undefined : onClose}
    >
      <View style={styles.backdropContainer}>
        {/* Backdrop Tap */}
        <TouchableWithoutFeedback onPress={isLoading ? undefined : onClose}>
          <View
            style={[
              styles.backdrop,
              {
                backgroundColor: isDark
                  ? 'rgba(0, 0, 0, 0.75)'
                  : 'rgba(15, 23, 42, 0.55)',
              },
            ]}
          />
        </TouchableWithoutFeedback>

        {/* Modal Card */}
        <Animated.View
          style={[
            styles.card,
            {
              backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
              borderColor: isDark ? '#334155' : '#E2E8F0',
            },
            animatedCardStyle,
          ]}
        >
          {/* Top Icon Badge */}
          <View
            style={[
              styles.iconWrapper,
              {
                backgroundColor: isDanger
                  ? 'rgba(239, 68, 68, 0.12)'
                  : 'rgba(37, 99, 235, 0.12)',
              },
            ]}
          >
            {isDanger ? (
              <Trash2 size={24} color="#EF4444" strokeWidth={2.2} />
            ) : type === 'warning' ? (
              <AlertTriangle size={24} color="#F59E0B" strokeWidth={2.2} />
            ) : (
              <AlertCircle size={24} color={theme.primary} strokeWidth={2.2} />
            )}
          </View>

          {/* Title & Message */}
          <View style={styles.textContainer}>
            <Text
              style={[
                styles.title,
                { color: isDark ? '#F8FAFC' : '#0F172A' },
              ]}
            >
              {title}
            </Text>

            {itemName && (
              <Text
                numberOfLines={1}
                style={[
                  styles.itemNameText,
                  { color: isDark ? '#94A3B8' : '#475569' },
                ]}
              >
                "{itemName}"
              </Text>
            )}

            <Text
              style={[
                styles.message,
                { color: isDark ? '#94A3B8' : '#64748B' },
              ]}
            >
              {message}
            </Text>
          </View>

          {/* Action Buttons Row */}
          <View style={styles.buttonRow}>
            {/* Cancel / Keep Button */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onClose}
              disabled={isLoading}
              style={[
                styles.cancelBtn,
                {
                  backgroundColor: isDark ? '#0F172A' : '#F1F5F9',
                  borderColor: isDark ? '#334155' : '#E2E8F0',
                },
              ]}
            >
              <Text
                style={[
                  styles.cancelBtnText,
                  { color: isDark ? '#E2E8F0' : '#475569' },
                ]}
              >
                {cancelText}
              </Text>
            </TouchableOpacity>

            {/* Confirm / Delete Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onConfirm}
              disabled={isLoading}
              style={[
                styles.confirmBtn,
                {
                  backgroundColor: isDanger ? '#EF4444' : theme.primary,
                },
              ]}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.confirmBtnText}>{confirmText}</Text>
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdropContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 24,
    borderWidth: 1,
    padding: 22,
    alignItems: 'center',
    gap: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.18,
        shadowRadius: 20,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  iconWrapper: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    alignItems: 'center',
    gap: 6,
    width: '100%',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  itemNameText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  message: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    marginTop: 6,
  },
  cancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  confirmBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});

export default CartConfirmModal;
