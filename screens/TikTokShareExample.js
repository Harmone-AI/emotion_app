import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { shareToTikTok, shareToTikTokViaShareSheet } from '../utils/tiktokShare';
import ViewShot from 'react-native-view-shot';
import * as Haptics from 'expo-haptics';

export default function TikTokShareExample() {
  const [imageUri, setImageUri] = useState(null);
  const viewShotRef = useRef(null);

  const captureScreen = async () => {
    if (viewShotRef.current) {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        const uri = await viewShotRef.current.capture();
        setImageUri(uri);
        Alert.alert('Success', 'Image captured! Now you can share it to TikTok.');
      } catch (error) {
        console.error('Error capturing screen:', error);
        Alert.alert('Error', 'Failed to capture screen');
      }
    }
  };

  const handleShareToTikTok = async () => {
    if (imageUri) {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        
        // Share to TikTok using our custom function
        await shareToTikTok(
          imageUri,
          'Check out my Harmone AI emotion! #HarmoneAI #EmotionAI'
        );
      } catch (error) {
        console.error('Error sharing to TikTok:', error);
        Alert.alert('Error', 'Failed to share to TikTok');
      }
    } else {
      Alert.alert('Error', 'No image to share. Please capture the screen first.');
    }
  };

  const handleShareViaShareSheet = async () => {
    if (imageUri) {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        
        // Share via system share sheet (can be used to share to TikTok)
        await shareToTikTokViaShareSheet(
          imageUri,
          'Check out my Harmone AI emotion! #HarmoneAI #EmotionAI'
        );
      } catch (error) {
        console.error('Error sharing via share sheet:', error);
        Alert.alert('Error', 'Failed to share via share sheet');
      }
    } else {
      Alert.alert('Error', 'No image to share. Please capture the screen first.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TikTok Share Example</Text>
      
      <ViewShot
        ref={viewShotRef}
        options={{ format: 'jpg', quality: 0.9 }}
        style={styles.captureContainer}
      >
        <View style={styles.contentToCapture}>
          <Text style={styles.emotionText}>My Emotion Today</Text>
          <View style={styles.emotionContainer}>
            <Text style={styles.emoji}>😊</Text>
            <Text style={styles.emotionLabel}>Happy</Text>
          </View>
          <Text style={styles.appName}>Harmone AI</Text>
        </View>
      </ViewShot>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.captureButton}
          onPress={captureScreen}
        >
          <Text style={styles.buttonText}>Capture Screen</Text>
        </TouchableOpacity>
        
        {imageUri ? (
          <>
            <Text style={styles.previewText}>Preview:</Text>
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
            
            <TouchableOpacity 
              style={[styles.shareButton, styles.tiktokButton]}
              onPress={handleShareToTikTok}
            >
              <Text style={styles.buttonText}>Open TikTok</Text>
            </TouchableOpacity>
            
            <Text style={styles.orText}>OR</Text>
            
            <TouchableOpacity 
              style={[styles.shareButton, styles.shareSheetButton]}
              onPress={handleShareViaShareSheet}
            >
              <Text style={styles.buttonText}>Share via Share Sheet</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.instruction}>
            Capture the screen first to share to TikTok
          </Text>
        )}
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  captureContainer: {
    width: 300,
    height: 400,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  contentToCapture: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F29762',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emotionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  emotionContainer: {
    backgroundColor: '#fff',
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emoji: {
    fontSize: 80,
  },
  emotionLabel: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  appName: {
    fontSize: 18,
    color: '#fff',
    marginTop: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  captureButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  shareButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  tiktokButton: {
    backgroundColor: '#000000',
  },
  shareSheetButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  previewText: {
    fontSize: 16,
    marginBottom: 10,
  },
  previewImage: {
    width: 150,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  instruction: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 20,
  },
  orText: {
    fontSize: 16,
    marginVertical: 10,
    color: '#666',
  },
});
