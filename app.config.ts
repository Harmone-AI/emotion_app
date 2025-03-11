import { ExpoConfig, ConfigContext } from "expo/config";
import withAppleSettings, {
  ChildPane,
  Group,
  Switch,
  Title,
} from "@config-plugins/apple-settings";

export default ({ config }: ConfigContext): ExpoConfig => {
  return withAppleSettings(
    {
      ...config,
      name: "Harmone AI",
      slug: "harmone_ai",
      version: "1.0.1",
      orientation: "portrait",
      icon: "./assets/images/icon.png",
      scheme: "harmone",
      userInterfaceStyle: "automatic",
      newArchEnabled: true,
      updates: {
        url: "https://ota.harmone.ai/api/manifest",
        enabled: true,
        fallbackToCacheTimeout: 30000,
        codeSigningCertificate:
          "./code-signing/com.harmone.harmoneai-certificate.pem",
        codeSigningMetadata: {
          keyid: "main",
          alg: "rsa-v1_5-sha256",
        },
      },
      ios: {
        supportsTablet: true,
        bundleIdentifier: "com.harmone.harmoneai",
        infoPlist: {
          NSSpeechRecognitionUsageDescription:
            "Allow $(PRODUCT_NAME) to use speech recognition.",
          NSMicrophoneUsageDescription:
            "Allow $(PRODUCT_NAME) to use the microphone.",
          ITSAppUsesNonExemptEncryption: false,
        },
        usesAppleSignIn: true,
        appleTeamId: "6D963DM8MR",
      },
      android: {
        adaptiveIcon: {
          foregroundImage: "./assets/images/adaptive-icon.png",
          backgroundColor: "#ffffff",
        },
        package: "com.harmone.harmoneai",
        permissions: ["android.permission.RECORD_AUDIO"],
      },
      plugins: [
        [
          "expo-splash-screen",
          {
            image: "./assets/images/splash-icon.png",
            imageWidth: 200,
            resizeMode: "contain",
            backgroundColor: "#ffffff",
          },
        ],
        [
          "expo-speech-recognition",
          {
            microphonePermission:
              "Allow $(PRODUCT_NAME) to use the microphone.",
            speechRecognitionPermission:
              "Allow $(PRODUCT_NAME) to use speech recognition.",
            androidSpeechServicePackages: [
              "com.google.android.googlequicksearchbox",
            ],
          },
        ],
        "expo-secure-store",
        "expo-localization",
        "expo-apple-authentication",
        [
          "@react-native-google-signin/google-signin",
          {
            iosUrlScheme:
              "com.googleusercontent.apps.688317210747-e06gkeig3fjbasqbdhmmo9lblc4an75i",
          },
        ],
        [
          "react-native-share",
          {
            ios: ["fb", "instagram", "twitter", "tiktoksharesdk"],
            android: [
              "com.facebook.katana",
              "com.instagram.android",
              "com.twitter.android",
              "com.zhiliaoapp.musically",
            ],
            enableBase64ShareAndroid: true,
          },
        ],
        "expo-build-properties",
        "expo-video",
      ],
      experiments: {
        typedRoutes: true,
      },
      extra: {
        eas: {
          projectId: "6836d526-773a-4bf2-82d4-6a3eca5cafae",
        },
      },
      owner: "harmone",
    },
    {
      // The name of the .plist file to generate. Root is the default and must be provided.
      Root: {
        // The page object is required. It will be used to generate the .plist file.
        // The contents will be converted directly to plist.
        page: {
          // The `PreferenceSpecifiers` defines the UI elements to generate.
          PreferenceSpecifiers: [
            // Child panes can be used to create nested pages.
            Switch({
              title: "Session Replay",
              // The NSUserDefaults ID.
              key: "p_session_replay",
              value: false,
            }),
          ],
        },
      },
    }
  );
};
