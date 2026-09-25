import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, CheckCircle2, Circle, Edit3, Trash2, MapPin } from 'lucide-react-native';
import { useTheme } from '@/theme';
import { Button } from '@/components/ui';
import { useGetAddresses, useDeleteAddress } from '@/features/address';
import type { UserAddress } from '@/features/address/validations/address.validation';

export interface CheckoutAddressStepProps {
  selectedAddress: UserAddress | null;
  onSelectAddress: (address: UserAddress) => void;
  onProceed: () => void;
}

export function CheckoutAddressStep({
  selectedAddress,
  onSelectAddress,
  onProceed,
}: CheckoutAddressStepProps) {
  const router = useRouter();
  const { isDark } = useTheme();

  const { data, isLoading, refetch } = useGetAddresses();
  const { mutate: deleteAddress, isPending: isDeleting } = useDeleteAddress();

  const addressList: UserAddress[] = Array.isArray(data?.data) ? data.data : [];

  // Auto-select default or first address if none selected
  useEffect(() => {
    if (addressList.length > 0 && !selectedAddress) {
      const defaultAddr = addressList.find((a) => a.isDefault) || addressList[0];
      if (defaultAddr) {
        onSelectAddress(defaultAddr);
      }
    }
  }, [addressList, selectedAddress, onSelectAddress]);

  const handleAddNew = () => {
    router.push({
      pathname: '/(protected)/address',
      params: { mode: 'create' },
    });
  };

  const handleEdit = (addr: UserAddress) => {
    router.push({
      pathname: '/(protected)/address',
      params: { mode: 'edit', editId: addr.id },
    });
  };

  const handleDelete = (addr: UserAddress) => {
    Alert.alert(
      'Delete Address',
      `Are you sure you want to delete ${addr.label || 'this'} address?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteAddress(addr.id, {
              onSuccess: () => {
                refetch();
              },
            });
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 px-4 pt-2">
      {/* Step Header */}
      <View className="flex-row justify-between items-center mb-3.5">
        <Text className="text-base font-bold text-slate-900 dark:text-white">
          Select Delivery Address
        </Text>
        <Button
          variant="outline"
          size="xs"
          rounded="full"
          onPress={handleAddNew}
          leftIcon={<Plus size={13} color={isDark ? '#FFFFFF' : '#2D2621'} />}
          className="border-[#2D2621] dark:border-white px-3"
        >
          Add New
        </Button>
      </View>

      {/* Loading state */}
      {isLoading ? (
        <View className="py-12 items-center justify-center">
          <ActivityIndicator
            size="small"
            color={isDark ? '#FFFFFF' : '#2D2621'}
          />
          <Text className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
            Loading addresses...
          </Text>
        </View>
      ) : addressList.length === 0 ? (
        /* Empty State */
        <View className="border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 items-center gap-2.5 mt-3 bg-white dark:bg-slate-900">
          <MapPin size={36} color={isDark ? '#94A3B8' : '#2D2621'} />
          <Text className="text-base font-bold text-slate-900 dark:text-white">
            No saved addresses
          </Text>
          <Text className="text-xs text-center text-slate-500 dark:text-slate-400 max-w-[240px]">
            Please add a delivery address to continue checkout.
          </Text>
          <Button
            variant="dark"
            size="sm"
            rounded="xl"
            onPress={handleAddNew}
            leftIcon={<Plus size={15} color={isDark ? '#0F172A' : '#FFFFFF'} />}
            className="mt-1"
          >
            Add Delivery Address
          </Button>
        </View>
      ) : (
        /* Address List */
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ gap: 12, paddingBottom: 20 }}
        >
          {addressList.map((addr) => {
            const isSelected = selectedAddress?.id === addr.id;

            return (
              <TouchableOpacity
                key={addr.id}
                activeOpacity={0.85}
                onPress={() => onSelectAddress(addr)}
                className={`border rounded-2xl p-4 gap-2 ${
                  isSelected
                    ? 'bg-primary-light/70 dark:bg-stone-900 border-[#2D2621] dark:border-[#E2B897]'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
              >
                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center gap-2 flex-1 flex-wrap">
                    {isSelected ? (
                      <CheckCircle2
                        size={19}
                        color={isDark ? '#E2B897' : '#2D2621'}
                      />
                    ) : (
                      <Circle
                        size={19}
                        color={isDark ? '#64748B' : '#94A3B8'}
                      />
                    )}
                    <Text className="text-sm font-bold text-slate-900 dark:text-white">
                      {addr.recipientName}
                    </Text>
                    {addr.label && (
                      <View className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">
                        <Text className="text-[10px] font-bold uppercase text-slate-600 dark:text-slate-400">
                          {addr.label}
                        </Text>
                      </View>
                    )}
                    {addr.isDefault && (
                      <View className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60">
                        <Text className="text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-400">
                          DEFAULT
                        </Text>
                      </View>
                    )}
                  </View>

                  <View className="flex-row items-center gap-3">
                    <TouchableOpacity
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      onPress={() => handleEdit(addr)}
                      className="p-1"
                    >
                      <Edit3
                        size={16}
                        color={isDark ? '#94A3B8' : '#64748B'}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      disabled={isDeleting}
                      onPress={() => handleDelete(addr)}
                      className="p-1"
                    >
                      <Trash2 size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Address Body */}
                <View className="pl-7 gap-0.5">
                  <Text className="text-xs text-slate-600 dark:text-slate-300 leading-4">
                    {addr.addressLine1}
                    {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}
                  </Text>
                  <Text className="text-xs text-slate-600 dark:text-slate-300 leading-4">
                    {addr.city}, {addr.state} - {addr.postalCode}
                  </Text>
                  {addr.phone && (
                    <Text className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
                      Mobile: {addr.phone}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* Deliver to this address CTA Button */}
      {addressList.length > 0 && (
        <View className="pt-2 pb-4">
          <Button
            variant="dark"
            size="lg"
            rounded="2xl"
            fullWidth
            disabled={!selectedAddress}
            onPress={onProceed}
          >
            Deliver to this Address
          </Button>
        </View>
      )}
    </View>
  );
}

export default CheckoutAddressStep;
