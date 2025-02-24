import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { PortalProvider } from "@gorhom/portal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { tokenCache } from "./cache";
import { useAppState, useNetworkState } from "./libs/query-helpers";
import Navigation from "./navigation";
import "./style.css";

import { PostHogProvider } from "posthog-react-native";
import * as SplashScreen from "expo-splash-screen";
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error("Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your .env file");
}

export default function App() {
  // 初始化应用状态监听
  useAppState();
  // 初始化网络状态监听
  useNetworkState();
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PortalProvider>
          {/* <SafeAreaProvider
            style={{ flex: 1 }}
            initialMetrics={{
              ...initialWindowMetrics,
              insets: {
                ...initialWindowMetrics?.insets,
                bottom: initialWindowMetrics?.insets?.bottom || 20,
              },
            }}
          > */}
          <BottomSheetModalProvider>
            <Navigation />
          </BottomSheetModalProvider>
          {/* </SafeAreaProvider> */}
        </PortalProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
