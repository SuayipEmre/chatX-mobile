import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { MainNavigatorStackParamList } from './types'
import { RouteProp } from '@react-navigation/native'
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSocketPresence } from '../providers/SocketProvider'
import { formatLastSeen } from '../utils/formatLastSeen'


type Props = {
  navigation: NativeStackNavigationProp<MainNavigatorStackParamList, "ChatScreen", undefined>,
  route: RouteProp<MainNavigatorStackParamList, "ChatScreen">
  isGroupChat: boolean,
  chatId: string,
  avatarUrl?: string,
  groupId?: string
  otherUserId?: string;
  otherUserLastSeenAt?: string | null;
}
const CustomChatScreenHeader: React.FC<Props> = ({
  route,
  navigation,
  isGroupChat,
  avatarUrl,
  groupId,
  otherUserId,
  otherUserLastSeenAt
}) => {

  const { onlineUsers } = useSocketPresence();

  const isOnline = otherUserId && onlineUsers.has(otherUserId);

  console.log('groupId in header :', otherUserLastSeenAt);

  console.log('isOnline :', isOnline);
  
  console.log('is group chat :', isGroupChat);
  console.log('other user id :', otherUserId);
  
  
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

        <View className={`flex flex-row gap-5 items-start ${isGroupChat && 'items-center'}`}>
          <View className='border border-white rounded-full w-16 h-16'>
            {
              !isGroupChat && avatarUrl && <Image
                source={{ uri: avatarUrl }}
                className='w-full h-full rounded-full'
                resizeMode='contain'
              />
            }


          </View>

          <View className={`gap-2`}>
            <Text className={`text-white text-xl font-bold`}>
              {route.params?.otherUserName?.toUpperCase() || "Chat"}
            </Text>
            {!isGroupChat && otherUserId && (
              <Text className={`text-sm font-semibold ${isOnline ? 'text-green-400' : 'text-gray-200'}`}>
                {isOnline
                  ? "online"
                  : formatLastSeen(otherUserLastSeenAt)}
              </Text>
            )}
          </View>

        </View>

      </View>

      {
        isGroupChat && <View className=''>
          <Entypo name="dots-three-vertical" size={24} color="white" onPress={
            () => navigation.navigate('GroupDetailScreen', {
              groupId: groupId || ''
            })
          } />
        </View>
      }
      <Text />
    </SafeAreaView>
  )
}

export default CustomChatScreenHeader

const styles = StyleSheet.create({})