import {
    Text,
    View,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    FlatList,
    Modal
  } from 'react-native'
  import React, { useEffect, useState } from 'react'
  import EvilIcons from '@expo/vector-icons/EvilIcons'
  import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
  import { fetchSearchUsers } from '../service/user.service'
  
  interface Props {
    visible: boolean
    onClose: () => void
    onCreateChat: (username: string, userId: string) => void
  }
  
  const CreateChatModal = ({ visible, onClose, onCreateChat }: Props) => {
    const [modalSearch, setModalSearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [searchLoading, setSearchLoading] = useState(false)
    const [searchedUsers, setSearchedUsers] = useState<any[]>([])
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
  
    // ✅ DEBOUNCE
    useEffect(() => {
      const timer = setTimeout(() => {
        setDebouncedSearch(modalSearch)
      }, 500)
  
      return () => clearTimeout(timer)
    }, [modalSearch])
  
    useEffect(() => {
      if (!debouncedSearch.trim() || debouncedSearch.length < 2) {
        setSearchedUsers([])
        setPage(1)
        setHasMore(true)
        return
      }
  
      const searchUsers = async () => {
        try {
          setSearchLoading(true)
          const result = await fetchSearchUsers(debouncedSearch, 1, 10)
          setSearchedUsers(result.data)
          setHasMore(result.hasMore ?? result.length === 10)
          setPage(2)
        } finally {
          setSearchLoading(false)
        }
      }
  
      searchUsers()
    }, [debouncedSearch])
  
    return (
      <Modal animationType="slide" transparent visible={visible}>
        <View className="flex-1 bg-black mt-20 px-5">
  
          {/* CLOSE */}
          <EvilIcons
            name="close"
            size={30}
            color="white"
            onPress={onClose}
            className="mb-5"
          />
  
          {/* SEARCH INPUT */}
          <View className="w-full flex-row items-center border border-gray-400 h-12 rounded-xl px-4 mb-4">
            <TextInput
              className="flex-1 text-white"
              placeholder="Search users to chat..."
              placeholderTextColor="#777"
              value={modalSearch}
              onChangeText={setModalSearch}
            />
            <EvilIcons name="search" size={26} color="white" />
          </View>
  
          {/* LOADING */}
          {searchLoading && (
            <ActivityIndicator size="large" color="white" />
          )}
  
          {/* USER LIST */}
          <FlatList
            data={searchedUsers}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            onEndReached={async () => {
              if (!hasMore || searchLoading) return
  
              try {
                setSearchLoading(true)
                const result = await fetchSearchUsers(debouncedSearch, page, 10)
                const newUsers = result.users ?? result
  
                setSearchedUsers(prev => [...prev, ...newUsers])
                setHasMore(result.hasMore ?? newUsers.length === 10)
                setPage(prev => prev + 1)
              } finally {
                setSearchLoading(false)
              }
            }}
            onEndReachedThreshold={0.5}
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.8}
                className="flex-row items-center p-4 rounded-2xl mb-3 bg-neutral-900 border border-neutral-800"
                onPress={() => onCreateChat(item.username, item._id)}
              >
                <View className="w-12 h-12 rounded-full bg-blue-600 items-center justify-center">
                  <EvilIcons name="user" size={28} color="white" />
                </View>
  
                <View className="flex-1 ml-3">
                  <Text className="text-white text-[16px] font-semibold">
                    {item.username}
                  </Text>
                  <Text className="text-neutral-500 text-[13px] mt-[2px]">
                    Click to start chat
                  </Text>
                </View>
  
                <View className="w-9 h-9 rounded-full bg-neutral-800 items-center justify-center">
                  <FontAwesome6 name="message" size={16} color="#3b82f6" />
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    )
  }
  
  export default CreateChatModal
  