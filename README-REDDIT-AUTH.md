# Reddit Authentication Setup Guide

This guide explains how to configure Reddit OAuth for your Harmone AI application.

## Step 1: Create a Reddit Developer Application

1. Go to [Reddit's App Preferences page](https://www.reddit.com/prefs/apps)
2. Scroll down and click on "create another app..." or "create an app..." button
3. Fill in the following details:
   - **Name**: Harmone AI (or your preferred app name)
   - **App type**: Select "installed app" for mobile applications
   - **Description**: A brief description of your app
   - **About URL**: Your app's website URL (if available)
   - **Redirect URI**: Use the values below

## Step 2: Configure Redirect URIs

For your Reddit developer account, you need to add **both** of these redirect URIs:

### Development Environment URI
```
exp://YOUR-LOCAL-IP:19000/--/reddit-auth
```
Replace `YOUR-LOCAL-IP` with your actual development machine's IP address (e.g., `192.168.1.100`).

### Production Environment URI
```
myapp://reddit-auth
```

This URI is based on the scheme defined in your `app.json` file.

## Step 3: Get Your Client ID

After creating the app, Reddit will provide you with:
- **Client ID**: A string under your app name (looks like: `YourClientID`)
- **Client Secret**: Only needed for confidential clients (not for installed apps)

Update the `REDDIT_CLIENT_ID` constant in `components/RedditAuthButton.js` with your actual Client ID.

## Step 4: Testing the Integration

1. Run your app in development mode
2. Press the "Login with Reddit" button
3. The app will open a browser to authenticate with Reddit
4. After authentication, Reddit will redirect back to your app using the configured redirect URI
5. The `handleRedditRedirect` function will extract the authorization code from the URL

## Troubleshooting

- If the redirect doesn't work in development, make sure your IP address is correct in the Reddit developer console
- For production builds, ensure your app's scheme is correctly set to "myapp" in app.json
- Check the console logs for the exact redirect URI being used

## Note on Security

For a production app, you should:
1. Generate a random state parameter for each auth request
2. Verify the state parameter when handling the redirect
3. Exchange the authorization code for an access token using a secure backend
