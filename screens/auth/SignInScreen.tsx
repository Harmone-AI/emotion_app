import {
  Keyboard,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Platform,
  Image,
  SafeAreaView,
  StatusBar,
} from "react-native";
import React, { useState } from "react";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useScaleSize } from "@/hooks/useScreen";
import AppButton from "@/components/AppButton";
import { HBase } from "@/components/HBase";
import * as WebBrowser from "expo-web-browser";
import { supabase } from "@/hooks/supabase";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import * as AppleAuthentication from "expo-apple-authentication";
import { RootStackParamList } from "@/types/navigation";
import * as Haptics from "expo-haptics";
const logoImage = require("@/assets/login/logo.png");

type SignInScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "SignIn"
>;

type Props = {
  navigation: SignInScreenNavigationProp;
};

export default function SignInScreen({ navigation }: Props) {
  const login = async () => {
    navigation.push("Home");
  };

  const scaleSize = useScaleSize();
  React.useEffect(() => {
    // GoogleSignin.configure({
    //   scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    //   webClientId: 'YOUR CLIENT ID FROM GOOGLE CONSOLE',
    // })
  }, []);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: 80,
        backgroundColor: "#e8eff3",
        alignItems: "center",
        padding: 20,
      }}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#e8eff3" />

      <View style={{ flex: 1 }}></View>
      <Image style={{ width: 185, height: 189 }} source={logoImage}></Image>
      <Text style={{ fontWeight: "bold", fontSize: 20, marginTop: 10 }}>
        Welcome to Harmone!
      </Text>
      <View style={{ flex: 1 }}></View>
      <AppButton
        onPress={async () => {
          // login();
          try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            const credential = await AppleAuthentication.signInAsync({
              requestedScopes: [
                AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                AppleAuthentication.AppleAuthenticationScope.EMAIL,
              ],
            });
            // Sign in via Supabase Auth.
            if (credential.identityToken) {
              const {
                error,
                data: { user },
              } = await supabase.auth.signInWithIdToken({
                provider: "apple",
                token: credential.identityToken,
              });
              if (!error) {
                navigation.replace("Home");
              }
            } else {
              throw new Error("No identityToken.");
            }
          } catch (e) {
            console.error("Error AppleAuthentication", e);
            if (e.code === "ERR_REQUEST_CANCELED") {
              // handle that the user canceled the sign-in flow
            } else {
              // handle other errors
            }
          }
        }}
        style={{
          backgroundColor: "#fff",
          alignItems: "center",
          justifyContent: "center",
          padding: 10,
          borderRadius: scaleSize(12),
          flexDirection: "row",
          width: scaleSize(378),
          alignSelf: "center",

          shadowColor: "#e5e5e5",
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowRadius: 0,
          elevation: 0,
          shadowOpacity: 1,
          borderStyle: "solid",
        }}
      >
        <Image
          style={{
            width: scaleSize(24),
            height: scaleSize(24),
            marginRight: 10,
          }}
          source={require("@/assets/login/apple.png")}
        ></Image>
        <Text
          style={{ color: "#000", fontSize: scaleSize(20), fontWeight: "bold" }}
        >
          Sign in with Apple
        </Text>
      </AppButton>
      <View style={{ height: scaleSize(8) }} />
      <AppButton
        style={{
          backgroundColor: "#fff",
          marginHorizontal: scaleSize(15),
          alignItems: "center",
          justifyContent: "center",
          padding: scaleSize(10),
          borderRadius: scaleSize(12),
          flexDirection: "row",
          width: scaleSize(378),

          shadowColor: "#e5e5e5",
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowRadius: 0,
          elevation: 0,
          shadowOpacity: 1,
          borderStyle: "solid",
        }}
        onPress={async () => {
          try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            GoogleSignin.configure({
              iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
            });
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            if (userInfo.data!.idToken) {
              const { data, error } = await supabase.auth.signInWithIdToken({
                provider: "google",
                token: userInfo.data!.idToken,
              });
              if (!error) {
                navigation.replace("Home");
              }
            } else {
              throw new Error("no ID token present!");
            }
          } catch (error: any) {
            console.log("xuanpinglog", "google", error);
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
              // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
              // operation (e.g. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
              // play services not available or outdated
            } else {
              // some other error happened
            }
          }
          // let { data, error } = await supabase.auth.signInWithOAuth({
          //   provider: "google",
          // });
          // if (!data.url) {
          //   return;
          // }
          // WebBrowser.openAuthSessionAsync(data.url);
          // console.log("google", data, error);
        }}
      >
        <Image
          style={{
            width: scaleSize(24),
            height: scaleSize(24),
            marginRight: 10,
          }}
          source={require("@/assets/login/google.png")}
        ></Image>
        <Text style={{ color: "#000", fontSize: 20, fontWeight: "bold" }}>
          Sign in with Google
        </Text>
      </AppButton>
      <View
        style={{
          width: scaleSize(358),
        }}
      >
        <Text
          style={{
            paddingTop: scaleSize(20),
            marginBottom: scaleSize(100),
            color: "#95a7b1",
            fontWeight: "bold",
            lineHeight: scaleSize(20),
          }}
        >
          Logging In Indicates That You Have Read And Agreed To Our{" "}
          <Text
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              console.log("Terms Of Service");
              WebBrowser.openBrowserAsync("https://expo.dev");
            }}
            style={{ color: "#5a5a5a" }}
          >
            Terms Of Service
          </Text>{" "}
          And{" "}
          <Text
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            style={{ color: "#5a5a5a" }}
          >
            Privacy Policy.
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}
