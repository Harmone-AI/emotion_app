import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SignedIn, SignedOut, useClerk, useUser } from '@clerk/clerk-expo';
import { Link, router } from 'expo-router';

export default function HomePage() {
  const [energy, setEnergy] = useState(0);
  const [feeling, setFeeling] = useState('');

  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container} edges={['top']}>
        <View>
          <SignedIn>
            <Text>
              Hello {user?.username} 👋
              {user?.emailAddresses[0].emailAddress}
            </Text>
            <TouchableOpacity
              onPress={async () => {
                await signOut();
                router.reload();
              }}
            >
              <Text>Sign out</Text>
            </TouchableOpacity>
          </SignedIn>
          <SignedOut>
            <Link href='/(auth)/sign-in'>
              <Text>Sign in</Text>
            </Link>
            <Link href='/(auth)/sign-up'>
              <Text>Sign up</Text>
            </Link>
          </SignedOut>
        </View>

        <View style={styles.content}>
          <View style={styles.chatBubble}>
            <Text style={styles.bubbleText}>How's your day?</Text>
          </View>

          <View style={styles.energyContainer}>
            <Text>Energy - lvl:</Text>
            <View style={styles.energyBar}>
              <View
                style={[
                  styles.energyFill,
                  { width: `${(energy / 15) * 100}%` },
                ]}
              />
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
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    paddingBottom: 100, // Extra padding for tab bar
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
    marginBottom: 20,
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
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E6E6FA',
    borderRadius: 10,
    padding: 10,
    height: 100,
    textAlignVertical: 'top',
  },
});
