import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useUser, useClerk } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CustomDrawer() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/sign-in');
  };

  return (
    <SafeAreaView className="flex-1 p-4">
      <View className="items-center p-4 border-b border-gray-200">
        {user?.imageUrl && (
          <Image
            source={{ uri: user.imageUrl }}
            className="w-20 h-20 rounded-full mb-2"
          />
        )}
        <Text className="text-lg font-bold mb-1">{user?.username || 'User'}</Text>
        <Text className="text-sm text-gray-600">
          {user?.emailAddresses[0].emailAddress}
        </Text>
      </View>

      <View className="mt-4">
        <TouchableOpacity
          className="py-3 px-4 rounded-lg"
          onPress={() => router.push('/')}
        >
          <Text className="text-base">主页</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="py-3 px-4 rounded-lg"
          onPress={() => router.push('/record')}
        >
          <Text className="text-base">记录</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        className="mt-auto bg-red-500 p-3 rounded-lg items-center"
        onPress={handleSignOut}
      >
        <Text className="text-white font-semibold">退出登录</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
