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
import { useStoryStore } from "@/hooks/zustand/story";

export default function StoryListScreen() {
  const navigation = useNavigation<RootStackNavigationProp>();
  const getStories = useStoryStore((state) => state.getStories);
  const stories = useStoryStore((state) => state.stories);
  console.log("stories", JSON.stringify(stories));
  const storyMapByDate = stories.reduce((acc, curr) => {
    if (!curr?.created_at) {
      return acc;
    }
    const date = curr.created_at.split("T")[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(curr);
    return acc;
  }, {} as { [index: string]: Story[] });
  useEffect(() => {
    getStories();
  }, []);
  const scaleSize = useScaleSize();
  return (
    <Page
      safeAreaProps={{
        edges: ["bottom"],
      }}
      contentContainerStyle={{ paddingVertical: scaleSize(8) }}
    >
      {Object.entries(storyMapByDate).map(([date, stories], dateIndex) => {
        const dateObj = new Date(date);
        const formattedDate = dateObj.toLocaleDateString("en-US", {
          month: "numeric",
          day: "numeric",
        });
        return (
          <View
            style={{
              flexDirection: "row",
              marginVertical: scaleSize(12),
              alignSelf: "center",
            }}
            key={date}
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
              {formattedDate}
            </HBase>
            <View>
              {stories.map((story, storyIndex) => {
                return (
                  <AppButton
                    key={story.id}
                    onPress={() =>
                      navigation.navigate("story", {
                        id: story.id,
                      })
                    }
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
                      width: scaleSize(312),
                      height: scaleSize(238),
                      marginTop: scaleSize(12),
                    }}
                  >
                    <View>
                      {/* Story Image */}
                      <Image
                        source={{ uri: story.image_url }}
                        style={{
                          width: scaleSize(310),
                          height: scaleSize(153),
                        }}
                      />

                      <View
                        style={{
                          flexDirection: "column",
                          padding: scaleSize(16),
                        }}
                      >
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
                );
              })}
            </View>
          </View>
        );
      })}
    </Page>
  );
}
