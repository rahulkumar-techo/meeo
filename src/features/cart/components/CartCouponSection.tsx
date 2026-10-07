import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Tag, ChevronDown, ChevronUp, CheckCircle, XCircle, X, Ticket, IndianRupee } from 'lucide-react-native';
import { useTheme } from '@/theme';
import { useGetActivePromotions, useValidatePromoCode, usePreviewCartPromotions } from '@/features/products/hooks/promo.hook';
import { usePromoStore } from '../store/usePromoStore';
import type { ActivePromotion, CartPreviewItem } from '@/features/products/types/promo.type';
import type { CartItem } from '../types/cart.types';

interface CartCouponSectionProps {
  items: CartItem[];
  subtotal: number;
}

function buildCartItems(items: CartItem[]): CartPreviewItem[] {
  return items.map((item) => ({
    productId: item.productId || item.product?.id || '',
    variantId: item.variantId ?? null,
    categoryId:
      item.product?.categoryId ??
      (typeof item.product?.category === 'object' ? item.product?.category?.id : null) ??
      null,
    brandId:
      item.product?.brandId ??
      (typeof item.product?.brand === 'object' ? item.product?.brand?.id : null) ??
      null,
    productName: item.product?.name || 'Product',
    unitPrice: Number(item.unitPrice || item.price || 0),
    quantity: item.quantity || 1,
  }));
}

/** Rupee icon + amount — avoids encoding issues with the glyph */
function Rupee({ amount, size = 12, color }: { amount: string | number; size?: number; color: string }) {
  return (
    <View style={styles.rupeeRow}>
      <IndianRupee size={size} color={color} strokeWidth={2.5} />
      <Text style={{ fontSize: size + 1, fontWeight: '700', color }}>{amount}</Text>
    </View>
  );
}

