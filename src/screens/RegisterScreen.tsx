import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import Logo from '../components/Logo'
import AuthFormInput from '../components/AuthFormInput'
import GradientButton from '../components/GradientButton'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { AuthNavigatorStackParamList } from '../navigation/types'
import { useSendRegisterRequestMutation } from '../service/auth.service'

const RegisterScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [repassword, setRepassword] = useState('')

  const navigation = useNavigation<NavigationProp<AuthNavigatorStackParamList>>()


  const [register] = useSendRegisterRequestMutation()

  const handleRegister = async() => {
    
    if(password !== repassword) {
      Alert.alert("ChatX","Passwords do not match")
      return
    }
    const data = await register({email, password, username}).unwrap()
  
    
    if(String(data.status) != 'success') {
     return Alert.alert("ChatX","Failed to register. Please try again.")
    }

    Alert.alert("ChatX","Registered successfully")
    navigation.navigate('LoginScreen')
  }
  return (
    <View className='flex-1 bg-black px-7 flex justify-center'>
      <Logo text='Signup to start your conversations' />

      <View className='gap-6'>
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

        <AuthFormInput
          placeholder="********"
          label="RePassword"
          secureTextEntry
          value={repassword}
          onChange={setRepassword}
        />

        <AuthFormInput
          placeholder="username"
          label="Type a username"
          value={username}
          onChange={setUsername}
        />

        <GradientButton onPress={handleRegister} text="register" />

        <View className="flex-row items-center my-10">
          <View className="flex-1 h-[1px] bg-neutral-800" />
          <Text className="text-gray-500 mx-4">or</Text>
          <View className="flex-1 h-[1px] bg-neutral-800" />
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
          <Text className="text-gray-400 text-center text-base">
            Already have an account?{" "}
            <Text className="text-blue-400 font-medium">Login</Text>
          </Text>
        </TouchableOpacity>

      </View>
    </View>
  )
}

export default RegisterScreen

const styles = StyleSheet.create({})