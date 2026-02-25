import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  FlatList,
  Alert,
  Image,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { useCreateChatMutation, useCreateGroupChatMutation, useFetchChatsQuery } from '../service/chat.service'
import { useFetchAllUsersQuery } from '../service/user.service'
import { IChat } from '../types/Chats'
import EvilIcons from '@expo/vector-icons/EvilIcons'
import { SafeAreaView } from 'react-native-safe-area-context'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { MainNavigatorStackParamList } from '../navigation/types'
import CreateChatModal from '../components/SearchUserModal'
import { useUserSession } from '../store/feature/user/hooks'
import { getSocket } from '../socket'
import Ionicons from '@expo/vector-icons/Ionicons';
import Avatar from '../components/Avatar'
const HomeScreen = () => {
  const [search, setSearch] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)

  const userSession = useUserSession()

  const [createChat] = useCreateChatMutation()
  const [createGroupChat] = useCreateGroupChatMutation()
  const { data: chatData, isLoading } = useFetchChatsQuery({})
  const { data: allUsersData, isLoading: isLoadingUsers } = useFetchAllUsersQuery({})


  const navigation = useNavigation<NavigationProp<MainNavigatorStackParamList>>()


  console.log('chat data : ', chatData);



  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    const socket = getSocket(userSession?.user._id!);

    socket.on("user_online", (userId: string) => {
      setOnlineUsers((prev) => [...new Set([...prev, userId])]);
    });

    socket.on("user_offline", (userId: string) => {
      setOnlineUsers((prev) => prev?.filter((id) => id !== userId));
    });

    return () => {
      socket.off("user_online");
      socket.off("user_offline");
    };
  }, [userSession]);

  console.log('chatData : ', chatData);


  const filtered = () => {
    return chatData?.data?.filter((chat: IChat) => {
      if (chat.isGroupChat) return chat.chatName?.toLowerCase().includes(search.toLowerCase());
      return chat?.otherUser?.username?.toLowerCase().includes(search.toLowerCase())
    })

  }


  const handleCreateMultipleChat = async (
    users: { _id: string; username: string, avatarUrl?: string }[],
    groupName?: string
  ) => {

    try {
      if (users.length === 1) {
        const chatResult = await createChat(users[0]._id).unwrap()
        setIsModalVisible(false)

        return navigation.navigate('ChatScreen', {
          chatId: chatResult.data._id,
          otherUserName: users[0].username,
          isGroupChat: false,
          avatarUrl: users[0].avatarUrl,
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
      }).unwrap()

      setIsModalVisible(false)

      navigation.navigate('ChatScreen', {
        chatId: groupData.data.chat._id,
        otherUserName: groupData.data.group.groupName,
        isGroupChat: true,
        avatarUrl: undefined,
        groupId: groupData.data.group._id,
      })
    } catch (error) {
      console.log('error creating chat/group:', error);
      Alert.alert('Error', 'Chat oluşturulamadı')
    }
  }

  // ✅ SUGGESTED USERS RENDERER
  const renderSuggestedUsers = () => {
    if (isLoadingUsers || !allUsersData?.data?.length) return null;

    // Filter out current user from suggestions
    const suggestedUsers = allUsersData.data.filter(
      (u: any) => u._id !== userSession?.user._id
    );

    if (!suggestedUsers.length) return null;

    return (
      <View className="mb-6">
        <Text className="text-neutral-400 text-sm font-semibold mb-3 tracking-wider uppercase">
          Suggested
        </Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={suggestedUsers}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleCreateMultipleChat([item])}
              className="items-center mr-4 w-[72px]"
            >
              <View className="w-16 h-16 rounded-full overflow-hidden mb-2 border-2 border-primary">
                {item.avatar ? (
                  <Image source={{ uri: item.avatar }} className="w-full h-full" />
                ) : (
                  <View className="w-full h-full bg-neutral-800 items-center justify-center">
                    <FontAwesome6 name="user" size={24} color="#9ca3af" />
                  </View>
                )}
                {/* Online indicator */}
                {onlineUsers.includes(item._id) && (
                  <View className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-green-500 border-2 border-black" />
                )}
              </View>
              <Text className="text-white text-xs text-center" numberOfLines={1}>
                {item.username}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  };

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
            <ActivityIndicator size="large" color="#FF5B04" />
          </View>
        )}

        <FlatList
          data={filtered()}
          keyExtractor={item => item._id}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={renderSuggestedUsers}
          renderItem={({ item }) => {
            const user = item.otherUser

            return (
              <TouchableOpacity
                className="flex-row items-center p-4 rounded-2xl mb-2 bg-neutral-900 border border-neutral-800"
                onPress={() =>
                  navigation.navigate('ChatScreen', {
                    chatId: item._id,
                    otherUserName: item.isGroupChat ? item.chatName : user?.username,
                    isGroupChat: item.isGroupChat,
                    avatarUrl: user?.avatar,
                    groupId: item.isGroupChat ? item.groupId : undefined,
                    otherUser: user,
                  })
                }
              >
                <View className="relative">
                  {item.isGroupChat ? (
                    <View className="w-12 h-12 rounded-full bg-neutral-800 items-center justify-center">
                      <FontAwesome6 name="users" size={20} color="white" />
                    </View>
                  ) : (
                    <Image
                      source={{ uri: user?.avatar || 'https://via.placeholder.com/150' }}
                      className='w-12 h-12 rounded-full'
                    />
                  )}
                  {/* Online Indicator */}
                  {!item.isGroupChat && user && onlineUsers.includes(user._id) && (
                    <View className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-neutral-900" />
                  )}
                </View>

                <View className="flex-1 ml-4 justify-center">
                  <Text className="text-white text-[17px] font-semibold">
                    {item.isGroupChat ? item.chatName : user?.username}
                  </Text>

                  <View className='flex-row items-center gap-2 mt-1'>
                    <Ionicons name="checkmark-done-sharp" size={16} color="gray" />
                    <Text className="text-neutral-400 text-[14px]" numberOfLines={1}>
                      {item.latestMessage ? item.latestMessage.content : 'No messages yet.'}
                    </Text>
                  </View>

                </View>
              </TouchableOpacity>
            )
          }}
        />

        {/* ✅ ADD BUTTON */}
        <TouchableOpacity
          className="absolute right-6 bottom-6 w-14 h-14 bg-primary rounded-full items-center justify-center shadow-lg"
          style={{ backgroundColor: '#FF5B04', shadowColor: '#FF5B04', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 }}
          onPress={() => setIsModalVisible(true)}
        >
          <FontAwesome6 name="plus" size={20} color="white" />
        </TouchableOpacity>

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
