import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Portal } from '@gorhom/portal';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useRef, useState } from 'react';
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
  Dimensions,
  Button,
  Alert,
  StatusBar
} from 'react-native';
import InputView from '../home/inputView';
import PopView from '@/components/PopView';
import TaskList from '../task/taskList';
const animalImage = require("@/assets/animal.png")
const { width, height } = Dimensions.get('window')
import * as api from "@/api/api"


import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";
import Loading from '@/components/Loading';
import RecordingView from '@/components/RecordingView';


export default function HomeScreen({ navigation }: any) {
  const [currentValue, setCurrentValue] = useState(0);

  const [rotation, setRotation] = useState(new Animated.Value(0));
  const [showInputView, setShowInputView] = useState(false);
  const [showTaskList, setShowTaskList] = useState(false);

  const [recording, setRecording] = useState(false);
  const [showRecording, setShowRecording] = useState(false);
  const [showLoading, setShowLoading] = useState(false);


  const [recognizing, setRecognizing] = useState(false);
  const [transcript, setTranscript] = useState("");

  const [cancel, setCancel] = useState(false);

  useSpeechRecognitionEvent("start", () => setRecognizing(true));
  useSpeechRecognitionEvent("end", () => setRecognizing(false));
  useSpeechRecognitionEvent("result", (event) => {
    if (!cancel) {
      console.log("result====", event.results[0].transcript);
      setTranscript(event.results[0]?.transcript);
      done();
    }
  });
  useSpeechRecognitionEvent("error", (event) => {
    if (!cancel) {
      Alert.alert(event.message);
      console.log("error code:", event.error, "error message:", event.message);
      setRecording(false);
    }

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

  const done = async () => {
    setShowLoading(true);
    let res = await api.word2tasklist({
      "user_input": transcript,
      "user_id": 1
    });

    setShowLoading(false);
  }

  const clickAdd = () => {
    console.log("clickadd");
    // 创建一个平移 + 透明度的动画
    if (currentValue == 0) {
      Animated.timing(rotation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {

        // rotation.setValue(0); // 重置旋转
      });
    } else {
      Animated.timing(rotation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {

        // rotation.setValue(0); // 重置旋转
      });
    }

  }

  useEffect(() => {
    // 监听动画值的变化
    const listenerId = rotation.addListener(({ value }) => {
      console.log("value===", value);
      setCurrentValue(value);
    });

    // 清除监听器
    return () => {
      rotation.removeListener(listenerId);
    };
  }, [rotation,showRecording]);

  const clickInput = () => {
    setShowInputView(true);
  }

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '135deg'], // 从0度旋转到360度
  });

  let keyboardLeftStart = width / 2 - 48;
  let keyboardLeftEnd = width / 3 - 48;
  let keyboardLeft = keyboardLeftStart + (keyboardLeftEnd - keyboardLeftStart) * currentValue;


  let keyboardBottomStart = 50;
  let keyboardBottomEnd = 100;
  let keyboardBottom = keyboardBottomStart + (keyboardBottomEnd - keyboardBottomStart) * currentValue;


  let voiceLeftStart = width / 2 - 48;
  let voiceLeftEnd = width * 2 / 3 - 48;
  let voiceLeft = voiceLeftStart + (voiceLeftEnd - voiceLeftStart) * currentValue;


  let voiceBottomStart = 50;
  let voiceBottomEnd = 100;
  let voiceBottom = voiceBottomStart + (voiceBottomEnd - voiceBottomStart) * currentValue;


  return (
    <SafeAreaView onTouchStart={() => {
      if (showRecording) {
        setRecording(false);
        setShowRecording(false);
        setCurrentValue(0);
        rotation.setValue(0);
        clickAdd();

      }
      else if (currentValue == 1) {
        setShowRecording(false);
        setShowRecording(false);
        clickAdd();
      }

    }} style={{ flex: 1, backgroundColor: '#e8eff3', paddingTop: 10 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#e8eff3" />
      <View style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image style={{ width: 48, height: 48, zIndex: 10 }} source={require("@/assets/home/yachi.png")}></Image>
          <View style={{ backgroundColor: "#A8D8E5", marginLeft: -10, flexDirection: "row", alignItems: "center", paddingRight: 20, height: 30, paddingLeft: 20, borderTopRightRadius: 20, borderBottomRightRadius: 20 }}>
            <Text style={{ textAlign: "center" }}>1/19</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => {
          setShowTaskList(true)
        }}>
          <Image style={{ width: 48, height: 48, zIndex: 10 }} source={require("@/assets/home/rili.png")}></Image>
        </TouchableOpacity>
      </View>
      <View style={{ alignItems: "center" }}>
        <Image style={{ width: 273, height: 371 }} source={animalImage}></Image>
      </View>
      <View style={{ flex: 1 }}></View>
      {
        !showRecording && <View style={{ display: "flex", alignItems: "center", paddingBottom: 40, position: "relative" }}>

          <Animated.View
            onTouchStart={(event) => {
              event.stopPropagation();
              clickInput();
            }}
            style={[
              { width: 96, height: 96, backgroundColor: "#fff", borderRadius: 60, alignItems: "center", justifyContent: "center", position: "absolute", left: keyboardLeft, bottom: keyboardBottom, opacity: currentValue },
              {

              },
            ]}
          >
            <Image style={{ width: 60, height: 60 }} source={require("@/assets/home/keyboard.png")}></Image>
          </Animated.View>

          <Animated.View
            onTouchStart={(event) => {
              event.stopPropagation();
              setShowRecording(true);
            }}
            style={[
              { width: 96, height: 96, backgroundColor: "#fff", borderRadius: 60, alignItems: "center", justifyContent: "center", position: "absolute", left: voiceLeft, bottom: voiceBottom, opacity: currentValue },
              {

              },
            ]}
          >
            <Image style={{ width: 60, height: 60 }} source={require("@/assets/home/voice.png")}></Image>
          </Animated.View>


          <Animated.View
            onTouchStart={(event) => {
              event.stopPropagation();
              clickAdd();
            }}
            style={[
              { width: 64, height: 64, backgroundColor: `rgb(${255 * (1 - currentValue)}, ${255 * (1 - currentValue)}, ${255 * (1 - currentValue)})`, borderRadius: 40, alignItems: "center", justifyContent: "center", position: "absolute", left: width / 2 - 32, bottom: 50 },
              {
                transform: [{ "rotate": rotateInterpolate }], // 应用平移
              },
            ]}
          >
            <Image style={{ width: 32, height: 32, position: "absolute", left: 16, top: 16, opacity: (1 - currentValue) }} source={require("@/assets/home/add.png")}></Image>
            <Image style={{ width: 32, height: 32, position: "absolute", left: 16, top: 16, opacity: currentValue }} source={require("@/assets/home/addwhite.png")}></Image>
          </Animated.View>



        </View>
      }


      {showInputView && <PopView><InputView onClose={() => {
        setShowInputView(false);
      }}></InputView></PopView>}

      {showTaskList && <PopView><TaskList onClose={() => {
        setShowTaskList(false);
      }}></TaskList></PopView>}
      {
        showRecording && <View style={{ position: "absolute", left: 0, bottom: 50, right: 0, alignItems: "center" }}>
          {
            recording && <View style={{ alignItems: "center" }}>
              <RecordingView></RecordingView>

              <Image style={{ width: 11, height: 6, marginTop: 20 }} source={require("@/assets/home/arrowup.png")}></Image>
              <Text>Swipe up to cancel</Text>
            </View>
          }

          {showLoading ? <View style={{ width: 60, height: 60, backgroundColor: '#fff', borderRadius: 40, alignItems: "center", justifyContent: "center" }}> <Loading></Loading>  </View> : <Animated.View
            onTouchStart={(event) => {
              event.stopPropagation();
              setRecording(true);
              handleStart();
              setCancel(false);
            }}
            onTouchMove={() => {
              setRecording(false);
              setCancel(true);
              ExpoSpeechRecognitionModule.stop();
            }}
            onTouchEnd={() => {
              ExpoSpeechRecognitionModule.stop();
            }}
            style={[
              { width: 64, height: 64, backgroundColor: recording ? "#FF7C14" : "#fff", borderRadius: 60, alignItems: "center", justifyContent: "center", marginTop: 30 },
              {

              },
            ]}
          >
            <Image style={{ width: 40, height: 40 }} source={recording ? require("@/assets/home/voicewhite.png") : require("@/assets/home/voice.png")}></Image>
          </Animated.View>}

        </View>
      }

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
