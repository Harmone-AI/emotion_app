import { Task } from "@/api/api";
import { useScaleSize } from "@/hooks/useScreen";
import React, { useEffect } from "react";
import { Keyboard, TextInput, View, StyleSheet } from "react-native";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
// import RightAction from "../RightActions";
import { SwipeableMethods } from "react-native-gesture-handler/lib/typescript/components/ReanimatedSwipeable";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { RectButton } from "react-native-gesture-handler";
import { HBase } from "@/components/HBase";
import { Image } from "expo-image";
import { useQuestStore } from "@/hooks/zustand/quest";

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
  rightAction: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
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
        { flex: 1 },
        text === "delete" && {
          height: scaleSize(56),
          marginTop: scaleSize(2),
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
        ]}
        onPress={onPress}
      >
        {text === "edit" && (
          <Image
            source={require("../RightActions/edit.svg")}
            style={{
              width: 60,
              height: 60,
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

export default React.memo(({ id, task }: { id: number; task: Task }) => {
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
    const emitterSubscription = Keyboard.addListener("keyboardWillHide", () => {
      setEditing(false);
    });
    return () => {
      emitterSubscription.remove();
    };
  }, []);
  const deleteTask = useQuestStore((state) => state.deleteTask);
  return (
    <View
      key={id}
      style={{
        marginBottom: scaleSize(4),
        alignSelf: "center",
        // height: scaleSize(62),
        justifyContent: "center",
      }}
    >
      <Swipeable
        key={id}
        // containerStyle={{ overflow: "visible" }}
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
              swipeable.close();
              setTimeout(() => {
                setEditing(true);
              }, 300);
            },
            () => {
              deleteTask(id);
              swipeable.close();
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
        <View
          key={id}
          style={{
            marginVertical: scaleSize(3),
            width: scaleSize(338),
            height: scaleSize(56),
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: scaleSize(12),
            paddingRight: scaleSize(12),
            backgroundColor: "#fff",

            borderColor: "#e5e5e5",
            borderWidth: scaleSize(1),
            borderRadius: scaleSize(12),

            shadowColor: "#e5e5e5",
            shadowOffset: {
              width: 0,
              height: 3,
            },
            shadowRadius: 0,
            elevation: 0,
            shadowOpacity: 1,
          }}
        >
          <TextInput
            ref={inputRef}
            editable={editing}
            style={{
              fontSize: scaleSize(14),
              lineHeight: scaleSize(20),
              textTransform: "capitalize",
              fontWeight: "700",
              color: "#333",
              textAlign: "left",
              flex: 1,
              textAlignVertical: "center",
              paddingTop: 0,
              paddingBottom: 0,
            }}
            numberOfLines={2}
            multiline={true}
            defaultValue={task?.content}
          />
          <View
            style={{
              borderColor: "#e0e0e0",
              borderRadius: scaleSize(32),
              borderWidth: scaleSize(2),
              width: scaleSize(32),
              height: scaleSize(32),
            }}
          />
        </View>
      </Swipeable>
    </View>
  );
});
