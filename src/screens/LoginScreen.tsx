import { View, Text, TouchableOpacity, Alert } from "react-native";
import AuthFormInput from "../components/AuthFormInput";
import { useEffect, useState } from "react";
import GradientButton from "../components/GradientButton";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AuthNavigatorStackParamList } from "../navigation/types";
import Logo from "../components/Logo";
import { useSendLoginRequestMutation } from "../service/auth.service";
import { setUserSession } from "../store/feature/user/actions";
import { useUserSession } from "../store/feature/user/hooks";
import { getTokens, setTokens, setUserSessionToStorage } from "../utils/cleanStorage";

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const userSession = useUserSession();  

  const navigation = useNavigation<NavigationProp<AuthNavigatorStackParamList>>()

useEffect(() => {
  
  const getData = async () => {
    const tokens = await getTokens()

    console.log('----------------');
    console.log('after logout current data');
    console.log('refresh : ', tokens.refreshToken);
    console.log('access : ', tokens.accessToken);
    console.log('userSession : ', userSession);
    console.log('----------------');
    
  }

  getData()

},[userSession])


  const [login, { isLoading, error }] = useSendLoginRequestMutation();


  
  
  

  const handleLogin = async () => {
    if (!email.includes('@') || password.length < 5) return console.log('cannot login')

    try {
      const loginData = await login({email, password}).unwrap();
      console.log('loginData : ', loginData);

      if (loginData) {
        setUserSession(loginData.data)
        setUserSessionToStorage(loginData.data)
        setTokens(loginData.data.tokens)
      }

      

    } catch (error) {
      Alert.alert('Login Failed', 'Please check your credentials and try again.');
      console.log('errorasd : ', error);

    }
  }

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

      <GradientButton onPress={handleLogin} text="login" />

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
