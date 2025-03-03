import { Alert, Linking, Share, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';

/**
 * Share content to Instagram via the system share sheet
 * @param {string} imageUri - URI of the image to share
 * @param {string} caption - Caption text for the post
 */
export const shareToInstagramViaShareSheet = async (imageUri, caption = '') => {
  try {
    await Share.share({
      url: imageUri,
      message: caption
    });
  } catch (error) {
    console.error('Error sharing to Instagram via share sheet:', error);
    Alert.alert('Error', 'Could not share to Instagram. Please try again later.');
  }
};

/**
 * Directly open Instagram for sharing
 * @param {string} imageUri - URI of the image to share
 * @param {string} caption - Caption text for the post
 */
export const directOpenInstagram = async (imageUri, caption = '') => {
  try {
    // Show options to the user directly without trying to save the image first
    Alert.alert(
      'Share to Instagram',
      'Choose how you want to share to Instagram:',
      [
        { 
          text: 'View & Save Image', 
          onPress: async () => {
            try {
              // Show the image for saving
              Alert.alert(
                'Save Image',
                'Press and hold on the image that appears, then select "Save Image". After saving, you\'ll be directed to Instagram.',
                [
                  { 
                    text: 'View Image', 
                    onPress: async () => {
                      try {
                        // After user has had a chance to save, try to open Instagram
                        setTimeout(async () => {
                          try {
                            await Linking.openURL('instagram://camera');
                          } catch (linkError) {
                            console.error('Error opening Instagram:', linkError);
                            offerInstagramInstall();
                          }
                        }, 3000); // Give user 3 seconds to save the image
                        
                        // For data URIs, we need to use the Share API to view them
                        if (imageUri.startsWith('data:')) {
                          await Share.share({
                            url: imageUri,
                            message: caption
                          });
                        } else {
                          // For file URIs, we can try to open them directly
                          await Linking.openURL(imageUri);
                        }
                      } catch (error) {
                        console.error('Error opening image:', error);
                        Alert.alert('Error', 'Could not open the image for saving. Trying system share instead...');
                        // Fallback to system share
                        shareToInstagramViaShareSheet(imageUri, caption);
                      }
                    }
                  },
                  { text: 'Cancel', style: 'cancel' }
                ]
              );
            } catch (error) {
              console.error('Error showing image save dialog:', error);
              // Fallback to direct Instagram opening
              openInstagramDirectly();
            }
          }
        },
        {
          text: 'Open Instagram Now',
          onPress: openInstagramDirectly
        },
        {
          text: 'Use Share Sheet',
          onPress: () => shareToInstagramViaShareSheet(imageUri, caption)
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  } catch (error) {
    console.error('Error in directOpenInstagram:', error);
    // Fallback to system share sheet
    shareToInstagramViaShareSheet(imageUri, caption);
  }
  
  // Helper function to open Instagram directly
  function openInstagramDirectly() {
    Linking.openURL('instagram://camera').catch(error => {
      console.error('Error opening Instagram:', error);
      offerInstagramInstall();
    });
  }
};

// Helper function to offer Instagram installation
const offerInstagramInstall = () => {
  Alert.alert(
    'Instagram Not Available',
    'Would you like to install Instagram?',
    [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Install Instagram', 
        onPress: () => {
          // Open App Store or Google Play Store to download Instagram
          const storeUrl = Platform.OS === 'ios' 
            ? 'https://apps.apple.com/app/instagram/id389801252'
            : 'https://play.google.com/store/apps/details?id=com.instagram.android';
          
          Linking.openURL(storeUrl).catch(err => {
            console.error('Could not open store URL:', err);
            Alert.alert('Error', 'Could not open the app store.');
          });
        }
      },
    ]
  );
};
