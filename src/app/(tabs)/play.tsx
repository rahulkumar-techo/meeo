import React from 'react';
import { View, Text } from 'react-native';
import { Play, Film } from 'lucide-react-native';
import { Screen } from '@/components/layout';

export default function PlayScreen() {
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
            <Play size={16} color="#2D2621" />
          </View>
          <Text className="text-display-sm font-bold text-text-primary dark:text-white">
            Play & Discover
          </Text>
        </View>
      </View>

      {/* Empty State */}
      <View className="px-5 py-20 items-center justify-center">
        <View className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 items-center justify-center mb-4">
          <Film size={32} color="#94A3B8" />
        </View>
        <Text className="text-h3 font-bold text-text-primary dark:text-white mb-1 text-center">
          No live videos yet
        </Text>
        <Text className="text-body-sm text-text-secondary text-center max-w-[260px]">
          Live shopping streams, product showcases, and reels will appear here.
        </Text>
      </View>
    </Screen>
  );
}
