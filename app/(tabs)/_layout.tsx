import { Tabs } from "expo-router";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { usePathname, useRouter } from "expo-router";

export default function TabLayout() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <Tabs screenOptions={{ headerShown: false }}>
        <Tabs.Screen name="index" options={{ href: null }} />
        <Tabs.Screen name="record" options={{ href: null }} />
      </Tabs>
      
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tab, isActive('/') && styles.activeTab]} 
          onPress={() => router.push('/')}
        >
          <Text style={[styles.tabText, isActive('/') && styles.activeText]}>主页</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, isActive('/record') && styles.activeTab]} 
          onPress={() => router.push('/record')}
        >
          <Text style={[styles.tabText, isActive('/record') && styles.activeText]}>记录</Text>
        </TouchableOpacity>
      </View>
    </>
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
    borderTopWidth: 1,
    borderTopColor: '#E6E6FA',
    height: 60,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  activeTab: {
    backgroundColor: '#E6E6FA',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeText: {
    color: '#9370DB',
    fontWeight: 'bold',
  },
});
