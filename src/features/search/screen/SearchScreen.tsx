import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Keyboard,
  Platform,
  StatusBar as RNStatusBar,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import {
  ArrowLeft,
  Search,
  Mic,
  X,
  Clock,
  Trash2,
  TrendingUp,
  Package,
  Sparkles,
} from 'lucide-react-native';
import { Screen } from '@/components/layout';
import { useTheme } from '@/theme';
import { HeaderGradient } from '@/components/header';
import { useGetAllProducts } from '@/features/products';
import type { Product } from '@/features/products/types/product.types';
import { useDebounce } from '@/hooks/useDebounce';
import { SearchItem } from '../components/searchItem';
import { AppRoute } from '@/routes/app-route';

const SEARCH_HISTORY_KEY = 'meeo_search_history';
const MAX_HISTORY = 5;

const POPULAR_SEARCHES = [
  'Oversized T-Shirt',
  'Sneakers',
  'Denim Jacket',
  'Hoodie',
  'Summer Dress',
  'Accessories',
];

export const SearchScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();

  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Safe status bar top inset matching HomeHeader
  const topInset =
    insets.top > 0
      ? insets.top
      : Platform.OS === 'android'
      ? RNStatusBar.currentHeight ?? 24
      : 0;

  // 1. Debounce user search query by 400ms to protect network & backend
  const debouncedQuery = useDebounce(query.trim(), 400);

  // 2. Safely debounce writes to SecureStore
  const persistSearches = useMemo(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    return (list: string[]) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        SecureStore.setItemAsync(SEARCH_HISTORY_KEY, JSON.stringify(list)).catch(() => {});
      }, 300);
    };
  }, []);

  // 3. Load search history on mount
  useEffect(() => {
    SecureStore.getItemAsync(SEARCH_HISTORY_KEY)
      .then((raw) => {
        if (raw) {
          try {
            const list = JSON.parse(raw);
            if (Array.isArray(list)) {
              setRecentSearches(list.slice(0, MAX_HISTORY));
            }
          } catch {
            // Ignore parse errors
          }
        }
      })
      .catch(() => {});
  }, []);

  // Save search term with duplicate prevention and debounced persistence
  const saveSearchTerm = useCallback(
    (term: string) => {
      const cleaned = term.trim();
      if (!cleaned) return;

      setRecentSearches((prev) => {
        const next = [
          cleaned,
          ...prev.filter((t) => t.toLowerCase() !== cleaned.toLowerCase()),
        ].slice(0, MAX_HISTORY);
        persistSearches(next);
        return next;
      });
    },
    [persistSearches]
  );

  // Remove individual search history term
  const removeSearchTerm = useCallback(
    (term: string) => {
      setRecentSearches((prev) => {
        const next = prev.filter((t) => t !== term);
        persistSearches(next);
        return next;
      });
    },
    [persistSearches]
  );

  // Clear all search history
  const clearAllHistory = useCallback(() => {
    setRecentSearches([]);
    SecureStore.deleteItemAsync(SEARCH_HISTORY_KEY).catch(() => {});
  }, []);

  // 4. Fetch products based on debounced search query
  const isSearchActive = debouncedQuery.length > 0;
  const { data, isLoading, isFetching } = useGetAllProducts(
    { search: debouncedQuery, limit: 20 },
    { enabled: isSearchActive }
  );

  // Extract products array safely
  const products: Product[] = useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data.data?.items)) return data.data.items;
    if (Array.isArray(data.data)) return data.data as any as Product[];
    return [];
  }, [data]);

  // Handle product click
  const handleSelectProduct = useCallback(
    (product: Product) => {
      if (query.trim()) {
        saveSearchTerm(query.trim());
      }
      Keyboard.dismiss();
      router.push({
        pathname: AppRoute.product_details,
        params: { productId: product.id },
      });
    },
    [query, router, saveSearchTerm]
  );

  // Handle history / trending term click
  const handleSelectTerm = useCallback(
    (term: string) => {
      setQuery(term);
      saveSearchTerm(term);
    },
    [saveSearchTerm]
  );

  const handleSearchSubmit = useCallback(() => {
    if (query.trim()) {
      saveSearchTerm(query.trim());
      Keyboard.dismiss();
    }
  }, [query, saveSearchTerm]);

  return (
    <Screen
      safeArea={false}
      horizontalPadding={false}
      keyboard={false}
      style={{ flex: 1 }}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Header with HomeHeader luxury gradient */}
      <View style={{ paddingTop: topInset }} className="relative overflow-hidden pb-3">
        <HeaderGradient isDark={isDark} />

        <View className="flex-row items-center px-4 pt-2 gap-2.5">
          {/* Glass Back Button */}
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => router.back()}
            className="w-11 h-11 rounded-full items-center justify-center bg-white/20 border border-white/35"
          >
            <ArrowLeft size={20} color="#FFFFFF" strokeWidth={2.2} />
          </TouchableOpacity>

          {/* Search Pill Matching HomeHeaderSearchBar */}
          <View
            className="flex-1 flex-row items-center h-11 px-3.5 rounded-full bg-white gap-2 shadow-sm"
            style={{
              elevation: 3,
              shadowColor: '#000000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            }}
          >
            <Search size={19} color="#64748B" />

            <TextInput
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={handleSearchSubmit}
              returnKeyType="search"
              autoFocus
              autoCapitalize="none"
              placeholder="Search products, brands & more..."
              placeholderTextColor="#64748B"
              className="flex-1 text-sm font-medium text-slate-900 py-0"
              style={{ paddingVertical: 0 }}
            />

            {isFetching ? (
              <ActivityIndicator size="small" color="#8C5338" className="mx-1" />
            ) : query.length > 0 ? (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setQuery('')}
                className="w-5 h-5 rounded-full items-center justify-center bg-slate-200"
              >
                <X size={12} color="#475569" strokeWidth={2.5} />
              </TouchableOpacity>
            ) : null}

            {/* Mic Icon Button */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                // Mic voice search action
              }}
              className="p-1"
            >
              <Mic size={19} color="#64748B" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Main Body */}
      <View className="flex-1 px-4 pt-3 bg-slate-50/50 dark:bg-stone-950">
        {!isSearchActive ? (
          /* Empty query state: Recent Searches & Trending */
          <View className="gap-6 pt-1">
            {/* Recent Searches Section (3-5 saved items) */}
            {recentSearches.length > 0 && (
              <View className="gap-2.5">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-1.5">
                    <Clock size={15} color={isDark ? '#94A3B8' : '#64748B'} />
                    <Text className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-stone-400">
                      Recent Searches
                    </Text>
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={clearAllHistory}
                    className="flex-row items-center gap-1 py-1 px-2 rounded-lg"
                  >
                    <Trash2 size={12} color="#EF4444" />
                    <Text className="text-xs font-semibold text-red-500">
                      Clear
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Recent search chips */}
                <View className="flex-row flex-wrap gap-2">
                  {recentSearches.map((term) => (
                    <View
                      key={term}
                      className="flex-row items-center pl-3 pr-1.5 py-1.5 rounded-full bg-white dark:bg-stone-900 border border-slate-200/80 dark:border-stone-800 shadow-2xs"
                    >
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => handleSelectTerm(term)}
                        className="mr-1.5"
                      >
                        <Text className="text-xs font-medium text-slate-800 dark:text-slate-200">
                          {term}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => removeSearchTerm(term)}
                        className="w-5 h-5 rounded-full items-center justify-center bg-slate-100 dark:bg-stone-800"
                      >
                        <X size={10} color={isDark ? '#94A3B8' : '#64748B'} strokeWidth={2.5} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Popular / Trending Searches */}
            <View className="gap-2.5">
              <View className="flex-row items-center gap-1.5">
                <TrendingUp size={15} color={isDark ? '#94A3B8' : '#64748B'} />
                <Text className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-stone-400">
                  Trending Searches
                </Text>
              </View>

              <View className="flex-row flex-wrap gap-2">
                {POPULAR_SEARCHES.map((term) => (
                  <TouchableOpacity
                    key={term}
                    activeOpacity={0.7}
                    onPress={() => handleSelectTerm(term)}
                    className="flex-row items-center px-3 py-2 rounded-full bg-white dark:bg-stone-900 border border-slate-200/80 dark:border-stone-800 shadow-2xs gap-1.5"
                  >
                    <Sparkles size={12} color="#D97706" />
                    <Text className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {term}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        ) : isLoading ? (
          /* Loading indicator */
          <View className="flex-1 items-center justify-center pt-20">
            <ActivityIndicator size="large" color="#8C5338" />
            <Text className="text-xs font-medium text-slate-400 dark:text-stone-500 mt-3">
              Searching products...
            </Text>
          </View>
        ) : products.length > 0 ? (
          /* Results list */
          <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <SearchItem product={item} onPress={handleSelectProduct} />
            )}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 30 }}
            ListHeaderComponent={
              <View className="py-2 mb-1 flex-row items-center justify-between">
                <Text className="text-xs font-bold text-slate-500 dark:text-stone-400">
                  Found {products.length} {products.length === 1 ? 'item' : 'items'}
                </Text>
                <Text
                  numberOfLines={1}
                  className="text-xs font-semibold text-slate-400 dark:text-stone-500 max-w-[180px]"
                >
                  for &quot;{debouncedQuery}&quot;
                </Text>
              </View>
            }
          />
        ) : (
          /* Empty Search Results */
          <View className="flex-1 items-center justify-center pt-16 px-6">
            <View className="w-16 h-16 rounded-full bg-slate-100 dark:bg-stone-800 items-center justify-center mb-3.5">
              <Package size={28} color={isDark ? '#64748B' : '#94A3B8'} />
            </View>

            <Text className="text-base font-extrabold text-slate-800 dark:text-slate-200 text-center mb-1">
              No products found
            </Text>

            <Text className="text-xs text-slate-400 dark:text-stone-500 text-center leading-relaxed max-w-[260px]">
              We couldn&apos;t find any items matching &quot;{debouncedQuery}&quot;. Try checking for typos or searching a different keyword.
            </Text>
          </View>
        )}
      </View>
    </Screen>
  );
};

export default SearchScreen;