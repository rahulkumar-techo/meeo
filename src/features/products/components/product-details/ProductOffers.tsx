import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Tag, ChevronDown, ChevronUp, AlertCircle, Zap, IndianRupee } from 'lucide-react-native';
import { useTheme } from '@/theme';
import { useGetActivePromotions, usePreviewCartPromotions } from '../../hooks/promo.hook';
import ApplyPromotion from '../ApplyPromotion';
import type { ActivePromotion, CartPreviewData, PromotionType } from '../../types/promo.type';

const VISIBLE_COUNT = 2;

export interface ProductOffersContentProps {
  productId: string;
  variantId?: string | null;
  categoryId?: string | null;
  brandId?: string | null;
  productName: string;
  unitPrice: number;
  quantity: number;
}

function getTagStyle(type: PromotionType): { tagColor: string; tagBg: string; label: string } {
  switch (type) {
    case 'PERCENTAGE':
    case 'FLASH_SALE':
      return { tagColor: '#DC2626', tagBg: '#FEF2F2', label: 'Sale' };
    case 'FIXED_DISCOUNT':
      return { tagColor: '#2563EB', tagBg: '#EFF6FF', label: 'Discount' };
    case 'FREE_SHIPPING':
      return { tagColor: '#7C3AED', tagBg: '#F5F3FF', label: 'Free Shipping' };
    case 'PRODUCT_DISCOUNT':
      return { tagColor: '#059669', tagBg: '#ECFDF5', label: 'Product Offer' };
    case 'CATEGORY_DISCOUNT':
      return { tagColor: '#D97706', tagBg: '#FFFBEB', label: 'Category Deal' };
    case 'BRAND_DISCOUNT':
      return { tagColor: '#0891B2', tagBg: '#ECFEFF', label: 'Brand Deal' };
    case 'BUY_X_GET_Y':
      return { tagColor: '#9333EA', tagBg: '#FAF5FF', label: 'Buy & Get' };
    default:
      return { tagColor: '#64748B', tagBg: '#F8FAFC', label: 'Offer' };
  }
}

function formatDiscount(promotion: ActivePromotion): string {
  const value = promotion.discountValue ? parseFloat(promotion.discountValue) : null;
  if (!value) return promotion.name;

  switch (promotion.type) {
    case 'PERCENTAGE':
    case 'FLASH_SALE':
    case 'PRODUCT_DISCOUNT':
    case 'CATEGORY_DISCOUNT':
    case 'BRAND_DISCOUNT':
      return `${value}% off - ${promotion.name}`;
    case 'FIXED_DISCOUNT':
      return `Rs.${value} off - ${promotion.name}`;
    case 'FREE_SHIPPING':
      return `Free Shipping - ${promotion.name}`;
    case 'BUY_X_GET_Y':
      return `Buy & Get Deal - ${promotion.name}`;
    default:
      return promotion.name;
  }
}

