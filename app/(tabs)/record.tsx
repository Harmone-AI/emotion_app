import { StyleSheet, Text, View } from 'react-native';

export default function RecordScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>记录页面</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingBottom: 80, // Add padding for tab bar
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#9370DB',
  },
});
