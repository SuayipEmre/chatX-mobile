import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { AuthNavigatorStackParamList } from './types'
import RegisterScreen from '../screens/RegisterScreen'
import LoginScreen from '../screens/LoginScreen'

const Stack = createNativeStackNavigator<AuthNavigatorStackParamList>()

const AuthenticationStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name='LoginScreen'
                component={LoginScreen}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name='RegisterScreen'
                component={RegisterScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    )
}

export default AuthenticationStack
