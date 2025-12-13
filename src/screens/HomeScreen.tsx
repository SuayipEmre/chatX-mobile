import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  FlatList,
  Alert,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { useCreateChatMutation, useCreateGroupChatMutation, useFetchChatsQuery } from '../service/chat.service'
import { IChat } from '../types/Chats'
import EvilIcons from '@expo/vector-icons/EvilIcons'
import { SafeAreaView } from 'react-native-safe-area-context'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { MainNavigatorStackParamList } from '../navigation/types'
import CreateChatModal from '../components/SearchUserModal'
import { useUserSession } from '../store/feature/user/hooks'
import { getSocket } from '../socket'
import UserDefaultIcon from '../components/UserDefaultIcon'

const HomeScreen = () => {
  const [search, setSearch] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)

  const userSession = useUserSession()

  const[createChat] = useCreateChatMutation()
  const[createGroupChat] = useCreateGroupChatMutation()
  const{data : chatData, isLoading} = useFetchChatsQuery({})


  
  const navigation = useNavigation<NavigationProp<MainNavigatorStackParamList>>()



  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    const socket = getSocket(userSession?.user._id!);

    socket.on("user_online", (userId: string) => {
      setOnlineUsers((prev) => [...new Set([...prev, userId])]);
    });

    socket.on("user_offline", (userId: string) => {
      setOnlineUsers((prev) => prev.filter((id) => id !== userId));
    });

    return () => {
      socket.off("user_online");
      socket.off("user_offline");
    };
  }, [userSession]);



  const filtered = () => {
    return chatData?.data.filter((chat : IChat) => {
      if (chat.isGroupChat) return chat.chatName?.toLowerCase().includes(search.toLowerCase());
      return chat?.otherUser?.username?.toLowerCase().includes(search.toLowerCase())
    })

  }

  const handleCreateMultipleChat = async (
    users: { _id: string; username: string, avatarUrl?: string }[],
    groupName?: string
  ) => {


    console.log('users: ', users);
    

    
    try {
      if (users.length === 1) {
        const chatData = await createChat(users[0]._id).unwrap()
        setIsModalVisible(false)

        return navigation.navigate('ChatScreen', {
          chatId: chatData.data._id,
          otherUserName: users[0].username,
          isGroupChat : false,
          avatarUrl : users[0].avatarUrl
        })
      }

      const addedAdminId = users.find(u => u._id === userSession?.user._id)

      if (!addedAdminId) {
        users.push({ _id: userSession!.user._id, username: userSession!.user.username, avatarUrl: userSession!.user.avatar })
      }

      const groupData = await createGroupChat({
        users: users.map(u => u._id),
        groupName: groupName || 'New Group',
        adminId: userSession?.user._id
      })

      setIsModalVisible(false)

      navigation.navigate('ChatScreen', {
        chatId: groupData.data.data.chat._id,
        otherUserName:  groupData.data.data.group.groupName,
        isGroupChat: true,
        avatarUrl : undefined
      })
    } catch (error) {
      console.log('error creating chat/group:', error);
      Alert.alert('Error', 'Chat oluşturulamadı')
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-black" edges={['top']}>
      <View className="flex-1 px-4 pt-3">
        {/* HEADER */}
        <View className="mb-4">
          <Text className="text-white text-[28px] font-bold mb-3">
            Chats
          </Text>

          <View className="bg-neutral-900 border border-neutral-800 rounded-2xl px-4 py-3 flex-row items-center">
            <EvilIcons name="search" size={26} color="gray" />
            <TextInput
              className="text-white ml-2 flex-1 text-[16px]"
              placeholder="Search chats..."
              placeholderTextColor="#777"
              value={search}
              onChangeText={setSearch}
            />
          </View>
        </View>

        {isLoading && (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="white" />
          </View>
        )}

        <FlatList
          data={filtered()}
          keyExtractor={item => item._id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const user = item.otherUser
            console.log('users : ', user);
            
            return (
              <TouchableOpacity
                className="flex-row items-center p-4 rounded-2xl mb-2 bg-neutral-900 border border-neutral-800"
                onPress={() =>
                  navigation.navigate('ChatScreen', {
                    chatId: item._id,
                    otherUserName: user?.username,
                    isGroupChat : item.isGroupChat,
                    avatarUrl : user?.avatar
                  })
                }
              >
             <UserDefaultIcon />

                <View className="flex-1 ml-3">
                  <Text className="text-white text-[17px] font-semibold">
                    {item.isGroupChat ? item.chatName : user?.username}
                  </Text>
                  <Text className="text-neutral-500 text-[14px]">
                    click to start chatting
                  </Text>
                </View>
              </TouchableOpacity>
            )
          }}
        />

        {/* ✅ ADD BUTTON */}
        <FontAwesome6
          name="add"
          size={24}
          color="blue"
          className="absolute right-10 bottom-10 border border-gray-500 p-5 rounded-full"
          onPress={() => setIsModalVisible(true)}
        />

        {/* ✅ MODAL */}
        <CreateChatModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onCreateChat={handleCreateMultipleChat}
          userSession={userSession}
        />
      </View>
    </SafeAreaView>
  )
}

export default HomeScreen
