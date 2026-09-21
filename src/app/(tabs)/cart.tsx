import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {
  ShoppingCart,
  ArrowRight,
} from 'lucide-react-native';
import { Screen } from '@/components/layout';
import { CartItemCard, Button } from '@/components/ui';

interface CartItem {
  id: string;
  title: string;
  variant?: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export default function CartScreen() {
  const [items, setItems] = useState<CartItem[]>([]);

  const updateQuantity = (id: string, newQty: number) => {
    if (newQty <= 0) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    } else {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
      );
    }
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 0 && subtotal < 150 ? 15 : 0;
  const total = subtotal + shipping;

  return (
    <Screen
      scroll
      safeArea={['top']}
      contentContainerStyle={{
        paddingBottom: 110,
      }}
    >
      {/* Header */}
      <View className="px-5 pt-3 pb-3 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center">
            <ShoppingCart size={16} color="#2563EB" />
          </View>
          <Text className="text-display-sm font-bold text-text-primary dark:text-white">
            My Cart ({items.length})
          </Text>
        </View>

        {items.length > 0 && (
          <TouchableOpacity onPress={() => setItems([])}>
            <Text className="text-body-sm font-medium text-red-500">Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {items.length === 0 ? (
        <View className="px-5 py-20 items-center justify-center">
          <View className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 items-center justify-center mb-4">
            <ShoppingCart size={32} color="#94A3B8" />
          </View>
          <Text className="text-h3 font-bold text-text-primary dark:text-white mb-1">
            Your cart is empty
          </Text>
          <Text className="text-body-sm text-text-secondary text-center max-w-[260px]">
            Items added to your bag while browsing will appear here.
          </Text>
        </View>
      ) : (
        <View className="px-5 gap-4">
          {/* Cart items list */}
          <View className="gap-3">
            {items.map((item) => (
              <CartItemCard
                key={item.id}
                id={item.id}
                title={item.title}
                variantInfo={item.variant}
                price={item.price}
                quantity={item.quantity}
                imageUrl={item.imageUrl}
                onIncrement={() => updateQuantity(item.id, item.quantity + 1)}
                onDecrement={() => updateQuantity(item.id, item.quantity - 1)}
                onRemove={() => removeItem(item.id)}
              />
            ))}
          </View>

          {/* Order Summary */}
          <View className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
            <Text className="text-h4 font-bold text-text-primary dark:text-white mb-3">
              Order Summary
            </Text>

            <View className="gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <View className="flex-row items-center justify-between">
                <Text className="text-body-sm text-text-secondary">Subtotal</Text>
                <Text className="text-body-sm font-semibold text-text-primary dark:text-white">
                  ${subtotal.toFixed(2)}
                </Text>
              </View>

              <View className="flex-row items-center justify-between">
                <Text className="text-body-sm text-text-secondary">Shipping</Text>
                <Text className="text-body-sm font-semibold text-text-primary dark:text-white">
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center justify-between pt-3 mb-4">
              <Text className="text-body-md font-bold text-text-primary dark:text-white">
                Total Amount
              </Text>
              <Text className="text-h3 font-bold text-primary">
                ${total.toFixed(2)}
              </Text>
            </View>

            <Button
              fullWidth
              size="lg"
              variant="primary"
              className="h-12 rounded-xl"
              onPress={() => {}}
            >
              <View className="flex-row items-center justify-center gap-2">
                <Text className="text-body-md font-bold text-white">Proceed to Checkout</Text>
                <ArrowRight size={18} color="#FFFFFF" />
              </View>
            </Button>
          </View>
        </View>
      )}
    </Screen>
  );
}
