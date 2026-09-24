import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { ShoppingBag, Trash2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';
import {
  useGetCart,
  useUpdateCartItem,
  useRemoveCartItem,
  useClearCart,
} from '../hooks/cart.hook';
import type { CartItem } from '../types/cart.types';
import {
  CartItemRow,
  CartSummaryCard,
  CartEmptyView,
  CartSkeleton,
  CartConfirmModal,
} from '../components';
import { ErrorState } from '@/components/ui/ErrorState';

export function CartScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();

  // State for Custom Confirmation Modals & Manual Pull-to-refresh
  const [itemToDelete, setItemToDelete] = useState<CartItem | null>(null);
  const [isClearModalVisible, setIsClearModalVisible] = useState(false);
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);

  // Queries and Mutations
  const { data, isLoading, isError, error, refetch } = useGetCart();
  const { mutate: updateQuantity } = useUpdateCartItem();
  const { mutate: removeItem, isPending: isRemoving } = useRemoveCartItem();
  const { mutate: clearCart, isPending: isClearing } = useClearCart();

  // Manual Pull-to-Refresh handler (Only shows spinner on manual gesture)
  const handleManualRefresh = useCallback(async () => {
    setIsManualRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsManualRefreshing(false);
    }
  }, [refetch]);

  // Robust items extraction supporting all response structures
  const items: CartItem[] = useMemo(() => {
    const raw = data as any;
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    if (Array.isArray(raw.items)) return raw.items;
    if (raw.data) {
      if (Array.isArray(raw.data)) return raw.data;
      if (Array.isArray(raw.data.items)) return raw.data.items;
      if (raw.data.data && Array.isArray(raw.data.data.items)) return raw.data.data.items;
      if (raw.data.cart && Array.isArray(raw.data.cart.items)) return raw.data.cart.items;
    }
    if (raw.cart && Array.isArray(raw.cart.items)) return raw.cart.items;
    return [];
  }, [data]);

  const subtotal = useMemo(() => {
    if (data?.data?.summary?.subtotal !== undefined) return data.data.summary.subtotal;
    if (data?.data?.subtotal !== undefined) return data.data.subtotal;
    return items.reduce((sum, item) => {
      const lineTotal = Number(
        item.lineTotal ?? (item.unitPrice ? item.unitPrice * (item.quantity || 1) : 0)
      );
      return sum + lineTotal;
    }, 0);
  }, [data, items]);

  const discount = useMemo(() => {
    return data?.data?.discount ?? 0;
  }, [data]);

  // Instant Optimistic Increment
  const handleIncrement = useCallback(
    (item: CartItem) => {
      updateQuantity({
        cartItemId: item.id,
        payload: { quantity: item.quantity + 1 },
      });
    },
    [updateQuantity]
  );

  // Instant Optimistic Decrement
  const handleDecrement = useCallback(
    (item: CartItem) => {
      if (item.quantity <= 1) {
        setItemToDelete(item);
        return;
      }
      updateQuantity({
        cartItemId: item.id,
        payload: { quantity: item.quantity - 1 },
      });
    },
    [updateQuantity]
  );

  const handleConfirmRemoveItem = useCallback(() => {
    if (!itemToDelete) return;
    removeItem(itemToDelete.id, {
      onSettled: () => {
        setItemToDelete(null);
      },
    });
  }, [itemToDelete, removeItem]);

  const handleConfirmClearCart = useCallback(() => {
    clearCart(undefined, {
      onSettled: () => {
        setIsClearModalVisible(false);
      },
    });
  }, [clearCart]);

  const handleCheckout = useCallback(() => {
    router.push('/(protected)/checkout' as any);
  }, [router]);

  return (
    <View
      style={[
        styles.screen,
        { backgroundColor: isDark ? theme.background : '#F8FAFC' },
      ]}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />

      {/* Screen Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: Math.max(insets.top, 12) + 8,
            backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
            borderBottomColor: isDark ? '#1E293B' : '#E2E8F0',
          },
        ]}
      >
        <View style={styles.headerLeft}>
          <View
            style={[
              styles.iconWrapper,
              {
                backgroundColor: isDark
                  ? 'rgba(37, 99, 235, 0.2)'
                  : 'rgba(37, 99, 235, 0.1)',
              },
            ]}
          >
            <ShoppingBag size={18} color={theme.primary} />
          </View>
          <Text
            style={[
              styles.headerTitle,
              { color: isDark ? '#F8FAFC' : '#0F172A' },
            ]}
          >
            My Bag {items.length > 0 ? `(${items.length})` : ''}
          </Text>
        </View>

        {items.length > 0 && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setIsClearModalVisible(true)}
            disabled={isClearing}
            style={styles.clearBtn}
          >
            <Trash2 size={15} color="#EF4444" />
            <Text style={styles.clearBtnText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Main Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 90,
          paddingTop: 12,
        }}
        refreshControl={
          <RefreshControl
            refreshing={isManualRefreshing}
            onRefresh={handleManualRefresh}
            tintColor={theme.primary}
            colors={[theme.primary]}
          />
        }
      >
        {/* Loading Skeleton */}
        {isLoading && items.length === 0 ? (
          <CartSkeleton />
        ) : isError && items.length === 0 ? (
          <View style={styles.errorWrapper}>
            <ErrorState
              title="Unable to load bag"
              message={error?.message || 'Please check your connection and try again.'}
              onRetry={() => refetch()}
              isRetrying={isManualRefreshing}
            />
          </View>
        ) : items.length === 0 ? (
          <CartEmptyView />
        ) : (
          <View style={styles.contentContainer}>
            {/* Items List */}
            <View style={styles.itemsList}>
              {items.map((item, index) => (
                <CartItemRow
                  key={item.id || item.variantId || `cart-item-${index}`}
                  item={item}
                  currency="₹"
                  onIncrement={() => handleIncrement(item)}
                  onDecrement={() => handleDecrement(item)}
                  onRemove={() => setItemToDelete(item)}
                />
              ))}
            </View>

            {/* Price Breakdown & Checkout Card */}
            <CartSummaryCard
              subtotal={subtotal}
              discount={discount}
              currency="₹"
              onCheckout={handleCheckout}
            />
          </View>
        )}
      </ScrollView>

      {/* Custom Alert Modal for Item Deletion */}
      <CartConfirmModal
        visible={!!itemToDelete}
        title="Remove from Bag"
        itemName={itemToDelete?.product?.name}
        message="Are you sure you want to remove this item from your shopping bag?"
        confirmText="Remove"
        cancelText="Keep Item"
        type="danger"
        isLoading={isRemoving}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleConfirmRemoveItem}
      />

      {/* Custom Alert Modal for Clear Bag */}
      <CartConfirmModal
        visible={isClearModalVisible}
        title="Clear Shopping Bag"
        message="Are you sure you want to remove all items from your shopping bag? This action cannot be undone."
        confirmText="Clear All"
        cancelText="Cancel"
        type="danger"
        isLoading={isClearing}
        onClose={() => setIsClearModalVisible(false)}
        onConfirm={handleConfirmClearCart}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    zIndex: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
  },
  clearBtnText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '700',
  },
  contentContainer: {
    paddingHorizontal: 16,
    gap: 18,
  },
  itemsList: {
    gap: 12,
  },
  errorWrapper: {
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
});

export default CartScreen;
