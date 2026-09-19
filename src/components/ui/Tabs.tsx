import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

export interface TabItem {
  id: string;
  label: string;
  badge?: number | string;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
  variant?: 'underline' | 'pill';
  isScrollable?: boolean;
  className?: string;
}

export function Tabs({
  tabs,
  activeTab,
  onTabChange,
  variant = 'underline',
  isScrollable = false,
  className = '',
}: TabsProps) {
  if (variant === 'pill') {
    const content = (
      <View
        className={`flex-row p-1 bg-slate-100 dark:bg-slate-800 rounded-pill gap-1 ${
          !isScrollable ? 'w-full' : ''
        }`}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => onTabChange(tab.id)}
              activeOpacity={0.8}
              className={`flex-row items-center justify-center py-2 px-4 rounded-pill gap-1.5 ${
                !isScrollable ? 'flex-1' : ''
              } ${
                isActive
                  ? 'bg-surface dark:bg-slate-700 shadow-sm'
                  : 'bg-transparent'
              }`}
            >
              {tab.icon && <View>{tab.icon}</View>}
              <Text
                className={`text-body-sm font-semibold ${
                  isActive
                    ? 'text-text-primary dark:text-slate-100'
                    : 'text-text-secondary dark:text-slate-400'
                }`}
              >
                {tab.label}
              </Text>

              {tab.badge !== undefined && (
                <View
                  className={`px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-primary-light dark:bg-blue-900'
                      : 'bg-slate-200 dark:bg-slate-600'
                  }`}
                >
                  <Text
                    className={`text-[10px] font-bold ${
                      isActive
                        ? 'text-primary dark:text-blue-300'
                        : 'text-text-secondary dark:text-slate-300'
                    }`}
                  >
                    {tab.badge}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    );

    return isScrollable ? (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className={className}
      >
        {content}
      </ScrollView>
    ) : (
      <View className={className}>{content}</View>
    );
  }

  // Default: underline variant
  const content = (
    <View className="flex-row border-b border-border dark:border-slate-800">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <TouchableOpacity
            key={tab.id}
            onPress={() => onTabChange(tab.id)}
            activeOpacity={0.8}
            className={`flex-row items-center justify-center py-3 px-4 gap-2 border-b-2 ${
              !isScrollable ? 'flex-1' : ''
            } ${
              isActive
                ? 'border-primary'
                : 'border-transparent'
            }`}
          >
            {tab.icon && <View>{tab.icon}</View>}
            <Text
              className={`text-body font-semibold ${
                isActive
                  ? 'text-primary dark:text-blue-400'
                  : 'text-text-secondary dark:text-slate-400'
              }`}
            >
              {tab.label}
            </Text>

            {tab.badge !== undefined && (
              <View
                className={`px-1.5 py-0.5 rounded-full ${
                  isActive
                    ? 'bg-primary-light dark:bg-blue-900'
                    : 'bg-slate-100 dark:bg-slate-800'
                }`}
              >
                <Text
                  className={`text-[10px] font-bold ${
                    isActive
                      ? 'text-primary dark:text-blue-300'
                      : 'text-text-secondary dark:text-slate-300'
                  }`}
                >
                  {tab.badge}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return isScrollable ? (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className={className}
    >
      {content}
    </ScrollView>
  ) : (
    <View className={className}>{content}</View>
  );
}
