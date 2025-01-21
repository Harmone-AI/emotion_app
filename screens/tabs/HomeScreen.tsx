import { MaterialCommunityIcons } from '@expo/vector-icons';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetTextInput,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { Portal } from '@gorhom/portal';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useRef, useState } from 'react';
import {
  Keyboard,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

type RootStackParamList = {
  Home: undefined;
  AddGoal: undefined;
  Record: undefined;
  TaskList: undefined;
  StoryList: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

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
  const navigation = useNavigation<NavigationProp>();
  const [goals, setGoals] = useState<Goal[]>(defaultGoals);
  const [newGoal, setNewGoal] = useState('');
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

  const handleClosePress = () => {
    bottomSheetRef.current?.close();
  };

  const handleNavigateToAddGoal = () => {
    navigation.navigate('AddGoal');
  };

  const handleSheetChanges = (index: number) => {
    console.log('Bottom sheet index changed:', index);
    if (index === -1) {
      Keyboard.dismiss();
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ flex: 1 }}>
        {/* 顶部导航 */}
        <View className='flex-row justify-between items-center px-12 py-4'>
          <TouchableOpacity
            onPress={() => navigation.navigate('TaskList')}
            className='w-8 h-8'
          >
            <MaterialCommunityIcons name='menu' size={24} color='#666' />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('StoryList')}
            className='w-8 h-8'
          >
            <View className='absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full' />
            <MaterialCommunityIcons name='bell' size={24} color='#666' />
          </TouchableOpacity>
        </View>

        {/* 主要内容区域 */}
        <View className='flex-1 px-6 justify-center'>
          {/* 任务列表区域 */}
          <View
            className='bg-gray-50 rounded-3xl overflow-hidden'
            style={{ height: 280 }}
          >
            <ScrollView
              className='flex-1'
              contentContainerStyle={{ padding: 20 }}
              showsVerticalScrollIndicator={false}
            >
              {goals.map((goal) => (
                <TouchableOpacity
                  key={goal.id}
                  onPress={() => toggleGoal(goal.id)}
                  className='flex-row items-center bg-white rounded-xl p-4 mb-3 shadow-sm'
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.05,
                    shadowRadius: 2,
                    elevation: 1,
                  }}
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
            </ScrollView>
          </View>
        </View>

        {/* 底部浮动按钮 */}
        <TouchableOpacity
          className='absolute bottom-6 left-1/2 -ml-8 w-16 h-16 bg-white rounded-full items-center justify-center shadow-lg'
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          }}
          onPress={handleNavigateToAddGoal}
        >
          <MaterialCommunityIcons name='plus' size={32} color='#666' />
        </TouchableOpacity>

        {/* Bottom Sheet */}
        <Portal>
          <BottomSheet
            ref={bottomSheetRef}
            snapPoints={['40%']}
            onChange={handleSheetChanges}
            index={-1}
            enablePanDownToClose
            backdropComponent={renderBackdrop}
            handleIndicatorStyle={{
              backgroundColor: '#DDD',
              width: 40,
            }}
            backgroundStyle={{
              backgroundColor: 'white',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
            }}
            android_keyboardInputMode='adjustResize'
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
      </View>
    </SafeAreaView>
  );
}
