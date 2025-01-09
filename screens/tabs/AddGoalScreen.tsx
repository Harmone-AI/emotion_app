import { generateGoals } from '@/services';
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from '@tanstack/react-query';
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddGoalScreen() {
  const [feeling, setFeeling] = useState('');
  const [isListening, setIsListening] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // 处理语音识别事件
  useSpeechRecognitionEvent('start', () => {
    setIsListening(true);
    // 清空上一次的输入，避免重复
    setFeeling('');
  });
  useSpeechRecognitionEvent('end', () => {
    setIsListening(false);
  });
  useSpeechRecognitionEvent('result', (event) => {
    if (event.results[0]?.transcript) {
      // 直接设置最新的识别结果，而不是追加
      setFeeling(event.results[0].transcript);
    }
  });
  useSpeechRecognitionEvent('error', (event) => {
    console.log('error code:', event.error, 'error message:', event.message);
    Alert.alert('Error', 'Could not start voice recognition');
  });

  // 麦克风按钮动画效果
  useEffect(() => {
    if (isListening) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isListening, pulseAnim]);

  const startListening = async () => {
    try {
      const result =
        await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!result.granted) {
        Alert.alert(
          'Permission needed',
          'Please grant microphone permissions to use voice input'
        );
        return;
      }

      ExpoSpeechRecognitionModule.start({
        lang: 'en-US',
        interimResults: true,
        maxAlternatives: 1,
        continuous: false,
        requiresOnDeviceRecognition: false,
        addsPunctuation: false,
      });
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not start voice recognition');
    }
  };

  const stopListening = () => {
    try {
      ExpoSpeechRecognitionModule.stop();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = () => {
    if (!feeling.trim()) {
      Alert.alert('Please share your feelings');
      return;
    }
    console.log({ feeling });
    // TODO: 处理提交逻辑
  };

  return (
    <SafeAreaView className='flex-1 pb-8'>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-1 bg-white'
        style={{ width: '100%' }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className='flex-1 px-4 py-8' style={{ width: '100%' }}>
            {/* 头部文案 */}
            <View className='mb-6'>
              <Text className='text-2xl font-semibold text-gray-900 mb-2'>
                How are you feeling today?
              </Text>
              <Text className='text-base text-gray-500'>
                Share your thoughts and feelings, and we'll help you set
                meaningful goals.
              </Text>
            </View>

            {/* 输入区域 */}
            <View className='flex-1 mb-6'>
              <View className='flex-row justify-between items-center mb-4'>
                <Text className='text-lg font-medium text-gray-700'>
                  Your feelings
                </Text>
                <Animated.View
                  style={{
                    transform: [{ scale: pulseAnim }],
                    opacity: pulseAnim.interpolate({
                      inputRange: [1, 1.2],
                      outputRange: [1, 0.7],
                    }),
                  }}
                >
                  <Pressable
                    onPress={isListening ? stopListening : startListening}
                    className={`p-3 rounded-full ${
                      isListening ? 'bg-red-100' : 'bg-gray-100'
                    }`}
                  >
                    <Ionicons
                      name={isListening ? 'mic' : 'mic-outline'}
                      size={24}
                      color={isListening ? '#ef4444' : '#374151'}
                    />
                  </Pressable>
                </Animated.View>
              </View>

              <TextInput
                className='flex-1 bg-gray-50 rounded-xl p-4 text-base leading-6 text-gray-700'
                placeholder="I'm feeling..."
                value={feeling}
                onChangeText={setFeeling}
                multiline
                textAlignVertical='top'
                style={{ minHeight: 100 }}
              />
            </View>

            {/* 提交按钮 */}
            <GenerateGoalsButton feeling={feeling} />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function GenerateGoalsButton({ feeling }: { feeling: string }) {
  const generateGoalsMutate = useMutation({
    mutationKey: ['generate-goals'],
    mutationFn: generateGoals,
    onSuccess: (response) => {
      console.log(response);
    },
  });

  return (
    <TouchableOpacity
      onPress={async () => {
        console.log(123123123);
        const result = await generateGoalsMutate.mutateAsync(feeling);
        console.log('result', result);
      }}
      className={`py-3 rounded-xl ${
        feeling.trim() ? 'bg-purple-600' : 'bg-gray-300'
      }`}
      disabled={!feeling.trim()}
    >
      <Text className='text-white text-center font-semibold text-lg'>
        Generate Goals
      </Text>
    </TouchableOpacity>
  );
}
