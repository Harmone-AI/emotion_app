import { View, Text, Button } from "react-native";
import { useToastStore } from "@/hooks/zustand/toast";

export default function TestScreen() {
  const show = useToastStore((state) => state.show);
  return (
    <View>
      <Button
        title="toast"
        onPress={() => {
          show({
            message: "Hello, world!",
            action: () => {
              console.log("Action triggered!");
            },
            actionText: "OK",
          });
        }}
      />
    </View>
  );
}
