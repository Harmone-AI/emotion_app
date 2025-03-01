import { View, Text, Button, ScrollView } from "react-native";
import { useToastStore } from "@/hooks/zustand/toast";
import React from "react";
import Animated from "react-native-reanimated";

export default function TestScreen() {
  const show = useToastStore((state) => state.show);
  const [testArray, setTestArray] = React.useState<number[]>([
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  ]);
  return (
    <View style={{ flex: 1, backgroundColor: "red" }}>
      <Animated.ScrollView style={{ height: 300, width: 300 }}>
        {testArray.map((item, index) => (
          <Button
            key={index}
            title={`toast ${index}`}
            onPress={() => {
              // show({
              //   message: "Hello, world!",
              //   action: () => {
              //     console.log("Action triggered!");
              //   },
              //   actionText: "OK",
              // });
              setTestArray((prev) => [...prev, ...prev]);
            }}
          />
        ))}
      </Animated.ScrollView>
    </View>
  );
}
