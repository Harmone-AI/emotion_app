import React from 'react';
import {
  NavigationContainer,
  useNavigation,
  DrawerActions,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text, Image, TouchableOpacity } from 'react-native';

import SignInScreen from '../screens/auth/SignInScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import HomeScreen from '../screens/tabs/HomeScreen';
import RecordScreen from '../screens/tabs/RecordScreen';
import {
  RootStackParamList,
  DrawerParamList,
  TabParamList,
  NavigationProp,
} from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();

// 自定义 hook 获取当前标签页
function useCurrentTab() {
  const navigation = useNavigation();

  const getCurrentTab = () => {
    try {
      const state = navigation.getState();
      // 找到 Root 路由
      const rootRoute = state?.routes?.find((route) => route.name === 'Root');
      if (!rootRoute?.state) return 'Home';

      // 找到 Main 路由
      const drawerState = rootRoute.state as any;
      const mainRoute = drawerState.routes.find(
        (route: any) => route.name === 'Main'
      );
      if (!mainRoute?.state) return 'Home';

      // 获取当前标签页
      const tabState = mainRoute.state;
      return tabState.routes[tabState.index]?.name || 'Home';
    } catch (error) {
      console.log('Error getting current tab:', error);
      return 'Home';
    }
  };

  return getCurrentTab();
}

function CustomDrawerContent() {
  // const { user } = useUser();
  // const { signOut } = useAuth();
  const navigation = useNavigation();
  const currentTab = useCurrentTab();

  console.log(currentTab);

  const navigateToScreen = (screenName: keyof TabParamList) => {
    // @ts-ignore: 暂时忽略类型检查
    navigation.navigate('Root', {
      screen: 'Main',
      params: {
        screen: screenName,
      },
    });
  };

  return (
    <View className='flex-1 bg-white'>
      <DrawerContentScrollView>
        {/* 用户信息区域 */}
        {/* <View className='px-6 py-8'>
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
        </View> */}

        {/* 导航菜单 */}
        <View className='px-4 py-6'>
          <TouchableOpacity
            className='flex-row items-center px-4 py-3 rounded-lg mb-2'
            style={{
              backgroundColor:
                currentTab === 'Home' ? '#f3e8ff' : 'transparent',
            }}
            onPress={() => navigateToScreen('Home')}
          >
            <MaterialCommunityIcons
              name='home'
              size={24}
              color={currentTab === 'Home' ? '#9333ea' : '#4b5563'}
            />
            <Text
              className={`ml-3 ${
                currentTab === 'Home' ? 'text-purple-600' : 'text-gray-700'
              }`}
            >
              首页
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className='flex-row items-center px-4 py-3 rounded-lg'
            style={{
              backgroundColor:
                currentTab === 'Record' ? '#f3e8ff' : 'transparent',
            }}
            onPress={() => navigateToScreen('Record')}
          >
            <MaterialCommunityIcons
              name='text-box'
              size={24}
              color={currentTab === 'Record' ? '#9333ea' : '#4b5563'}
            />
            <Text
              className={`ml-3 ${
                currentTab === 'Record' ? 'text-purple-600' : 'text-gray-700'
              }`}
            >
              记录
            </Text>
          </TouchableOpacity>
        </View>

        {/* 登出按钮 */}
      </DrawerContentScrollView>

      <View className='px-4'>
        <TouchableOpacity
          className='mt-2 mb-6 flex-row items-center px-4 py-3 w-full rounded-full bg-red-500 justify-center'
          // onPress={() => signOut()}
        >
          <MaterialCommunityIcons name='logout' size={18} color='#fff' />
          <Text className='ml-3 text-white font-medium'>退出登录</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function TabNavigator() {
  const navigation = useNavigation();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Record') {
            iconName = focused ? 'text-box' : 'text-box-outline';
          }

          return (
            <MaterialCommunityIcons
              name={iconName as any}
              size={size}
              color={color}
            />
          );
        },
        tabBarActiveTintColor: '#9370DB',
        tabBarInactiveTintColor: 'gray',
        headerShown: true,
        headerTitleStyle: {
          color: '#9370DB',
          fontSize: 18,
        },
        headerTitleAlign: 'center',
        headerLeft: () => (
          <MaterialCommunityIcons
            name='menu'
            size={24}
            color='#9370DB'
            style={{ marginLeft: 10 }}
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          />
        ),
      })}
    >
      <Tab.Screen
        name='Home'
        component={HomeScreen}
        options={{
          title: '首页',
          tabBarLabel: '首页',
          headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcons name='heart' size={24} color='#9370DB' />
              <Text
                style={{
                  marginLeft: 8,
                  fontSize: 18,
                  color: '#9370DB',
                  fontWeight: '600',
                }}
              >
                心情记录
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name='Record'
        component={RecordScreen}
        options={{
          title: '记录',
          tabBarLabel: '记录',
          headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcons name='heart' size={24} color='#9370DB' />
              <Text
                style={{
                  marginLeft: 8,
                  fontSize: 18,
                  color: '#9370DB',
                  fontWeight: '600',
                }}
              >
                心情记录
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={CustomDrawerContent}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: '#fff',
          width: 280,
        },
      }}
    >
      <Drawer.Screen name='Main' component={TabNavigator} />
    </Drawer.Navigator>
  );
}

export default function Navigation() {
  // const { isSignedIn } = useAuth();

  // console.log(isSignedIn);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* {!isSignedIn ? (
          <Stack.Group screenOptions={{ headerShown: false }}>
            <Stack.Screen name='SignIn' component={SignInScreen} />
            <Stack.Screen name='SignUp' component={SignUpScreen} />
          </Stack.Group>
        ) : (
          
        )} */}

        <Stack.Screen
          name='Root'
          component={DrawerNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
