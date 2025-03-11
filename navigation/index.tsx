import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { Text, TouchableOpacity, useColorScheme, View } from "react-native";

import SignInScreen from "../screens/auth/SignInScreen";
import StoryDetailScreen from "../screens/story";
import StoryListScreen from "../screens/stories";
import AddGoalScreen from "../screens/tabs/AddGoalScreen";
import HomeScreen from "../screens/tabs/home";
import SettingsScreen from "../screens/tabs/SettingsScreen";
import { DrawerParamList, RootStackParamList } from "./types";
import { PostHogProvider } from "posthog-react-native";
import Tasks from "@/screens/tasks";
import TaskScreen from "@/screens/quest";
import { Image } from "expo-image";
import { useScaleSize } from "@/hooks/useScreen";
import { supabase } from "@/hooks/supabase";
import * as SplashScreen from "expo-splash-screen";
import KeyboardInputTargetScreen from "@/screens/tabs/home/KeyboardInputTarget";
import TestScreen from "@/screens/test/TestScreen";
import QuestScreen from "@/screens/quest";
import RedditShareExample from "@/screens/test/RedditShareExample";
import { SessionReplyPermissionDialog } from "@/screens/dialog/SessionReplyPermissionDialog";
import { useSetting, useSettingStore } from "@/hooks/zustand/setting";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigation() {
  const [initialRouteName, setInitialRouteName] = React.useState<
    keyof RootStackParamList | undefined
  >();
  const initBySession = React.useCallback(async () => {
    try {
      const session = await supabase.auth.getSession();
      if (session.data.session?.user) {
        setInitialRouteName("Home");
      } else {
        setInitialRouteName("SignIn");
      }
      setTimeout(() => {
        SplashScreen.hideAsync();
      }, 200);
    } catch (error) {
      console.error("Error initBySession", error);
      setInitialRouteName("SignIn");
    }
  }, []);
  React.useEffect(() => {
    initBySession();
  }, []);
  const scheme = useColorScheme();
  const [data, setData] = useSetting("p_session_replay");
  if (initialRouteName === undefined) {
    return null;
  }
  return (
    <NavigationContainer theme={scheme === "dark" ? DarkTheme : DefaultTheme}>
      <PostHogProvider
        apiKey="phc_oRAcPnb1Mt5vy38HacooO5Mq6qmtBxfa6D0DjYnevFM"
        autocapture={true}
        options={{
          host: "https://us.i.posthog.com",

          // check https://posthog.com/docs/session-replay/installation?tab=React+Native
          // for more config and to learn about how we capture sessions on mobile
          // and what to expect
          enableSessionReplay: !!data,
          sessionReplayConfig: {
            // Whether text inputs are masked. Default is true.
            // Password inputs are always masked regardless
            maskAllTextInputs: false,
            // Whether images are masked. Default is true.
            maskAllImages: false,
            // Capture logs automatically. Default is true.
            // Android only (Native Logcat only)
            captureLog: true,
            // Whether network requests are captured in recordings. Default is true
            // Only metric-like data like speed, size, and response code are captured.
            // No data is captured from the request or response body.
            // iOS only
            captureNetworkTelemetry: true,
            // Deboucer delay used to reduce the number of snapshots captured and reduce performance impact. Default is 500ms
            androidDebouncerDelayMs: 1000,
            // Deboucer delay used to reduce the number of snapshots captured and reduce performance impact. Default is 1000ms
            iOSdebouncerDelayMs: 1000,
          },
        }}
        style={{ flex: 1 }}
      >
        <Stack.Navigator
          initialRouteName={__DEV__ ? initialRouteName : initialRouteName}
          screenOptions={{
            headerBackImageSource: require("@/assets/images/back.png"),
            headerBackTitle: "",
            headerShadowVisible: true,
            headerBackButtonDisplayMode: "minimal",
            headerTintColor: "#D0D0D0",
            headerTitleStyle: {
              color: "#4F4F4F",
            },
            // headerSearchBarOptions: {
            //   tintColor: "#E0E0E0",
            // },
            // headerTintColor: "#E0E0E0",
            headerTransparent: true,
            headerBlurEffect: "regular",
            headerStyle: {
              backgroundColor: "transparent",
            },
          }}
        >
          {/* {!isSignedIn ? (
          <>
            <Stack.Screen name='SignIn' component={SignInScreen} />
            <Stack.Screen name='SignUp' component={SignUpScreen} />
          </>
        ) : ( */}
          <>
            <Stack.Group screenOptions={{ headerShown: false }}>
              <Stack.Screen name="SignIn" component={SignInScreen} />
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen
                name="quest"
                component={QuestScreen}
                options={{
                  animation: "slide_from_bottom",
                }}
              />
              <Stack.Screen
                name="keyboard-input-target"
                component={KeyboardInputTargetScreen}
                options={{
                  presentation: "containedTransparentModal",
                }}
              />
              <Stack.Screen
                name="story"
                component={StoryDetailScreen}
                options={{
                  presentation: "formSheet",
                  title: "",
                  headerShadowVisible: false,
                }}
              />
              <Stack.Screen
                name="session-reply-permission"
                component={SessionReplyPermissionDialog}
                options={{
                  presentation: "transparentModal",
                  animation: "fade",
                }}
              />
            </Stack.Group>
            <Stack.Group screenOptions={{ headerShown: true }}>
              <Stack.Screen
                name="AddGoal"
                component={AddGoalScreen}
                options={{ headerShown: false, presentation: "modal" }}
              />
              <Stack.Screen
                name="tasks"
                component={Tasks}
                options={{ title: "Task List" }}
              />
              <Stack.Screen
                name="stories"
                component={StoryListScreen}
                options={{ title: "Story List" }}
              />

              <Stack.Screen name="test" component={TestScreen} />
              <Stack.Screen
                name="reddit-share-example"
                component={RedditShareExample}
                options={{ title: "Reddit Share Example" }}
              />
              <Stack.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                  headerShown: true,
                  title: "Settings",
                }}
              />
            </Stack.Group>
          </>
          {/* )} */}
        </Stack.Navigator>
      </PostHogProvider>
    </NavigationContainer>
  );
}
