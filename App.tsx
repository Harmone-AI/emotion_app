import 'react-native-gesture-handler';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { PortalProvider } from '@gorhom/portal';
import { QueryClientProvider } from '@tanstack/react-query';
import Navigation from './navigation';
import { queryClient } from './libs/queryClient';
import { useAppState, useNetworkState } from './libs/query-helpers';

import './style.css';

export default function App() {
  // 初始化应用状态监听
  useAppState();
  // 初始化网络状态监听
  useNetworkState();

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PortalProvider>
          <BottomSheetModalProvider>
            <Navigation />
          </BottomSheetModalProvider>
        </PortalProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
