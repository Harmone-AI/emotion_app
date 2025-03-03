import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { getRedditRedirectUri } from '../utils/redditAuth';
import RedditAuthButton from '../components/RedditAuthButton';

export default function RedditAuthScreen() {
  const [redirectUri, setRedirectUri] = useState('');

  useEffect(() => {
    // Get the redirect URI that will be used for this environment
    const uri = getRedditRedirectUri();
    setRedirectUri(uri);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reddit Authentication</Text>
      
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Current Redirect URI:</Text>
        <Text style={styles.infoText}>{redirectUri}</Text>
        <Text style={styles.infoNote}>
          Add this URI to your Reddit developer console in the app settings.
        </Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <RedditAuthButton />
      </View>
      
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>How it works:</Text>
        <Text style={styles.infoText}>
          1. Press the button to initiate Reddit OAuth flow{'\n'}
          2. Authenticate with your Reddit credentials{'\n'}
          3. Reddit will redirect back to this app{'\n'}
          4. The authorization code will be extracted from the URL
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  infoBox: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    width: '100%',
    marginVertical: 15,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
  },
  infoNote: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 10,
    color: '#666',
  },
  buttonContainer: {
    marginVertical: 20,
  },
});
