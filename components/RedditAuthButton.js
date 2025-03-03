import React, { useEffect, useState } from 'react';
import { Button, Alert, View, Text, StyleSheet, Share } from 'react-native';
import { 
  initiateRedditAuth, 
  setupRedditAuthListener, 
  getRedditRedirectUri,
  shareImageToReddit
} from '../utils/redditAuth';

// Replace with your actual Reddit client ID from the Reddit developer console
const REDDIT_CLIENT_ID = 'IrC_-PAHIWltomEqrQzF9A';

export default function RedditAuthButton({ imageUri, title, onShare }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authCode, setAuthCode] = useState(null);

  useEffect(() => {
    // Set up the listener for when the app is opened via the redirect URI
    const unsubscribe = setupRedditAuthListener((code) => {
      // Handle the authorization code
      setAuthCode(code);
      setIsAuthenticated(true);
      Alert.alert('Success', 'Successfully authenticated with Reddit!');
      
      // If an image URI was provided, share it immediately after authentication
      if (imageUri) {
        handleShareToReddit();
      }
    });

    // Clean up the listener when the component unmounts
    return unsubscribe;
  }, [imageUri]);

  const handleRedditLogin = () => {
    // Display the redirect URI that will be used (for debugging purposes)
    const redirectUri = getRedditRedirectUri();
    console.log('Redirect URI:', redirectUri);
    
    // Start the Reddit OAuth flow
    initiateRedditAuth(REDDIT_CLIENT_ID);
  };

  const handleShareToReddit = async () => {
    try {
      // If we have an image URI, share it to Reddit
      if (imageUri) {
        // Use our custom function to share to Reddit
        await shareImageToReddit(
          imageUri,
          title || 'Check out my Harmone AI emotion!'
        );
        
        if (onShare) {
          onShare('reddit');
        }
      } else {
        Alert.alert('Error', 'No image to share');
      }
    } catch (error) {
      console.error('Error sharing to Reddit:', error);
      Alert.alert('Error', 'Failed to share to Reddit');
    }
  };

  // If an imageUri is provided, this is being used as a share button
  if (imageUri) {
    return (
      <Button
        title="Share to Reddit"
        color="#FF4500"
        onPress={handleShareToReddit}
      />
    );
  }

  // Otherwise, this is being used as an auth button
  return (
    <View style={styles.container}>
      <Button
        title={isAuthenticated ? "Authenticated with Reddit" : "Login with Reddit"}
        color="#FF4500"
        onPress={handleRedditLogin}
        disabled={isAuthenticated}
      />
      {isAuthenticated && (
        <Text style={styles.successText}>✓ Ready to share to Reddit</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  successText: {
    color: 'green',
    marginTop: 5,
    textAlign: 'center',
  }
});
