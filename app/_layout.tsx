// File: app/_layout.tsx
// Author: (cmcfar)/cmcfar@bu.edu
// Description: Root layout — redirects to /login if no token, otherwise to /(tabs)/feed

import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    const reset = async () => {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('profileId');
      router.replace('/login');
    };
    reset();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}