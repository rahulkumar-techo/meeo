import React from 'react';
import { Redirect } from 'expo-router';
import { useAuthStore } from '@/features/auth';

export default function Index() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return <Redirect href={isAuthenticated ? '/(tabs)' : '/(auth)/sign-in'} />;
}

