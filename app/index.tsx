import { Text, View, TextInput, StyleSheet } from "react-native";
import { useState } from "react";

export default function Index() {
  const [energy, setEnergy] = useState(0);
  const [feeling, setFeeling] = useState("");

  return (
    <View style={styles.container}>
      <View style={styles.chatBubble}>
        <Text style={styles.bubbleText}>How's your day?</Text>
      </View>
      
      <View style={styles.energyContainer}>
        <Text>Energy - lvl:</Text>
        <View style={styles.energyBar}>
          <View style={[styles.energyFill, { width: `${(energy/15) * 100}%` }]} />
          <Text style={styles.energyText}>{energy}/15</Text>
        </View>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Share your feelings today and we'll generate goals customized for you!"
        value={feeling}
        onChangeText={setFeeling}
        multiline
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    paddingBottom: 80, // Add padding for tab bar
  },
  chatBubble: {
    backgroundColor: '#E6E6FA',
    padding: 15,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  bubbleText: {
    fontSize: 16,
  },
  energyContainer: {
    marginVertical: 20,
  },
  energyBar: {
    height: 20,
    backgroundColor: '#E6E6FA',
    borderRadius: 10,
    marginTop: 5,
    overflow: 'hidden',
    position: 'relative',
  },
  energyFill: {
    position: 'absolute',
    height: '100%',
    backgroundColor: '#9370DB',
    borderRadius: 10,
  },
  energyText: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    lineHeight: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E6E6FA',
    borderRadius: 10,
    padding: 15,
    height: 100,
    textAlignVertical: 'top',
    marginVertical: 20,
  },
});
