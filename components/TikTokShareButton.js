import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { shareToTikTok, shareToTikTokViaShareSheet } from '../utils/tiktokShare';
import * as Haptics from 'expo-haptics';

/**
 * A reusable TikTok share button component
 * 
 * @param {Object} props
 * @param {string} props.imageUri - URI of the image to share
 * @param {string} props.caption - Caption for the TikTok post
 * @param {Function} props.onShare - Callback function called after successful sharing
 * @param {boolean} props.useShareSheet - Whether to use the system share sheet (true) or direct TikTok sharing (false)
 * @param {Object} props.style - Additional styles for the button
 */
export default function TikTokShareButton({ 
  imageUri, 
  caption = 'Check out my Harmone AI emotion! #HarmoneAI', 
  onShare = () => {}, 
  useShareSheet = false,
  style = {}
}) {
  const handlePress = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      if (!imageUri) {
        Alert.alert('Error', 'No image to share');
        return;
      }
      
      if (useShareSheet) {
        await shareToTikTokViaShareSheet(imageUri, caption);
      } else {
        await shareToTikTok(imageUri, caption);
      }
      
      // Call the onShare callback
      onShare();
    } catch (error) {
      console.error('Error in TikTokShareButton:', error);
      Alert.alert('Error', 'Failed to share to TikTok');
    }
  };
  
  return (
    <TouchableOpacity 
      style={[styles.button, style]} 
      onPress={handlePress}
    >
      <Text style={styles.buttonText}>
        {useShareSheet ? 'Share via Share Sheet' : 'Share to TikTok'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#000000', // TikTok's primary color
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
