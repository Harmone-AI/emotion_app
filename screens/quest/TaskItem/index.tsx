import { Task } from "@/api/api";
import { useScaleSize } from "@/hooks/useScreen";
import React, { useEffect } from "react";
import {
  Keyboard,
  TextInput,
  View,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";
import Animated, {
  BounceOut,
  CurvedTransition,
  EntryExitTransition,
  FadeIn,
  FadeOut,
  interpolate,
  JumpingTransition,
  Keyframe,
  LinearTransition,
  SequencedTransition,
  SharedValue,
  useAnimatedStyle,
  ZoomIn,
  ZoomInEasyDown,
  ZoomOut,
} from "react-native-reanimated";
// import RightAction from "../RightActions";
import { SwipeableMethods } from "react-native-gesture-handler/lib/typescript/components/ReanimatedSwipeable";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { RectButton } from "react-native-gesture-handler";
import { HBase } from "@/components/HBase";
import { Image } from "expo-image";
import { useQuestStore } from "@/hooks/zustand/quest";
import AppButton from "@/components/AppButton";
import AppLoading from "@/components/Loading";
import { useToastStore } from "@/hooks/zustand/toast";
import { useCharacterStore } from "@/hooks/zustand/character";
import { Shadow } from "react-native-shadow-2";
import * as Haptics from "expo-haptics";

const ZoomFadeIn = new Keyframe({
  from: { opacity: 0, transform: [{ scale: 0 }] },
  to: { opacity: 1, transform: [{ scale: 1 }] },
}).duration(300);
const ZoomFadeOut = new Keyframe({
  from: { opacity: 1, transform: [{ scale: 1 }] },
  to: { opacity: 0, transform: [{ scale: 0 }] },
}).duration(300);
const styles = StyleSheet.create({
  leftAction: {
    flex: 1,
    backgroundColor: "#497AFC",
    justifyContent: "center",
  },
  archiveText: {
    color: "white",
    fontSize: 16,
    backgroundColor: "transparent",
    padding: 20,
  },
  actionText: {
    color: "white",
    fontSize: 16,
    backgroundColor: "transparent",
    textAlign: "center",
    margin: "auto",
  },
  rightActionView: {
    flex: 1,
  },
  rightActionsView: {
    width: 140,
    flexDirection: "row",
  },
});

interface RightActionProps {
  text: string;
  color: string;
  x: number;
  progress: SharedValue<number>;
  totalWidth: number;
  swipeableRef: React.RefObject<SwipeableMethods | null>;
}

const RightAction = ({
  text,
  color,
  x,
  progress,
  totalWidth,
  swipeableRef,
  onPress,
}: RightActionProps) => {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(progress.value, [0, -totalWidth], [x, 0]),
      },
    ],
  }));
  const scaleSize = useScaleSize();

  return (
    <Animated.View
      style={[
        {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        },
        animatedStyle,
      ]}
    >
      <RectButton
        style={[
          styles.rightAction,
          {
            backgroundColor: color,
            borderRadius: 16,
            marginLeft: 10,
          },
          {
            alignItems: "center",
            justifyContent: "center",
            width: 58,
            height: 58,
          },
        ]}
        onPress={onPress}
      >
        {text === "edit" && (
          <Image
            source={require("../RightActions/edit.svg")}
            style={{
              width: (60 * 58) / 62,
              height: 58,
              alignSelf: "center",
              marginTop: 2,
            }}
          />
        )}
        {text === "delete" && (
          <Image
            source={require("../RightActions/delete.svg")}
            style={{
              width: 24,
              height: 24,
            }}
          />
        )}
      </RectButton>
    </Animated.View>
  );
};

const renderRightActions = (
  _: any,
  progress: SharedValue<number>,
  swipeableRef: SwipeableMethods,
  onEdit: () => void,
  onDelete: () => void
) => (
  <View style={styles.rightActionsView}>
    <RightAction
      text="edit"
      color="transparent"
      x={140}
      progress={progress}
      totalWidth={140}
      swipeableRef={swipeableRef}
      onPress={onEdit}
    />
    <RightAction
      text="delete"
      color="#e74c3c"
      x={70}
      progress={progress}
      totalWidth={140}
      swipeableRef={swipeableRef}
      onPress={onDelete}
    />
  </View>
);

