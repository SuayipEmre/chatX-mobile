import { Text, View, TouchableOpacity, TextInput, ActivityIndicator, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { fetchChats } from '../service/chat.service'
import { IChat } from '../types/Chats'
import EvilIcons from '@expo/vector-icons/EvilIcons'
import { SafeAreaView } from 'react-native-safe-area-context'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { MainNavigatorStackParamList } from '../navigation/types'

const HomeScreen = () => {

  const [chats, setChats] = useState<IChat[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  const navigation = useNavigation<NavigationProp<MainNavigatorStackParamList>>()

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


  return (
    <SafeAreaView className="flex-1 bg-black" edges={['top']}>
      <View className="flex-1 px-4 pt-3">

        {/* HEADER - Search */}
        <View className="mb-4">
          <Text className="text-white text-[28px] font-bold mb-3">
            Sohbetler
          </Text>

          <View className="bg-neutral-900 border border-neutral-800 rounded-2xl px-4 py-3 flex-row items-center">
            <EvilIcons name="search" size={26} color="gray" />
            <TextInput
              className="text-white ml-2 flex-1 text-[16px]"
              placeholder="Kullanıcı ara veya sohbet başlat"
              placeholderTextColor="#777"
              value={search}
              onChangeText={setSearch}
            />
          </View>
        </View>

        {/* LOADING */}
        {loading && (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#3b82f6" />
          </View>
        )}

        {/* EMPTY STATE */}
        {!loading && filtered?.length === 0 && (
          <View className="flex-1 items-center justify-center">
            <Text className="text-neutral-500 text-[16px]">
              Henüz bir sohbet yok
            </Text>
          </View>
        )}

        {/* CHAT LIST */}
        <FlatList
          data={filtered}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const user = item.otherUser

            return (
              <TouchableOpacity
                className="flex-row items-center p-4 rounded-2xl mb-2 bg-neutral-900 border border-neutral-800 active:bg-neutral-800"
                onPress={() => navigation.navigate('ChatScreen', { chatId: item._id })}
              >
                <View className="w-12 h-12 rounded-full bg-blue-600 items-center justify-center shadow-md shadow-blue-500/40">
                  <EvilIcons name="user" size={30} color="white" />
                </View>

                <View className="flex-1 ml-3">
                  <Text className="text-white text-[17px] font-semibold">
                    {user?.username}
                  </Text>

                  <Text className="text-neutral-500 text-[14px]">
                    Sohbete başlamak için tıkla
                  </Text>
                </View>

                <Text className="text-neutral-600 text-xs">
                  {new Date(item.createdAt).toLocaleTimeString("tr-TR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </TouchableOpacity>
            )
          }}
        />

        <FontAwesome6 name="add" size={24} color="blue" className='absolute right-10 bottom-10 z-50 border border-gray-500 p-5 rounded-full' />
      </View>
    </SafeAreaView>
  )
}

export default HomeScreen
