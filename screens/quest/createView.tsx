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
  TextInput
} from 'react-native';
const animalImage = require("@/assets/animal.png")
import * as api from "@/api/api"
import Loading from '@/components/Loading';

export default function CreateView({ navigation, onClose, userInput }: any) {

  const [rotation, setRotation] = useState(new Animated.Value(0));
  const [showLoading, setShowLoading] = useState(false);

  const [list, setList] = useState<any>([]);

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
  const done = () => {
    onClose();
  }

  useEffect(() => {
    query();
  }, [])

  const query = async () => {
    console.log("res22===");
    let res: any = await api.current_tasklist(1);
    console.log("res===", res);
    setList(res.tasks);
  }

  const regenerate = async () => {
    setShowLoading(true);
    let res = await api.word2tasklist({
      "user_input": userInput,
      "user_id": 1
    });
    setShowLoading(false);
    query();

  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#e8eff3', paddingTop: 20, zIndex: 200, paddingHorizontal: 20 }}>
      <View style={{ flexDirection: "column", alignItems: "center", width: "100%", backgroundColor: "#F29762", borderRadius: 16, padding: 16 }}>
        <Image style={{ width: 113, height: 118 }} source={require("@/assets/home/hhh.png")}></Image>
        <Text style={{ color: "#fff", fontSize: 32, fontWeight: "bold" }}>Braincell Deathmatch</Text>
        <Text style={{ color: "#fff", fontSize: 16 }}>“ruthless or not?”</Text>
        <View style={{ width: "100%", flexDirection: "row", alignItems: "center", marginVertical: 20 }}>
          <View style={{ flex: 1, backgroundColor: "#D46422", height: 30, borderRadius: 40, borderWidth: 2, borderColor: "#fff" }}>
            <View style={{ position: "absolute", left: 0, right: 0, bottom: 0, top: 0, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ color: "#F29762" }}>5/20</Text>
            </View>
          </View>
          <Image style={{ width: 44, height: 44, marginLeft: -20 }} source={require("@/assets/task/reward.png")}></Image>
        </View>
        <TouchableOpacity style={{ position: "absolute", right: 10, top: 10 }} onPress={() => {
          close();
        }}>
          <Image style={{ width: 32, height: 32 }} source={require("@/assets/home/close.png")}></Image>
        </TouchableOpacity>

      </View>
      <View style={{ marginVertical: 20 }}>
        {list.map((item: any,index:any) => {
          return <View key={index} style={{ height: 56, width: "100%", boxShadow: "2px 2px 2px #00000022", borderRadius: 20, paddingVertical: 10, marginBottom: 20, paddingHorizontal: 8, borderWidth: 2, borderColor: "#00000022", alignItems: "center", flexDirection: "row" }}>
            <Text style={{ fontSize: 14, fontWeight: "bold", flex: 1 }}>{item.content}</Text>
            <TouchableOpacity style={{ width: 40, height: 40, borderWidth: 2, borderRadius: 40, borderColor: "#E0E0E0" }}></TouchableOpacity>
          </View>
        })}
      </View>
      <View style={{ flexDirection: "row", gap: 20 }}>
        <TouchableOpacity onPress={() => {
          regenerate();
        }} style={{ backgroundColor: "#FFD000", flex: 1, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center",flexDirection:"row" }}>
          {showLoading && <Loading></Loading>}
          <Text style={{ color: "#000", fontWeight: "bold" }}>Regenerate</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          done();
        }} style={{ backgroundColor: "#CF620C", flex: 1, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center",flexDirection:"row" }}>
          <Text style={{ color: "#fff", fontWeight: "bold" }}>confirm</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
