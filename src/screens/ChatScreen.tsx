import { Text, View, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native'
import React, { use, useEffect, useRef, useState } from 'react'
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { MainNavigatorStackParamList } from '../navigation/types'
import { fetchMessagesByChatId, sendMessage } from '../service/message.service'
import { IMessage } from '../types/Message'
import { useUserSession } from '../store/feature/user/hooks'

type ChatScreenRouteProp = RouteProp<MainNavigatorStackParamList, 'ChatScreen'>
type ChatScreenNavProp = NavigationProp<MainNavigatorStackParamList, 'ChatScreen'>

const ChatScreen = () => {
    const user = useUserSession()
    const navigation = useNavigation<ChatScreenNavProp>()
    const route = useRoute<ChatScreenRouteProp>()
    const { chatId } = route.params

    const [messages, setMessages] = useState<IMessage[]>([])
    const [content, setContent] = useState("")

    const flatListRef = useRef<FlatList<any>>(null)

    const currentUserId = user?.user._id

    useEffect(() => {
        const load = async () => {
            const data = await fetchMessagesByChatId(chatId)
            if (data) setMessages(data)
        }
        load()
    }, [chatId])

    const handleSend = async () => {
        if (!content.trim()) return

        const newMessage = await sendMessage(chatId, content)
        setMessages(prev => [...prev, newMessage])
        setContent("")

        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true })
        }, 100)
    }

    const renderMessage = ({ item }: { item: IMessage }) => {
        const isMine = item.sender._id === currentUserId

        return (
            <View className={`flex-row my-1 px-1 ${isMine ? "justify-end" : "justify-start"}`}>
                <View
                    className={`
            max-w-[75%] px-3 py-2 rounded-2xl 
            ${isMine ? "bg-blue-600 rounded-tr-none" : "bg-neutral-800 rounded-tl-none"}
          `}
                >
                    <Text className="text-white text-[15px]">{item.content}</Text>

                    <Text className="text-neutral-400 text-[10px] mt-1 text-right">
                        {new Date(item.createdAt).toLocaleTimeString("tr-TR", {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </Text>
                </View>
            </View>
        )
    }

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-black"
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            {/* MESSAGE LIST */}
            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item._id}
                renderItem={renderMessage}
                contentContainerStyle={{ paddingVertical: 10 }}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />

            {/* INPUT AREA */}
            <View className="flex-row items-center px-3 py-3 border-t border-neutral-800">
                <TextInput
                    className="flex-1 bg-neutral-900 text-white px-4 py-3 rounded-full mr-3 text-[15px]"
                    placeholder="Mesaj yaz..."
                    placeholderTextColor="#777"
                    value={content}
                    onChangeText={setContent}
                />

                <TouchableOpacity onPress={handleSend}
                 className="bg-blue-600 px-4 py-3 rounded-full"
                >
                    <Text className="text-white font-semibold">Gönder</Text>
                </TouchableOpacity>

                
            </View>

        </KeyboardAvoidingView>
    )
}

export default ChatScreen