export function CartCouponSection({ items, subtotal }: CartCouponSectionProps) {
  const { isDark } = useTheme();
  const { appliedCode, preview, setPromo, clearPromo } = usePromoStore();

  const [code, setCode] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showList, setShowList] = useState(false);

  const { data: activeData, isLoading: isLoadingActive } = useGetActivePromotions();
  const { mutate: validateCode, isPending: isValidating } = useValidatePromoCode();
  const { mutate: previewCart, isPending: isPreviewing } = usePreviewCartPromotions();

  const isLoading = isValidating || isPreviewing;
  const activePromotions = (activeData?.data ?? []).filter((p) => !p.isAutomatic && p.code);

  const inputBg = isDark ? '#1E293B' : '#F8FAFC';
  const borderColor = isDark ? '#334155' : '#E2E8F0';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const subTextColor = isDark ? '#64748B' : '#94A3B8';
  const cardBg = isDark ? '#0F172A' : '#FFFFFF';

  const applyCode = (codeToApply: string) => {
    const trimmed = codeToApply.trim().toUpperCase();
    if (!trimmed) return;
    setErrorMsg(null);

    validateCode(
      { code: trimmed, subtotal },
      {
        onSuccess: (res) => {
          if (!res.data.valid || !res.data.promotion) {
            setErrorMsg('Invalid or expired promo code.');
            return;
          }
          previewCart(
            { promoCode: trimmed, shippingFee: 0, items: buildCartItems(items) },
            {
              onSuccess: (previewRes) => {
                setPromo(trimmed, previewRes.data);
                setCode('');
                setShowList(false);
              },
              onError: (err: any) => {
                setErrorMsg(err?.response?.data?.message || 'Could not apply this code.');
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
  };

  const savingColor = isDark ? '#4ADE80' : '#15803D';

  // Applied state
  if (appliedCode && preview) {
    return (
      <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
        <View style={styles.cardHeader}>
          <Ticket size={15} color="#16A34A" />
          <Text style={[styles.cardTitle, { color: textColor }]}>Coupon Applied</Text>
        </View>

        <View
          style={[
            styles.appliedRow,
            { borderColor: '#16A34A', backgroundColor: isDark ? '#052e16' : '#F0FDF4' },
          ]}
        >
          <CheckCircle size={15} color="#16A34A" />
          <View style={styles.appliedBody}>
            <Text style={[styles.appliedCode, { color: '#16A34A' }]}>{`"${appliedCode}"`}</Text>
            {preview.totalDiscount > 0 && (
              <View style={styles.savingRow}>
                <Text style={[styles.appliedSaving, { color: savingColor }]}>You save </Text>
                <Rupee amount={preview.totalDiscount.toFixed(2)} size={11} color={savingColor} />
                <Text style={[styles.appliedSaving, { color: savingColor }]}> on this order</Text>
              </View>
            )}
            {preview.isFreeShipping && (
              <Text style={[styles.appliedSaving, { color: '#7C3AED' }]}>+ Free Shipping</Text>
            )}
          </View>
          <TouchableOpacity onPress={handleRemove} hitSlop={8}>
            <X size={15} color="#64748B" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Input + available coupons list
  return (
    <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
      <View style={styles.cardHeader}>
        <Ticket size={15} color={isDark ? '#94A3B8' : '#475569'} />
        <Text style={[styles.cardTitle, { color: textColor }]}>Apply Coupon</Text>
      </View>

      <View style={styles.inputRow}>
        <TextInput
          value={code}
          onChangeText={(t) => {
            setCode(t.toUpperCase());
            if (errorMsg) setErrorMsg(null);
          }}
          placeholder="Enter coupon code"
          placeholderTextColor={subTextColor}
          autoCapitalize="characters"
          returnKeyType="done"
          onSubmitEditing={() => applyCode(code)}
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
          onPress={() => applyCode(code)}
          activeOpacity={0.8}
          disabled={isLoading || !code.trim()}
          style={[styles.applyBtn, { opacity: isLoading || !code.trim() ? 0.6 : 1 }]}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.applyBtnText}>Apply</Text>
          )}
        </TouchableOpacity>
      </View>

      {errorMsg ? (
        <View style={styles.errorRow}>
          <XCircle size={13} color="#EF4444" />
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      ) : null}

      {!isLoadingActive && activePromotions.length > 0 && (
        <>
          <TouchableOpacity
            style={styles.toggleRow}
            activeOpacity={0.7}
            onPress={() => setShowList((p) => !p)}
          >
            <Text style={styles.toggleText}>
              {activePromotions.length} coupon{activePromotions.length > 1 ? 's' : ''} available
            </Text>
            {showList ? <ChevronUp size={14} color="#2563EB" /> : <ChevronDown size={14} color="#2563EB" />}
          </TouchableOpacity>

          {showList && (
            <View style={styles.couponList}>
              {activePromotions.map((promo) => (
                <CouponRow
                  key={promo.id}
                  promo={promo}
                  isDark={isDark}
                  borderColor={borderColor}
                  textColor={textColor}
                  subTextColor={subTextColor}
                  isLoading={isLoading}
                  onApply={() => promo.code && applyCode(promo.code)}
                />
              ))}
            </View>
          )}
        </>
      )}
    </View>
  );
}

function CouponRow({
  promo,
  isDark,
  borderColor,
  textColor,
  subTextColor,
  isLoading,
  onApply,
}: {
  promo: ActivePromotion;
  isDark: boolean;
  borderColor: string;
  textColor: string;
  subTextColor: string;
  isLoading: boolean;
  onApply: () => void;
}) {
  if (!promo.code) return null;

  const discountVal = promo.discountValue ? parseFloat(promo.discountValue) : null;

  return (
    <View style={[styles.couponRow, { borderColor, backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }]}>
      <View style={styles.couponLeft}>
        <View style={[styles.codeBadge, { backgroundColor: isDark ? '#1E293B' : '#EFF6FF' }]}>
          <Tag size={10} color="#2563EB" />
          <Text style={[styles.codeBadgeText, { color: '#2563EB' }]}>{promo.code}</Text>
        </View>

        {/* Discount label using Rupee icon where needed */}
        {promo.type === 'FREE_SHIPPING' ? (
          <Text style={[styles.couponDiscount, { color: textColor }]}>FREE SHIPPING</Text>
        ) : promo.type === 'FIXED_DISCOUNT' && discountVal ? (
          <View style={styles.discountRow}>
            <Rupee amount={`${discountVal} OFF`} size={12} color={isDark ? '#F8FAFC' : '#0F172A'} />
          </View>
        ) : discountVal ? (
          <Text style={[styles.couponDiscount, { color: textColor }]}>{discountVal}% OFF</Text>
        ) : (
          <Text style={[styles.couponDiscount, { color: textColor }]}>{promo.name}</Text>
        )}

        {promo.description ? (
          <Text style={[styles.couponDesc, { color: subTextColor }]} numberOfLines={1}>
            {promo.description}
          </Text>
        ) : null}
      </View>

      <TouchableOpacity
        onPress={onApply}
        disabled={isLoading}
        activeOpacity={0.8}
        style={styles.couponApplyBtn}
      >
        <Text style={styles.couponApplyText}>Apply</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 14, padding: 14, gap: 12 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  cardTitle: { fontSize: 14, fontWeight: '700' },
  inputRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  input: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1,
  },
  applyBtn: {
    height: 44,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: '#1A3A6B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  errorRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  errorText: { fontSize: 12, color: '#EF4444', flex: 1 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start' },
  toggleText: { fontSize: 13, fontWeight: '700', color: '#2563EB' },
  couponList: { gap: 8 },
  couponRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    gap: 10,
  },
  couponLeft: { flex: 1, gap: 3 },
  codeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  codeBadgeText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  discountRow: { flexDirection: 'row', alignItems: 'center' },
  couponDiscount: { fontSize: 13, fontWeight: '700' },
  couponDesc: { fontSize: 11 },
  couponApplyBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#2563EB',
  },
  couponApplyText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  appliedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
  },
  appliedBody: { flex: 1, gap: 3 },
  appliedCode: { fontSize: 13, fontWeight: '700' },
  savingRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  appliedSaving: { fontSize: 12, fontWeight: '600' },
  rupeeRow: { flexDirection: 'row', alignItems: 'center', gap: 1 },
});

export default CartCouponSection;