import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RootStackNavigationProp } from "../../navigation/types";
import { fetchStories } from "../../services/storyService";
import { Story } from "../../types/story";
import { HBase } from "@/components/HBase";
import { useScaleSize } from "@/hooks/useScreen";
import AppButton from "@/components/AppButton";
import Page from "@/components/Page";

export default function StoryListScreen() {
  const navigation = useNavigation<RootStackNavigationProp>();
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    const loadStories = async () => {
      const data = await fetchStories(1); // TODO: Replace with actual user ID
      setStories(data);
    };
    loadStories();
  }, []);
  const scaleSize = useScaleSize();
  return (
    <Page contentContainerStyle={{ paddingVertical: scaleSize(8) }}>
      {stories.map((story, dateIndex) => (
        <View
          style={{
            flexDirection: "row",
            marginVertical: scaleSize(12),
            alignSelf: "center",
          }}
          key={dateIndex}
        >
          <HBase
            style={{
              fontSize: 15,
              lineHeight: 32,
              textTransform: "capitalize",
              fontWeight: "700",
              fontFamily: "SF Pro Rounded",
              color: "#333",
              textAlign: "left",
              width: scaleSize(36),
            }}
          >
            1/17
          </HBase>

          <AppButton
            key={story.id}
            onPress={() => navigation.navigate("story", story)}
            style={{
              marginLeft: scaleSize(16),
              shadowColor: "#e5e5e5",
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowRadius: 0,
              elevation: 0,
              shadowOpacity: 1,
              borderRadius: 12,
              backgroundColor: "#fff",
              borderColor: "#e5e5e5",
              borderWidth: 2,
              borderStyle: "solid",
              width: scaleSize(310),
              height: scaleSize(238),
              overflow: "hidden",
            }}
          >
            <View>
              {/* Story Image */}
              <Image
                source={require("@/assets/images/image.png")}
                style={{
                  width: scaleSize(310),
                  height: scaleSize(153),
                }}
              />

              <View style={{ flexDirection: "column", padding: scaleSize(16) }}>
                {/* Story Title */}
                <Text
                  style={{
                    fontSize: 17,
                    lineHeight: 17,
                    textTransform: "capitalize",
                    fontWeight: "600",
                    fontFamily: "SF Pro Rounded",
                    color: "#282e32",
                    textAlign: "left",
                  }}
                >
                  {story.title}
                </Text>

                {/* Story Preview */}
                <Text
                  numberOfLines={2}
                  style={{
                    alignSelf: "stretch",
                    fontSize: 12,
                    lineHeight: 16,
                    textTransform: "capitalize",
                    fontWeight: "500",
                    fontFamily: "SF Pro Rounded",
                    color: "#282e32",
                    textAlign: "left",
                    overflow: "hidden",
                    opacity: 0.7,
                    marginTop: scaleSize(4),
                  }}
                >
                  {story.story_content}
                </Text>
              </View>
            </View>
          </AppButton>
        </View>
      ))}
    </Page>
  );
}
