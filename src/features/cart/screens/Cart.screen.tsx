import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { ShoppingBag, Trash2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';
import { CartCouponSection } from '../components/CartCouponSection';
import {
  useGetCart,
  useUpdateCartItem,
  useRemoveCartItem,
  useClearCart,
  usePrecheckoutDataLoad,
} from '../hooks';
import type { CartItem } from '../types/cart.types';
import {
  CartItemRow,
  CartSummaryCard,
  CartSkeleton,
  CartConfirmModal,
} from '../components';
import { EmptyState, ErrorState } from '@/components/ui';

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

  // Background prefetch addresses & checkout bill validation
  usePrecheckoutDataLoad(items);

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
    <View className="flex-1 bg-background dark:bg-background-dark">
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />

      {/* Screen Header */}
      <View
        className="flex-row items-center justify-between px-4 pb-3.5 border-b border-border dark:border-border-dark bg-surface dark:bg-surface-dark z-10"
        style={{ paddingTop: Math.max(insets.top, 12) + 8 }}
      >
        <View className="flex-row items-center gap-2.5">
          <View className="w-9 h-9 rounded-full items-center justify-center bg-primary/10 dark:bg-primary/20">
            <ShoppingBag size={18} color={theme.primary} />
          </View>
          <Text className="text-xl font-extrabold tracking-tight text-text-primary dark:text-text-primary-dark">
            My Bag {items.length > 0 ? `(${items.length})` : ''}
          </Text>
        </View>

        {items.length > 0 && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setIsClearModalVisible(true)}
            disabled={isClearing}
            className="flex-row items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-500/10"
          >
            <Trash2 size={15} color="#EF4444" />
            <Text className="text-red-500 text-xs font-bold">Clear All</Text>
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
          <View className="py-10 px-4">
            <ErrorState
              title="Unable to load bag"
              message={error?.message || 'Please check your connection and try again.'}
              onRetry={() => refetch()}
              isRetrying={isManualRefreshing}
            />
          </View>
        ) : items.length === 0 ? (
          <EmptyState
            icon={<ShoppingBag size={36} color={theme.primary} />}
            title="Your Shopping Bag is Empty"
            description="Looks like you haven't added any items to your bag yet. Explore top products and great deals!"
            actionText="Start Shopping"
            onActionPress={() => router.push('/(tabs)')}
            className="py-12"
          />
        ) : (
          <View className="px-4 gap-4">
            {/* Items List */}
            <View className="gap-3">
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

            {/* Coupon / Offers Section */}

            <CartCouponSection items={items} subtotal={subtotal} />

            

            {/* Price Breakdown & Checkout Card */}
            <CartSummaryCard
              items={items}
              subtotal={subtotal}
              discount={discount}
              currency="₹"
              onCheckout={handleCheckout}
            />
          </View>
        )}
      </ScrollView>

      {/* Custom Alert Modal for Item Deletion */}
      {!!itemToDelete && (
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
      )}

      {/* Custom Alert Modal for Clear Bag */}
      {isClearModalVisible && (
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
      )}
    </View>
  );
}

export default CartScreen;

