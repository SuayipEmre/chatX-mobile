import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  FlatList,
  Modal,
  Alert
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { createChat, fetchChats } from '../service/chat.service'
import { fetchSearchUsers } from '../service/user.service'
import { IChat } from '../types/Chats'
import EvilIcons from '@expo/vector-icons/EvilIcons'
import { SafeAreaView } from 'react-native-safe-area-context'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { MainNavigatorStackParamList } from '../navigation/types'
import CreateChatModal from '../components/SearchUserModal'

const HomeScreen = () => {
  const [chats, setChats] = useState<IChat[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  const [isModalVisible, setIsModalVisible] = useState(false)

  const [modalSearch, setModalSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchedUsers, setSearchedUsers] = useState<any[]>([])

  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const navigation = useNavigation<NavigationProp<MainNavigatorStackParamList>>()

  // ✅ CHATLARI ÇEK
  useEffect(() => {
    loadChats()
  }, [])

  const loadChats = async () => {
    try {
      const data = await fetchChats()
      setChats(data)
    } finally {
      setLoading(false)
    }
  }

  const filtered = chats?.filter(chat =>
    chat?.otherUser?.username?.toLowerCase().includes(search.toLowerCase())
  )



  const handleCreateChat = async (username: string, userId: string) => {

    try {
      const chatData = await createChat(userId)

      console.log("Created or accessed chat:", chatData);

      if (!chatData) {
        return Alert.alert("Error", "Could not create or access chat.")
      }

      setIsModalVisible(false)
      navigation.navigate('ChatScreen', {
        chatId: chatData._id,
        otherUserName: username,
      })
    } catch (error) {

    }

  }

  return (
    <SafeAreaView className="flex-1 bg-black" edges={['top']}>
      <View className="flex-1 px-4 pt-3">

        {/* HEADER */}
        <View className="mb-4">
          <Text className="text-white text-[28px] font-bold mb-3">
            Sohbetler
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

        {loading && (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="white" />
          </View>
        )}

        <FlatList
          data={filtered}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const user = item.otherUser

            return (
              <TouchableOpacity
                className="flex-row items-center p-4 rounded-2xl mb-2 bg-neutral-900 border border-neutral-800"
                onPress={() =>
                  navigation.navigate('ChatScreen', {
                    chatId: item._id,
                    otherUserName: user?.username,
                  })
                }
              >
                <View className="w-12 h-12 rounded-full bg-blue-600 items-center justify-center">
                  <EvilIcons name="user" size={30} color="white" />
                </View>

                <View className="flex-1 ml-3">
                  <Text className="text-white text-[17px] font-semibold">
                    {user?.username}
                  </Text>
                  <Text className="text-neutral-500 text-[14px]">
                    click to start chatting
                  </Text>
                </View>
              </TouchableOpacity>
            )
          }}
        />

        <FontAwesome6
          name="add"
          size={24}
          color="blue"
          className="absolute right-10 bottom-10 border border-gray-500 p-5 rounded-full"
          onPress={() => {
            setModalSearch("")
            setSearchedUsers([])
            setPage(1)
            setHasMore(true)
            setIsModalVisible(true)
          }}
        />

        <CreateChatModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onCreateChat={handleCreateChat}
        />

      </View>
    </SafeAreaView>
  )
}

export default HomeScreen
