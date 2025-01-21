import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { RootStackNavigationProp } from '../navigation/types';
import { fetchStories } from '../services/storyService';
import { Story } from '../types/story';

export default function StoryListScreen() {
  const navigation = useNavigation<RootStackNavigationProp>();
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    const loadStories = async () => {
      const data = await fetchStories(1); // TODO: Replace with actual user ID
      setStories(data);
    };
    loadStories();
  }, []);

  return (
    <SafeAreaView className='flex-1 bg-[#333333]'>
      {/* Header */}
      <View className='px-5 py-4 flex-row items-center'>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className='w-10 h-10 items-center justify-center'
        >
          <MaterialCommunityIcons name='chevron-left' size={32} color='#fff' />
        </TouchableOpacity>
        <Text className='flex-1 text-center text-lg font-medium text-white mr-10'>
          故事列表
        </Text>
      </View>

      {/* Story List */}
      <ScrollView className='flex-1 bg-white'>
        {stories.map((story) => (
          <TouchableOpacity
            key={story.id}
            onPress={() => navigation.navigate('StoryDetail', story)}
            className='border-b border-gray-100'
          >
            <View className='p-5'>
              {/* Story Image */}
              <Image
                source={require('../assets/images/image.png')}
                style={{
                  width: 120,
                  height: 120,
                  resizeMode: 'contain',
                }}
              />

              {/* Story Title */}
              <Text className='text-lg font-semibold text-gray-900 mb-2'>
                {story.title}
              </Text>

              {/* Story Preview */}
              <Text className='text-base text-gray-600' numberOfLines={3}>
                {story.story_content}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
