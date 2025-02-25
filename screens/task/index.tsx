import { HBase } from "@/components/HBase";
import Page from "@/components/Page";
import { useScaleSize } from "@/hooks/useScreen";
import { Image } from "expo-image";
import { ScrollView, TextInput, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useState } from "react";
import React from "react";
import AppButton from "@/components/AppButton";
import { useNavigation } from "@react-navigation/native";
import { Quest } from "@/api/api";
import StorageHelper from "@/hooks/storage";
import Swipeable, {
  SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import RightAction from "./RightActions";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SharedValue } from "react-native-reanimated";
import TaskItem from "./TaskItem";
import { useQuestStore } from "@/hooks/zustand/quest";

export default function TaskScreen() {
  const scaleSize = useScaleSize();
  const navigation = useNavigation();
  const quest = useQuestStore((state) => state.questMap[state.latestQuestId]);
  const addTask = useQuestStore((state) => state.addTask);
  const confirm = useQuestStore((state) => state.confirm);
  const taskIds = quest?.taskids.split(",");
  const tasks = useQuestStore((state) => state.taskMap);
  const finishedCount =
    taskIds?.filter((id) => tasks?.[Number(id)]?.status === 1).length || 0;
  const percent = finishedCount / (quest?.taskids.split(",").length || 0);
  const insets = useSafeAreaInsets();

  const finishTaskIds = quest?.taskids.split(",").filter((id) => {
    return tasks?.[Number(id)]?.status === 1;
  });
  const unFinishTaskIds = quest?.taskids.split(",").filter((id) => {
    return tasks?.[Number(id)]?.status === 0;
  });
  const [folderFinishedTasks, setFolderFinishedTasks] =
    useState<boolean>(false);
  return (
    <Page
      style={{
        backgroundColor: "#e6eff4",
        paddingBottom: scaleSize(insets.bottom ? 0 : 20),
      }}
      safeAreaProps={{
        style: {
          width: scaleSize(370),
          alignSelf: "center",
          borderRadius: scaleSize(24),
          backgroundColor: "#fff",
          overflow: "hidden",
          minHeight: scaleSize(500),
          flex: 1,
        },
        mode: "margin",
      }}
      scrollEnabled={false}
    >
      <ScrollView>
        <View
          style={{
            backgroundColor: "#F29762",
            borderRadius: scaleSize(800),
            width: scaleSize(800),
            height: scaleSize(800),
            top: scaleSize(-450),
            alignSelf: "center",
            position: "absolute",
          }}
        >
          {/* <View
            style={{
              width: scaleSize(370),
              height: scaleSize(400),
              backgroundColor: "#F29762",
              borderTopLeftRadius: scaleSize(24),
              borderTopRightRadius: scaleSize(24),
            }}
          ></View> */}
        </View>
        <Image
          contentFit="contain"
          style={{
            width: scaleSize(118),
            height: scaleSize(118),
            alignSelf: "center",
            marginTop: scaleSize(30),
          }}
          source={require("@/screens/tasks/head.png")}
        />
        <HBase
          style={{
            fontSize: scaleSize(32),
            lineHeight: scaleSize(32),
            textTransform: "capitalize",
            fontWeight: "700",
            color: "#fff",
            textAlign: "center",
            marginTop: scaleSize(12),
          }}
        >
          {quest?.quest_title}
        </HBase>
        <HBase
          style={{
            fontSize: scaleSize(14),
            lineHeight: scaleSize(20),
            fontWeight: "500",
            color: "#fff",
            textAlign: "center",
          }}
        >
          {quest?.user_title}
        </HBase>

        <View
          style={{
            borderRadius: scaleSize(52),
            backgroundColor: "#d46422",
            borderStyle: "solid",
            borderColor: "#f8b200",
            borderWidth: scaleSize(2),
            width: scaleSize(338),
            height: scaleSize(24),
            alignSelf: "center",
            marginTop: scaleSize(20),
          }}
        >
          <View
            style={{
              borderTopLeftRadius: scaleSize(26),
              borderBottomLeftRadius: scaleSize(26),
              backgroundColor: "#ffd000",
              width: scaleSize(percent * 338),
              height: "100%",
              overflow: "hidden",
              justifyContent: "center",
              alignItems: "center",
            }}
          />
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
            <HBase
              style={{
                fontSize: scaleSize(14),
                fontWeight: "700",
                color: "#f29762",
              }}
            >
              {finishedCount}/{quest?.taskids.split(",").length || ""}
            </HBase>
          </View>
          <View
            style={{
              width: scaleSize(44),
              height: scaleSize(44),
              backgroundColor: "#ffd000",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: scaleSize(44),
              position: "absolute",
              right: scaleSize(-2),
              top: scaleSize(-12),
            }}
          >
            <Image
              source={require("./goal.svg")}
              style={{ width: scaleSize(20), height: scaleSize(20) }}
            />
          </View>
        </View>
        <GestureHandlerRootView style={{ flex: 1, marginTop: scaleSize(40) }}>
          {unFinishTaskIds?.map((id, index) => {
            const task = tasks?.[Number(id)];
            if (task.status !== 0) {
              return null;
            }
            return <TaskItem key={id} id={Number(id)} task={task!} />;
          })}
        </GestureHandlerRootView>
        {finishTaskIds.length > 0 && (
          <AppButton
            onPress={() => {
              setFolderFinishedTasks((s) => !s);
            }}
            style={{
              flexDirection: "row",
              marginTop: scaleSize(24),
              marginBottom: scaleSize(16),
              alignItems: "center",
              alignSelf: "center",
            }}
          >
            <HBase
              style={{
                fontSize: scaleSize(12),
                fontWeight: "800",
                color: "rgba(0, 0, 0, 0.25)",
                textAlign: "left",
              }}
            >
              {folderFinishedTasks
                ? `Completed ${finishTaskIds.length} goals`
                : "Fold up completed goals"}
            </HBase>
            <Image
              source={require("./arrow.svg")}
              style={{
                width: scaleSize(7),
                height: scaleSize(4),
                marginLeft: scaleSize(6),
                transform: [
                  { rotate: folderFinishedTasks ? "0deg" : "180deg" },
                ],
              }}
            />
          </AppButton>
        )}
        {!folderFinishedTasks &&
          finishTaskIds?.map((id, index) => {
            const task = tasks?.[Number(id)];
            return <TaskItem key={id} id={Number(id)} task={task!} />;
          })}
      </ScrollView>
      <AppButton
        style={{
          backgroundColor: "#fff",
          borderRadius: scaleSize(40),
          width: scaleSize(40),
          height: scaleSize(40),
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          top: scaleSize(18),
          right: scaleSize(16),
        }}
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Image
          source={require("@/assets/images/close.svg")}
          style={{
            width: scaleSize(24),
            height: scaleSize(24),
          }}
        />
      </AppButton>
      <View
        style={{
          flexDirection: "row",
          alignSelf: "center",
          marginBottom: scaleSize(16),
        }}
      >
        {quest.confirmed ? (
          <AppButton
            onPress={() => {
              addTask(quest.id, "");
            }}
            style={{
              shadowColor: "#cf620c",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowRadius: 0,
              elevation: 0,
              shadowOpacity: 1,
              borderRadius: 8,
              backgroundColor: "#ff7c14",
              width: scaleSize(338),
              height: scaleSize(40),
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <HBase
              style={{
                fontSize: scaleSize(15),
                lineHeight: scaleSize(15),
                textTransform: "uppercase",
                fontWeight: "700",
                color: "#fff",
                textAlign: "left",
                textAlignVertical: "center",
                alignSelf: "center",
                marginTop: scaleSize(4),
              }}
            >
              + Add goal
            </HBase>
          </AppButton>
        ) : (
          <>
            <AppButton
              style={{
                shadowColor: "#b49300",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowRadius: 0,
                elevation: 0,
                shadowOpacity: 1,
                borderRadius: 12,
                backgroundColor: "#ffd000",
                width: scaleSize(165),
                height: scaleSize(40),
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <HBase
                style={{
                  fontSize: scaleSize(15),
                  textTransform: "uppercase",
                  fontWeight: "700",
                  fontFamily: "SF Pro Rounded",
                  color: "#53270d",
                  textAlign: "left",
                }}
              >
                Regenerate
              </HBase>
            </AppButton>
            <AppButton
              style={{
                marginLeft: scaleSize(8),
                shadowColor: "#b49300",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowRadius: 0,
                elevation: 0,
                shadowOpacity: 1,
                borderRadius: 12,
                backgroundColor: "#FF7C14",
                width: scaleSize(165),
                height: scaleSize(40),
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                confirm(quest.id);
              }}
            >
              <HBase
                style={{
                  fontSize: scaleSize(15),
                  textTransform: "uppercase",
                  fontWeight: "700",
                  fontFamily: "SF Pro Rounded",
                  color: "#fff",
                  textAlign: "left",
                }}
              >
                confirm
              </HBase>
            </AppButton>
          </>
        )}
      </View>
    </Page>
  );
}
