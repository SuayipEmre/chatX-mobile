
export type AuthNavigatorStackParamList = {
    LoginScreen : undefined,
    RegisterScreen : undefined
}

export type MainNavigatorStackParamList = {
    HomeScreen : undefined,
    ChatScreen : { chatId: string, otherUserName?:string, isGroupChat:boolean, avatarUrl?:string }
    
}

export type ProfileNavigatorStackParamList = {
    ProfileScreen : undefined,
    EditProfileScreen : undefined

}