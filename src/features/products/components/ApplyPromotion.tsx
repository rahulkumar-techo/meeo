import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { CheckCircle, XCircle, Tag, X, IndianRupee } from 'lucide-react-native';
import { useTheme } from '@/theme';
import { useValidatePromoCode, usePreviewCartPromotions } from '../hooks/promo.hook';
import { usePromoStore } from '@/features/cart/store/usePromoStore';
import type { CartPreviewItem } from '../types/promo.type';

interface ApplyPromotionProps {
  unitPrice: number;
  productId: string;
  variantId?: string | null;
  categoryId?: string | null;
  brandId?: string | null;
  productName: string;
  quantity: number;
  onSaved?: (code: string) => void;
  onRemoved?: () => void;
}

/** Inline icon + amount, safe alternative to the rupee glyph */
function RupeeAmount({ amount, color, style }: { amount: string; color: string; style?: object }) {
  return (
    <View style={styles.rupeeRow}>
      <IndianRupee size={11} color={color} strokeWidth={2.5} />
      <Text style={[style, { color }]}>{amount}</Text>
    </View>
  );
}

const ApplyPromotion = ({
  unitPrice,
  productId,
  variantId,
  categoryId,
  brandId,
  productName,
  quantity,
  onSaved,
  onRemoved,
}: ApplyPromotionProps) => {
  const { isDark } = useTheme();
  const { appliedCode, preview, setPromo, clearPromo } = usePromoStore();

  const [code, setCode] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { mutate: validateCode, isPending: isValidating } = useValidatePromoCode();
  const { mutate: previewCart, isPending: isPreviewing } = usePreviewCartPromotions();

  const isLoading = isValidating || isPreviewing;

  const cartItem: CartPreviewItem = {
    productId,
    variantId: variantId ?? null,
    categoryId: categoryId ?? null,
    brandId: brandId ?? null,
    productName,
    unitPrice,
    quantity,
  };

  const handleSave = () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;
    setErrorMsg(null);

    validateCode(
      { code: trimmed, subtotal: unitPrice * quantity },
      {
        onSuccess: (res) => {
          if (!res.data.valid || !res.data.promotion) {
            setErrorMsg('Invalid or expired promo code.');
            return;
          }
          previewCart(
            { promoCode: trimmed, shippingFee: 0, items: [cartItem] },
            {
              onSuccess: (previewRes) => {
                setPromo(trimmed, previewRes.data);
                setCode('');
                onSaved?.(trimmed);
              },
              onError: (err: any) => {
                setErrorMsg(err?.response?.data?.message || 'Could not apply this code. Try again.');
              },
            }
          );
        },
        onError: (err: any) => {
          setErrorMsg(err?.response?.data?.message || 'Invalid promo code.');
        },
      }
    );
  };

  const handleRemove = () => {
    clearPromo();
    setErrorMsg(null);
    setCode('');
    onRemoved?.();
  };

  const inputBg = isDark ? '#1E293B' : '#F8FAFC';
  const borderColor = isDark ? '#334155' : '#E2E8F0';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const subTextColor = isDark ? '#64748B' : '#94A3B8';
  const savingColor = isDark ? '#4ADE80' : '#15803D';

  if (appliedCode && preview) {
    const saving = preview.totalDiscount;
    return (
      <View style={styles.root}>
        <View
          style={[
            styles.savedRow,
            { backgroundColor: isDark ? '#052e16' : '#F0FDF4', borderColor: '#16A34A' },
          ]}
        >
          <CheckCircle size={15} color="#16A34A" />
          <View style={styles.savedBody}>
            <Text style={[styles.savedCode, { color: '#16A34A' }]}>
              "{appliedCode}" saved
            </Text>
            {saving > 0 && (
              <View style={styles.savingRow}>
                <Text style={[styles.savedSub, { color: savingColor }]}>Save </Text>
                <RupeeAmount amount={saving.toFixed(2)} color={savingColor} style={styles.savedSub} />
                <Text style={[styles.savedSub, { color: savingColor }]}> at checkout</Text>
              </View>
            )}
          </View>
          <TouchableOpacity onPress={handleRemove} hitSlop={8}>
            <X size={15} color="#64748B" />
          </TouchableOpacity>
        </View>

        {preview.appliedPromotions.map((promo) => (
          <View
            key={promo.id}
            style={[styles.promoRow, { borderColor, backgroundColor: inputBg }]}
          >
            <View style={[styles.tagPill, { backgroundColor: '#ECFDF5' }]}>
              <Tag size={10} color="#059669" />
              <Text style={[styles.tagLabel, { color: '#059669' }]}>Applied at Checkout</Text>
            </View>
            <View style={styles.promoBody}>
              <Text style={[styles.promoTitle, { color: textColor }]}>{promo.name}</Text>
              {promo.description ? (
                <Text style={[styles.promoSub, { color: subTextColor }]}>{promo.description}</Text>
              ) : null}
              {promo.isFreeShipping && (
                <Text style={[styles.promoSub, { color: '#7C3AED' }]}>+ Free Shipping</Text>
              )}
            </View>
          </View>
        ))}
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.inputRow}>
        <TextInput
          value={code}
          onChangeText={(t) => {
            setCode(t.toUpperCase());
            if (errorMsg) setErrorMsg(null);
          }}
          placeholder="Enter promo code"
          placeholderTextColor={subTextColor}
          autoCapitalize="characters"
          returnKeyType="done"
          onSubmitEditing={handleSave}
          editable={!isLoading}
          style={[
            styles.input,
            {
              backgroundColor: inputBg,
              borderColor: errorMsg ? '#EF4444' : borderColor,
              color: textColor,
            },
          ]}
        />
        <TouchableOpacity
          onPress={handleSave}
          activeOpacity={0.8}
          disabled={isLoading || !code.trim()}
          style={[styles.applyBtn, { opacity: isLoading || !code.trim() ? 0.6 : 1 }]}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.applyBtnText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      {errorMsg ? (
        <View style={styles.errorRow}>
          <XCircle size={13} color="#EF4444" />
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  root: { gap: 8 },
  rupeeRow: { flexDirection: 'row', alignItems: 'center' },
  savingRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  inputRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  input: {
    flex: 1,
    height: 42,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1,
  },
  applyBtn: {
    height: 42,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: '#1A3A6B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  errorRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  errorText: { fontSize: 12, color: '#EF4444', flex: 1 },
  savedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
  },
  savedBody: { flex: 1, gap: 2 },
  savedCode: { fontSize: 13, fontWeight: '700' },
  savedSub: { fontSize: 12, fontWeight: '500' },
  promoRow: { borderWidth: 1, borderRadius: 10, padding: 10, gap: 6 },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagLabel: { fontSize: 11, fontWeight: '700' },
  promoBody: { gap: 2 },
  promoTitle: { fontSize: 13, fontWeight: '700', lineHeight: 18 },
  promoSub: { fontSize: 12 },
});

export default ApplyPromotion;