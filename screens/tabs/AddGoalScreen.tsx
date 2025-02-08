import { RootStackNavigationProp } from '@/navigation/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {
  useSpeechRecognitionEvent,
  ExpoSpeechRecognitionModule
} from 'expo-speech-recognition';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useWord2TaskList } from '../../hooks/useTaskQueries';

export default function AddGoalScreen() {
  const navigation = useNavigation<RootStackNavigationProp>();
  const [feeling, setFeeling] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [waveformBars, setWaveformBars] = useState<number[]>([]);
  const [input, setInput] = useState('');
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // 使用 react-query 的 mutation
  const { mutate: word2TaskList, isPending } = useWord2TaskList();

  // 处理语音识别事件
  useSpeechRecognitionEvent('start', () => {
    setIsListening(true);
    // 开始波形动画
    startWaveformAnimation();
  });

  useSpeechRecognitionEvent('end', () => {
    setIsListening(false);
    // 停止波形动画
    stopWaveformAnimation();
  });

  useSpeechRecognitionEvent('result', (event) => {

    console.log("result====",event.results[0].transcript);
    if (event.results[0]?.transcript) {
      setFeeling(event.results[0].transcript);
    }
  });

  useSpeechRecognitionEvent('error', (event) => {
    console.log('error code:', event.error, 'error message:', event.message);
    Alert.alert('Error', '语音识别失败，请重试');
  });

  // 波形动画
  const startWaveformAnimation = () => {
    // 生成随机波形数据
    const generateWaveform = () => {
      const bars = Array.from(
        { length: 30 },
        () => Math.random() * (isListening ? 40 : 10) + 10
      );
      setWaveformBars(bars);
    };

    // 每100ms更新一次波形
    const interval = setInterval(generateWaveform, 100);
    return () => clearInterval(interval);
  };

  const stopWaveformAnimation = () => {
    setWaveformBars([]);
  };

  // 呼吸动画
  useEffect(() => {
    const breatheAnimation = () => {
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
      ]).start(() => {
        if (isListening) {
          breatheAnimation();
        }
      });
    };

    if (isListening) {
      breatheAnimation();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isListening, pulseAnim]);

  const startListening = async () => {
   
  };

  const stopListening = () => {
    
  };

  const handleSubmit = () => {
    if (!feeling.trim()) {
      Alert.alert('提示', '请先说点什么...');
      return;
    }

    word2TaskList(
      { input: feeling, userId: 1 },
      {
        onSuccess: (result) => {
          Alert.alert('成功', result.start_message, [
            {
              text: '查看任务',
              onPress: () => {
                navigation.navigate('TaskList');
              },
            },
            {
              text: '继续添加',
              style: 'cancel',
              onPress: () => {
                setFeeling('');
              },
            },
          ]);
        },
        onError: (error) => {
          Alert.alert('错误', '生成任务列表失败，请稍后重试');
          console.error('Error generating task list:', error);
        },
      }
    );
  };

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-1'
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className='flex-1 px-6 pt-4 pb-8'>
            {/* 头部关闭按钮 */}
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className='self-end p-2'
            >
              <MaterialCommunityIcons name='close' size={24} color='#666' />
            </TouchableOpacity>

            {/* 输入区域 */}
            <View className='flex-1'>
              <TextInput
                className='flex-1 text-base leading-6 text-gray-700'
                placeholder='你感觉怎么样？&#10;你今天在忙什么？&#10;输入你心中的想法，开始你的个人冒险......'
                placeholderTextColor='#666'
                value={feeling}
                onChangeText={setFeeling}
                multiline
                textAlignVertical='top'
              />

              {/* 语音波形动画 */}
              {isListening && (
                <View className='flex-row items-center justify-center h-20 my-4'>
                  {waveformBars.map((height, index) => (
                    <View
                      key={index}
                      className='mx-0.5 bg-purple-500'
                      style={{
                        height,
                        width: 3,
                        borderRadius: 1.5,
                      }}
                    />
                  ))}
                </View>
              )}
            </View>

            {/* 底部按钮区域 */}
            <View className='flex-row justify-between items-center mt-4 mb-8'>
              <TouchableOpacity
                onPress={isListening ? stopListening : startListening}
                className={`p-3 rounded-full ${
                  isListening ? 'bg-purple-100' : ''
                }`}
              >
                <MaterialCommunityIcons
                  name={isListening ? 'microphone' : 'microphone-outline'}
                  size={28}
                  color={isListening ? '#9333ea' : '#374151'}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSubmit}
                disabled={isPending}
                className='bg-white rounded-3xl py-3 px-14 border border-gray-100'
                style={{
                  minWidth: 140,
                  opacity: isPending ? 0.7 : 1,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 1,
                  },
                  shadowOpacity: 0.1,
                  shadowRadius: 1,
                  elevation: 1,
                }}
              >
                {isPending ? (
                  <ActivityIndicator color='#9333ea' />
                ) : (
                  <Text className='text-base text-center text-gray-700'>
                    完成
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