export default React.memo(
  ({
    id,
    task,
    isFinalTask,
    questId,
    onFinishTask,
  }: {
    id: number;
    task: Task;
    isFinalTask: boolean;
    questId: number;
    onFinishTask?: (allFinish: boolean) => void;
  }) => {
    const scaleSize = useScaleSize();
    const inputRef = React.useRef<TextInput>(null);
    const [editing, setEditing] = React.useState(false);
    useEffect(() => {
      if (editing) {
        inputRef.current?.focus();
      } else {
        inputRef.current?.blur();
      }
    }, [editing]);
    useEffect(() => {
      const emitterSubscription = Keyboard.addListener(
        "keyboardWillHide",
        () => {
          setEditing(false);
        }
      );
      return () => {
        emitterSubscription.remove();
      };
    }, []);
    const deleteTask = useQuestStore((state) => state.deleteTask);
    const finishTask = useQuestStore((state) => state.finishTask);
    const finishAllTask = useQuestStore((state) => state.finishAllTask);
    const contentRef = React.useRef<string>(task?.content);
    const [loading, setLoading] = React.useState(false);
    const patchTask = useQuestStore((state) => state.patchTask);
    const show = useToastStore((state) => state.show);
    const getCharacter = useCharacterStore((state) => state.get);
    return (
      <Animated.View
        key={id}
        style={{
          alignSelf: "center",
          // height: scaleSize(62),
          justifyContent: "center",
        }}
        exiting={isFinalTask ? undefined : ZoomFadeOut}
        entering={isFinalTask ? undefined : ZoomFadeIn}
        layout={isFinalTask ? undefined : LinearTransition}
      >
        <Swipeable
          key={id}
          containerStyle={{ padding: scaleSize(5) }}
          friction={2}
          enableTrackpadTwoFingerGesture
          rightThreshold={0}
          // renderRightActions={RightAction}
          renderRightActions={(
            progressAnimatedValue: SharedValue<number>,
            dragAnimatedValue: SharedValue<number>,
            swipeable: SwipeableMethods
          ) => {
            return renderRightActions(
              progressAnimatedValue,
              dragAnimatedValue,
              swipeable,
              () => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                swipeable.close();
                setTimeout(() => {
                  setEditing(true);
                }, 300);
              },
              async () => {
                try {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setLoading(true);
                  swipeable.close();
                  const undo = await deleteTask(id);
                  show({
                    message: "Deleted",
                    action: () => {
                      undo();
                    },
                    actionText: "Undo",
                    timeout: 3000,
                  });
                } catch (e) {
                  console.error("Error deleteTask:", e);
                } finally {
                  setLoading(false);
                }
              }
            );
            // return RightAction(
            //   progressAnimatedValue,
            //   dragAnimatedValue,
            //   swipeable,
            //   () => {
            //     swipeable.close();
            //     setTimeout(() => {
            //       setEditing(true);
            //     }, 300);
            //   },
            //   () => {
            //     swipeable.close();
            //   }
            // );
          }}
        >
          <Shadow
            distance={scaleSize(5)}
            disabled={true}
            style={{
              width: scaleSize(338),
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "white",
              paddingRight: scaleSize(12),

              borderRadius: 12,
              borderWidth: Math.floor(scaleSize(3)),
              borderColor: "#E5E5E5",
              boxShadow: `0px ${scaleSize(4)}px 0px 0px #E5E5E5`,
            }}
            containerStyle={{
              borderRadius: scaleSize(12),
              width: scaleSize(338),
            }}
            offset={[0, scaleSize(2)]}
            startColor="#E5E5E5"
            endColor="#E5E5E5"
          >
            <TextInput
              ref={inputRef}
              editable={!loading && (editing || !task?.content)}
              style={{
                fontSize: scaleSize(14),
                lineHeight: scaleSize(20),
                textTransform: "capitalize",
                fontWeight: "700",
                color: "#333",
                textAlign: "left",
                flex: 1,
                textAlignVertical: "center",
                paddingLeft: scaleSize(10),
                // paddingBottom: scaleSize(10),
                paddingRight: scaleSize(10),
                borderRadius: scaleSize(12),
                paddingTop: scaleSize(16),
                paddingBottom: scaleSize(18),
              }}
              numberOfLines={4}
              multiline={true}
              defaultValue={task?.content}
              onChangeText={(text) => {
                contentRef.current = text;
              }}
              autoFocus={!task?.content}
              returnKeyType="done"
              onSubmitEditing={() => {
                inputRef.current?.blur();
              }}
              onBlur={async () => {
                if (contentRef.current !== task?.content) {
                  try {
                    setLoading(true);
                    await patchTask(task?.task_id!, {
                      content: contentRef.current,
                    });
                  } catch (error) {
                    console.error("Error patchTask:", error);
                  } finally {
                    setLoading(false);
                  }
                }
              }}
            />
            {loading ? (
              <AppLoading width={scaleSize(32)} height={scaleSize(32)} />
            ) : (
              <AppButton
                style={[
                  {
                    borderColor: "#e0e0e0",
                    borderRadius: scaleSize(32),
                    borderWidth: scaleSize(2),
                    width: scaleSize(32),
                    height: scaleSize(32),
                    justifyContent: "center",
                    alignItems: "center",
                  },
                  task.status === 1 && {
                    backgroundColor: "#27AE60",
                    borderWidth: 0,
                  },
                ]}
                onPress={async () => {
                  try {
                    Haptics.selectionAsync();
                    setLoading(true);
                    if (isFinalTask) {
                      await finishAllTask(questId);
                      // await getCharacter();
                    }
                    await finishTask(task?.task_id);
                    onFinishTask?.(isFinalTask);
                    if (isFinalTask) {
                      Haptics.notificationAsync(
                        Haptics.NotificationFeedbackType.Success
                      );
                    }
                  } catch (error) {
                    show({
                      message: "The internet connection appears to be offline.",
                    });
                    console.error("Error finishTask:", error);
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                <Image
                  source={require("../checkmark.svg")}
                  style={{ width: scaleSize(24), height: scaleSize(24) }}
                />
              </AppButton>
            )}
          </Shadow>
        </Swipeable>
      </Animated.View>
    );
  }
);
