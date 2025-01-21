import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Story } from '../types/story';

export default function StoryDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const story = route.params as Story;

  return (
    <SafeAreaView className='flex-1 bg-white'>
      {/* Header */}
      <View className='px-5 py-4 flex-row items-center border-b border-gray-100'>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className='w-10 h-10 items-center justify-center'
        >
          <MaterialCommunityIcons name='chevron-left' size={32} color='#333' />
        </TouchableOpacity>
        <Text className='flex-1 text-center text-gray-900 text-lg font-medium mr-10'>
          故事详情
        </Text>
      </View>

      {/* Content */}
      <ScrollView className='flex-1'>
        {/* Story Image */}
        <Image
          source={require('../assets/images/image.png')}
          className='w-full aspect-[4/3]'
          resizeMode='cover'
        />

        {/* Story Content */}
        <View className='p-5'>
          {/* Title */}
          <Text className='text-xl font-semibold text-gray-900 mb-4'>
            {story.title}
          </Text>

          {/* Content */}
          <Text className='text-base leading-6 text-gray-700'>
            {story.content}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
