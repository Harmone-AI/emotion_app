import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Switch,
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from "react-native";
import { HBase } from "@/components/HBase";
import AppButton from "@/components/AppButton";
import { useScaleSize } from "@/hooks/useScreen";
import { supabase } from "@/hooks/supabase";
import { useSetting, useSettingStore } from "@/hooks/zustand/setting";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import { RootStackNavigationProp } from "@/navigation/types";

export default function SettingsScreen() {
  const scaleSize = useScaleSize();
  const navigation = useNavigation<RootStackNavigationProp>();
  const sessionReplyPermissionStatus = useSettingStore(
    (state) => state.sessionReplyPermissionStatus
  );
  const setSessionReplyPermissionStatus = useSettingStore(
    (state) => state.setSessionReplyPermissionStatus
  );

  const [data, setData] = useSetting("p_session_replay");

  const handleSessionReplayToggle = (value: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setData(value);
    setSessionReplyPermissionStatus(value ? "granted" : "denied");
  };

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            try {
              const { error } = await supabase.auth.signOut();
              if (error) {
                console.error("Error signing out:", error);
                Alert.alert("Error", "Failed to sign out. Please try again.");
              } else {
                navigation.reset({
                  index: 0,
                  routes: [{ name: "SignIn" }],
                });
              }
            } catch (error) {
              console.error("Error signing out:", error);
              Alert.alert("Error", "Failed to sign out. Please try again.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <HBase style={styles.sectionTitle}>App Preferences</HBase>

          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <HBase style={styles.settingTitle}>Session Replay</HBase>
              <HBase style={styles.settingDescription}>
                Allow anonymous collection of usage data to help improve the app
              </HBase>
            </View>
            <Switch
              value={!!data}
              onValueChange={handleSessionReplayToggle}
              trackColor={{ false: "#e0e0e0", true: "#FF7C14" }}
              thumbColor="#ffffff"
              ios_backgroundColor="#e0e0e0"
            />
          </View>
        </View>

        <View style={styles.section}>
          <HBase style={styles.sectionTitle}>Account</HBase>

          <AppButton onPress={handleLogout} style={styles.logoutButton}>
            <HBase style={styles.logoutButtonText}>Logout</HBase>
          </AppButton>
        </View>

        <View style={styles.footer}>
          <Image
            source={require("@/assets/login/logo.png")}
            style={styles.logo}
          />
          <HBase style={styles.version}>Version 1.0.1</HBase>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000",
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: "#666",
  },
  logoutButton: {
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutButtonText: {
    color: "#e74c3c",
    fontWeight: "600",
    fontSize: 16,
  },
  footer: {
    marginTop: 40,
    alignItems: "center",
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  version: {
    fontSize: 14,
    color: "#999",
  },
});
