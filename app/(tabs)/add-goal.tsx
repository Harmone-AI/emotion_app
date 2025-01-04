import {
  View,
  Text,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';

export default function AddGoalPage() {
  const [energy, setEnergy] = useState(0);
  const [feeling, setFeeling] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    (async () => {
      const permission = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      setHasPermission(permission === 'granted');
    })();
  }, []);

  // 监听语音识别结果
  useSpeechRecognitionEvent("result", (event) => {
    if (event.results && event.results.length > 0) {
      const transcript = event.results[0]?.transcript;
      if (transcript) {
        setFeeling(prev => prev + ' ' + transcript);
      }
    }
  });

  // 监听录音开始
  useSpeechRecognitionEvent("audiostart", (event) => {
    console.log("Recording started for file:", event.uri);
  });

  // 监听录音结束
  useSpeechRecognitionEvent("audioend", (event) => {
    console.log("Local file path:", event.uri);
    setRecordingUri(event.uri);
    setIsListening(false);
  });

  // 监听错误
  useSpeechRecognitionEvent("error", (event) => {
    console.error("Speech recognition error:", event);
    setIsListening(false);
  });

  const startListening = async () => {
    try {
      setIsListening(true);
      await ExpoSpeechRecognitionModule.start({
        lang: "zh-CN",
        recordingOptions: {
          persist: true,
          outputDirectory: FileSystem.cacheDirectory,
          outputFileName: `recording_${Date.now()}.wav`,
          outputSampleRate: 16000,
          outputEncoding: "pcmFormatInt16",
        },
      });
    } catch (error) {
      console.error('Failed to start speech recognition', error);
      setIsListening(false);
    }
  };

  const stopListening = async () => {
    try {
      await ExpoSpeechRecognitionModule.stop();
      setIsListening(false);
    } catch (error) {
      console.error('Failed to stop speech recognition', error);
    }
  };

  if (!hasPermission) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>需要麦克风权限才能使用语音识别功能</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
          <View className="flex-1 p-5 pb-24">
            <View className="mb-5">
              <Text className="text-xl mb-1">Energy - lvl:</Text>
              <TextInput
                className="border border-[#E6E6FA] rounded-lg p-2.5"
                keyboardType="numeric"
                value={energy.toString()}
                onChangeText={(value) => setEnergy(Number(value))}
                placeholder="Enter your energy level (0-100)"
              />
            </View>

            <View className="flex-1">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-xl">How are you feeling?</Text>
                <TouchableOpacity
                  onPress={isListening ? stopListening : startListening}
                  className={`p-2 rounded-full ${isListening ? 'bg-red-500' : 'bg-purple-600'}`}
                >
                  {isListening ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Ionicons name="mic" size={24} color="white" />
                  )}
                </TouchableOpacity>
              </View>

              {recordingUri && (
                <View className="mb-4 p-4 bg-gray-100 rounded-lg">
                  <Text className="text-sm text-gray-600 mb-2">Recording saved at:</Text>
                  <Text className="text-xs text-gray-500 mb-2">{recordingUri}</Text>
                </View>
              )}

              <TextInput
                className="flex-1 border border-[#E6E6FA] rounded-lg p-2.5"
                placeholder="Share your feelings today and we'll generate goals customized for you!"
                value={feeling}
                onChangeText={setFeeling}
                multiline
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity
              className="bg-purple-600 rounded-lg p-4 mt-4"
              onPress={() => {
                // TODO: 处理提交逻辑
                console.log({ energy, feeling, recordingUri });
              }}
            >
              <Text className="text-white text-center font-semibold">Generate Goals</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
