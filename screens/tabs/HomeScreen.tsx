import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { useState, useCallback, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetTextInput,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { Portal } from '@gorhom/portal';

type Goal = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
};

const defaultGoals: Goal[] = [
  {
    id: '1',
    title: 'Go for a walk',
    completed: false,
    createdAt: new Date(),
  },
  {
    id: '2',
    title: 'Read a book',
    completed: false,
    createdAt: new Date(),
  },
  {
    id: '3',
    title: 'Go to the gym',
    completed: false,
    createdAt: new Date(),
  },
];

export default function HomeScreen() {
  const [goals, setGoals] = useState<Goal[]>(defaultGoals);
  const [newGoal, setNewGoal] = useState('');
  const [energy, setEnergy] = useState(0);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  const toggleGoal = (id: string) => {
    setGoals(
      goals.map((goal) =>
        goal.id === id ? { ...goal, completed: !goal.completed } : goal
      )
    );
  };

  const handleAddGoal = () => {
    if (newGoal.trim()) {
      const newGoalItem = {
        id: Date.now().toString(),
        title: newGoal.trim(),
        completed: false,
        createdAt: new Date(),
      };
      setGoals([...goals, newGoalItem]);
      setNewGoal('');
      handleClosePress();
    }
  };

  const handleOpenPress = () => {
    console.log('Opening bottom sheet');
    bottomSheetRef.current?.expand();
  };

  const handleClosePress = () => {
    bottomSheetRef.current?.close();
  };

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <ScrollView className='flex-1 px-6'>
        {/* 标题部分 */}
        <View>
          <Text className='text-2xl font-bold text-gray-900'>
            How's your day?
          </Text>
          <Text className='mt-2 text-base text-gray-600'>
            Energy - lvl:{energy}
          </Text>
          <View className='mt-4 flex-row items-center justify-between bg-purple-100 rounded-xl p-4'>
            <View>
              <Text className='text-sm text-purple-600 font-medium'>
                Energy
              </Text>
              <Text className='text-2xl font-bold text-purple-700 mt-1'>
                {energy}/15
              </Text>
            </View>
            <View className='h-12 w-12 bg-purple-200 rounded-full items-center justify-center'>
              <Text className='text-xl text-purple-600'>🌟</Text>
            </View>
          </View>
        </View>

        {/* 目标列表 */}
        <View className='flex-1'>
          <Text className='text-lg font-semibold text-gray-900 mb-4 mt-8'>
            Goals
          </Text>
          {goals.map((goal) => (
            <TouchableOpacity
              key={goal.id}
              onPress={() => toggleGoal(goal.id)}
              className='flex-row items-center bg-gray-50 rounded-xl p-4 mb-3'
            >
              <View
                className={`h-6 w-6 rounded-full border-2 mr-3 items-center justify-center ${
                  goal.completed
                    ? 'bg-purple-600 border-purple-600'
                    : 'border-gray-300'
                }`}
              >
                {goal.completed && (
                  <Text className='text-white text-xs'>✓</Text>
                )}
              </View>
              <Text
                className={`flex-1 text-base ${
                  goal.completed
                    ? 'text-gray-400 line-through'
                    : 'text-gray-700'
                }`}
              >
                {goal.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* 浮动添加按钮 */}
      <TouchableOpacity
        className='absolute bottom-8 right-6 w-14 h-14 bg-purple-600 rounded-full items-center justify-center shadow-lg'
        style={{
          shadowColor: '#9333ea',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 6,
        }}
        onPress={handleOpenPress}
      >
        <MaterialCommunityIcons name='plus' size={30} color='white' />
      </TouchableOpacity>

      {/* Bottom Sheet */}
      <Portal>
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={['40%']}
          onChange={(index) => {
            console.log('Bottom sheet index changed:', index);
            if (index === -1) {
              Keyboard.dismiss();
            }
          }}
          index={-1}
          enablePanDownToClose
          backdropComponent={renderBackdrop}
          handleIndicatorStyle={{
            backgroundColor: '#9333ea',
            width: 40,
          }}
          backgroundStyle={{
            backgroundColor: 'white',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
          }}
          android_keyboardInputMode='adjustResize'
        >
          <TouchableWithoutFeedback
            onPress={() => {
              bottomSheetRef.current?.snapToIndex(0);
              Keyboard.dismiss();
            }}
          >
            <BottomSheetView className='flex-1 px-6 pt-2'>
              <Text className='text-xl font-semibold text-gray-900 mb-6'>
                添加新目标
              </Text>
              <BottomSheetTextInput
                className='bg-gray-50 rounded-xl px-4 py-3 text-base text-gray-900'
                placeholder='输入你的目标...'
                value={newGoal}
                onChangeText={setNewGoal}
                multiline
              />
              <TouchableOpacity
                className='bg-purple-600 rounded-xl py-4 mt-6'
                onPress={handleAddGoal}
              >
                <Text className='text-white text-center font-semibold'>
                  添加
                </Text>
              </TouchableOpacity>
            </BottomSheetView>
          </TouchableWithoutFeedback>
        </BottomSheet>
      </Portal>
    </SafeAreaView>
  );
}
