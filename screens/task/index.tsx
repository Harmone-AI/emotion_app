import { HBase } from "@/components/HBase";
import Page from "@/components/Page";
import { useScaleSize } from "@/hooks/useScreen";
import { Image } from "expo-image";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import React from "react";
import AppButton from "@/components/AppButton";
import { useNavigation } from "@react-navigation/native";

export default function TaskScreen() {
  const scaleSize = useScaleSize();
  const [percent, setPercent] = useState(0.5);
  const navigation = useNavigation();
  return (
    <View style={{ backgroundColor: "#e6eff4" }}>
      <SafeAreaView
        style={{
          width: scaleSize(370),
          alignSelf: "center",
          borderRadius: scaleSize(24),
          backgroundColor: "#fff",
          overflow: "hidden",
          minHeight: scaleSize(500),
          flex: 1,
        }}
        mode="margin"
      >
        <View
          style={{
            backgroundColor: "#F29762",
            borderRadius: scaleSize(800),
            width: scaleSize(800),
            height: scaleSize(800),
            top: scaleSize(-450),
            alignSelf: "center",
            position: "absolute",
          }}
        >
          {/* <View
            style={{
              width: scaleSize(370),
              height: scaleSize(400),
              backgroundColor: "#F29762",
              borderTopLeftRadius: scaleSize(24),
              borderTopRightRadius: scaleSize(24),
            }}
          ></View> */}
        </View>
        <Image
          contentFit="contain"
          style={{
            width: scaleSize(118),
            height: scaleSize(118),
            alignSelf: "center",
            marginTop: scaleSize(30),
          }}
          source={require("@/screens/tasks/head.png")}
        />
        <HBase
          style={{
            fontSize: scaleSize(32),
            lineHeight: scaleSize(32),
            textTransform: "capitalize",
            fontWeight: "700",
            color: "#fff",
            textAlign: "center",
            marginTop: scaleSize(12),
          }}
        >
          Braincell Deathmatch
        </HBase>
        <HBase
          style={{
            fontSize: scaleSize(14),
            lineHeight: scaleSize(20),
            fontWeight: "500",
            color: "#fff",
            textAlign: "center",
          }}
        >
          “ruthless or not?”
        </HBase>
        <AppButton
          style={{
            backgroundColor: "#fff",
            borderRadius: scaleSize(40),
            width: scaleSize(40),
            height: scaleSize(40),
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            top: scaleSize(18),
            right: scaleSize(16),
          }}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Image
            source={require("@/assets/images/close.svg")}
            style={{
              width: scaleSize(24),
              height: scaleSize(24),
            }}
          />
        </AppButton>
        <View
          style={{
            borderRadius: scaleSize(52),
            backgroundColor: "#d46422",
            borderStyle: "solid",
            borderColor: "#f8b200",
            borderWidth: scaleSize(2),
            width: scaleSize(338),
            height: scaleSize(24),
            alignSelf: "center",
            marginTop: scaleSize(20),
          }}
        >
          <View
            style={{
              borderTopLeftRadius: scaleSize(26),
              borderBottomLeftRadius: scaleSize(26),
              backgroundColor: "#ffd000",
              width: scaleSize(percent * 338),
              height: "100%",
              overflow: "hidden",
              justifyContent: "center",
              alignItems: "center",
            }}
          />
          <View
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <HBase
              style={{
                fontSize: scaleSize(14),
                fontWeight: "700",
                color: "#f29762",
              }}
            >
              5/20
            </HBase>
          </View>
          <View
            style={{
              width: scaleSize(44),
              height: scaleSize(44),
              backgroundColor: "#ffd000",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: scaleSize(44),
              position: "absolute",
              right: scaleSize(-2),
              top: scaleSize(-12),
            }}
          >
            <Image
              source={require("./goal.svg")}
              style={{ width: scaleSize(20), height: scaleSize(20) }}
            />
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <View
            style={{
              alignSelf: "center",
              shadowColor: "#e5e5e5",
              shadowOffset: {
                width: 0,
                height: 3,
              },
              shadowRadius: 0,
              elevation: 0,
              shadowOpacity: 1,
              borderRadius: 12,
              backgroundColor: "#fff",
              borderColor: "#e5e5e5",
              borderWidth: scaleSize(2),
              width: scaleSize(338),
              height: scaleSize(56),
              flexDirection: "row",
              alignItems: "center",
              marginTop: scaleSize(40),
              paddingLeft: scaleSize(12),
              paddingRight: scaleSize(12),
            }}
          >
            <HBase
              style={{
                fontSize: scaleSize(14),
                lineHeight: 20,
                textTransform: "capitalize",
                fontWeight: "700",
                fontFamily: "SF Pro Rounded",
                color: "#333",
                textAlign: "left",
                flex: 1,
              }}
            >
              Open study materials
            </HBase>
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
        </View>
        <View
          style={{
            flexDirection: "row",
            alignSelf: "center",
            marginBottom: scaleSize(16),
          }}
        >
          <AppButton
            style={{
              shadowColor: "#b49300",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowRadius: 0,
              elevation: 0,
              shadowOpacity: 1,
              borderRadius: 12,
              backgroundColor: "#ffd000",
              width: scaleSize(165),
              height: scaleSize(40),
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <HBase
              style={{
                fontSize: scaleSize(15),
                textTransform: "uppercase",
                fontWeight: "700",
                fontFamily: "SF Pro Rounded",
                color: "#53270d",
                textAlign: "left",
              }}
            >
              Regenerate
            </HBase>
          </AppButton>
          <AppButton
            style={{
              marginLeft: scaleSize(8),
              shadowColor: "#b49300",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowRadius: 0,
              elevation: 0,
              shadowOpacity: 1,
              borderRadius: 12,
              backgroundColor: "#FF7C14",
              width: scaleSize(165),
              height: scaleSize(40),
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <HBase
              style={{
                fontSize: scaleSize(15),
                textTransform: "uppercase",
                fontWeight: "700",
                fontFamily: "SF Pro Rounded",
                color: "#fff",
                textAlign: "left",
              }}
            >
              confirm
            </HBase>
          </AppButton>
        </View>
      </SafeAreaView>
    </View>
  );
}
