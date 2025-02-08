import { useSignIn } from '@clerk/clerk-expo';
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
} from 'react-native';
import React, { useState } from 'react';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';


const logoImage = require("@/assets/login/logo.png")
type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

type SignInScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'SignIn'
>;

type Props = {
  navigation: SignInScreenNavigationProp;
};

export default function SignInScreen({ navigation }: Props) {

  const login = async () => {

    navigation.push("Home");
  };


  return (
    <SafeAreaView style={{ flex: 1, paddingTop: 80, backgroundColor: "#e8eff3", alignItems: "center", padding: 20 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#e8eff3" />

      <View style={{ flex: 1 }}></View>
      <Image style={{ width: 185, height: 189 }} source={logoImage}></Image>
      <Text style={{ fontWeight: "bold", fontSize: 20, marginTop: 10 }}>
        Welcome to Harmone!
      </Text>
      <View style={{ flex: 1 }}></View>
      <TouchableOpacity onPress={() => {
        login();
      }} style={{ backgroundColor: "#fff", alignItems: "center", justifyContent: "center", padding: 10, borderRadius: 12, flexDirection: "row", width: "100%" }}>
        <Image style={{ width: 24, height: 24, marginRight: 10 }} source={require("@/assets/login/apple.png")}></Image>
        <Text style={{ color: "#000", fontSize: 20, fontWeight: "bold" }}>Sign in with Apple</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ backgroundColor: "#fff", marginHorizontal: 15, alignItems: "center", justifyContent: "center", padding: 10, borderRadius: 12, marginTop: 20, flexDirection: "row", width: "100%" }}>
        <Image style={{ width: 24, height: 24, marginRight: 10 }} source={require("@/assets/login/google.png")}></Image>
        <Text style={{ color: "#000", fontSize: 20, fontWeight: "bold" }}>Sign in with Google</Text>
      </TouchableOpacity>
      <Text style={{ paddingTop: 20, marginBottom: 100, color: "#999", fontWeight: "bold" }}>Logging In Indicates That You Have Read And Agreed To Our <Text style={{ color: "#000" }}>Terms Of Service</Text> And  <Text style={{ color: "#000" }}>Privacy Policy.</Text></Text>
    </SafeAreaView>
  );
}
