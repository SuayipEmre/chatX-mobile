import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ProfileNavigatorStackParamList } from './types'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ProfileScreen from '../screens/ProfileScreen'
import EditProfileScreen from '../screens/EditProfileScreen'
import ChangePasswordScreen from '../screens/ChangePasswordScreen'


const Stack = createNativeStackNavigator<ProfileNavigatorStackParamList>()

const ProfileNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name='ProfileScreen' component={ProfileScreen} options={{
        headerStyle: {
          backgroundColor: '#000',
        },
        headerShown: false,
        headerTintColor: '#fff'
      }} />

      <Stack.Screen name='EditProfileScreen' component={EditProfileScreen}
        options={{
          headerStyle: {
            backgroundColor: '#000',
          },
          headerTintColor: '#fff',
          title: 'Edit Profile'
        }} />

      <Stack.Screen name='ChangePasswordScreen' component={ChangePasswordScreen}
        options={{
          headerStyle: {
            backgroundColor: '#000',
          },
          headerTintColor: '#fff',
          title: 'Change Password'
        }} />
    </Stack.Navigator>
  )
}

export default ProfileNavigator
