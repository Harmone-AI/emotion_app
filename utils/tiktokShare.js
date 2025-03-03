import * as Linking from 'expo-linking';
import * as FileSystem from 'expo-file-system';
import { Platform, Alert } from 'react-native';
import { Share } from 'react-native';

/**
 * Share content to TikTok
 * 
 * TikTok doesn't have a direct sharing API like Reddit, but we can:
 * 1. Use TikTok's URL scheme to open TikTok app
 * 2. Use React Native's Share API to share content, which can then be shared to TikTok
 * 
 * @param {string} imageUri - URI of the image to share
 * @param {string} caption - Caption for the TikTok post
 */

/**
 * Directly open TikTok app without showing the system share sheet first
 * 
 * @param {string} imageUri - URI of the image to share
 * @param {string} caption - Caption for the TikTok post
 */
export const directOpenTikTok = async (imageUri, caption = '') => {
  try {
    // Show options to the user directly without trying to save the image first
    Alert.alert(
      'Share to TikTok',
      'Choose how you want to share to TikTok:',
      [
        { 
          text: 'View & Save Image', 
          onPress: async () => {
            try {
              // Show the image for saving
              Alert.alert(
                'Save Image',
                'Press and hold on the image that appears, then select "Save Image". After saving, you\'ll be directed to TikTok.',
                [
                  { 
                    text: 'View Image', 
                    onPress: async () => {
                      try {
                        // After user has had a chance to save, try to open TikTok
                        setTimeout(async () => {
                          try {
                            await Linking.openURL('tiktok://feed');
                          } catch (linkError) {
                            console.error('Error opening TikTok:', linkError);
                            offerTikTokInstall();
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
                        shareToTikTokViaShareSheet(imageUri, caption);
                      }
                    }
                  },
                  { text: 'Cancel', style: 'cancel' }
                ]
              );
            } catch (error) {
              console.error('Error showing image save dialog:', error);
              // Fallback to direct TikTok opening
              openTikTokDirectly();
            }
          }
        },
        {
          text: 'Open TikTok Now',
          onPress: openTikTokDirectly
        },
        {
          text: 'Use Share Sheet',
          onPress: () => shareToTikTokViaShareSheet(imageUri, caption)
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  } catch (error) {
    console.error('Error in directOpenTikTok:', error);
    // Fallback to system share sheet
    shareToTikTokViaShareSheet(imageUri, caption);
  }
  
  // Helper function to open TikTok directly
  function openTikTokDirectly() {
    Linking.openURL('tiktok://feed').catch(error => {
      console.error('Error opening TikTok:', error);
      offerTikTokInstall();
    });
  }
};

// Helper function to ensure the image is accessible
const saveImageToCameraRoll = async (imageUri) => {
  try {
    // For data URIs, we need to handle them differently
    if (imageUri.startsWith('data:')) {
      console.log('Data URI detected, skipping file check');
      return imageUri;
    }
    
    // For file URIs, check if the file exists
    if (imageUri.startsWith('file:')) {
      const fileInfo = await FileSystem.getInfoAsync(imageUri);
      if (!fileInfo.exists) {
        throw new Error('Image file does not exist');
      }
    }
    
    // Return the URI - we'll instruct the user to save it manually
    return imageUri;
  } catch (error) {
    console.log('Error checking image:', error);
    // Even if there's an error checking the image, we'll still try to proceed
    return imageUri;
  }
};

// Helper function to offer TikTok installation
const offerTikTokInstall = () => {
  Alert.alert(
    'TikTok Not Available',
    'Would you like to install TikTok?',
    [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Install TikTok', 
        onPress: () => {
          // Open app store link based on platform
          const storeUrl = Platform.OS === 'ios' 
            ? 'https://apps.apple.com/app/tiktok/id835599320'
            : 'https://play.google.com/store/apps/details?id=com.zhiliaoapp.musically';
          
          Linking.openURL(storeUrl);
        }
      },
    ]
  );
};


export const shareToTikTok = async (imageUri, caption = '') => {
  try {
    // Since we might have issues with checking if TikTok is installed due to LSApplicationQueriesSchemes,
    // we'll use a more robust approach that doesn't rely on checking if TikTok is installed first
    
    // First, try to share the image using the system share sheet
    // This is more reliable and doesn't require specific app URL schemes
    try {
      const shareResult = await Share.share({
        url: imageUri,
        message: caption,
      });
      
      if (shareResult.action === Share.sharedAction) {
        console.log('Content shared successfully via system share sheet');
        return;
      } else if (shareResult.action === Share.dismissedAction) {
        console.log('Share dismissed');
        // When share is dismissed, ask if they want to try opening TikTok directly
        Alert.alert(
          'Share to TikTok',
          'Would you like to try opening TikTok directly?',
          [
            { text: 'No, thanks', style: 'cancel' },
            { 
              text: 'Yes, open TikTok', 
              onPress: () => tryOpenTikTok(imageUri, caption)
            },
          ]
        );
        return;
      }
    } catch (shareError) {
      console.error('Error using Share API:', shareError);
      // Continue to fallback methods if sharing fails
    }
    
    // We'll use this helper function to try opening TikTok directly
    tryOpenTikTok(imageUri, caption);
  } catch (error) {
    console.error('Error in shareToTikTok:', error);
    
    // As a last resort, just try the system share again
    try {
      const shareResult = await Share.share({
        url: imageUri,
        message: caption,
      });
    } catch (finalError) {
      console.error('Final sharing attempt failed:', finalError);
    }
  }
};

// Helper function to try opening TikTok directly
const tryOpenTikTok = async (imageUri, caption) => {
  try {
    Alert.alert(
      'Share to TikTok',
      'We\'ll try to open TikTok for you. You\'ll need to manually create a post and select the saved image.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Open TikTok', 
          onPress: async () => {
            try {
              await Linking.openURL('tiktok://');
            } catch (linkError) {
              console.error('Error opening TikTok:', linkError);
              
              // If we can't open TikTok, offer to install it
              Alert.alert(
                'TikTok Not Available',
                'Would you like to install TikTok?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Install TikTok', 
                    onPress: () => {
                      // Open app store link based on platform
                      const storeUrl = Platform.OS === 'ios' 
                        ? 'https://apps.apple.com/app/tiktok/id835599320'
                        : 'https://play.google.com/store/apps/details?id=com.zhiliaoapp.musically';
                      
                      Linking.openURL(storeUrl);
                    }
                  },
                ]
              );
            }
          }
        },
      ]
    );
  } catch (alertError) {
    console.error('Error showing alert:', alertError);
    // Last resort fallback - just try the system share again
    Share.share({
      url: imageUri,
      message: caption,
    });
  }
};

/**
 * Alternative method: Share content to TikTok using the system share sheet
 * This is more reliable as it uses the native sharing capabilities
 * 
 * @param {string} imageUri - URI of the image to share
 * @param {string} caption - Caption for the TikTok post
 */
export const shareToTikTokViaShareSheet = async (imageUri, caption = '') => {
  try {
    // Use React Native's Share API to open the system share sheet
    const shareResult = await Share.share({
      url: imageUri,
      message: caption,
    });
    
    if (shareResult.action === Share.sharedAction) {
      if (shareResult.activityType) {
        // Shared with activity type
        console.log(`Shared with activity type: ${shareResult.activityType}`);
      } else {
        // Shared
        console.log('Shared successfully');
      }
    } else if (shareResult.action === Share.dismissedAction) {
      // Dismissed
      console.log('Share dismissed');
    }
  } catch (error) {
    console.error('Error sharing via share sheet:', error);
    Alert.alert('Sharing Error', 'Failed to share content');
  }
};
