import { tokenCache } from '@/cache';
import {
  ClerkProvider,
  ClerkLoaded,
  useAuth,
  useClerk,
} from '@clerk/clerk-expo';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';

function RootLayoutNav() {
  const { isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';

    if (!isSignedIn && !inAuthGroup) {
      // 如果用户未登录且不在认证页面，重定向到登录页
      router.replace('/(auth)/sign-in');
    } else if (isSignedIn && inAuthGroup) {
      // 如果用户已登录但在认证页面，重定向到主页
      router.replace('/(tabs)');
    }
  }, [isSignedIn, segments]);

  return <Slot />;
}

export default function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

  if (!publishableKey) {
    throw new Error('Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env');
  }

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <RootLayoutNav />
      </ClerkLoaded>
    </ClerkProvider>
  );
}
