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
const animalImage = require("@/assets/animal.png")

export default function TaskList({ navigation, onClose }: any) {

  const [rotation, setRotation] = useState(new Animated.Value(0));

  const [list, setList] = useState([
    {
      date: "Today",
      list: [
        {
          image: require("@/assets/home/hhh.png"),
          name: "Daily Earnings Plan",
          finished: true
        },
        {
          image: require("@/assets/home/hhh.png"),
          name: "Daily Earnings Plan",
          finished: true
        },
        {
          image: require("@/assets/home/hhh.png"),
          name: "Daily Earnings Plan",
          finished: false
        }
      ]
    },
    {
      date: "1/20",
      list: [
        {
          image: require("@/assets/home/hhh.png"),
          name: "Daily Earnings Plan",
          finished: true
        },
        {
          image: require("@/assets/home/hhh.png"),
          name: "Daily Earnings Plan",
          finished: true
        },
        {
          image: require("@/assets/home/hhh.png"),
          name: "Daily Earnings Plan",
          finished: false
        }
      ]
    },
  ]);

  const close = () => {
    onClose();
  }
  const done = () => {
    onClose();
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#e8eff3', paddingTop: 20, zIndex: 200, paddingHorizontal: 20 }}>
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity onPress={() => {
          close();
        }}>
          <Image style={{ width: 24, height: 24 }} source={require("@/assets/task/arrow-left.png")}></Image>
        </TouchableOpacity>
        <Text style={{ color: "#000", fontSize: 17, flex: 1, textAlign: "center" }}>Task List</Text>
      </View>
      {list.map((item) => {
        return <View>
          <Text>{item.date}</Text>
          <View style={{}}>
            {item.list.map(item => {
              return <TouchableOpacity>
                <Image style={{ width: 91, height: 122 }} source={item.image}></Image>
                <Text>{item.name}</Text>
              </TouchableOpacity>
            })}
          </View>
        </View>
      })}
    </SafeAreaView>
  );
}
