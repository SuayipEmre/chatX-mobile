import { Text, View, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { fetchChats } from '../service/chat.service'
import { IChat } from '../types/Chats'
import EvilIcons from '@expo/vector-icons/EvilIcons'

const HomeScreen = () => {

  const [chats, setChats] = useState<IChat[]>([])

  useEffect(() => {
    const getChats = async () => {
      const data = await fetchChats()
      setChats(data)
    }
    getChats()
  }, [])

  return (
    <View className="flex-1 bg-black pt-10">
      <View className='gap-5'>
      {chats.map((item) => {
        const user = item.otherUser
        return (
          <TouchableOpacity 
            key={item._id}
            className="flex-row items-center px-4 py-3 border-b border-neutral-800"
          >
            {/* Avatar */}
            <View className="w-12 h-12 rounded-full bg-neutral-700 items-center justify-center">
              <EvilIcons name="user" size={34} color="white" />
            </View>

            {/* Chat info */}
            <View className="flex-1 ml-3">
              <Text className="text-white text-[17px] font-semibold">
                {user?.username}
              </Text>

              <Text className="text-neutral-400 text-[14px] mt-0.5">
                Sohbete başlamak için tıkla
              </Text>
            </View>

            {/* Time */}
            <Text className="text-neutral-500 text-xs">
              {new Date(item.createdAt).toLocaleTimeString("tr-TR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </TouchableOpacity>
        )
      })}
      </View>
    </View>
  )
}

export default HomeScreen
