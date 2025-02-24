import AppButton from "@/components/AppButton";
import { HBase } from "@/components/HBase";
import { useScaleSize } from "@/hooks/useScreen";
import { Image } from "expo-image";
import { View } from "react-native";
import { SwipeableMethods } from "react-native-gesture-handler/lib/typescript/components/ReanimatedSwipeable";
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

export default function RightAction(
  prog: SharedValue<number>,
  drag: SharedValue<number>,
  swipeable: SwipeableMethods,
  onEdit: () => void,
  onClose: () => void
) {
  const scaleSize = useScaleSize();
  const margin = scaleSize(10);
  const actionSize = scaleSize(57);
  const styleAnimation = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: drag.value + (actionSize + margin) * 2 }],
    };
  });

  return (
    <Reanimated.View
      style={[
        { flexDirection: "row", width: actionSize + margin * 2 },
        styleAnimation,
      ]}
    >
      {/* <View
        style={{ width: margin, height: "100%", backgroundColor: "red" }}
      ></View> */}
      <AppButton
        onPress={onEdit}
        style={{
          width: actionSize,
          height: actionSize,
        }}
      >
        <Image
          source={require("./edit.svg")}
          style={{
            width: actionSize,
            height: actionSize,
          }}
        />
      </AppButton>
      <AppButton
        onPress={onClose}
        style={{
          width: actionSize,
          height: actionSize,
          // shadowColor: "#cf4436",
          // shadowOffset: {
          //   width: 0,
          //   height: 2,
          // },
          // shadowRadius: 0,
          // elevation: 0,
          // shadowOpacity: 1,
          borderRadius: 16,
          backgroundColor: "#e74c3c",
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 28,
          paddingVertical: 0,
          marginLeft: margin,
        }}
      >
        <Image
          source={require("./delete.svg")}
          style={{ width: scaleSize(24), height: scaleSize(24) }}
        />
      </AppButton>
    </Reanimated.View>
  );
}
