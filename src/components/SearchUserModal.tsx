import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  FlatList,
  Modal,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import EvilIcons from '@expo/vector-icons/EvilIcons'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import { fetchSearchUsers } from '../service/user.service'
import { User, UserSession } from '../types/UserSessionType'

interface Props {
  visible: boolean
  onClose: () => void
  onCreateChat: (
    users: { _id: string; username: string }[],
    groupName?: string
  ) => void,
  userSession : UserSession | null | undefined
}

const CreateChatModal = ({ visible, onClose, onCreateChat, userSession}: Props) => {
  const [modalSearch, setModalSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchedUsers, setSearchedUsers] = useState<any[]>([])
  const [selectedUsers, setSelectedUsers] = useState<any[]>([])
  const [groupName, setGroupName] = useState('')

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
      return
    }

    const searchUsers = async () => {
      try {
        setSearchLoading(true)
        const result = await fetchSearchUsers(debouncedSearch, 1, 10)
        setSearchedUsers(result.data ?? result)
      } finally {
        setSearchLoading(false)
      }
    }

    searchUsers()
  }, [debouncedSearch])

  const toggleUser = (user: any) => {
    const exists = selectedUsers.find(u => u._id === user._id)

    if (exists) {
      setSelectedUsers(prev => prev.filter(u => u._id !== user._id))
    } else {
      setSelectedUsers(prev => [...prev, user])
    }
  }

  return (
    <Modal animationType="slide" transparent visible={visible}>
      <View className="flex-1 bg-black mt-20 px-5">
        {/* ✅ CLOSE */}
        <EvilIcons
          name="close"
          size={30}
          color="white"
          onPress={onClose}
          className="mb-4"
        />

        {/* ✅ SELECTED USERS */}
        {selectedUsers.length > 0 && (
          <View className="flex-row flex-wrap mb-3">
            {selectedUsers.map(user => (
              <View
                key={user._id}
                className="bg-blue-600 px-3 py-1 rounded-full mr-2 mb-2"
              >
                <Text className="text-white">{user.username}</Text>
              </View>
            ))}
          </View>
        )}

        {/* ✅ GROUP NAME */}
        {selectedUsers.length > 1 && (
          <TextInput
            value={groupName}
            onChangeText={setGroupName}
            placeholder="Group name"
            placeholderTextColor="#777"
            className="border border-gray-500 rounded-xl px-4 py-3 text-white mb-3"
          />
        )}

        {/* ✅ SEARCH INPUT */}
        <View className="w-full flex-row items-center border border-gray-400 h-12 rounded-xl px-4 mb-4">
          <TextInput
            className="flex-1 text-white"
            placeholder="Search users..."
            placeholderTextColor="#777"
            value={modalSearch}
            onChangeText={setModalSearch}
          />
          <EvilIcons name="search" size={26} color="white" />
        </View>

        {searchLoading && <ActivityIndicator size="large" color="white" />}

        {/* ✅ USER LIST */}
        <FlatList
          data={searchedUsers}
          keyExtractor={item => item._id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const isSelected = selectedUsers.some(
              u => u._id === item._id
            )

            return (
              <TouchableOpacity
                activeOpacity={0.8}
                className={`flex-row items-center p-4 rounded-2xl mb-3 border ${
                  isSelected
                    ? 'bg-blue-800 border-blue-500'
                    : 'bg-neutral-900 border-neutral-800'
                }`}
                onPress={() => toggleUser(item)}
              >
                <View className="w-12 h-12 rounded-full bg-blue-600 items-center justify-center">
                  <EvilIcons name="user" size={28} color="white" />
                </View>

                <View className="flex-1 ml-3">
                  <Text className="text-white text-[16px] font-semibold">
                    {item.username}
                  </Text>
                  <Text className="text-neutral-400 text-[13px] mt-[2px]">
                    {isSelected ? 'Selected' : 'Tap to select'}
                  </Text>
                </View>

                {isSelected && (
                  <FontAwesome6
                    name="check"
                    size={18}
                    color="#22c55e"
                  />
                )}
              </TouchableOpacity>
            )
          }}
        />

        {/* ✅ CREATE BUTTON */}
        {selectedUsers.length > 0 && (
          <TouchableOpacity
            className="bg-blue-600 p-4 rounded-xl items-center mb-6"
            onPress={() => onCreateChat(selectedUsers, groupName)}
          >
            <Text className="text-white font-bold text-lg">
              {selectedUsers.length > 1
                ? 'Create Group Chat'
                : 'Start Chat'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </Modal>
  )
}

export default CreateChatModal
