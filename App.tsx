import React from "react";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useAppState, useNetworkState } from "./libs/query-helpers";
import Navigation from "./navigation";

import * as SplashScreen from "expo-splash-screen";
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from "react-native-safe-area-context";
import Toast from "./components/Toast";
import { Appearance, View } from "react-native";

SplashScreen.preventAutoHideAsync();
Appearance.setColorScheme("light");

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error("Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your .env file");
}

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <Navigation />
      <Toast />
    </View>
  );
}
