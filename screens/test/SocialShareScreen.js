import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { shareImageToReddit } from "../../utils/redditAuth";
import {
  shareToTikTok,
  shareToTikTokViaShareSheet,
} from "../../utils/tiktokShare";
import RedditAuthButton from "../../components/RedditAuthButton";
import TikTokShareButton from "../../components/TikTokShareButton";
import ViewShot from "react-native-view-shot";
import * as Haptics from "expo-haptics";

export default function SocialShareScreen() {
  const [imageUri, setImageUri] = useState(null);
  const [caption, setCaption] = useState("Check out my Harmone AI emotion!");
  const viewShotRef = useRef(null);

  const captureScreen = async () => {
    if (viewShotRef.current) {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        const uri = await viewShotRef.current.capture();
        setImageUri(uri);
        Alert.alert(
          "Success",
          "Image captured! Now you can share it to social media."
        );
      } catch (error) {
        console.error("Error capturing screen:", error);
        Alert.alert("Error", "Failed to capture screen");
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Share to Social Media</Text>

        <ViewShot
          ref={viewShotRef}
          options={{ format: "jpg", quality: 0.9 }}
          style={styles.captureContainer}
        >
          <View style={styles.contentToCapture}>
            <Text style={styles.emotionText}>My Emotion Today</Text>
            <View style={styles.emotionContainer}>
              <Text style={styles.emoji}>😊</Text>
              <Text style={styles.emotionLabel}>Happy</Text>
            </View>
            <Text style={styles.appName}>Harmone AI</Text>
          </View>
        </ViewShot>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.captureButton}
            onPress={captureScreen}
          >
            <Text style={styles.buttonText}>Capture Screen</Text>
          </TouchableOpacity>

          {imageUri ? (
            <>
              <Text style={styles.previewText}>Preview:</Text>
              <Image source={{ uri: imageUri }} style={styles.previewImage} />

              <View style={styles.shareOptionsContainer}>
                <Text style={styles.sectionTitle}>Share Options</Text>

                {/* Reddit Sharing Options */}
                <View style={styles.platformContainer}>
                  <Text style={styles.platformTitle}>Reddit</Text>

                  <TouchableOpacity
                    style={[styles.shareButton, styles.redditButton]}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      shareImageToReddit(imageUri, caption);
                    }}
                  >
                    <Text style={styles.buttonText}>Share to Reddit</Text>
                  </TouchableOpacity>

                  <Text style={styles.orText}>OR</Text>

                  <RedditAuthButton
                    imageUri={imageUri}
                    title={caption}
                    onShare={() => Alert.alert("Success", "Shared to Reddit!")}
                  />
                </View>

                {/* TikTok Sharing Options */}
                <View style={styles.platformContainer}>
                  <Text style={styles.platformTitle}>TikTok</Text>

                  <TikTokShareButton
                    imageUri={imageUri}
                    caption={caption + " #HarmoneAI #EmotionAI"}
                    onShare={() => Alert.alert("Success", "Opened TikTok!")}
                    style={styles.tiktokButton}
                  />

                  <Text style={styles.orText}>OR</Text>

                  <TikTokShareButton
                    imageUri={imageUri}
                    caption={caption + " #HarmoneAI #EmotionAI"}
                    onShare={() =>
                      Alert.alert("Success", "Shared via share sheet!")
                    }
                    useShareSheet={true}
                    style={styles.shareSheetButton}
                  />
                </View>
              </View>
            </>
          ) : (
            <Text style={styles.instruction}>
              Capture the screen first to share to social media
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 20,
  },
  captureContainer: {
    width: 300,
    height: 400,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 20,
  },
  contentToCapture: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F29762",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emotionText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  emotionContainer: {
    backgroundColor: "#fff",
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emoji: {
    fontSize: 80,
  },
  emotionLabel: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  appName: {
    fontSize: 18,
    color: "#fff",
    marginTop: 20,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  captureButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  shareButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
    width: "100%",
    alignItems: "center",
  },
  redditButton: {
    backgroundColor: "#FF4500",
  },
  tiktokButton: {
    backgroundColor: "#000000",
    marginVertical: 10,
    width: "100%",
  },
  shareSheetButton: {
    backgroundColor: "#007AFF",
    marginVertical: 10,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  previewText: {
    fontSize: 16,
    marginBottom: 10,
  },
  previewImage: {
    width: 150,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  instruction: {
    fontSize: 16,
    color: "#666",
    fontStyle: "italic",
    marginTop: 20,
  },
  shareOptionsContainer: {
    width: "100%",
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  platformContainer: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    width: "100%",
  },
  platformTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  orText: {
    fontSize: 16,
    marginVertical: 5,
    color: "#666",
    textAlign: "center",
  },
});
