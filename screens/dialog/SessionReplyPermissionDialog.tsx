import React, { useRef, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { HBase } from "../../components/HBase";
import AppButton from "../../components/AppButton";
import { useScaleSize } from "@/hooks/useScreen";
import { useSettingStore } from "@/hooks/zustand/setting";
import { useNavigation } from "@react-navigation/native";
interface SessionReplyPermissionDialogProps {
  onPermissionGranted?: () => void;
  onPermissionDenied?: () => void;
}

export const SessionReplyPermissionDialog: React.FC<
  SessionReplyPermissionDialogProps
> = ({ onPermissionGranted, onPermissionDenied }) => {
  const scaleSize = useScaleSize();
  const setSessionReplyPermissionStatus = useSettingStore(
    (state) => state.setSessionReplyPermissionStatus
  );
  const navigation = useNavigation();
  const handleAllow = () => {
    setSessionReplyPermissionStatus("granted");
    onPermissionGranted?.();
    navigation.goBack();
  };

  const handleDeny = () => {
    setSessionReplyPermissionStatus("denied");
    onPermissionDenied?.();
    navigation.goBack();
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
      }}
    >
      <View
        style={{
          padding: scaleSize(16),
          marginHorizontal: scaleSize(16),
          backgroundColor: "white",
          borderRadius: scaleSize(16),
        }}
      >
        <HBase
          style={{
            fontSize: 20,
            fontWeight: "700",
            marginBottom: 16,
            textAlign: "center",
            color: "#000",
          }}
        >
          Help Us Improve Your Experience
        </HBase>

        <HBase
          style={{
            fontSize: 16,
            marginBottom: 12,
            lineHeight: 22,
            color: "#000",
          }}
        >
          We'd like to collect session replay data to better understand how you
          use our app and improve your experience.
        </HBase>

        <HBase
          style={{
            fontSize: 14,
            marginBottom: 24,
            opacity: 0.7,
            lineHeight: 20,
            color: "#000",
          }}
        >
          This data is anonymized and will only be used to enhance our app's
          features and usability. You can change this setting anytime in your
          app preferences.
        </HBase>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <AppButton
            onPress={handleDeny}
            style={[
              {
                flex: 1,
                paddingVertical: 12,
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "center",
                marginHorizontal: 8,
              },
              {
                backgroundColor: "#f5f5f5",
                borderWidth: 1,
                borderColor: "#e0e0e0",
              },
            ]}
          >
            <HBase
              style={{
                color: "#666",
                fontWeight: "600",
              }}
            >
              Not Now
            </HBase>
          </AppButton>

          <AppButton
            onPress={handleAllow}
            style={[
              {
                flex: 1,
                paddingVertical: 12,
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "center",
                marginHorizontal: 8,
              },
              {
                backgroundColor: "#FF7C14",
              },
            ]}
          >
            <HBase
              style={{
                color: "#fff",
                fontWeight: "600",
              }}
            >
              Allow
            </HBase>
          </AppButton>
        </View>
      </View>
    </View>
  );
};

export default SessionReplyPermissionDialog;
