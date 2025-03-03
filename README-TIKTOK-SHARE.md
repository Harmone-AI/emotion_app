# TikTok Sharing in Harmone AI

This document explains how TikTok sharing is implemented in the Harmone AI application.

## Overview

TikTok doesn't provide an official SDK or direct sharing API for third-party apps like Reddit does. However, we've implemented two approaches to share content to TikTok:

1. **Direct TikTok App Opening**: Opens the TikTok app and lets the user manually create a post
2. **System Share Sheet**: Uses the native system share sheet which can include TikTok as an option

## Implementation Details

### TikTok Sharing Utility (`utils/tiktokShare.js`)

This utility provides two main functions:

- `shareToTikTok`: Attempts to open the TikTok app directly
- `shareToTikTokViaShareSheet`: Uses the system share sheet which may include TikTok as an option

### TikTok Share Button Component (`components/TikTokShareButton.js`)

A reusable button component that can be used throughout the app to share content to TikTok.

### Example Screens

- `screens/TikTokShareExample.js`: A standalone example of TikTok sharing
- `screens/SocialShareScreen.js`: A combined screen that allows sharing to both Reddit and TikTok

## How It Works

1. **Capture Content**: Use `react-native-view-shot` to capture a view as an image
2. **Share to TikTok**:
   - **Method 1**: Open TikTok app directly (user needs to manually create a post)
   - **Method 2**: Use system share sheet which may include TikTok as an option

## Limitations

- TikTok doesn't provide a direct sharing API like Reddit
- The user needs to manually create a post in TikTok after the app is opened
- The system share sheet method depends on TikTok being registered as a share target on the device

## Future Improvements

- Monitor for any official TikTok sharing SDK releases
- Explore deeper integration options if TikTok opens their platform
- Consider adding video sharing capabilities specifically for TikTok

## Usage Example

```javascript
import { shareToTikTok, shareToTikTokViaShareSheet } from '../utils/tiktokShare';

// Option 1: Open TikTok app directly
shareToTikTok(imageUri, 'Check out my Harmone AI emotion! #HarmoneAI');

// Option 2: Use system share sheet
shareToTikTokViaShareSheet(imageUri, 'Check out my Harmone AI emotion! #HarmoneAI');
```

Or use the TikTokShareButton component:

```javascript
import TikTokShareButton from '../components/TikTokShareButton';

<TikTokShareButton 
  imageUri={imageUri}
  caption="Check out my Harmone AI emotion! #HarmoneAI"
  onShare={() => console.log('Shared to TikTok!')}
/>
```
