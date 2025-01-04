import {
  Text,
  View,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function HomePage() {
  const [energy, setEnergy] = useState(0);
  const [feeling, setFeeling] = useState('');
  const router = useRouter();

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        <View className="flex-1 p-5 pb-24 flex flex-col items-center gap-4">
          <Text className="text-base text-center">How's your day?</Text>

          <View className="mb-5 w-full px-4">
            <Text className="text-xl mb-1 text-center">Energy - lvl:</Text>
            <View className="h-5 bg-[#E6E6FA] rounded-lg mt-1 overflow-hidden relative">
              <View
                className="absolute h-full bg-[#9370DB] rounded-lg"
                style={{ width: `${(energy / 15) * 100}%` }}
              />
              <Text className="absolute w-full text-center leading-5">{energy}/15</Text>
            </View>
          </View>

          <TextInput
            className="w-full border border-[#E6E6FA] rounded-lg p-2.5 h-24"
            placeholder="Share your feelings today and we'll generate goals customized for you!"
            value={feeling}
            onChangeText={setFeeling}
            multiline
            textAlignVertical="top"
          />

          {/* 添加目标按钮 */}
          <TouchableOpacity
            className="absolute bottom-8 right-8 w-14 h-14 bg-purple-600 rounded-full items-center justify-center shadow-lg"
            onPress={() => router.push('/(tabs)/add-goal')}
          >
            <Ionicons name="add" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
