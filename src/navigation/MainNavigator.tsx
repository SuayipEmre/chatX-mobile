import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { MainNavigatorStackParamList } from './types'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from '../screens/HomeScreen'
import ChatScreen from '../screens/ChatScreen'


const Stack = createNativeStackNavigator<MainNavigatorStackParamList>()

const MainNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name='HomeScreen' component={HomeScreen} options={{
        headerStyle : {
          backgroundColor:'#000',
        },
        headerShown:false,
        headerTintColor : '#fff'
      }} />

      <Stack.Screen name='ChatScreen' component={ChatScreen}
      options={{
        headerStyle : {
          backgroundColor:'#000',
        },
        headerTintColor : '#fff'
      }} />
    </Stack.Navigator>
  )
}

export default MainNavigator

const styles = StyleSheet.create({})