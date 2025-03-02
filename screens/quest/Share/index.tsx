import AppButton from "@/components/AppButton";
import { HBase } from "@/components/HBase";
import { useScaleSize } from "@/hooks/useScreen";
import { Image } from "expo-image";
import React, { useCallback, useRef } from "react";
import { View, Share as PlatformShare } from "react-native";
import ViewShot from "react-native-view-shot";
import Share, { Social } from "react-native-share";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default React.memo(
  React.forwardRef(
    (
      {
        header,
        quest,
        onClose,
        onImageLoad,
      }: {
        header: React.ReactNode;
        quest: any;
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
            justifyContent: "flex-end",
            alignItems: "center",
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
                }}
              >
                {header}
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  // backgroundColor: "red",
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
                  }}
                >
                  <Image
                    source={{ uri: quest.begin_img }}
                    style={{ width: scaleSize(34), height: scaleSize(34) }}
                    resizeMode="contain"
                    onLoad={onImageLoad}
                  />
                </View>
                <HBase style={{ flex: 1 }}>{quest.quest_title}</HBase>
                <Image
                  source={require("@/assets/images/qr.png")}
                  style={{ width: scaleSize(50), height: scaleSize(50) }}
                  resizeMode="contain"
                  onLoad={onImageLoad}
                />
              </View>
            </View>
          </ViewShot>
          <AppButton
            style={{
              width: scaleSize(60),
              height: scaleSize(60),
              backgroundColor: "#fff",
              borderRadius: scaleSize(60),
              justifyContent: "center",
              alignItems: "center",
              marginTop: scaleSize(16),
            }}
            onPress={() => {
              onClose();
            }}
          >
            <Image
              source={require("@/assets/images/close.svg")}
              style={{ width: scaleSize(24), height: scaleSize(24) }}
            />
          </AppButton>
          <View
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
                Share.shareSingle({
                  social: Social.Instagram,
                  type: "image/*",
                  url: sharedImageUri.current,
                });
              }}
            >
              <Image
                source={require("@/assets/images/instagram.svg")}
                style={{ width: scaleSize(60), height: scaleSize(60) }}
              />
            </AppButton>
            <AppButton
              onPress={() => {
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
                PlatformShare.share({
                  url: sharedImageUri.current,
                  message: "",
                });
              }}
            >
              <Image
                source={require("../more.svg")}
                style={{ width: scaleSize(60), height: scaleSize(60) }}
              />
            </AppButton>
          </View>
        </View>
      );
    }
  )
);
