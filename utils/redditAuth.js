import * as Linking from 'expo-linking';

// Generate the redirect URI for Reddit OAuth
export const getRedditRedirectUri = () => {
  // This will create a URI that adapts based on environment:
  // - In development: exp://192.168.x.x:19000/--/reddit-auth
  // - In production: myapp://reddit-auth
  return Linking.createURL('reddit-auth');
};

// Function to initiate Reddit OAuth flow
export const initiateRedditAuth = (clientId) => {
  const redirectUri = getRedditRedirectUri();
  
  // Reddit OAuth endpoint
  const authUrl = `https://www.reddit.com/api/v1/authorize?` +
    `client_id=${clientId}` +
    `&response_type=code` +
    `&state=RANDOM_STATE` + // You should generate a random state for security
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&duration=permanent` + // or 'temporary' based on your needs
    `&scope=identity read submit`;  // Added 'submit' scope for posting

  // Open the authorization URL in the device browser
  Linking.openURL(authUrl);
};

// Function to handle the redirect from Reddit
export const handleRedditRedirect = async (url) => {
  // Parse the URL to extract the authorization code
  const { queryParams } = Linking.parse(url);
  
  if (queryParams.code) {
    // You have the authorization code, now you can exchange it for an access token
    return queryParams.code;
  }
  
  if (queryParams.error) {
    // Handle error
    throw new Error(`Reddit authentication error: ${queryParams.error}`);
  }
  
  return null;
};

// Set up the URL listener for handling the redirect
export const setupRedditAuthListener = (callback) => {
  // Add event listener for URL changes (when the app is opened via the redirect URI)
  const subscription = Linking.addEventListener('url', (event) => {
    const { url } = event;
    if (url.includes('reddit-auth')) {
      handleRedditRedirect(url)
        .then(code => {
          if (code) {
            callback(code);
          }
        })
        .catch(error => {
          console.error('Error handling Reddit redirect:', error);
        });
    }
  });
  
  return () => {
    // Clean up the event listener when no longer needed
    subscription.remove();
  };
};

import { Platform, Alert } from 'react-native';

// Function to share image to Reddit
export const shareImageToReddit = async (imageUri, title, subreddit = '') => {
  // Reddit has two ways to share content:
  // 1. Using their API (requires authentication)
  // 2. Using a deep link to their app or website
  
  try {
    // Check if the imageUri is a base64 data URI or a local file path
    if (imageUri.startsWith('data:') || imageUri.startsWith('file:') || (!imageUri.startsWith('http') && !imageUri.startsWith('https'))) {
      console.log('Local image or base64 detected');
      
      // For local images or base64, we can't directly share to Reddit
      // We'll try to use the Imgur API to upload the image first
      
      // Extract base64 data if it's a data URI
      let base64Data = '';
      if (imageUri.startsWith('data:')) {
        // Get the base64 part after the comma
        const parts = imageUri.split(',');
        if (parts.length > 1) {
          base64Data = parts[1];
        } else {
          throw new Error('Invalid data URI format');
        }
      } else {
        // For file URIs, we can't easily convert to base64 without expo-file-system
        // So we'll show an alert and open Reddit without the image
        Alert.alert(
          'Direct Image Sharing Not Available',
          'To share this image to Reddit, we\'ll open Reddit where you can upload the image manually.',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Continue to Reddit', 
              onPress: () => {
                // Open Reddit's submit page without an image URL
                const redditSubmitUrl = `https://www.reddit.com/submit?title=${encodeURIComponent(title)}`;
                Linking.openURL(redditSubmitUrl);
              }
            },
          ]
        );
        return;
      }
      
      // Try to upload to Imgur
      try {
        // Upload to Imgur (anonymous upload)
        const response = await fetch('https://api.imgur.com/3/image', {
          method: 'POST',
          headers: {
            'Authorization': 'Client-ID 546c25a59c58ad7', // Replace with your Imgur client ID
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: base64Data,
            type: 'base64',
            title: title,
            description: 'Shared from Harmone AI',
          }),
        });
        
        const responseData = await response.json();
        
        if (responseData.success) {
          // Successfully uploaded to Imgur, now share the Imgur URL to Reddit
          const imgurUrl = responseData.data.link;
          console.log('Image uploaded to Imgur:', imgurUrl);
          
          // Format: https://www.reddit.com/submit?url=IMAGE_URL&title=TITLE
          const redditShareUrl = `https://www.reddit.com/submit?` +
            `url=${encodeURIComponent(imgurUrl)}` +
            `&title=${encodeURIComponent(title)}`;
            
          // If a specific subreddit is provided, add it to the URL
          const fullShareUrl = subreddit ? 
            `https://www.reddit.com/r/${subreddit}/submit?url=${encodeURIComponent(imgurUrl)}&title=${encodeURIComponent(title)}` : 
            redditShareUrl;
          
          console.log('Opening Reddit with URL:', fullShareUrl);
          return Linking.openURL(fullShareUrl);
        } else {
          throw new Error('Failed to upload image to Imgur');
        }
      } catch (uploadError) {
        console.error('Error uploading to Imgur:', uploadError);
        
        // If upload fails, ask the user if they want to continue without the image
        Alert.alert(
          'Image Upload Failed',
          'We couldn\'t upload your image. Would you like to continue to Reddit without the image?',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Continue to Reddit', 
              onPress: () => {
                // Open Reddit's submit page without an image URL
                const redditSubmitUrl = `https://www.reddit.com/submit?title=${encodeURIComponent(title)}`;
                Linking.openURL(redditSubmitUrl);
              }
            },
          ]
        );
        return;
      }
    } else {
      // For public URLs, we can directly share to Reddit
      // Format: https://www.reddit.com/submit?url=IMAGE_URL&title=TITLE
      const redditShareUrl = `https://www.reddit.com/submit?` +
        `url=${encodeURIComponent(imageUri)}` +
        `&title=${encodeURIComponent(title)}`;
        
      // If a specific subreddit is provided, add it to the URL
      const fullShareUrl = subreddit ? 
        `https://www.reddit.com/r/${subreddit}/submit?url=${encodeURIComponent(imageUri)}&title=${encodeURIComponent(title)}` : 
        redditShareUrl;
      
      console.log('Opening Reddit with URL:', fullShareUrl);
      return Linking.openURL(fullShareUrl);
    }
  } catch (error) {
    console.error('Error in shareImageToReddit:', error);
    
    // As a last resort, just open Reddit's submit page
    Alert.alert(
      'Sharing Error',
      'There was an error sharing to Reddit. Would you like to continue to Reddit without the image?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Continue to Reddit', 
          onPress: () => {
            const redditSubmitUrl = `https://www.reddit.com/submit?title=${encodeURIComponent(title)}`;
            Linking.openURL(redditSubmitUrl);
          }
        },
      ]
    );
    return;
  }
};

// Function to share to Reddit with authentication (for posting directly to user's account)
export const shareToRedditWithAuth = async (accessToken, imageUrl, title, subreddit = 'test') => {
  // This function requires the user to be authenticated with Reddit
  // and have the 'submit' scope authorized
  
  try {
    // Reddit API endpoint for submitting a new link
    const response = await fetch('https://oauth.reddit.com/api/submit', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        api_type: 'json',
        kind: 'link',
        url: imageUrl,
        sr: subreddit, // subreddit name
        title: title,
        resubmit: true,
      }).toString(),
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error sharing to Reddit:', error);
    throw error;
  }
};
