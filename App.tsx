import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { PortalProvider } from '@gorhom/portal';
import { QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAppState, useNetworkState } from './libs/query-helpers';
import { queryClient } from './libs/queryClient';
import Navigation from './navigation';

import { ClerkLoaded, ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from './cache';
import './style.css';

export default function App() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

  if (!publishableKey) {
    throw new Error('Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your .env file');
  }

  // 初始化应用状态监听
  useAppState();
  // 初始化网络状态监听
  useNetworkState();

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PortalProvider>
          <BottomSheetModalProvider>
            <ClerkProvider
              publishableKey={publishableKey}
              tokenCache={tokenCache}
            >
              <ClerkLoaded>
                <Navigation />
              </ClerkLoaded>
            </ClerkProvider>
          </BottomSheetModalProvider>
        </PortalProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
