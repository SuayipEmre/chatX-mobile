
export type AuthNavigatorStackParamList = {
    LoginScreen : undefined,
    RegisterScreen : undefined
}

export type MainNavigatorStackParamList = {
    HomeScreen : undefined,
    ProfileScreen : undefined,
    ChatScreen : { chatId: string, otherUserName?:string }
    
}

export type ProfileNavigatorStackParamList = {
    ProfileScreen : undefined
}