import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { MainNavigatorStackParamList } from './types'
import { RouteProp } from '@react-navigation/native'
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView } from 'react-native-safe-area-context'


type Props = {
  navigation: NativeStackNavigationProp<MainNavigatorStackParamList, "ChatScreen", undefined>,
  route: RouteProp<MainNavigatorStackParamList, "ChatScreen">
  isGroupChat: boolean,
  chatId: string,
  avatarUrl?: string
}
const CustomChatScreenHeader: React.FC<Props> = ({ route, navigation, chatId, isGroupChat, avatarUrl }) => {
  console.log('chat id : ', chatId);
  console.log('is group chat : ', isGroupChat);

  console.log('avatarUrl : ', avatarUrl);

  return (
    <SafeAreaView
      edges={['top']}
      className='bg-black pb-5  items-center flex-row border-b border-gray-500   px-5'
    >

      <StatusBar style="light" />

      <View className='flex-1 flex-row gap-4 items-center'>
        <AntDesign
          name="arrow-left"
          className='flex'
          size={24}
          color="white"
          onPress={() => navigation.goBack()} />

        <View className='flex flex-row gap-5 items-start '>
          <View className='border border-white rounded-full w-16 h-16'>
            {
              !isGroupChat && avatarUrl && <Image
                source={{ uri: avatarUrl }}
                className='w-full h-full rounded-full'
                resizeMode='contain'
              />
            }


          </View>

          <View className='gap-2 '>
            <Text className=' text-white text-xl font-bold'>
              {route.params?.otherUserName?.toUpperCase() || "Chat"}
            </Text>
            <Text className='text-gray-200 text-sm font-semibold'>Last view 00:00</Text>
          </View>

        </View>

      </View>

      {
        isGroupChat && <View className=''>
          <Entypo name="dots-three-vertical" size={24} color="white" />
        </View>
      }
      <Text />
    </SafeAreaView>
  )
}

export default CustomChatScreenHeader

const styles = StyleSheet.create({})