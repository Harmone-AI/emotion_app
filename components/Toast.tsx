import { useToastStore } from "@/hooks/zustand/toast";
import React from "react";
import { View } from "react-native";
import { HBase } from "./HBase";
import AppButton from "./AppButton";
import { useScaleSize } from "@/hooks/useScreen";

export default React.memo(() => {
  const message = useToastStore((state) => state.message);
  const actionText = useToastStore((state) => state.actionText);
  const action = useToastStore((state) => state.action);
  const scaleSize = useScaleSize();
  const hasButton = !!action && !!actionText;
  if (!message) {
    return null;
  }
  return (
    <View
      style={{
        borderRadius: scaleSize(38),
        backgroundColor: "#6C3514",
        boxShadow: "0px 2px 0px 0px #341605",
        alignItems: "center",
        justifyContent: "space-between",
        position: "absolute",
        bottom: scaleSize(92),
        minWidth: scaleSize(hasButton ? 200 : 100),
        alignSelf: "center",
        flexDirection: "row",
      }}
      pointerEvents={hasButton ? "auto" : "none"}
    >
      <HBase
        style={{
          paddingHorizontal: scaleSize(16),
          paddingVertical: scaleSize(8),
          color: "#FFF",
          fontSize: scaleSize(14),
          fontStyle: "normal",
          fontWeight: 700,
          lineHeight: scaleSize(20),
          textTransform: "capitalize",
        }}
      >
        {message}
      </HBase>
      {hasButton && (
        <AppButton
          onPress={() => {
            console.log("action");
            action?.();
          }}
          style={{
            paddingHorizontal: scaleSize(16),
            height: "100%",
            justifyContent: "center",
          }}
        >
          <HBase
            style={{
              color: "#FF7C14",
              fontSize: 14,
              fontWeight: 700,
              lineHeight: scaleSize(20),
              textTransform: "capitalize",
            }}
          >
            {actionText}
          </HBase>
        </AppButton>
      )}
    </View>
  );
});
