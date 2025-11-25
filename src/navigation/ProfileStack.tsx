import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { MainNavigatorStackParamList } from './types'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ProfileScreen from '../screens/ProfileScreen'


const Stack = createNativeStackNavigator<MainNavigatorStackParamList>()

const ProfileNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name='ProfileScreen' component={ProfileScreen} options={{
        headerStyle : {
          backgroundColor:'#000',
        },
        headerShown : false,
        headerTintColor : '#fff'
      }} />
    </Stack.Navigator>
  )
}

export default ProfileNavigator
