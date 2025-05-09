import AppButton from "@/components/AppButton";
import { HBase } from "@/components/HBase";
import { useScaleSize } from "@/hooks/useScreen";
import { Image } from "expo-image";
import React, { useCallback, useRef } from "react";
import { View, Share as PlatformShare } from "react-native";
import ViewShot from "react-native-view-shot";
import Share, { Social } from "react-native-share";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { Quest } from "@/api/api";
export default React.memo(
  React.forwardRef(
    (
      {
        header,
        quest,
        onClose,
        onImageLoad,
      }: {
        header: (width: number) => React.ReactNode;
        quest: Quest;
        onClose: () => void;
        onImageLoad: () => void;
      },
      ref
    ) => {
      const sharedImageUri = React.useRef("");
      const scaleSize = useScaleSize();
      const insets = useSafeAreaInsets();
      return (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            // justifyContent: "flex-end",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ViewShot
            ref={ref}
            onCapture={(result) => {
              sharedImageUri.current = "data:image/png;base64," + result;
            }}
            captureMode="mount"
            options={{
              result: "base64",
            }}
            style={{
              width: scaleSize(370),
              height: scaleSize(507),
              backgroundColor: "#fff",
              borderRadius: scaleSize(24),
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: scaleSize(370),
                height: scaleSize(507),
                backgroundColor: "#fff",
                borderRadius: scaleSize(24),
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: scaleSize(360),
                  height: scaleSize(418),
                  backgroundColor: "#F29762",
                  alignSelf: "center",
                  marginTop: scaleSize(5),
                  borderRadius: scaleSize(20),
                  paddingTop: scaleSize(20),
                }}
              >
                {header(300)}
                <HBase
                  style={{
                    color: "#FFF",
                    textAlign: "center",
                    fontFamily: "SF Pro Rounded",
                    fontSize: scaleSize(20),
                    fontStyle: "normal",
                    fontWeight: "700",
                    textTransform: "capitalize",
                    marginTop: scaleSize(40),
                    lineHeight: scaleSize(30),
                  }}
                >
                  Completed{" "}
                  <HBase
                    style={{
                      color: "#FFF",
                      fontFamily: "SF Pro Rounded",
                      fontSize: scaleSize(28),
                      fontStyle: "normal",
                      fontWeight: "700",
                      textTransform: "capitalize",
                    }}
                  >
                    {quest.taskids?.split(",").length}
                  </HBase>{" "}
                  goals
                </HBase>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: scaleSize(15),
                }}
              >
                <View
                  style={{
                    width: scaleSize(50),
                    height: scaleSize(50),
                    marginRight: scaleSize(12),
                    backgroundColor: "#FF7A2D",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: scaleSize(12),
                  }}
                >
                  <Image
                    source={{ uri: quest.begin_img }}
                    style={{
                      width: scaleSize(34),
                      height: scaleSize(34),
                    }}
                    contentFit="contain"
                    onLoad={onImageLoad}
                  />
                </View>
                <HBase
                  style={{
                    flex: 1,
                    color: "#000",
                    fontSize: scaleSize(16),
                    fontStyle: "normal",
                    fontWeight: "600",
                    lineHeight: scaleSize(16),
                    textTransform: "capitalize",
                  }}
                >
                  {quest.user_title}
                </HBase>
                <Image
                  source={require("@/assets/images/qr.png")}
                  style={{ width: scaleSize(50), height: scaleSize(50) }}
                  contentFit="contain"
                  onLoad={onImageLoad}
                />
              </View>
            </View>
          </ViewShot>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: scaleSize(40 + insets.bottom),
              marginTop: scaleSize(16),
              justifyContent: "space-around",
              width: scaleSize(370),
            }}
          >
            <AppButton
              style={{
                width: scaleSize(60),
                height: scaleSize(60),
                backgroundColor: "#fff",
                borderRadius: scaleSize(60),
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onClose();
              }}
            >
              <Image
                source={require("@/assets/images/close.svg")}
                style={{ width: scaleSize(24), height: scaleSize(24) }}
              />
            </AppButton>
            <AppButton
              style={{
                backgroundColor: "#fff",
                borderRadius: scaleSize(40),
                width: scaleSize(60),
                height: scaleSize(60),
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                PlatformShare.share({
                  url: sharedImageUri.current,
                  message: "",
                });
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
          </View>
          {/* <View
            style={{
              marginTop: !insets.bottom ? scaleSize(16) : scaleSize(46),
              flexDirection: "row",
              width: scaleSize(370),
              alignSelf: "center",
              justifyContent: "space-around",
              marginBottom: scaleSize(40 + insets.bottom),
            }}
          >
            <AppButton
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                Share.shareSingle({
                  social: Social.Twitter,
                  url: sharedImageUri.current,
                });
              }}
            >
              <Image
                source={require("@/assets/images/x.svg")}
                style={{ width: scaleSize(60), height: scaleSize(60) }}
              />
            </AppButton>
            <AppButton
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                Share.shareSingle({
                  backgroundImage: "http://urlto.png", // url or an base64 string
                  stickerImage: sharedImageUri.current, //or you can use "data:" url
                  backgroundBottomColor: "#fefefe",
                  backgroundTopColor: "#906df4",
                  // attributionURL: "http://deep-link-to-app", //in beta
                  appId: "219376304", //facebook appId
                  social: Social.FacebookStories,
                });
              }}
            >
              <Image
                source={require("@/assets/images/facebook.svg")}
                style={{ width: scaleSize(60), height: scaleSize(60) }}
              />
            </AppButton>
            <AppButton
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                // Share.share({
                //   url: "",
                // });
              }}
            >
              <Image
                source={require("@/assets/images/thread.svg")}
                style={{ width: scaleSize(60), height: scaleSize(60) }}
              />
            </AppButton>
            <AppButton
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                // Directly share to Reddit using our custom function
                import("@/utils/redditAuth").then(({ shareImageToReddit }) => {
                  shareImageToReddit(
                    sharedImageUri.current,
                    quest.quest_title || "Check out my Harmone AI emotion!"
                  );
                });
              }}
            >
              <View
                style={{
                  width: scaleSize(60),
                  height: scaleSize(60),
                  borderRadius: scaleSize(30),
                  overflow: "hidden",
                  borderWidth: 1,
                  borderColor: "#e0e0e0",
                }}
              >
                <Image
                  source={require("@/assets/images/reddit.svg")}
                  style={{ width: "100%", height: "100%" }}
                />
              </View>
            </AppButton>
            <AppButton
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                // Directly open TikTok app
                import("@/utils/tiktokShare").then(({ directOpenTikTok }) => {
                  directOpenTikTok(
                    sharedImageUri.current,
                    quest.quest_title ||
                      "Check out my Harmone AI emotion! #HarmoneAI #EmotionAI"
                  );
                });
              }}
            >
              <View
                style={{
                  width: scaleSize(60),
                  height: scaleSize(60),
                  borderRadius: scaleSize(30),
                  overflow: "hidden",
                  borderWidth: 1,
                  borderColor: "#e0e0e0",
                }}
              >
                <Image
                  source={require("./tiktok.jpg")}
                  style={{ width: "100%", height: "100%" }}
                />
              </View>
            </AppButton>
            <AppButton
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                // Directly open Instagram app
                import("@/utils/instagramShare").then(
                  ({ directOpenInstagram }) => {
                    directOpenInstagram(
                      sharedImageUri.current,
                      quest.quest_title ||
                        "Check out my Harmone AI emotion! #HarmoneAI #EmotionAI"
                    );
                  }
                );
              }}
            >
              <View
                style={{
                  width: scaleSize(60),
                  height: scaleSize(60),
                  borderRadius: scaleSize(30),
                  overflow: "hidden",
                  borderWidth: 1,
                  borderColor: "#e0e0e0",
                }}
              >
                <Image
                  source={require("@/assets/images/instagram.svg")}
                  style={{ width: "100%", height: "100%" }}
                />
              </View>
            </AppButton>
            <AppButton
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                PlatformShare.share({
                  url: sharedImageUri.current,
                  message: "",
                });
              }}
            >
              <View
                style={{
                  width: scaleSize(60),
                  height: scaleSize(60),
                  borderRadius: scaleSize(30),
                  overflow: "hidden",
                  borderWidth: 1,
                  borderColor: "#e0e0e0",
                }}
              >
                <Image
                  source={require("../more.svg")}
                  style={{ width: "100%", height: "100%" }}
                />
              </View>
            </AppButton>
          </View> */}
        </View>
      );
    }
  )
);
