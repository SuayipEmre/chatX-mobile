import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { NavigationContainer, NavigatorScreenParams } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { AuthNavigatorStackParamList, MainNavigatorStackParamList, ProfileNavigatorStackParamList } from './types'
import AuthenticationStack from './AuthenticationStack'
import { useUserSession } from '../store/feature/user/hooks'
import { getAccessToken, getUserSessionFromStorage } from '../utils/storage'
import { setUserSession } from '../store/feature/user/actions'
import MainNavigator from './MainStack'
import AntDesign from '@expo/vector-icons/AntDesign';
import ProfileNavigator from './ProfileStack'
import Feather from '@expo/vector-icons/Feather';
type NativeStackNavigatorParamList = {
    AuthenticationNavigator: NavigatorScreenParams<AuthNavigatorStackParamList>;
}

type BottomNavigatorRootStackParamList = {
    MainNavigator: NavigatorScreenParams<MainNavigatorStackParamList>;
    ProfileNavigator: NavigatorScreenParams<ProfileNavigatorStackParamList>;
}


const Tab = createBottomTabNavigator<BottomNavigatorRootStackParamList>()
const Stack = createNativeStackNavigator<NativeStackNavigatorParamList>()



const RootNavigator = () => {
    const user = useUserSession()


    useEffect(() => {
        const getUser = async () => {
            const user = await getUserSessionFromStorage()
            const accessToken = await getAccessToken()
            console.log('accessToken :', accessToken);
            console.log('USER ON THE ROOT : ', user);

            setUserSession(user ?? null)
        }
        getUser()
    }, [])

    console.log('USER : user', user);

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
                tabBarInactiveTintColor: '#ccc',
                tabBarActiveTintColor: '#fff',

            }}
        >
            <Tab.Screen
                name='MainNavigator'
                component={MainNavigator}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color }) => <AntDesign
                        name="wechat-work"
                        size={24} color={color} />,

                    tabBarLabel: 'Chats',
                }}
            />

            <Tab.Screen name='ProfileNavigator' component={ProfileNavigator} options={{
                tabBarIcon: ({ color }) => <Feather name="user" size={24} color={color} />,
                headerShown: false,
                tabBarLabel: 'Profile'
            }} />
        </Tab.Navigator>
    </NavigationContainer>
}

export default RootNavigator
