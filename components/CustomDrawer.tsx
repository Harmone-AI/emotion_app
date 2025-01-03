import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useUser, useClerk } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import { useNavigation, DrawerActions } from '@react-navigation/native';

export default function CustomDrawer(props: any) {
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigation = useNavigation();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/sign-in');
  };

  const navigateToScreen = (screen: string) => {
    navigation.navigate('tabs', { screen });
    navigation.dispatch(DrawerActions.closeDrawer());
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.container}>
        <View style={styles.userSection}>
          {user?.imageUrl && (
            <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
          )}
          <Text style={styles.username}>{user?.username || 'User'}</Text>
          <Text style={styles.email}>
            {user?.emailAddresses[0].emailAddress}
          </Text>
        </View>

        <View style={styles.menuItems}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigateToScreen('index')}
          >
            <Text style={styles.menuText}>主页</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigateToScreen('record')}
          >
            <Text style={styles.menuText}>记录</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>退出登录</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  userSection: {
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
  menuItems: {
    marginTop: 16,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  menuText: {
    fontSize: 16,
  },
  signOutButton: {
    marginTop: 'auto',
    backgroundColor: '#ff4444',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  signOutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
