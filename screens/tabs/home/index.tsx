import { Image } from "expo-image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Keyboard,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Animated,
  Dimensions,
  Button,
  Alert,
  StatusBar,
  useAnimatedValue,
} from "react-native";
const animalImage = require("@/assets/animal.png");
const { width, height } = Dimensions.get("window");
import * as api from "@/api/api";

import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";
import Loading from "@/components/Loading";
import RecordingView from "@/components/RecordingView";
import AppButton from "@/components/AppButton";
import { useScaleSize } from "@/hooks/useScreen";
import Ionicons from "@expo/vector-icons/Ionicons";
import AppLoading from "@/components/Loading";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useQuestStore } from "@/hooks/zustand/quest";
import { HBase } from "@/components/HBase";
import React from "react";

const AnimatedIonicons = Animated.createAnimatedComponent(Ionicons);

export default function HomeScreen({ navigation }: any) {
  const rotationAnimatedValue = useAnimatedValue(1, {
    useNativeDriver: true,
  });

  const [recording, setRecording] = useState(0);
  const [showRecording, setShowRecording] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  const [recognizing, setRecognizing] = useState(false);

  useSpeechRecognitionEvent("start", () => setRecognizing(true));
  useSpeechRecognitionEvent("end", () => setRecognizing(false));
  useSpeechRecognitionEvent("result", (event) => {
    if (event.isFinal) {
      done(event.results[0]?.transcript);
    }
  });
  useSpeechRecognitionEvent("error", (event) => {
    if (recording !== 2) {
      console.error(
        "error code:",
        event.error,
        "error message:",
        event.message
      );
    }
    setRecording(0);
  });

  const handleStart = async () => {
    const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!result.granted) {
      console.warn("Permissions not granted", result);
      return;
    }
    // Start speech recognition
    ExpoSpeechRecognitionModule.start({
      lang: "en-US",
      interimResults: true,
      maxAlternatives: 1,
      continuous: false,
      requiresOnDeviceRecognition: false,
      addsPunctuation: false,
      contextualStrings: ["Carlsen", "Nepomniachtchi", "Praggnanandhaa"],
    });
  };

  const post = useQuestStore((state) => state.post);

  const done = async (transcript: string) => {
    setRecording(0);
    setShowLoading(true);
    let res = await post(transcript);
    setShowLoading(false);
    navigation.navigate("task");
  };

  const clickAdd = () => {
    Animated.timing(rotationAnimatedValue, {
      toValue: rotationAnimatedValue._value > 0 ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // rotationAnimatedValue.setValue(0); // 重置旋转
    });
  };

  const clickInput = () => {
    navigation.navigate("keyboard-input-target");
  };

  const scaleSize = useScaleSize();
  const keyboardVoiceMargin = 48;
  const addActionsMargin = 7;
  const actionButtonSize = 96;
  const addButtonSize = 64;
  const loadingSize = 80;
  const addButtonActionsMargin = -8;
  const actionsTranslateY = scaleSize(
    actionButtonSize / 2 + addActionsMargin + addButtonSize / 2
  );
  const actionsTranslateX = scaleSize(
    actionButtonSize / 2 + addButtonSize / 2 + addButtonActionsMargin
  );
  const tapStartLocation = React.useRef({ x: 0, y: 0 });
  return (
    <SafeAreaView
      onTouchStart={(event) => {
        if (showRecording) {
          setRecording(0);
          setShowRecording(false);
          rotationAnimatedValue.setValue(0);
          clickAdd();
        }
      }}
      style={{ flex: 1, backgroundColor: "#e8eff3", paddingTop: 10 }}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#e8eff3" />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <AppButton
          onPress={() => navigation.navigate("tasks")}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <View
            style={{
              marginLeft: scaleSize(16),
              flexDirection: "row",
              alignItems: "center",
              borderTopRightRadius: 20,
              borderBottomRightRadius: 20,
            }}
          >
            <View
              style={{
                borderRadius: 10,
                backgroundColor: "#fff",
                borderStyle: "solid",
                borderColor: "rgba(0, 0, 0, 0.1)",
                borderWidth: 1,
                width: scaleSize(56),
                height: scaleSize(56),
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={require("@/screens/tasks/head.png")}
                contentFit="contain"
                style={{ width: scaleSize(46), height: scaleSize(46) }}
              />
            </View>
            <Image
              source={require("./more.svg")}
              style={{
                width: scaleSize(28),
                height: scaleSize(28),
                marginLeft: scaleSize(5),
              }}
            />
          </View>
        </AppButton>
        <AppButton
          style={{ marginRight: scaleSize(16) }}
          onPress={() => {
            navigation.navigate("stories");
          }}
        >
          <Image
            style={{ width: 48, height: 48, zIndex: 10 }}
            source={require("@/assets/home/rili.png")}
          ></Image>
        </AppButton>
      </View>
      <View style={{ alignItems: "center" }}>
        <Image style={{ width: 273, height: 371 }} source={animalImage}></Image>
      </View>
      <View style={{ flex: 1 }}></View>
      {/* <AppLoading width={40} height={40} /> */}
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Animated.View
            onTouchStart={(event) => {
              clickInput();
            }}
            style={{
              width: scaleSize(actionButtonSize),
              height: scaleSize(actionButtonSize),
              backgroundColor: "#fff",
              borderRadius: 60,
              alignItems: "center",
              justifyContent: "center",
              transform: [
                {
                  translateX: rotationAnimatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, actionsTranslateX],
                  }),
                },
                {
                  translateY: rotationAnimatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, actionsTranslateY],
                  }),
                },
                {
                  scale: rotationAnimatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, addButtonSize / actionButtonSize],
                  }),
                },
              ],
              opacity: rotationAnimatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0],
              }),
            }}
          >
            <Image
              style={{ width: scaleSize(60), height: scaleSize(60) }}
              source={require("@/assets/home/keyboard.png")}
            ></Image>
          </Animated.View>

          <Animated.View
            onTouchStart={(event) => {
              event.stopPropagation();
              setShowRecording(true);
              clickAdd();
            }}
            style={{
              width: scaleSize(actionButtonSize),
              height: scaleSize(actionButtonSize),
              backgroundColor: "#fff",
              borderRadius: scaleSize(actionButtonSize),
              alignItems: "center",
              justifyContent: "center",
              marginLeft: scaleSize(keyboardVoiceMargin),
              opacity: rotationAnimatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0],
              }),
              transform: [
                {
                  translateX: rotationAnimatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -actionsTranslateX],
                  }),
                },
                {
                  translateY: rotationAnimatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, actionsTranslateY],
                  }),
                },
                {
                  scale: rotationAnimatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, addButtonSize / actionButtonSize],
                  }),
                },
              ],
            }}
          >
            <Image
              style={{ width: scaleSize(60), height: scaleSize(60) }}
              source={require("@/assets/home/voice.png")}
            ></Image>
          </Animated.View>
        </View>
        <View
          style={{
            marginTop: scaleSize(addActionsMargin),
            width: scaleSize(addButtonSize),
            height: scaleSize(addButtonSize),
            marginBottom: scaleSize(17),
          }}
        >
          <Animated.View
            onTouchStart={(event) => {
              event.stopPropagation();
              clickAdd();
            }}
            style={{
              marginBottom: scaleSize(17),
              width: scaleSize(addButtonSize),
              height: scaleSize(addButtonSize),
              backgroundColor: rotationAnimatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: ["rgba(51, 51, 51, 1)", "rgba(255, 255, 255, 1)"],
              }),
              transform: [
                {
                  rotate: rotationAnimatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["45deg", "0deg"],
                  }),
                },
              ],
              borderRadius: 40,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Animated.Image
              style={{
                width: scaleSize(32),
                height: scaleSize(32),
                opacity: rotationAnimatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                }),
                // tintColor: rotationAnimatedValue.interpolate({
                //   inputRange: [0, 1],
                //   outputRange: ["rgba(51, 51, 51, 1)", "rgba(255, 255, 255, 1)"],
                // }),
                // tintColor: "white",
              }}
              // tintColor={"white"}
              // tintColor={rotationAnimatedValue.interpolate({
              //   inputRange: [0, 1],
              //   outputRange: ["rgba(51, 51, 51, 1)", "rgba(255, 255, 255, 1)"],
              // })}
              source={require("@/assets/home/add.png")}
            ></Animated.Image>
            <Animated.Image
              style={{
                position: "absolute",
                alignSelf: "center",
                width: scaleSize(32),
                height: scaleSize(32),
                opacity: rotationAnimatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0],
                }),
              }}
              source={require("@/assets/home/addwhite.png")}
            ></Animated.Image>
          </Animated.View>
          {showRecording && (
            <GestureHandlerRootView
              style={{
                position: "absolute",
                left: 0,
                bottom: 0,
                right: 0,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {recording !== 0 && (
                <View
                  style={{
                    alignItems: "center",
                    width: scaleSize(300),
                    marginBottom: scaleSize(30),
                  }}
                >
                  <RecordingView></RecordingView>

                  <Image
                    style={{ width: 11, height: 6, marginTop: scaleSize(30) }}
                    source={require("@/assets/home/arrowup.png")}
                  ></Image>
                  <HBase
                    style={{
                      color: "#86A2B2",
                      textAlign: "center",
                      fontSize: 12,
                      fontStyle: "normal",
                      fontWeight: "600",
                      textTransform: "capitalize",
                      marginTop: scaleSize(7),
                    }}
                  >
                    {recording === 1
                      ? "Swipe up to cancel"
                      : recording === 2
                      ? "Release to cancel"
                      : "Hold to record"}
                  </HBase>
                </View>
              )}

              {showLoading ? (
                <View
                  style={{
                    width: scaleSize(addButtonSize),
                    height: scaleSize(addButtonSize),
                    backgroundColor: "#fff",
                    borderRadius: scaleSize(addButtonSize),
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Loading width={50} height={50} borderSize={30}></Loading>
                </View>
              ) : (
                <Animated.View
                  onTouchStart={(event) => {
                    event.stopPropagation();
                    setRecording(1);
                    handleStart();
                    tapStartLocation.current = {
                      x: event.nativeEvent.locationX,
                      y: event.nativeEvent.locationY,
                    };
                  }}
                  onTouchMove={(event) => {
                    if (
                      event.nativeEvent.locationY - tapStartLocation.current.y <
                      -5
                    ) {
                      setRecording(2);
                    } else {
                      setRecording(1);
                    }
                  }}
                  onTouchCancel={(event) => {
                    setRecording(0);
                    ExpoSpeechRecognitionModule.abort();
                  }}
                  onTouchEnd={() => {
                    setRecording(0);
                    if (recording === 2) {
                      ExpoSpeechRecognitionModule.abort();
                      return;
                    }
                    ExpoSpeechRecognitionModule.stop();
                  }}
                  style={{
                    width: scaleSize(addButtonSize),
                    height: scaleSize(addButtonSize),
                    backgroundColor: recording ? "#FF7C14" : "#fff",
                    borderRadius: 60,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    style={{ width: 40, height: 40 }}
                    source={
                      recording
                        ? require("@/assets/home/voicewhite.png")
                        : require("@/assets/home/voice.png")
                    }
                  ></Image>
                </Animated.View>
              )}
            </GestureHandlerRootView>
          )}
        </View>
      </View>

      {/* <View>
        {!recognizing ? (
          <Button title="Start" onPress={handleStart} />
        ) : (
          <Button
            title="Stop"
            onPress={() => ExpoSpeechRecognitionModule.stop()}
          />
        )}

        <ScrollView>
          <Text>{transcript}</Text>
        </ScrollView>
      </View> */}
    </SafeAreaView>
  );
}
