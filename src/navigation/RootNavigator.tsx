import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { NavigationContainer, NavigatorScreenParams } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { AuthNavigatorStackParamList, MainNavigatorStackParamList } from './types'
import AuthenticationStack from './AuthenticationStack'
import { useUserSession } from '../store/feature/user/hooks'
import { getUserSessionFromStorage } from '../utils/storage'
import { setUserSession } from '../store/feature/user/actions'
import MainNavigator from './MainNavigator'
import AntDesign from '@expo/vector-icons/AntDesign';
type NativeStackNavigatorParamList = {
    AuthenticationNavigator: NavigatorScreenParams<AuthNavigatorStackParamList>;
}

type BottomNavigatorRootStackParamList = {
    MainNavigator: NavigatorScreenParams<MainNavigatorStackParamList>;
}


const Tab = createBottomTabNavigator<BottomNavigatorRootStackParamList>()
const Stack = createNativeStackNavigator<NativeStackNavigatorParamList>()



const RootNavigator = () => {
    const user = useUserSession()

    useEffect(() => {
        const getUser = async () => {
            const user = await getUserSessionFromStorage()
            setUserSession(user ?? null)
        }
        getUser()
    }, [])

    if (!user) return <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen
                name='AuthenticationNavigator'
                component={AuthenticationStack}
                options={{ headerShown: false }} />
        </Stack.Navigator>
    </NavigationContainer>
    return <NavigationContainer>
        <Tab.Navigator
        screenOptions={{
            tabBarStyle: {
                backgroundColor: "black",
              },
              tabBarInactiveTintColor : '#ccc',
              tabBarActiveTintColor : '#fff',
              
        }}
        >
            <Tab.Screen
                name='MainNavigator'
                component={MainNavigator}
                options={{
                    headerShown: false,
                    tabBarIcon : ({color}) => <AntDesign name="wechat-work" size={24} color={color}/>
                }}
            />
        </Tab.Navigator>
    </NavigationContainer>
}

export default RootNavigator
