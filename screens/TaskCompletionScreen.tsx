import { View, Text, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TaskCompletionScreen() {
  const navigation = useNavigation();
  
  return (
    <SafeAreaView className='flex-1 bg-gray-800'>
      <View className='flex-1'>
        {/* Header */}
        <View className='flex-row justify-between items-center px-4 py-2'>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name='chevron-left' size={32} color='#fff' />
          </TouchableOpacity>
          <TouchableOpacity 
            className='bg-white/10 px-4 py-1.5 rounded-full'
            onPress={() => {/* TODO: Add share functionality */}}
          >
            <Text className='text-white text-base'>分享</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View className='flex-1 items-center justify-center px-4'>
          <View className='bg-white/10 rounded-2xl p-4 mb-8'>
            <Image
              source={require('../assets/images/image.png')}
              style={{
                width: 120,
                height: 120,
                resizeMode: 'contain',
              }}
            />
          </View>
          
          <Text className='text-white text-2xl font-bold mb-2'>大机灵鬼</Text>
          <Text className='text-white/60 text-base mb-8'>摇摇摆摆扭扭捏捏</Text>
          
          <View className='bg-white/20 rounded-full px-6 py-3 mb-12'>
            <Text className='text-white text-lg font-medium'>已完成10个任务</Text>
          </View>

          <Text className='text-white/80 text-lg text-center'>
            nbglas, 你真的，我哭死
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
