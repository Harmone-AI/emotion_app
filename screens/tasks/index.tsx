import { Quest } from "@/api/api";
import AppButton from "@/components/AppButton";
import { HBase } from "@/components/HBase";
import Page from "@/components/Page";
import { useScaleSize } from "@/hooks/useScreen";
import { useQuestStore } from "@/hooks/zustand/quest";
import { useHeaderHeight } from "@react-navigation/elements";

import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Image } from "expo-image";
import React from "react";
import { useCallback, useRef, useState } from "react";
import {
  Keyboard,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Animated,
  StyleSheet,
  Button,
} from "react-native";
import * as Haptics from "expo-haptics";
import Ionicons from "@expo/vector-icons/Ionicons";
import { RootStackParamList } from "@/navigation/types";
const animalImage = require("@/assets/animal.png");

export default function Tasks({
  navigation,
  onClose,
}: {
  navigation: NativeStackNavigationProp<RootStackParamList, "tasks">;
  onClose: () => void;
}) {
  React.useEffect(() => {
    // Use `setOptions` to update the button that we previously specified
    // Now the button includes an `onPress` handler to update the count
    navigation.setOptions({
      headerStyle: {},
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate("Settings")}
          style={{
            alignItems: "center",
            justifyContent: "center",
            padding: 10,
            paddingRight: 0,
          }}
        >
          <Ionicons name="settings-outline" size={24} color="#4F4F4F" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const close = () => {
    onClose();
  };
  const done = () => {
    onClose();
  };

  const scaleSize = useScaleSize();

  const questMap = useQuestStore((state) => state.questMap);
  const questsByDate = React.useMemo(() => {
    const newQuestsArray: Quest[][] = [[]];
    Object.keys(questMap)
      .sort((a, b) => (Number(a) > Number(b) ? -1 : 1))
      .forEach((key) => {
        const quest = questMap[key];
        if (
          newQuestsArray[newQuestsArray.length - 1]?.[0]?.created_at ===
          quest.created_at
        ) {
          newQuestsArray[newQuestsArray.length - 1].push(quest);
        } else {
          newQuestsArray.push([quest]);
        }
      });
    return newQuestsArray;
  }, [questMap]);
  const get = useQuestStore((state) => state.get);
  React.useEffect(() => {
    get();
  }, []);
  const getTaskByQuestId = useQuestStore((state) => state.getTaskByQuestId);
  const headerHeight = useHeaderHeight();
  return (
    <Page
      contentContainerStyle={
        {
          // paddingVertical: scaleSize(20),
        }
      }
      safeAreaProps={{
        edges: ["bottom"],
      }}
      style={{
        paddingTop: headerHeight,
      }}
    >
      {questsByDate.map((dateArray, dateIndex) => {
        if (!dateArray[0]) {
          return null;
        }
        const dateString = dateArray[0].created_at;
        const list = dateArray;
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
              {dateString}
            </HBase>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                // alignSelf: "center",
              }}
            >
              {list.map((quest, taskIndex) => {
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
                    onPress={async () => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      useQuestStore.getState().latestQuestId = quest.id;
                      navigation.navigate("quest", {
                        questId: quest.id,
                      });
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
                          width: 122,
                          height: 122,
                        }}
                        contentFit="contain"
                        source={{ uri: quest.begin_img }}
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
                      {quest.quest_title}
                    </Text>
                    {/* <View style={styles.wrapper}>
                      <Text style={[styles.text, styles.textTypo]}>03.06</Text>
                    </View> */}
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
