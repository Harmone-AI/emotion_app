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
  Animated
} from 'react-native';
const animalImage = require("@/assets/animal.png")

export default function HomeScreen({ navigation }: any) {

  const [rotation, setRotation] = useState(new Animated.Value(0));

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
        <Image style={{ width: 48, height: 48, zIndex: 10 }} source={require("@/assets/home/rili.png")}></Image>

      </View>
      <View style={{ alignItems: "center" }}>
        <Image style={{ width: 273, height: 371 }} source={animalImage}></Image>
      </View>
      <View style={{ flex: 1 }}></View>
      <View style={{ display: "flex", alignItems: "center", paddingBottom: 40,position:"relative" }}>

        <Animated.View
          onTouchStart={() => {
            clickAdd();
          }}
          style={[
            { width: 96, height: 96, backgroundColor: "#fff", borderRadius: 60, alignItems: "center", justifyContent: "center", position: "absolute",left:"50%",bottom:50,"translateX":-50 },
            {

            },
          ]}
        >
          <Image style={{ width: 60, height: 60 }} source={require("@/assets/home/keyboard.png")}></Image>
        </Animated.View>

        <Animated.View
          onTouchStart={() => {
            clickAdd();
          }}
          style={[
            { width: 96, height: 96, backgroundColor: "#fff", borderRadius: 60, alignItems: "center", justifyContent: "center", position: "absolute",left:"50%",bottom:50  },
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
            { width: 64, height: 64, backgroundColor: "#fff", borderRadius: 40, alignItems: "center", justifyContent: "center", position: "absolute",left:"50%",bottom:50  },
            {
              transform: [{ "rotate": rotateInterpolate }], // 应用平移
            },
          ]}
        >
          <Image style={{ width: 32, height: 32 }} source={require("@/assets/home/add.png")}></Image>
        </Animated.View>



      </View>
    </SafeAreaView>
  );
}
