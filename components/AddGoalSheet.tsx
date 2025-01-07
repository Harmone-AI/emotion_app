import React, { useCallback, useRef, useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetTextInput,
  BottomSheetView,
} from '@gorhom/bottom-sheet';

type AddGoalSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (goal: string) => void;
};

export default function AddGoalSheet({
  isOpen,
  onClose,
  onAdd,
}: AddGoalSheetProps) {
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

  const handleAddGoal = () => {
    if (newGoal.trim()) {
      onAdd(newGoal);
      setNewGoal('');
      onClose();
    }
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={['50%']}
      onChange={(index) => {
        if (index === -1) {
          onClose();
        }
      }}
      enablePanDownToClose
      index={isOpen ? 0 : -1}
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
          <Text className='text-white text-center font-semibold'>添加</Text>
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheet>
  );
}
