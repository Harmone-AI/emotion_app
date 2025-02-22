import AppButton from "@/components/AppButton";
import { HBase } from "@/components/HBase";
import Page from "@/components/Page";
import { useScaleSize } from "@/hooks/useScreen";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Portal } from "@gorhom/portal";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useCallback, useRef, useState } from "react";
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
  StyleSheet,
} from "react-native";
const animalImage = require("@/assets/animal.png");

export default function Tasks({ navigation, onClose }: any) {
  const [rotation, setRotation] = useState(new Animated.Value(0));

  const [list, setList] = useState([
    {
      date: "Today",
      list: [
        {
          image: require("@/assets/home/hhh.png"),
          name: "Daily Earnings Plan",
          finished: true,
        },
        {
          image: require("@/assets/home/hhh.png"),
          name: "Daily Earnings Plan",
          finished: true,
        },
        {
          image: require("@/assets/home/hhh.png"),
          name: "Daily Earnings Plan",
          finished: false,
        },
      ],
    },
    {
      date: "1/20",
      list: [
        {
          image: require("@/assets/home/hhh.png"),
          name: "Daily Earnings Plan",
          finished: true,
        },
        {
          image: require("@/assets/home/hhh.png"),
          name: "Daily Earnings Plan",
          finished: true,
        },
        {
          image: require("@/assets/home/hhh.png"),
          name: "Daily Earnings Plan",
          finished: false,
        },
      ],
    },
  ]);

  const close = () => {
    onClose();
  };
  const done = () => {
    onClose();
  };

  const scaleSize = useScaleSize();

  return (
    <Page
      contentContainerStyle={{
        paddingVertical: scaleSize(20),
      }}
    >
      {list.map((item, dateIndex) => {
        return (
          <View
            key={dateIndex}
            style={{
              width: scaleSize(177 + 177 + 8),
              alignSelf: "center",
              marginTop: dateIndex == 0 ? 0 : scaleSize(24),
            }}
          >
            <HBase
              style={{
                fontSize: scaleSize(20),
                lineHeight: scaleSize(32),
                textTransform: "capitalize",
                fontWeight: "700",
              }}
            >
              {item.date}
            </HBase>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                alignSelf: "center",
              }}
            >
              {item.list.map((item, taskIndex) => {
                return (
                  <AppButton
                    key={taskIndex}
                    style={{
                      width: scaleSize(177),
                      height: scaleSize(211),
                      marginLeft: taskIndex % 2 !== 0 ? scaleSize(8) : 0,
                      borderWidth: scaleSize(1),
                      borderColor: "#E5E5E5",
                      justifyContent: "center",
                      alignItems: "center",
                      shadowColor: "#e5e5e5",
                      shadowOffset: {
                        width: 0,
                        height: 0,
                      },
                      shadowRadius: 0,
                      elevation: 0,
                      shadowOpacity: 1,
                      borderRadius: 8,
                      marginTop: scaleSize(8),
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        style={{
                          width: 91,
                          height: 122,
                        }}
                        resizeMode="cover"
                        source={require("./head.png")}
                      />
                    </View>
                    <Text
                      style={[
                        {
                          fontSize: 15,
                          lineHeight: 15,
                          textTransform: "capitalize",
                          fontWeight: "700",
                          fontFamily: "SF Pro Rounded",
                          color: "#282e32",
                          textAlign: "center",
                          marginBottom: scaleSize(20),
                        },
                        styles.textTypo,
                      ]}
                    >
                      Daily Earnings Plan
                    </Text>
                    <View style={styles.wrapper}>
                      <Text style={[styles.text, styles.textTypo]}>03.06</Text>
                    </View>
                  </AppButton>
                );
              })}
            </View>
          </View>
        );
      })}
    </Page>
  );
}

const styles = StyleSheet.create({
  textTypo: {
    textAlign: "center",
    fontFamily: "SF Pro Rounded",
  },
  component3Icon: {
    top: -5,
    right: -4,
    position: "absolute",
  },
  text: {
    fontSize: 10,
    fontWeight: "500",
    color: "#fff",
  },
  wrapper: {
    top: 12,
    left: 12,
    borderRadius: 25,
    backgroundColor: "#ff8124",
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    position: "absolute",
  },
});
