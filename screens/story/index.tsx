import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Story } from "../../types/story";
import Page from "@/components/Page";
import { HBase } from "@/components/HBase";
import { useScaleSize } from "@/hooks/useScreen";
import AppButton from "@/components/AppButton";
import { Image } from "expo-image";

export default function StoryDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const story = route.params as Story;
  const scaleSize = useScaleSize();

  React.useEffect(() => {
    // Use `setOptions` to update the button that we previously specified
    // Now the button includes an `onPress` handler to update the count
    navigation.setOptions({
      headerLeft: () => (
        <AppButton onPress={() => navigation.goBack()}>
          <Image
            source={require("@/assets/images/close.svg")}
            style={{ width: scaleSize(24), height: scaleSize(24) }}
          />
        </AppButton>
      ),
      headerRight: () => (
        <AppButton onPress={() => {}}>
          <Image
            source={require("@/assets/images/share.svg")}
            style={{ width: scaleSize(24), height: scaleSize(24) }}
          />
        </AppButton>
      ),
    });
  }, [navigation]);
  return (
    <Page contentContainerStyle={{ paddingHorizontal: scaleSize(24) }}>
      <HBase
        style={{
          alignSelf: "stretch",
          fontSize: 15,
          lineHeight: 24,
          textTransform: "capitalize",
          fontWeight: "500",
          fontFamily: "SF Pro Rounded",
          color: "#282e32",
          textAlign: "left",
          opacity: 0.5,
        }}
      >
        March 24, 2024
      </HBase>
      <HBase
        style={{
          alignSelf: "stretch",
          fontSize: 28,
          lineHeight: 34,
          fontWeight: "500",
          color: "#282e32",
          textAlign: "left",
        }}
      >
        {story.title}
      </HBase>
      {/* Story Content */}
      <View>
        {/* Title */}
        <Text className="text-xl font-semibold text-gray-900 mb-4">
          {story.title}
        </Text>

        {/* Content */}
        <Text className="text-base leading-6 text-gray-700">
          {story.story_content}
        </Text>
      </View>
    </Page>
  );
}
