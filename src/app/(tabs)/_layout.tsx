import React, { useMemo } from 'react';
import { Tabs } from 'expo-router';
import { CustomTabBar } from '@/components/navigation/CustomTabBar';
import { useTheme } from '@/theme';

export default function TabLayout() {
    const { theme } = useTheme();

    const screenOptions = useMemo(() => ({
        headerShown: false,
        animation: 'none' as const,
        freezeOnBlur: true,
        sceneStyle: {
            backgroundColor: theme.background,
        },
    }), [theme.background]);

    return (
        <Tabs
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={screenOptions}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                }}
            />
            <Tabs.Screen
                name="play"
                options={{
                    title: 'Play',
                }}
            />
            <Tabs.Screen
                name="categories"
                options={{
                    title: 'Categories',
                }}
            />
            <Tabs.Screen
                name="cart"
                options={{
                    title: 'Cart',
                }}
            />
            <Tabs.Screen
                name="account"
                options={{
                    title: 'Account',
                }}
            />
        </Tabs>
    );
}
