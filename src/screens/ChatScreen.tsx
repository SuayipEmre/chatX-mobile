import { Text, View, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard, Alert, Image } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useRoute } from '@react-navigation/native'
import { fetchMessagesByChatId, sendMessage } from '../service/message.service'
import { IMessage } from '../types/Message'
import { useUserSession } from '../store/feature/user/hooks'
import { getSocket } from '../socket'
import UserDefaultIcon from '../components/UserDefaultIcon'

const ChatScreen = () => {
    const user = useUserSession()
    const route = useRoute()
    const { chatId, isGroupChat } = route.params as any


    const [messages, setMessages] = useState<IMessage[]>([])
    const [content, setContent] = useState("")
    const flatListRef = useRef<FlatList<any>>(null)
    const currentUserId = user?.user._id
    const socket = getSocket(currentUserId!)


    const [keyboardOpen, setKeyboardOpen] = useState(false);

    useEffect(() => {
        const showSub = Keyboard.addListener("keyboardDidShow", () => setKeyboardOpen(true));
        const hideSub = Keyboard.addListener("keyboardDidHide", () => setKeyboardOpen(false));

        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);


    console.log('messages:', messages);

    useEffect(() => {
        const load = async () => {
            const data = await fetchMessagesByChatId(chatId)
            if (data) setMessages(data)
        }
        load()
    }, [chatId])

    useEffect(() => {
        if (!currentUserId) return;

        const socket = getSocket(currentUserId);

        socket.emit("join_chat", chatId);

        socket.on("message_received", (message: IMessage) => {
            setMessages(prev => [...prev, message]);
        });

        return () => {
            socket.emit("leave_chat", chatId);
            socket.off("message_received");
        };
    }, [chatId, currentUserId]);

    const handleSend = async () => {
        try {
            if (!content.trim()) return

            const newMessage = await sendMessage(chatId, content)

            setContent("")
            setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 50)
        } catch (error) {
            Alert.alert("ChatX", "Failed to send message. Please try again.")
        }
    }

    const renderMessage = ({ item }: { item: IMessage }) => {
        const isMine = item.sender._id === currentUserId

        console.log('item:', item);

        return (
            <View className={`flex-row my-1 px-1 ${isMine ? "justify-end" : "justify-start"}`}>
                <View
                    className={`
                        max-w-[75%] px-3 py-2 rounded-2xl flex-row items-center gap-5
                        ${isMine ? "bg-blue-600 rounded-tr-none" : "bg-neutral-800 rounded-tl-none"}
                    `}
                >

                    {isGroupChat && !isMine && (item.sender?.avatar ? <Image
                        source={{ uri: item.sender.avatar }}
                        className="w-14 h-14 rounded-full "
                        resizeMethod='resize'
                        resizeMode='cover'
                    /> : <UserDefaultIcon />)}
                    <View>
                        <View>
                            {!isMine && <Text className='text-pink-500'>{item.sender.username}</Text>}
                            <Text className="text-white text-[15px]">{item.content}</Text>
                        </View>
                        <Text className="text-neutral-400 text-[10px] mt-1 text-right">
                            {new Date(item.createdAt).toLocaleTimeString("tr-TR", {
                                hour: "2-digit", minute: "2-digit"
                            })}
                        </Text>
                    </View>



                </View>
            </View>
        )
    }

    return (
        <View className="flex-1 bg-black">
            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item._id}
                renderItem={renderMessage}
                contentContainerStyle={{ paddingVertical: 10, paddingBottom: 90 }}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                keyboardShouldPersistTaps="handled"

            />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={80}

            >
                <View className={`flex-row items-center px-3 py-3 border-t border-neutral-800 bg-black ${keyboardOpen ? 'pb-10' : ''}`}>
                    <TextInput
                        className="flex-1 bg-neutral-900 text-white px-4 py-3 rounded-full mr-3 text-[15px]"
                        placeholder="Mesaj yaz..."
                        placeholderTextColor="#777"
                        value={content}
                        onChangeText={setContent}
                    />
                    <TouchableOpacity onPress={handleSend} className="bg-blue-600 px-4 py-3 rounded-full">
                        <Text className="text-white font-semibold">Gönder</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    )

}

export default ChatScreen
