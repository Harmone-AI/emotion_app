import { MaterialCommunityIcons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React, { useRef } from "react";
import {
  Alert,
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStoryStore } from "@/hooks/zustand/story";
import { RootStackParamList } from "@/navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AppLoading from "@/components/Loading";
import * as Haptics from "expo-haptics";

export default function StoryDetailScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, "story">>();
  const route = useRoute<RouteProp<RootStackParamList, "story">>();
  const story = useStoryStore((state) =>
    state.stories.find((story) => story.id === route.params?.id)
  );
  const disableSelect = useRef(story?.choice >= 0);
  console.log("story", JSON.stringify(story));
  const scaleSize = useScaleSize();
  const safeAreaInsets = useSafeAreaInsets();

  // React.useEffect(() => {
  //   // Use `setOptions` to update the button that we previously specified
  //   // Now the button includes an `onPress` handler to update the count
  //   navigation.setOptions({
  //     headerLeft: () => (
  //       <AppButton
  //         onPress={() => navigation.goBack()}
  //         style={{
  //           height: "100%",
  //           justifyContent: "center",
  //           minHeight: scaleSize(40),
  //           minWidth: scaleSize(40),
  //         }}
  //       >
  //         <Image
  //           source={require("@/assets/images/close.svg")}
  //           style={{ width: scaleSize(24), height: scaleSize(24) }}
  //         />
  //       </AppButton>
  //     ),
  //     headerRight: () => (
  //       <AppButton
  //         onPress={() => {}}
  //         style={{
  //           height: "100%",
  //           minHeight: scaleSize(40),
  //           minWidth: scaleSize(40),
  //           justifyContent: "center",
  //           alignItems: "flex-end",
  //         }}
  //       >
  //         <Image
  //           source={require("@/assets/images/share.svg")}
  //           style={{ width: scaleSize(24), height: scaleSize(24) }}
  //         />
  //       </AppButton>
  //     ),
  //   });
  // }, [navigation]);

  const [contentLines, choicesMap] = React.useMemo(() => {
    const contentLines = story?.story_content.split("\n") || [];
    const newContentLines = [...contentLines];
    const map: { [key: string]: string } = {};
    let key = "";
    for (let i = 0; i < contentLines.length; i++) {
      const line = contentLines[i];
      if (line.includes("# Choice")) {
        key = line;
      } else {
        if (key) {
          if (line.replaceAll("\n", "").trim() !== "") {
            delete newContentLines[i];
            map[key] = line;
            key = "";
          } else {
            delete newContentLines[i];
          }
        } else if (line.replaceAll("\n", "").trim() === "") {
          delete newContentLines[i];
        }
      }
    }
    return [newContentLines, map];
  }, [story?.story_content]);
  const [selectedChoice, setSelectedChoice] = React.useState<string | null>(
    Object.keys(choicesMap)[story?.choice]
  );
  console.log("selectedChoice", selectedChoice, story?.choice);
  // return (
  //   <ScrollView
  //     style={{ flex: 1 }}
  //     contentContainerStyle={{ paddingVertical: scaleSize(100) }}
  //   >
  //     <HBase>{story.story_content}</HBase>
  //   </ScrollView>
  // );
  const [loading, setLoading] = React.useState(false);
  const patch = useStoryStore((state) => state.patch);
  console.log("disableSelect", disableSelect.current);
  return (
    <View style={{ flex: 1, backgroundColor: "#F2EFE2" }}>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: scaleSize(200),
        }}
        style={{ backgroundColor: "#F2EFE2", height: scaleSize(874) }}
        scrollEnabled={true}
      >
        <View
          style={{
            paddingHorizontal: scaleSize(24),
            marginTop: scaleSize(80),
          }}
        >
          <HBase
            style={{
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
            {new Date(story.created_at).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
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
          <Image
            source={{ uri: story.head_img }}
            style={{
              width: scaleSize(354),
              height: scaleSize(153),
              marginTop: scaleSize(16),
              alignSelf: "center",
            }}
          />
          {/* Story Content */}
          <View>
            {contentLines.map((line, index) => {
              if (line.includes("# Choice")) {
                return (
                  <AppButton
                    disabled={disableSelect.current || loading}
                    key={index}
                    style={[
                      {
                        padding: 16,
                        gap: 8,
                        borderRadius: 12,
                        borderWidth: 2,
                        borderColor: "#E5E5E5",
                        backgroundColor: "#FFF",
                        boxShadow: "0px 3px 0px 0px #E5E5E5",
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: scaleSize(12),
                      },
                      selectedChoice === line && {
                        borderRadius: 12,
                        borderColor: "#19944D",
                        backgroundColor: "#27AE60",
                        boxShadow: "0px 3px 0px 0px #19944D",
                      },
                    ]}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      Alert.alert("", line.split(":")[1].trim() + "?", [
                        {
                          text: "NO",
                          style: "cancel",
                        },
                        {
                          text: "YES",
                          style: "default",
                          isPreferred: true,
                          onPress: async () => {
                            try {
                              setLoading(true);
                              await patch(story!.id, {
                                choice: Object.keys(choicesMap).indexOf(line),
                              });
                            } catch (error) {
                              console.error("patch story error", error);
                            } finally {
                              setLoading(false);
                            }
                          },
                        },
                      ]);
                    }}
                  >
                    <View key={index} style={{ flex: 1 }}>
                      <HBase
                        style={[
                          {
                            color: "#282E32",
                            fontSize: 16,
                            fontStyle: "normal",
                            fontWeight: "600",
                            lineHeight: 20,
                            textTransform: "capitalize",
                            opacity: 0.5,
                            width: scaleSize(338),
                          },
                          selectedChoice === line && {
                            color: "white",
                            opacity: 1,
                          },
                        ]}
                      >
                        {line.split(":")[1].trim()}
                      </HBase>
                      {/* <HBase
                    style={{
                      color: "#282E32",
                      fontSize: scaleSize(13),
                      fontStyle: "normal",
                      fontWeight: "400",
                      lineHeight: scaleSize(19.5),
                      opacity: 0.5,
                      marginTop: scaleSize(8),
                    }}
                  >
                    {choice}
                  </HBase> */}
                    </View>
                    {loading ? (
                      <AppLoading />
                    ) : (
                      <View
                        style={{
                          width: scaleSize(32),
                          height: scaleSize(32),
                          padding: scaleSize(4),
                          alignItems: "center",
                          gap: scaleSize(10),
                          borderRadius: scaleSize(36),
                          borderWidth: scaleSize(1.5),
                          borderColor: "#E0E0E0",
                          backgroundColor: "white",
                        }}
                      >
                        <Image
                          tintColor={
                            selectedChoice === line ? "#27AE60" : "transparent"
                          }
                          source={require("../quest/checkmark.svg")}
                          style={{
                            width: scaleSize(24),
                            height: scaleSize(24),
                          }}
                        />
                      </View>
                    )}
                  </AppButton>
                );
              }
              const lineArray = line.split(" ");
              const headLine = lineArray[0];
              const content = line.replaceAll(headLine + " ", "") || headLine;
              return (
                <HBase
                  key={index}
                  style={[
                    {
                      color: "#282E32",
                      fontSize: 16,
                      fontStyle: "normal",
                      fontWeight: "400",
                      lineHeight: 24,
                      marginTop: scaleSize(16),
                      width: scaleSize(338),
                    },
                    headLine == "#" && {
                      margin: ".67em 0",
                      fontWeight: "600",
                      paddingBottom: ".3em",
                      fontSize: 24,
                      borderBottom: "1px solid #E5E5E5",
                    },
                    headLine == "##" && {
                      fontWeight: "600",
                      paddingBottom: ".3em",
                      fontSize: 18,
                      borderBottom: "1px solid #E5E5E5",
                    },
                    headLine == "###" && {
                      fontWeight: "600",
                      fontSize: 16,
                    },
                  ]}
                >
                  {content}
                </HBase>
              );
            })}
          </View>
          <HBase
            style={{
              color: "#282E32",
              fontSize: 16,
              fontStyle: "normal",
              fontWeight: "400",
              lineHeight: 24,
              marginTop: scaleSize(16),
              width: scaleSize(338),
            }}
          >
            {choicesMap[selectedChoice]}
          </HBase>
        </View>
      </ScrollView>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: "#F2EFE2",
        }}
      >
        <AppButton
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.goBack();
          }}
          style={{
            justifyContent: "center",
            padding: scaleSize(24),
            minHeight: scaleSize(40),
            minWidth: scaleSize(40),
          }}
        >
          <Image
            source={require("@/assets/images/close.svg")}
            style={{ width: scaleSize(24), height: scaleSize(24) }}
          />
        </AppButton>
        <AppButton
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
          style={{
            minHeight: scaleSize(40),
            minWidth: scaleSize(40),
            justifyContent: "center",
            alignItems: "flex-end",
            padding: scaleSize(24),
          }}
        >
          <Image
            source={require("@/assets/images/share.svg")}
            style={{ width: scaleSize(24), height: scaleSize(24) }}
          />
        </AppButton>
      </View>
    </View>
  );
}
