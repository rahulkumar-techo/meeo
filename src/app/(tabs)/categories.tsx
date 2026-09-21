import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
} from 'react-native';
import { Search, LayoutGrid } from 'lucide-react-native';
import { Screen } from '@/components/layout';

export default function CategoriesScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Screen
      scroll
      safeArea={['top']}
      contentContainerStyle={{
        paddingBottom: 110,
      }}
    >
      {/* Header */}
      <View className="px-5 pt-3 pb-3">
        <Text className="text-display-sm font-bold text-text-primary dark:text-white">
          Explore Categories
        </Text>
        <Text className="text-body-sm text-text-secondary">
          Find carefully crafted gear for your work & lifestyle
        </Text>
      </View>

      {/* Search Input */}
      <View className="px-5 mb-6">
        <View className="flex-row items-center bg-slate-100 dark:bg-slate-800 rounded-2xl px-3.5 py-2.5 border border-border dark:border-slate-700">
          <Search size={18} color="#94A3B8" />
          <TextInput
            placeholder="Search categories..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 ml-2.5 text-body-sm text-text-primary dark:text-white"
          />
        </View>
      </View>

      {/* Empty State */}
      <View className="px-5 py-16 items-center justify-center">
        <View className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 items-center justify-center mb-4">
          <LayoutGrid size={32} color="#94A3B8" />
        </View>
        <Text className="text-h3 font-bold text-text-primary dark:text-white mb-1 text-center">
          No categories found
        </Text>
        <Text className="text-body-sm text-text-secondary text-center max-w-[260px]">
          Product categories and collections will be displayed here.
        </Text>
      </View>
    </Screen>
  );
}
