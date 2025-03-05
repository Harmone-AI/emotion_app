import { HBase } from "@/components/HBase";
import Page from "@/components/Page";
import { useSafeBottom, useScaleSize } from "@/hooks/useScreen";
import { Image } from "expo-image";
import {
  ScrollView,
  TextInput,
  View,
  Animated,
  useAnimatedValue,
  KeyboardAvoidingView,
  Platform,
  PixelRatio,
  Image as ReactImage,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useCallback, useRef, useState } from "react";
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
import ReAnimated, {
  FadeInDown,
  FadeOutDown,
  FadeOutUp,
  LinearTransition,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import TaskItem from "./TaskItem";
import { useQuestStore } from "@/hooks/zustand/quest";
import AppLoading from "@/components/Loading";
import ViewShot, { captureRef } from "react-native-view-shot";
import * as FileSystem from "expo-file-system";
import { Shadow } from "react-native-shadow-2";
import LottieView from "lottie-react-native";
import Share from "./Share";
import * as Haptics from "expo-haptics";

export default function QuestScreen({ route }: any) {
  const scaleSize = useScaleSize();
  const navigation = useNavigation();
  const questId = route.params?.questId;
  const latestQuest = useQuestStore(
    (state) => state.questMap[state.latestQuestId]
  );
  const getTaskByQuestId = useQuestStore((state) => state.getTaskByQuestId);
  const quest = React.useMemo(() => {
    if (questId) {
      return useQuestStore.getState().questMap[questId];
    }
    return latestQuest;
  }, [latestQuest, questId]);
  React.useEffect(() => {
    if (questId) {
      getTaskByQuestId(questId);
    }
  }, [questId]);
  const addTask = useQuestStore((state) => state.addTask);
  const post = useQuestStore((state) => state.post);
  const latestUserInput = useQuestStore((state) => state.latestUserInput);
  const confirm = useQuestStore((state) => state.confirm);
  const taskIds = React.useMemo(() => quest?.taskids.split(","), [quest]);
  const tasks = useQuestStore((state) => state.taskMap);
  const finishedCount = React.useMemo(() => {
    return (
      taskIds?.filter((id) => tasks?.[Number(id)]?.status === 1).length || 0
    );
  }, [taskIds, tasks]);
  const percent = React.useMemo(() => {
    return finishedCount / (quest?.taskids.split(",").length || 0);
  }, [finishedCount, quest]);
  const insets = useSafeAreaInsets();
  // Add shake animation
  const shakeAnimation = useAnimatedValue(0);

  const startShakeAnimation = () => {
    // Reset the animation value
    shakeAnimation.setValue(0);

    // Create a sequence of small movements to create a shake effect
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 5,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -5,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();

    // Trigger haptic feedback for better user experience
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  };

  const finishTaskIds = React.useMemo(() => {
    return taskIds.filter((id) => {
      return tasks?.[Number(id)]?.status === 1;
    });
  }, [taskIds, tasks]);
  const unFinishTaskIds = React.useMemo(() => {
    return taskIds.filter((id) => {
      return tasks?.[Number(id)]?.status === 0;
    });
  }, [taskIds, tasks]);
  const unFinishTaskCount = React.useRef(unFinishTaskIds?.length || 0);
  const [folderFinishedTasks, setFolderFinishedTasksOriginal] =
    useState<boolean>(true);
  const setFolderFinishedTasks = React.useCallback(
    (value: boolean) => {
      setFolderFinishedTasksOriginal(value);
      if (unFinishTaskIds?.length === 0) {
        if (value) {
          Animated.timing(backgroundScale, {
            toValue: 3,
            duration: 500,
            useNativeDriver: true,
          }).start();
        } else {
          Animated.timing(backgroundScale, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }).start();
        }
      }
    },
    [unFinishTaskIds?.length]
  );
  const backgroundScale = useAnimatedValue(
    unFinishTaskCount.current === 0 ? 3 : 1
  );
  const [readyToShare, setReadyToShare] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const headerTranslateY = useSharedValue(0);
  const maxHeaderTranslateY = scaleSize(146);
  const headerAnimationStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: -Math.min(headerTranslateY.value, maxHeaderTranslateY) },
      ],
    };
  });
  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: ({ contentOffset }) => {
      headerTranslateY.value = contentOffset.y;
    },
  });
  const progressBarAnimationStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scaleX:
            headerTranslateY.value > maxHeaderTranslateY
              ? 1 -
                Math.min(
                  (headerTranslateY.value - maxHeaderTranslateY) /
                    maxHeaderTranslateY,
                  100 / 338 // 24 -> 8
                )
              : 1,
        },
        {
          scaleY:
            headerTranslateY.value > maxHeaderTranslateY
              ? 1 -
                Math.min(
                  (headerTranslateY.value - maxHeaderTranslateY) /
                    maxHeaderTranslateY,
                  0.3 // 24 -> 8
                )
              : 1,
        },
      ],
    };
  });
  const headerBackground = (
    <Animated.View
      style={{
        backgroundColor: "#F29762",
        borderRadius: scaleSize(1000),
        width: scaleSize(1000),
        height: scaleSize(1000),
        top: scaleSize(-660),
        alignSelf: "center",
        position: "absolute",
        transform: [
          {
            scale: backgroundScale,
          },
        ],
      }}
    ></Animated.View>
  );
  const ref = useRef<ViewShot>(null);
  const onImageLoad = useCallback(() => {
    ref.current?.capture?.();
  }, []);
  const header = (
    <ReAnimated.View
      style={[
        unFinishTaskIds.length === 0 && {
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
        },
      ]}
      layout={LinearTransition}
    >
      <ReactImage
        style={{
          width: scaleSize(118),
          height: scaleSize(118),
          alignSelf: "center",
          marginTop: scaleSize(30),
        }}
        source={{ uri: quest.begin_img }}
        resizeMode="contain"
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

      <ReAnimated.View
        style={[
          {
            borderRadius: scaleSize(52),
            backgroundColor: "#d46422",
            borderStyle: "solid",
            borderColor: "#f8b200",
            borderWidth: scaleSize(2),
            width: scaleSize(338), //100
            height: scaleSize(24), //8
            alignSelf: "center",
            marginTop: scaleSize(20),
          },
          progressBarAnimationStyle,
        ]}
      >
        <ReAnimated.View
          layout={LinearTransition}
          style={{
            borderRadius: scaleSize(26),
            backgroundColor: "#ffd000",
            width: scaleSize(percent * 330),
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
              color: "#F29762",
              marginTop: scaleSize(3),
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
          <ReactImage
            source={require("./goal.png")}
            style={{ width: scaleSize(20), height: scaleSize(20) }}
            resizeMode="contain"
            onLoad={onImageLoad}
          />
        </View>
      </ReAnimated.View>
    </ReAnimated.View>
  );
  if (!quest) {
    return (
      <View style={{ marginTop: scaleSize(100) }}>
        <AppLoading />
      </View>
    );
  }
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#e6eff4",
        justifyContent: "center",
        paddingTop: scaleSize(insets.top || 20),
        paddingBottom: scaleSize(insets.bottom || 20),
      }}
    >
      <ReAnimated.View
        style={[
          {
            width: scaleSize(370),
            alignSelf: "center",
            borderRadius: scaleSize(24),
            backgroundColor: "#fff",
            overflow: "hidden",
            minHeight: scaleSize(500),
            flex: 0,
          },
          unFinishTaskIds.length === 0 && {
            flex: 1,
            justifyContent: "center",
          },
        ]}
        layout={LinearTransition}
        // safeAreaProps={{
        //   style: {
        //     width: scaleSize(370),
        //     alignSelf: "center",
        //     borderRadius: scaleSize(24),
        //     backgroundColor: "#fff",
        //     overflow: "hidden",
        //     minHeight: scaleSize(500),
        //     flex: 0,
        //   },
        //   mode: "margin",
        // }}
        // scrollEnabled={false}
      >
        <KeyboardAvoidingView
          style={[
            { flex: 0 },
            unFinishTaskIds.length === 0 && {
              flex: 1,
            },
          ]}
          contentContainerStyle={[
            unFinishTaskIds.length === 0 && {
              flex: 1,
              justifyContent: "center",
            },
          ]}
          behavior={"position"}
          keyboardVerticalOffset={20}
        >
          <ReAnimated.ScrollView
            contentContainerStyle={[
              {
                paddingBottom: scaleSize(16),
              },
              unFinishTaskIds.length === 0 &&
                folderFinishedTasks && {
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                },
            ]}
            onScroll={onScrollHandler}
          >
            {headerBackground}
            {header}
            <GestureHandlerRootView style={{ marginTop: scaleSize(40) }}>
              {unFinishTaskIds?.map((id, index) => {
                const task = tasks?.[Number(id)];
                if (task.status !== 0) {
                  return null;
                }
                return (
                  <TaskItem
                    key={id}
                    id={Number(id)}
                    task={task!}
                    questId={quest.id}
                    isFinalTask={
                      unFinishTaskIds.length === 1 && task.status === 0
                    }
                    onFinishTask={(allFinish) => {
                      if (!quest.confirmed) {
                        startShakeAnimation();
                        return;
                      }
                      if (allFinish) {
                        // setTimeout(() => {
                        setFolderFinishedTasksOriginal(true);
                        Animated.timing(backgroundScale, {
                          toValue: 3,
                          duration: 500,
                          useNativeDriver: true,
                        }).start();
                        // }, 1000);
                      }
                    }}
                    confirmed={quest.confirmed}
                  />
                );
              })}
            </GestureHandlerRootView>
            {finishTaskIds.length > 0 &&
              (unFinishTaskIds.length !== 0 ||
                (unFinishTaskIds.length === 0 && !folderFinishedTasks)) && (
                <ReAnimated.View layout={LinearTransition}>
                  <AppButton
                    disabled={loading}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setFolderFinishedTasks(!folderFinishedTasks);
                    }}
                    style={{
                      flexDirection: "row",
                      marginTop: scaleSize(
                        unFinishTaskIds.length === 0 ? 50 : 8
                      ),
                      paddingVertical: scaleSize(16),
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
                </ReAnimated.View>
              )}

            {!folderFinishedTasks &&
              finishTaskIds?.map((id, index) => {
                const task = tasks?.[Number(id)];
                return (
                  <TaskItem
                    key={id}
                    id={Number(id)}
                    task={task!}
                    questId={quest.id}
                    isFinalTask={false}
                    onFinishTask={(allFinish) => {
                      if (allFinish) {
                        setFolderFinishedTasks(true);
                      }
                    }}
                    confirmed={quest.confirmed}
                  />
                );
              })}
            <View style={{ height: scaleSize(60), width: "100%" }} />
          </ReAnimated.ScrollView>
          {/* {!folderFinishedTasks && (
            <ReAnimated.View
              style={[
                {
                  height: scaleSize(60),
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                },
                headerAnimationStyle,
              ]}
            >
              {headerBackground}
              {header}
            </ReAnimated.View>
          )} */}
        </KeyboardAvoidingView>
        <AppButton
          disabled={loading}
          style={{
            backgroundColor: "#fff",
            borderRadius: scaleSize(40),
            width: scaleSize(40),
            height: scaleSize(40),
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            top: scaleSize(18),
            right: unFinishTaskIds.length > 0 ? scaleSize(16) : undefined,
            left: unFinishTaskIds.length > 0 ? undefined : scaleSize(16),
          }}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
        {unFinishTaskIds.length === 0 && (
          <AppButton
            disabled={loading}
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
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setReadyToShare(true);
            }}
          >
            <Image
              source={require("@/assets/images/share.svg")}
              style={{
                width: scaleSize(24),
                height: scaleSize(24),
              }}
            />
          </AppButton>
        )}

        {unFinishTaskIds?.length > 0 && (
          <ReAnimated.View
            style={{
              flexDirection: "row",
              alignSelf: "center",
              marginBottom: scaleSize(16),
              position: "absolute",
              bottom: 0,
            }}
            layout={LinearTransition}
          >
            {quest.confirmed ? (
              <AppButton
                disabled={loading}
                onPress={async () => {
                  try {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setLoading(true);
                    await addTask(quest.id, "");
                  } catch (e) {
                    console.error("Error addTask:", e);
                  } finally {
                    setLoading(false);
                  }
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
                  flexDirection: "row",
                }}
              >
                {loading ? (
                  <AppLoading
                    color="#fff"
                    width={scaleSize(24)}
                    height={scaleSize(24)}
                  />
                ) : (
                  <HBase
                    style={{
                      fontSize: scaleSize(15),
                      lineHeight: scaleSize(15),
                      textTransform: "uppercase",
                      fontWeight: "700",
                      color: "#fff",
                      textAlign: "right",
                      textAlignVertical: "center",
                      alignSelf: "center",
                      width: scaleSize(24),
                    }}
                  >
                    +
                  </HBase>
                )}
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
                    marginTop: scaleSize(2),
                    marginRight: scaleSize(10),
                  }}
                >
                  {" "}
                  Add goal
                </HBase>
              </AppButton>
            ) : (
              <>
                <AppButton
                  disabled={loading}
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
                  onPress={async () => {
                    try {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setLoading(true);
                      await post(latestUserInput);
                    } catch (e) {
                      console.error(e);
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  {loading ? (
                    <AppLoading />
                  ) : (
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
                  )}
                </AppButton>
                <Animated.View
                  style={{ transform: [{ translateX: shakeAnimation }] }}
                >
                  <AppButton
                    disabled={loading}
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
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
                </Animated.View>
              </>
            )}
          </ReAnimated.View>
        )}
        {unFinishTaskIds?.length === 0 && folderFinishedTasks && (
          <ReAnimated.View
            entering={FadeInDown}
            exiting={FadeOutDown}
            layout={LinearTransition}
          >
            <AppButton
              disabled={loading}
              style={{
                padding: scaleSize(12),
                alignItems: "center",
                gap: scaleSize(12),
                borderRadius: scaleSize(12),
                borderColor: "#DEE200",
                backgroundColor: "#FBFF00",
                shadowColor: "#DEE200",
                shadowOffset: { width: 0, height: scaleSize(3) },
                shadowOpacity: 1,
                shadowRadius: 0,
                position: "absolute",
                bottom: 0,
                alignSelf: "center",
                marginBottom: scaleSize(32),
              }}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setFolderFinishedTasks(false);
              }}
            >
              <HBase
                style={{
                  color: "#282E32",
                  fontSize: scaleSize(12),
                  fontWeight: "800",
                  textTransform: "uppercase",
                }}
              >
                Completed {finishTaskIds.length} goals
              </HBase>
            </AppButton>
          </ReAnimated.View>
        )}
      </ReAnimated.View>
      {unFinishTaskIds.length === 0 && folderFinishedTasks && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100%",
            height: "100%",
          }}
          pointerEvents="none"
        >
          <LottieView
            source={require("./fireworks.json")}
            autoPlay={true}
            loop={false}
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </View>
      )}
      {readyToShare && (
        <Share
          header={header}
          quest={quest}
          onClose={() => setReadyToShare(false)}
          ref={ref}
          onImageLoad={onImageLoad}
        />
      )}
    </View>
  );
}
