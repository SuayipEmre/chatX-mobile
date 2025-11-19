import { View, Text, TextInput, TouchableOpacity } from "react-native";
import AuthFormInput from "../components/AuthFormInput";
import { useState } from "react";
import GradientButton from "../components/GradientButton";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AuthNavigatorStackParamList } from "../navigation/types";
import Logo from "../components/Logo";

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const navigation = useNavigation<NavigationProp<AuthNavigatorStackParamList>>()


  return (
    <View className="flex-1 bg-black px-7 justify-center">

      {/* Logo Section */}
      <Logo text='Login to continue your conversations' />

      {/* Form */}
      <View className="gap-6">

        <AuthFormInput
          placeholder="you@example.com"
          label="Email Address"
          value={email}
          onChange={setEmail}
        />
        <AuthFormInput
          placeholder="********"
          label="Password"
          secureTextEntry
          value={password}
          onChange={setPassword}
        />

        {/* Forgot password */}
        <TouchableOpacity className="mt-1">
          <Text className="text-blue-400 text-right text-sm">
            Forgot Password?
          </Text>
        </TouchableOpacity>
      </View>

    <GradientButton onPress={() => console.log('button is active')} text="login" />

      <View className="flex-row items-center my-10">
        <View className="flex-1 h-[1px] bg-neutral-800" />
        <Text className="text-gray-500 mx-4">or</Text>
        <View className="flex-1 h-[1px] bg-neutral-800" />
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
        <Text className="text-gray-400 text-center text-base">
          Don’t have an account?{" "}
          <Text className="text-blue-400 font-medium">Sign Up</Text>
        </Text>
      </TouchableOpacity>

    </View>
  );
}
