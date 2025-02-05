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
  Dimensions
} from 'react-native';
import InputView from '../home/inputView';
import PopView from '@/components/PopView';
import TaskList from '../task/taskList';
const animalImage = require("@/assets/animal.png")
const { width, height } = Dimensions.get('window')

export default function HomeScreen({ navigation }: any) {
  const [currentValue, setCurrentValue] = useState(0);

  const [rotation, setRotation] = useState(new Animated.Value(0));
  const [showInputView, setShowInputView] = useState(false);
  const [showTaskList, setShowTaskList] = useState(false);

  const [recording, setRecording] = useState(false);
  const [showRecording, setShowRecording] = useState(false);

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
  }, [rotation]);

  const clickInput = () => {
    setShowInputView(true);
  }

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '135deg'], // 从0度旋转到360度
  });

  let keyboardLeftStart = width / 2 - 48;
  let keyboardLeftEnd = width / 4 - 48;
  let keyboardLeft = keyboardLeftStart + (keyboardLeftEnd - keyboardLeftStart) * currentValue;


  let keyboardBottomStart = 50;
  let keyboardBottomEnd = 100;
  let keyboardBottom = keyboardBottomStart + (keyboardBottomEnd - keyboardBottomStart) * currentValue;


  let voiceLeftStart = width / 2 - 48;
  let voiceLeftEnd = width * 3 / 4 - 48;
  let voiceLeft = voiceLeftStart + (voiceLeftEnd - voiceLeftStart) * currentValue;


  let voiceBottomStart = 50;
  let voiceBottomEnd = 100;
  let voiceBottom = voiceBottomStart + (voiceBottomEnd - voiceBottomStart) * currentValue;


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#e8eff3', paddingTop: 50 }}>
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
            onTouchStart={() => {
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
            onTouchStart={() => {
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
            onTouchStart={() => {
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
              <Image style={{ width: 11, height: 6 }} source={require("@/assets/home/arrowup.png")}></Image>
              <Text>Swipe up to cancel</Text>
            </View>
          }

          <Animated.View
            onTouchStart={() => {
              setRecording(true);
            }}
            style={[
              { width: 64, height: 64, backgroundColor: recording ? "#FF7C14" : "#fff", borderRadius: 60, alignItems: "center", justifyContent: "center", marginTop: 30 },
              {

              },
            ]}
          >
            <Image style={{ width: 40, height: 40 }} source={recording? require("@/assets/home/voicewhite.png"): require("@/assets/home/voice.png")}></Image>
          </Animated.View>

        </View>
      }
    </SafeAreaView>
  );
}
