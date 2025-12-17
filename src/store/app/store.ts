import { configureStore } from '@reduxjs/toolkit'
import userSlice from '../feature/user'
import AuthService from '../../service/auth.service'
import ChatService from '../../service/chat.service'
import MessageService from '../../service/message.service'
import UserService from '../../service/user.service'
import GroupService from '../../service/group.service'

export const store = configureStore({
    reducer: {
        userSlice,
        [AuthService.reducerPath]: AuthService.reducer,
        [ChatService.reducerPath]: ChatService.reducer,
        [MessageService.reducerPath]: MessageService.reducer,
        [UserService.reducerPath]: UserService.reducer,
        [GroupService.reducerPath]: GroupService.reducer,

    },


    middleware: (getDefaultMiddleware) => {
        return (
            getDefaultMiddleware()
                .concat(AuthService.middleware)
                .concat(ChatService.middleware)
                .concat(MessageService.middleware)
                .concat(UserService.middleware)
                .concat(GroupService.middleware)
        )
    }

})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
