import { useAuth, useUser } from '@clerk/clerk-expo';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import SignInScreen from '../screens/auth/SignInScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import StoryDetailScreen from '../screens/StoryDetailScreen';
import StoryListScreen from '../screens/StoryListScreen';
import AddGoalScreen from '../screens/tabs/AddGoalScreen';
import HomeScreen from '../screens/tabs/HomeScreen';
import TaskListScreen from '../screens/TaskListScreen';
import TaskCompletionScreen from '../screens/TaskCompletionScreen';
import { DrawerParamList, RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { navigation } = props;
  const { user } = useUser();
  const { signOut } = useAuth();

  const navigateToScreen = (screenName: keyof DrawerParamList) => {
    navigation.navigate(screenName);
  };

  return (
    <View className='flex-1 bg-white'>
      <DrawerContentScrollView {...props}>
        {/* 用户信息区域 */}
        <View className='px-6 py-8'>
          <View className='items-center'>
            {user?.imageUrl ? (
              <Image
                source={{ uri: user.imageUrl }}
                className='w-20 h-20 rounded-full mb-3'
              />
            ) : (
              <View className='w-20 h-20 rounded-full bg-purple-100 items-center justify-center mb-3'>
                <MaterialCommunityIcons
                  name='account'
                  size={36}
                  color='#9333ea'
                />
              </View>
            )}
            <Text className='text-lg font-semibold text-gray-800 mb-1'>
              {user?.username || '用户'}
            </Text>
            <Text className='text-sm text-gray-500'>
              {user?.primaryEmailAddress?.emailAddress}
            </Text>
          </View>
        </View>

        {/* Menu Items */}
        <View className='px-2 mt-4'>
          <TouchableOpacity
            className='flex-row items-center px-2 py-3 rounded-lg'
            onPress={() => navigateToScreen('Home')}
          >
            <MaterialCommunityIcons name='home' size={24} color='#666' />
            <Text className='ml-3 text-gray-700 text-base'>首页</Text>
          </TouchableOpacity>
        </View>
      </DrawerContentScrollView>

      {/* 登出按钮 */}
      <View className='px-4'>
        <TouchableOpacity
          className='mt-2 mb-6 flex-row items-center px-4 py-3 w-full rounded-full bg-red-500 justify-center'
          onPress={() => signOut()}
        >
          <MaterialCommunityIcons name='logout' size={18} color='#fff' />
          <Text className='ml-3 text-white font-medium'>退出登录</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: '75%',
        },
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name='Home'
        component={HomeScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name='home' size={size} color={color} />
          ),
          title: '首页',
        }}
      />
    </Drawer.Navigator>
  );
}

export default function Navigation() {
  const { isSignedIn } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* {!isSignedIn ? (
          <>
            <Stack.Screen name='SignIn' component={SignInScreen} />
            <Stack.Screen name='SignUp' component={SignUpScreen} />
          </>
        ) : ( */}
        <>
          <Stack.Screen name='SignIn' component={SignInScreen} />
          <Stack.Screen name='SignUp' component={SignUpScreen} />
          <Stack.Screen name='DrawerRoot' component={DrawerNavigator} />
          <Stack.Screen
            name='Home'
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='AddGoal'
            component={AddGoalScreen}
            options={{ headerShown: false, presentation: 'modal' }}
          />
          <Stack.Screen
            name='TaskList'
            component={TaskListScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='TaskCompletion'
            component={TaskCompletionScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='StoryList'
            component={StoryListScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='StoryDetail'
            component={StoryDetailScreen}
            options={{ headerShown: false }}
          />
        </>
        {/* )} */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
