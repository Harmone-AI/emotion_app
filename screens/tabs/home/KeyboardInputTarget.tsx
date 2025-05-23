import PopView from "@/components/PopView";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { StackActions, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useCallback, useRef, useState } from "react";
import {
  Keyboard,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Image,
  Animated,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as api from "@/api/api";
import { useScaleSize } from "@/hooks/useScreen";
import AppButton from "@/components/AppButton";
import Page from "@/components/Page";
import StorageHelper from "@/hooks/storage";
import { useQuestStore } from "@/hooks/zustand/quest";
import AppLoading from "@/components/Loading";
import * as Haptics from "expo-haptics";
const animalImage = require("@/assets/animal.png");

export default function KeyboardInputTargetScreen() {
  const [showCreateView, setShowCreateView] = useState(false);
  const scaleSize = useScaleSize();

  const [userInput, setUserInput] = useState("");
  const [showLoading, setShowLoading] = useState(false);

  const [taskids, setTaskids] = useState([]);
  const navigation = useNavigation();

  const close = () => {
    navigation.goBack();
  };
  const post = useQuestStore((state) => state.post);
  const done = async () => {
    try {
      setShowLoading(true);
      await post(userInput);
      navigation.dispatch(StackActions.replace("quest"));
    } catch (e) {
      console.error("Error done:", e);
      setShowLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      {...(Platform.OS === "ios" ? { behavior: "padding" } : {})}
      style={{ flex: 1, backgroundColor: "rgba(230, 239, 244, 0.9)" }}
    >
      <Page
        style={{
          backgroundColor: "transparent",
        }}
        scrollEnabled={false}
        keyboardDismissMode="none"
      >
        <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              close();
            }}
          >
            <Image
              style={{
                width: scaleSize(40),
                height: scaleSize(40),
                marginRight: scaleSize(24),
              }}
              source={require("@/assets/home/close.png")}
            ></Image>
          </TouchableOpacity>
        </View>

        <View
          style={{
            height: scaleSize(500),
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextInput
            numberOfLines={5}
            multiline={true}
            onChangeText={(v) => {
              setUserInput(v);
            }}
            returnKeyType="done"
            style={{
              fontSize: scaleSize(24),
              maxHeight: scaleSize(500),
              fontWeight: "600",
              color: "#000",
              width: scaleSize(322),
              alignSelf: "center",
              textAlignVertical: "center",
              justifyContent: "center", //Centered vertically
              alignItems: "center", //Centered horizontally
            }}
            autoFocus={true}
          ></TextInput>
        </View>
      </Page>
      <AppButton
        disabled={showLoading}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          done();
        }}
        style={{
          backgroundColor: "#FF7C14",
          width: scaleSize(370),
          height: scaleSize(40),
          borderRadius: 8,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          alignSelf: "center",
          marginVertical: scaleSize(20),
        }}
      >
        {showLoading ? (
          <View
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <AppLoading color="white" />
          </View>
        ) : (
          <Text style={{ color: "#fff" }}>DONE</Text>
        )}
      </AppButton>
    </KeyboardAvoidingView>
  );
}
