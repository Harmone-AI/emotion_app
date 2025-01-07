import {
  View,
  Text,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddGoalScreen() {
  const [energy, setEnergy] = useState(0);
  const [feeling, setFeeling] = useState('');

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className='flex-1'
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView className='flex-1 bg-white' edges={['top']}>
          <View className='flex-1 p-5 pb-24'>
            <View className='mb-5'>
              <Text className='text-xl mb-1'>Energy - lvl:</Text>
              <TextInput
                className='border border-[#E6E6FA] rounded-lg p-2.5'
                keyboardType='numeric'
                value={energy.toString()}
                onChangeText={(value) => setEnergy(Number(value))}
                placeholder='Enter your energy level (0-100)'
              />
            </View>

            <View className='flex-1'>
              <View className='flex-row justify-between items-center mb-2'>
                <Text className='text-xl'>How are you feeling?</Text>
              </View>

              <TextInput
                className='flex-1 border border-[#E6E6FA] rounded-lg p-2.5'
                placeholder="Share your feelings today and we'll generate goals customized for you!"
                value={feeling}
                onChangeText={setFeeling}
                multiline
                textAlignVertical='top'
              />
            </View>

            <TouchableOpacity
              className='bg-purple-600 rounded-lg p-4 mt-4'
              onPress={() => {
                console.log({ energy, feeling });
              }}
            >
              <Text className='text-white text-center font-semibold'>
                Generate Goals
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
