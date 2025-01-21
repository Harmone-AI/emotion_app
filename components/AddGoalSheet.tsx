import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetTextInput,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, { useCallback, useRef, useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';

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
  const snapPoints = ['50%'];

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.7}
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

  if (!isOpen) return null;

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      index={isOpen ? 0 : -1}
      enablePanDownToClose
      onClose={onClose}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{
        backgroundColor: '#666',
        width: 32,
      }}
      backgroundStyle={{
        backgroundColor: '#333333',
      }}
      style={{
        zIndex: 100,
        flex: 1,
      }}
    >
      <BottomSheetView className='flex-1 px-6 pt-2 pb-10'>
        <Text className='text-xl font-semibold text-white mb-6'>
          添加新目标
        </Text>

        <BottomSheetTextInput
          value={newGoal}
          onChangeText={setNewGoal}
          placeholder='输入你的目标...'
          placeholderTextColor='#666'
          className='bg-[#222222] text-white px-4 py-3 rounded-xl mb-6'
          style={{
            fontSize: 16,
          }}
        />

        <TouchableOpacity
          onPress={handleAddGoal}
          className='h-12 bg-white rounded-xl items-center justify-center'
        >
          <Text className='text-[#333333] font-medium text-base'>确认添加</Text>
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheet>
  );
}
