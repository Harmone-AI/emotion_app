import { Tabs } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { useCallback } from 'react';
import {
  createDrawerNavigator,
  DrawerNavigationProp,
} from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import CustomDrawer from '../../components/CustomDrawer';

const Drawer = createDrawerNavigator();

function TabsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  const isActive = useCallback((path: string) => pathname === path, [pathname]);

  const navigateToTab = (path: string) => {
    if (path === '/') {
      navigation.navigate('tabs', { screen: 'index' });
    } else if (path === '/record') {
      navigation.navigate('tabs', { screen: 'record' });
    }
  };

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: true,
          tabBarStyle: { display: 'none' },
          headerLeft: () => (
            <TouchableOpacity
              style={{ marginLeft: 16 }}
              onPress={() => navigation.openDrawer()}
            >
              <Ionicons name='menu' size={24} color='black' />
            </TouchableOpacity>
          ),
        }}
      >
        <Tabs.Screen
          name='index'
          options={{
            title: '主页',
            href: null,
          }}
        />
        <Tabs.Screen
          name='record'
          options={{
            title: '记录',
            href: null,
          }}
        />
      </Tabs>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, isActive('/') && styles.activeTab]}
          onPress={() => navigateToTab('/')}
        >
          <Text style={[styles.tabText, isActive('/') && styles.activeText]}>
            主页
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, isActive('/record') && styles.activeTab]}
          onPress={() => navigateToTab('/record')}
        >
          <Text
            style={[styles.tabText, isActive('/record') && styles.activeText]}
          >
            记录
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

export default function TabLayout() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: '75%',
        },
      }}
    >
      <Drawer.Screen name='tabs' component={TabsContent} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    height: 60,
    paddingBottom: 5,
    borderTopWidth: 1,
    borderTopColor: '#E6E6FA',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -0.5,
    },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 5,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  activeTab: {
    borderTopWidth: 0,
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeText: {
    color: '#9370DB',
    fontWeight: 'bold',
  },
});
