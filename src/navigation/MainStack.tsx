import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { MainNavigatorStackParamList } from './types'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from '../screens/HomeScreen'
import ChatScreen from '../screens/ChatScreen'

import AntDesign from '@expo/vector-icons/AntDesign';
const Stack = createNativeStackNavigator<MainNavigatorStackParamList>()

const MainNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name='HomeScreen' component={HomeScreen} options={{
        headerStyle: {
          backgroundColor: '#000',
        },
        headerShown: false,
        headerTintColor: '#fff'
      }} />

      <Stack.Screen name='ChatScreen' component={ChatScreen}
        options={({ route, navigation }) => (
          {

            header: () => (
              <View
                className='bg-black h-[90px] pt-10 items-center flex-row justify-between px-5 '
              >
                <AntDesign name="arrow-left" size={24} color="white" onPress={() => navigation.goBack()} />

                <Text style={{ color: "#fff", fontSize: 18, fontWeight: "600" }}>
                  {route.params?.otherUserName || "Chat"}
                </Text>

                <Text />
              </View>
            ),

            headerStyle: {
              backgroundColor: '#000',
            },
            headerTintColor: '#fff'
          }
        )} />
    </Stack.Navigator>
  )
}

export default MainNavigator