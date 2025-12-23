import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { MainNavigatorStackParamList } from './types'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from '../screens/HomeScreen'
import ChatScreen from '../screens/ChatScreen'
import AntDesign from '@expo/vector-icons/AntDesign';
import CustomChatScreenHeader from './CustomChatScreenHeader'
import GroupDetailScreen from '../screens/GroupDetailScreen'

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
        options={({ route, navigation }) => {
          console.log('route params in MainNavigator :', route.params);
          
          return (
            {
  
  
              header: () => (<CustomChatScreenHeader
                route={route}
                navigation={navigation}
                isGroupChat={route.params.isGroupChat}
                chatId={route.params.chatId}
                avatarUrl={route.params.avatarUrl}
                groupId={route.params.groupId}
                otherUserLastSeenAt={route.params.otherUser?.lastSeenAt}
                otherUserId={route.params.otherUser?._id}
              />
  
              ),
  
              headerStyle: {
                backgroundColor: '#000',
              },
              headerTintColor: '#fff'
            }
          )
        }} />

      <Stack.Screen
        name='GroupDetailScreen'
        component={GroupDetailScreen}
        options={({ navigation, route }) => (
          {
            headerStyle: {
              backgroundColor: '#000',
            },
            headerTintColor: '#fff',
            title: 'Group Details',
            headerLeft: () => (
              <AntDesign
                name="arrow-left"
                className='flex'
                size={24}
                color="white"
                onPress={() => navigation.goBack()} />
            )
          }
        )}
      />
    </Stack.Navigator>
  )
}

export default MainNavigator