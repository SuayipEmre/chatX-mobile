import { CommonUserFields } from "../types/GroupDetailType"

export type AuthNavigatorStackParamList = {
    LoginScreen: undefined,
    RegisterScreen: undefined
}

export type MainNavigatorStackParamList = {
    HomeScreen: undefined,
    ChatScreen: {
        chatId: string,
        otherUserName?: string,
        isGroupChat: boolean,
        avatarUrl?: string,
        groupId?: string,
        otherUser?: CommonUserFields
    },
    GroupDetailScreen: {
        groupId: string
    }

}

export type ProfileNavigatorStackParamList = {
    ProfileScreen: undefined,
    EditProfileScreen: undefined,
    ChangePasswordScreen: undefined
}