import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { NavigationContainer, NavigatorScreenParams } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { AuthNavigatorStackParamList, MainNavigatorStackParamList } from './types'
import AuthenticationStack from './AuthenticationStack'

type NativeStackNavigatorParamList = {
    AuthenticationNavigator: NavigatorScreenParams<AuthNavigatorStackParamList>;
}

type BottomNavigatorRootStackParamList = {
    MainNavigator: NavigatorScreenParams<MainNavigatorStackParamList>;
}


const Tab = createBottomTabNavigator<BottomNavigatorRootStackParamList>()
const Stack = createNativeStackNavigator<NativeStackNavigatorParamList>()



const RootNavigator = () => {
    const user = ''

    useEffect(() => {

    }, [user])

    if (!user) return <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen
                name='AuthenticationNavigator'
                component={AuthenticationStack}
                options={{ headerShown: false }} />
        </Stack.Navigator>
    </NavigationContainer>
    return <Text>Main navigator</Text>
}

export default RootNavigator