function PriceBreakdown({
  preview,
  isDark,
  label,
}: {
  preview: CartPreviewData;
  isDark: boolean;
  label?: string;
}) {
  const subTextColor = isDark ? '#64748B' : '#94A3B8';

  return (
    <View
      style={[
        styles.summaryBox,
        { borderColor: '#16A34A', backgroundColor: isDark ? '#052e16' : '#F0FDF4' },
      ]}
    >
      {label && (
        <Text style={[styles.summaryTitle, { color: isDark ? '#4ADE80' : '#15803D' }]}>
          {label}
        </Text>
      )}
      <View style={styles.summaryRow}>
        <Text style={[styles.summaryLabel, { color: subTextColor }]}>Original price</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 1 }}>
          <IndianRupee size={11} color={isDark ? '#F8FAFC' : '#0F172A'} strokeWidth={2.5} />
          <Text style={[styles.summaryValue, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>{preview.originalSubtotal.toFixed(2)}</Text>
        </View>
      </View>
      {preview.totalDiscount > 0 && (
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: subTextColor }]}>Discount</Text>
          <Text style={[styles.summaryValue, { color: '#16A34A' }]}>
            -{preview.totalDiscount.toFixed(2)}
          </Text>
        </View>
      )}
      {preview.isFreeShipping && (
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: subTextColor }]}>Shipping</Text>
          <Text style={[styles.summaryValue, { color: '#7C3AED' }]}>Free</Text>
        </View>
      )}
      <View style={[styles.summaryRow, styles.summaryTotal, { borderTopColor: '#16A34A' }]}>
        <Text style={[styles.summaryTotalLabel, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
          Grand Total
        </Text>
        <Text style={[styles.summaryTotalValue, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
          {preview.grandTotal.toFixed(2)}
        </Text>
      </View>
    </View>
  );
}

export function ProductOffersContent({
  productId,
  variantId,
  categoryId,
  brandId,
  productName,
  unitPrice,
  quantity,
}: ProductOffersContentProps) {
  const { isDark } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [autoPreview, setAutoPreview] = useState<CartPreviewData | null>(null);
  const [codePreview, setCodePreview] = useState<CartPreviewData | null>(null);

  const { data, isLoading, isError } = useGetActivePromotions();
  const { mutate: previewCart, isPending: isAutoPreviewing } = usePreviewCartPromotions();

  const promotions = data?.data ?? [];
  const borderColor = isDark ? '#1E293B' : '#E2E8F0';
  const subTextColor = isDark ? '#64748B' : '#94A3B8';

  const buildCartItem = () => ({
    productId,
    variantId: variantId ?? null,
    categoryId: categoryId ?? null,
    brandId: brandId ?? null,
    productName,
    unitPrice,
    quantity,
  });

  // Auto-preview on mount and whenever quantity/price changes
  useEffect(() => {
    if (!productId || unitPrice <= 0) return;

    previewCart(
      { items: [buildCartItem()], shippingFee: 0 },
      {
        onSuccess: (res) => {
          if (res.data.totalDiscount > 0 || res.data.isFreeShipping) {
            setAutoPreview(res.data);
          } else {
            setAutoPreview(null);
          }
        },
        onError: () => setAutoPreview(null),
      }
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, variantId, unitPrice, quantity]);

  const handleCodeApplied = (preview: CartPreviewData) => {
    setCodePreview(preview);
    setAutoPreview(null);
  };

  const handleCodeRemoved = () => {
    setCodePreview(null);
    if (!productId || unitPrice <= 0) return;
    previewCart(
      { items: [buildCartItem()], shippingFee: 0 },
      {
        onSuccess: (res) => {
          if (res.data.totalDiscount > 0 || res.data.isFreeShipping) {
            setAutoPreview(res.data);
          }
        },
        onError: () => {},
      }
    );
  };

  // Code preview takes priority; fall back to auto preview
  const activePreview = codePreview ?? autoPreview;

  return (
    <View style={styles.root}>
      <ApplyPromotion
        productId={productId}
        variantId={variantId}
        categoryId={categoryId}
        brandId={brandId}
        productName={productName}
        unitPrice={unitPrice}
        quantity={quantity}
        // onApplied={handleCodeApplied}
        onRemoved={handleCodeRemoved}
      />

      <View style={[styles.divider, { backgroundColor: borderColor }]} />

      {/* Loading spinner for auto-preview (only when no code preview active) */}
      {!codePreview && isAutoPreviewing && (
        <View style={styles.centered}>
          <ActivityIndicator size="small" color="#2563EB" />
        </View>
      )}

      {/* Silent auto-discount badge */}
      {!codePreview && autoPreview && autoPreview.appliedPromotions.length > 0 && (
        <View
          style={[
            styles.autoBanner,
            { backgroundColor: isDark ? '#0C1A2E' : '#EFF6FF', borderColor: '#2563EB' },
          ]}
        >
          <Zap size={13} color="#2563EB" />
          <Text style={[styles.autoBannerText, { color: isDark ? '#93C5FD' : '#1D4ED8' }]}>
            {autoPreview.appliedPromotions.map((p) => p.name).join(' + ')} applied automatically
          </Text>
        </View>
      )}

      {/* Promotions list */}
      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="small" color="#2563EB" />
        </View>
      ) : isError ? (
        <View style={styles.centered}>
          <AlertCircle size={16} color="#94A3B8" />
          <Text style={[styles.emptyText, { color: subTextColor }]}>Could not load offers</Text>
        </View>
      ) : promotions.length === 0 ? (
        <View style={styles.centered}>
          <Text style={[styles.emptyText, { color: subTextColor }]}>No active offers right now</Text>
        </View>
      ) : (
        <>
          {(isExpanded ? promotions : promotions.slice(0, VISIBLE_COUNT)).map((promo) => {
            const { tagColor, tagBg, label } = getTagStyle(promo.type);
            return (
              <View
                key={promo.id}
                style={[styles.row, { borderColor, backgroundColor: isDark ? '#0F172A' : '#FFFFFF' }]}
              >
                <View style={[styles.tagPill, { backgroundColor: isDark ? '#1E293B' : tagBg }]}>
                  <Tag size={10} color={tagColor} />
                  <Text style={[styles.tagLabel, { color: tagColor }]}>{label}</Text>
                </View>
                <View style={styles.offerBody}>
                  <Text style={[styles.offerTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                    {formatDiscount(promo)}
                  </Text>
                  {promo.description ? (
                    <Text style={[styles.offerSub, { color: subTextColor }]}>{promo.description}</Text>
                  ) : null}
                </View>
              </View>
            );
          })}

          {promotions.length > VISIBLE_COUNT && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setIsExpanded((prev) => !prev)}
              style={styles.toggleBtn}
            >
              <Text style={styles.toggleText}>
                {isExpanded ? 'Show less' : `+${promotions.length - VISIBLE_COUNT} more offers`}
              </Text>
              {isExpanded ? (
                <ChevronUp size={14} color="#2563EB" />
              ) : (
                <ChevronDown size={14} color="#2563EB" />
              )}
            </TouchableOpacity>
          )}
        </>
      )}

      {/* Price breakdown for both auto and code-applied */}
      {activePreview && (
        <PriceBreakdown
          preview={activePreview}
          isDark={isDark}
          label={codePreview ? 'Price Breakdown' : 'Auto Discount Applied'}
        />
      )}
    </View>
  );
}

// Kept for backward-compat
export function ProductOffers() {
  return <ProductOffersContent productId="" productName="" unitPrice={0} quantity={1} />;
}

const styles = StyleSheet.create({
  root: { gap: 10 },
  divider: { height: 1, marginVertical: 2 },
  centered: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  emptyText: { fontSize: 13 },
  autoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  autoBannerText: { fontSize: 12, fontWeight: '600', flex: 1 },
  row: { borderWidth: 1, borderRadius: 10, padding: 12, gap: 6 },
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
  offerBody: { gap: 2 },
  offerTitle: { fontSize: 13, fontWeight: '700', lineHeight: 18 },
  offerSub: { fontSize: 12 },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingVertical: 4,
  },
  toggleText: { fontSize: 13, fontWeight: '700', color: '#2563EB' },
  summaryBox: { borderWidth: 1, borderRadius: 10, padding: 12, gap: 6 },
  summaryTitle: { fontSize: 12, fontWeight: '700', marginBottom: 2 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryLabel: { fontSize: 13 },
  summaryValue: { fontSize: 13, fontWeight: '600' },
  summaryTotal: { borderTopWidth: 1, paddingTop: 6, marginTop: 2 },
  summaryTotalLabel: { fontSize: 14, fontWeight: '700' },
  summaryTotalValue: { fontSize: 14, fontWeight: '700' },
});

export default ProductOffers;
