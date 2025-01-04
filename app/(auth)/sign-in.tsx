import { useSignIn } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import {
  Keyboard,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Platform
} from 'react-native';
import React from 'react';

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const router = useRouter();

  const onSignInPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      });

      // This indicates the user is signed in
      await setActive({ session: completeSignIn.createdSessionId });
      router.replace('/');
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View className="flex-1 bg-white p-6 justify-center">
          <Text className="text-2xl font-semibold mb-6 text-center">Sign in</Text>
          <TextInput
            className="w-full bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200"
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Enter email"
            onChangeText={setEmailAddress}
            keyboardType="email-address"
            returnKeyType="next"
          />
          <TextInput
            className="w-full bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200"
            value={password}
            placeholder="Enter password"
            secureTextEntry={true}
            onChangeText={setPassword}
            returnKeyType="done"
            onSubmitEditing={onSignInPress}
          />
          <TouchableOpacity
            className="bg-purple-600 rounded-lg p-4 mb-6"
            onPress={onSignInPress}
          >
            <Text className="text-white text-center font-semibold">Sign in</Text>
          </TouchableOpacity>
          <View className="flex-row justify-center items-center space-x-2">
            <Text className="text-gray-600">Don't have an account?</Text>
            <Link href="/sign-up">
              <Text className="text-purple-600 font-semibold">Sign up</Text>
            </Link>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
