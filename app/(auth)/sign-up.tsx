import * as React from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState('');

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return;

    try {
      await signUp.create({
        username,
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace('/');
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  if (pendingVerification) {
    return (
      <View className="flex-1 bg-white p-6 justify-center">
        <Text className="text-2xl font-semibold mb-6 text-center">Verify your email</Text>
        <TextInput
          className="w-full bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200"
          value={code}
          placeholder='Enter your verification code'
          onChangeText={(code) => setCode(code)}
        />
        <TouchableOpacity
          className="bg-purple-600 rounded-lg p-4"
          onPress={onVerifyPress}
        >
          <Text className="text-white text-center font-semibold">Verify Email</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View className="flex-1 bg-white p-6 justify-center">
          <Text className="text-2xl font-semibold mb-6 text-center">Sign up</Text>
          <TextInput
            className="w-full bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200"
            autoCapitalize='none'
            value={username}
            placeholder='Enter username'
            onChangeText={(username) => setUsername(username)}
          />
          <TextInput
            className="w-full bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200"
            autoCapitalize='none'
            value={emailAddress}
            placeholder='Enter email'
            onChangeText={(email) => setEmailAddress(email)}
          />
          <TextInput
            className="w-full bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200"
            value={password}
            placeholder='Enter password'
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
          />
          <TouchableOpacity
            className="bg-purple-600 rounded-lg p-4"
            onPress={onSignUpPress}
          >
            <Text className="text-white text-center font-semibold">Continue</Text>
          </TouchableOpacity>
          <Text className='text-center mt-4'>
            Already have an account?{' '}
            <Link href="/(auth)/sign-in" className="text-purple-600 font-bold">Sign in</Link>
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
