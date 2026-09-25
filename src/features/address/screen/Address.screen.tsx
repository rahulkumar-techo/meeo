import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StatusBar,
  Keyboard,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Plus,
  Edit3,
  Trash2,
  Check,
  MapPin,
  Home,
  Briefcase,
  Navigation,
} from 'lucide-react-native';
import { Screen } from '@/components/layout';
import { Button } from '@/components/ui';
import { useTheme } from '@/theme';
import {
  useGetAddresses,
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
} from '../hooks/address.hook';
import type { UserAddress, Address } from '../validations/address.validation';

const LABELS = ['Home', 'Work', 'Other'] as const;

export function AddressScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ mode?: string; editId?: string }>();
  const { isDark } = useTheme();

  // Input refs for keyboard navigation
  const phoneRef = useRef<TextInput>(null);
  const addressLine1Ref = useRef<TextInput>(null);
  const addressLine2Ref = useRef<TextInput>(null);
  const cityRef = useRef<TextInput>(null);
  const stateRef = useRef<TextInput>(null);
  const postalCodeRef = useRef<TextInput>(null);
  const countryRef = useRef<TextInput>(null);

  // Queries and mutations
  const { data, isLoading, refetch } = useGetAddresses();
  const addressList: UserAddress[] = Array.isArray(data?.data) ? data.data : [];

  const [isFormView, setIsFormView] = useState<boolean>(
    params.mode === 'create' || params.mode === 'edit'
  );
  const [editingAddressId, setEditingAddressId] = useState<string | null>(
    params.editId || null
  );

  // Form states
  const [recipientName, setRecipientName] = useState('');
  const [phone, setPhone] = useState('');
  const [label, setLabel] = useState('Home');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('India');
  const [isDefault, setIsDefault] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-switch to form view if user has 0 addresses and not loading
  useEffect(() => {
    if (!isLoading && addressList.length === 0) {
      setIsFormView(true);
      setEditingAddressId(null);
    }
  }, [isLoading, addressList.length]);

  // Load address into form if editing
  useEffect(() => {
    if (editingAddressId) {
      const match = addressList.find((a) => a.id === editingAddressId);
      if (match) {
        setRecipientName(match.recipientName || '');
        setPhone(match.phone || '');
        setLabel(match.label || 'Home');
        setAddressLine1(match.addressLine1 || '');
        setAddressLine2(match.addressLine2 || '');
        setCity(match.city || '');
        setState(match.state || '');
        setPostalCode(match.postalCode || '');
        setCountry(match.country || 'India');
        setIsDefault(Boolean(match.isDefault));
        setIsFormView(true);
      }
    }
  }, [editingAddressId, addressList]);

  const { mutate: createAddress, isPending: isCreating } = useCreateAddress({
    onSuccess: () => {
      refetch();
      if (addressList.length > 0) {
        setIsFormView(false);
      } else {
        router.back();
      }
    },
    onError: (err: any) => {
      Alert.alert('Error', err?.message || 'Failed to save address.');
    },
  });

  const { mutate: updateAddress, isPending: isUpdating } = useUpdateAddress({
    onSuccess: () => {
      refetch();
      setIsFormView(false);
      setEditingAddressId(null);
    },
    onError: (err: any) => {
      Alert.alert('Error', err?.message || 'Failed to update address.');
    },
  });

  const { mutate: deleteAddress, isPending: isDeleting } = useDeleteAddress({
    onSuccess: () => {
      refetch();
    },
    onError: (err: any) => {
      Alert.alert('Error', err?.message || 'Failed to delete address.');
    },
  });

  const isSaving = isCreating || isUpdating;

  const resetForm = () => {
    setRecipientName('');
    setPhone('');
    setLabel('Home');
    setAddressLine1('');
    setAddressLine2('');
    setCity('');
    setState('');
    setPostalCode('');
    setCountry('India');
    setIsDefault(addressList.length === 0);
    setErrors({});
    setEditingAddressId(null);
  };

  const handleStartCreate = () => {
    resetForm();
    setIsFormView(true);
  };

  const handleStartEdit = (addr: UserAddress) => {
    setEditingAddressId(addr.id);
    setRecipientName(addr.recipientName || '');
    setPhone(addr.phone || '');
    setLabel(addr.label || 'Home');
    setAddressLine1(addr.addressLine1 || '');
    setAddressLine2(addr.addressLine2 || '');
    setCity(addr.city || '');
    setState(addr.state || '');
    setPostalCode(addr.postalCode || '');
    setCountry(addr.country || 'India');
    setIsDefault(Boolean(addr.isDefault));
    setErrors({});
    setIsFormView(true);
  };

  const handleDelete = (addr: UserAddress) => {
    Alert.alert(
      'Delete Address',
      `Are you sure you want to delete this delivery address?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteAddress(addr.id),
        },
      ]
    );
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!recipientName.trim()) errs.recipientName = 'Contact name is required';
    if (!phone.trim()) errs.phone = 'Phone number is required';
    if (!addressLine1.trim()) errs.addressLine1 = 'House / Flat details are required';
    if (!city.trim()) errs.city = 'City is required';
    if (!state.trim()) errs.state = 'State is required';
    if (!postalCode.trim()) errs.postalCode = 'Pincode is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    Keyboard.dismiss();
    if (!validate()) return;

    const payload: Address = {
      recipientName: recipientName.trim(),
      phone: phone.trim(),
      label: label.trim(),
      addressLine1: addressLine1.trim(),
      addressLine2: addressLine2.trim() || undefined,
      city: city.trim(),
      state: state.trim(),
      postalCode: postalCode.trim(),
      country: country.trim() || 'India',
      isDefault,
    };

    if (editingAddressId) {
      updateAddress({
        addressId: editingAddressId,
        payload,
      });
    } else {
      createAddress(payload);
    }
  };

  return (
    <Screen
      scroll
      keyboard
      safeArea={['top', 'bottom']}
      horizontalPadding={false}
      contentContainerStyle={{
        flexGrow: 1,
        paddingBottom: 40,
      }}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
      />

      {/* Screen Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-slate-200/60 dark:border-slate-800">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            Keyboard.dismiss();
            if (isFormView && addressList.length > 0) {
              setIsFormView(false);
              setEditingAddressId(null);
            } else {
              router.back();
            }
          }}
          className="w-10 h-10 rounded-full items-center justify-center bg-slate-100 dark:bg-slate-800"
        >
          <ArrowLeft size={20} color={isDark ? '#F8FAFC' : '#0F172A'} />
        </TouchableOpacity>

        <Text className="text-base font-bold text-slate-900 dark:text-white">
          {isFormView
            ? editingAddressId
              ? 'Edit Address'
              : 'Add Delivery Address'
            : 'Saved Addresses'}
        </Text>

        {!isFormView ? (
          <Button
            variant="dark"
            size="xs"
            rounded="full"
            onPress={handleStartCreate}
            leftIcon={<Plus size={14} color={isDark ? '#0F172A' : '#FFFFFF'} />}
            className="px-3"
          >
            Add
          </Button>
        ) : (
          <View className="w-10" />
        )}
      </View>

      {/* Main Content */}
      <View className="flex-1 px-4 pt-4">
        {isFormView ? (
          /* FORM VIEW */
          <View className="gap-5">
            {/* Address Type Selector */}
            <View className="gap-2.5">
              <Text className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Address Type
              </Text>
              <View className="flex-row gap-2.5">
                {LABELS.map((item) => {
                  const isSelected = label === item;
                  return (
                    <TouchableOpacity
                      key={item}
                      activeOpacity={0.8}
                      onPress={() => {
                        Keyboard.dismiss();
                        setLabel(item);
                      }}
                      className={`flex-row items-center gap-2 px-4 py-2.5 rounded-2xl border ${
                        isSelected
                          ? 'bg-[#2D2621] border-[#2D2621] dark:bg-white dark:border-white'
                          : 'bg-slate-100 border-slate-200 dark:bg-slate-800 dark:border-slate-700'
                      }`}
                    >
                      {item === 'Home' ? (
                        <Home
                          size={15}
                          color={
                            isSelected
                              ? isDark
                                ? '#0F172A'
                                : '#FFFFFF'
                              : isDark
                              ? '#94A3B8'
                              : '#64748B'
                          }
                        />
                      ) : item === 'Work' ? (
                        <Briefcase
                          size={15}
                          color={
                            isSelected
                              ? isDark
                                ? '#0F172A'
                                : '#FFFFFF'
                              : isDark
                              ? '#94A3B8'
                              : '#64748B'
                          }
                        />
                      ) : (
                        <Navigation
                          size={15}
                          color={
                            isSelected
                              ? isDark
                                ? '#0F172A'
                                : '#FFFFFF'
                              : isDark
                              ? '#94A3B8'
                              : '#64748B'
                          }
                        />
                      )}
                      <Text
                        className={`text-xs font-semibold ${
                          isSelected
                            ? 'text-white dark:text-slate-900'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Contact Details */}
            <View className="gap-3.5">
              <Text className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Contact Information
              </Text>

              <View className="gap-1.5">
                <Text className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Full Name *
                </Text>
                <TextInput
                  value={recipientName}
                  onChangeText={setRecipientName}
                  autoCapitalize="words"
                  autoComplete="name"
                  textContentType="name"
                  returnKeyType="next"
                  onSubmitEditing={() => phoneRef.current?.focus()}
                  blurOnSubmit={false}
                  placeholder="e.g. Rahul Kumar"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                  className={`w-full px-3.5 py-3 rounded-xl border text-sm font-medium bg-white dark:bg-slate-900 text-slate-900 dark:text-white ${
                    errors.recipientName
                      ? 'border-red-500'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                />
                {errors.recipientName && (
                  <Text className="text-xs text-red-500 mt-0.5">
                    {errors.recipientName}
                  </Text>
                )}
              </View>

              <View className="gap-1.5">
                <Text className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Phone Number *
                </Text>
                <TextInput
                  ref={phoneRef}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  autoComplete="tel"
                  textContentType="telephoneNumber"
                  returnKeyType="next"
                  onSubmitEditing={() => addressLine1Ref.current?.focus()}
                  blurOnSubmit={false}
                  placeholder="e.g. +91 9876543210"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                  className={`w-full px-3.5 py-3 rounded-xl border text-sm font-medium bg-white dark:bg-slate-900 text-slate-900 dark:text-white ${
                    errors.phone
                      ? 'border-red-500'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                />
                {errors.phone && (
                  <Text className="text-xs text-red-500 mt-0.5">
                    {errors.phone}
                  </Text>
                )}
              </View>
            </View>

            {/* Address Details */}
            <View className="gap-3.5">
              <Text className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Address Details
              </Text>

              <View className="gap-1.5">
                <Text className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Flat / House / Building *
                </Text>
                <TextInput
                  ref={addressLine1Ref}
                  value={addressLine1}
                  onChangeText={setAddressLine1}
                  autoCapitalize="words"
                  autoComplete="street-address"
                  textContentType="streetAddressLine1"
                  returnKeyType="next"
                  onSubmitEditing={() => addressLine2Ref.current?.focus()}
                  blurOnSubmit={false}
                  placeholder="e.g. Flat 402, Sunshine Heights"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                  className={`w-full px-3.5 py-3 rounded-xl border text-sm font-medium bg-white dark:bg-slate-900 text-slate-900 dark:text-white ${
                    errors.addressLine1
                      ? 'border-red-500'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                />
                {errors.addressLine1 && (
                  <Text className="text-xs text-red-500 mt-0.5">
                    {errors.addressLine1}
                  </Text>
                )}
              </View>

              <View className="gap-1.5">
                <Text className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Area / Street / Landmark
                </Text>
                <TextInput
                  ref={addressLine2Ref}
                  value={addressLine2}
                  onChangeText={setAddressLine2}
                  autoCapitalize="words"
                  textContentType="streetAddressLine2"
                  returnKeyType="next"
                  onSubmitEditing={() => cityRef.current?.focus()}
                  blurOnSubmit={false}
                  placeholder="e.g. Outer Ring Road, Bellandur"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                  className="w-full px-3.5 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-medium bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </View>

              <View className="flex-row gap-3">
                <View className="flex-1 gap-1.5">
                  <Text className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    City *
                  </Text>
                  <TextInput
                    ref={cityRef}
                    value={city}
                    onChangeText={setCity}
                    autoCapitalize="words"
                    autoComplete="postal-address-locality"
                    textContentType="addressCity"
                    returnKeyType="next"
                    onSubmitEditing={() => stateRef.current?.focus()}
                    blurOnSubmit={false}
                    placeholder="e.g. Bengaluru"
                    placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                    className={`w-full px-3.5 py-3 rounded-xl border text-sm font-medium bg-white dark:bg-slate-900 text-slate-900 dark:text-white ${
                      errors.city
                        ? 'border-red-500'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  />
                  {errors.city && (
                    <Text className="text-xs text-red-500 mt-0.5">
                      {errors.city}
                    </Text>
                  )}
                </View>

                <View className="flex-1 gap-1.5">
                  <Text className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    State *
                  </Text>
                  <TextInput
                    ref={stateRef}
                    value={state}
                    onChangeText={setState}
                    autoCapitalize="words"
                    autoComplete="postal-address-region"
                    textContentType="addressState"
                    returnKeyType="next"
                    onSubmitEditing={() => postalCodeRef.current?.focus()}
                    blurOnSubmit={false}
                    placeholder="e.g. Karnataka"
                    placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                    className={`w-full px-3.5 py-3 rounded-xl border text-sm font-medium bg-white dark:bg-slate-900 text-slate-900 dark:text-white ${
                      errors.state
                        ? 'border-red-500'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  />
                  {errors.state && (
                    <Text className="text-xs text-red-500 mt-0.5">
                      {errors.state}
                    </Text>
                  )}
                </View>
              </View>

              <View className="flex-row gap-3">
                <View className="flex-1 gap-1.5">
                  <Text className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Pincode *
                  </Text>
                  <TextInput
                    ref={postalCodeRef}
                    value={postalCode}
                    onChangeText={setPostalCode}
                    keyboardType="numeric"
                    autoComplete="postal-code"
                    textContentType="postalCode"
                    returnKeyType="next"
                    onSubmitEditing={() => countryRef.current?.focus()}
                    blurOnSubmit={false}
                    placeholder="e.g. 560103"
                    placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                    className={`w-full px-3.5 py-3 rounded-xl border text-sm font-medium bg-white dark:bg-slate-900 text-slate-900 dark:text-white ${
                      errors.postalCode
                        ? 'border-red-500'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  />
                  {errors.postalCode && (
                    <Text className="text-xs text-red-500 mt-0.5">
                      {errors.postalCode}
                    </Text>
                  )}
                </View>

                <View className="flex-1 gap-1.5">
                  <Text className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Country
                  </Text>
                  <TextInput
                    ref={countryRef}
                    value={country}
                    onChangeText={setCountry}
                    autoCapitalize="words"
                    autoComplete="country"
                    textContentType="countryName"
                    returnKeyType="done"
                    onSubmitEditing={handleSave}
                    placeholder="India"
                    placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                    className="w-full px-3.5 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-medium bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </View>
              </View>
            </View>

            {/* Make Default Checkbox */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                Keyboard.dismiss();
                setIsDefault((prev) => !prev);
              }}
              className="flex-row items-center gap-2.5 my-1"
            >
              <View
                className={`w-5 h-5 rounded-md border items-center justify-center ${
                  isDefault
                    ? 'bg-[#2D2621] border-[#2D2621] dark:bg-white dark:border-white'
                    : 'border-slate-300 dark:border-slate-700 bg-transparent'
                }`}
              >
                {isDefault && (
                  <Check
                    size={13}
                    color={isDark ? '#0F172A' : '#FFFFFF'}
                    strokeWidth={3}
                  />
                )}
              </View>
              <Text className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Make this my default delivery address
              </Text>
            </TouchableOpacity>

            {/* Save Address CTA */}
            <Button
              variant="dark"
              size="lg"
              rounded="2xl"
              fullWidth
              disabled={isSaving}
              isLoading={isSaving}
              loadingText="Saving..."
              onPress={handleSave}
              className="mt-2"
            >
              {editingAddressId ? 'Save Changes' : 'Save Address'}
            </Button>
          </View>
        ) : (
          /* LIST VIEW */
          <View className="gap-3">
            {isLoading ? (
              <View className="py-12 items-center justify-center">
                <ActivityIndicator
                  size="small"
                  color={isDark ? '#FFFFFF' : '#2D2621'}
                />
                <Text className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
                  Loading saved addresses...
                </Text>
              </View>
            ) : addressList.length === 0 ? (
              <View className="border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 items-center gap-2.5 mt-3 bg-white dark:bg-slate-900">
                <MapPin size={36} color={isDark ? '#94A3B8' : '#2D2621'} />
                <Text className="text-base font-bold text-slate-900 dark:text-white">
                  No saved addresses yet
                </Text>
                <Text className="text-xs text-center text-slate-500 dark:text-slate-400 max-w-[240px]">
                  Add your home or office address for fast delivery.
                </Text>
                <Button
                  variant="dark"
                  size="sm"
                  rounded="xl"
                  onPress={handleStartCreate}
                  leftIcon={<Plus size={15} color={isDark ? '#0F172A' : '#FFFFFF'} />}
                  className="mt-1"
                >
                  Add Address
                </Button>
              </View>
            ) : (
              addressList.map((addr) => (
                <View
                  key={addr.id}
                  className={`border rounded-2xl p-4 gap-2 bg-white dark:bg-slate-900 ${
                    addr.isDefault
                      ? 'border-[#2D2621] dark:border-white'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center gap-2 flex-1 flex-wrap">
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
                        onPress={() => handleStartEdit(addr)}
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

                  <View className="gap-0.5">
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
                </View>
              ))
            )}
          </View>
        )}
      </View>
    </Screen>
  );
}

export default AddressScreen;