import PopView from '@/components/PopView';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Portal } from '@gorhom/portal';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useRef, useState } from 'react';
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
  TextInput
} from 'react-native';
import * as api from "@/api/api"
import CreateView from '../task/createView';
import Loading from '@/components/Loading';
const animalImage = require("@/assets/animal.png")

export default function InputView({ navigation, onClose }: any) {

  const [rotation, setRotation] = useState(new Animated.Value(0));
  const [showCreateView, setShowCreateView] = useState(false);

  const [userInput, setUserInput] = useState("");
  const [showLoading, setShowLoading] = useState(false);

  const [taskids, setTaskids] = useState([]);

  const clickAdd = () => {
    console.log("clickadd");
    // 创建一个平移 + 透明度的动画
    Animated.timing(rotation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // rotation.setValue(0); // 重置旋转
    });
  }

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '135deg'], // 从0度旋转到360度
  });

  const close = () => {
    onClose();
  }
  const done = async () => {
    setShowLoading(true);
    let res = await api.word2tasklist({
      "user_input": userInput,
      "user_id": 1
    });

    setShowCreateView(true);
    setShowLoading(false);
  }

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#e8eff3', paddingTop: 20, zIndex: 100, paddingHorizontal: 20 }}>
        <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
          <TouchableOpacity onPress={() => {
            close();
          }}>
            <Image style={{ width: 32, height: 32 }} source={require("@/assets/home/close.png")}></Image>
          </TouchableOpacity>
        </View>
        <TextInput value={userInput} onChangeText={(v) => {
          setUserInput(v);
        }} style={{ flex: 1, fontSize: 24 }}></TextInput>
        <TouchableOpacity onPress={() => {
          done();
        }} style={{ backgroundColor: "#FF7C14", width: "100%", height: 40, borderRadius: 8, alignItems: "center", justifyContent: "center",flexDirection:"row" }}>
          {showLoading && <Loading></Loading>}
          <Text style={{ color: "#fff" }}>DONE</Text>
        </TouchableOpacity>

      </SafeAreaView>

      {showCreateView && <PopView><CreateView userInput={userInput} taskids={taskids} onClose={() => {
        setShowCreateView(false);
      }}></CreateView></PopView>}
    </View>
  );
}
