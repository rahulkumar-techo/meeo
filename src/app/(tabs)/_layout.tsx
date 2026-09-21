import React from 'react';
import { Tabs } from 'expo-router';
import { CustomTabBar } from '@/components/navigation/CustomTabBar';

export default function TabLayout() {
    return (
        <Tabs
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{
                headerShown: false,
                freezeOnBlur: true,
                animation: 'fade',
            }}
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
