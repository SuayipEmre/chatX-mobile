import { createApi } from "@reduxjs/toolkit/query/react";
import { chatxBaseQuery } from "./api";

const ChatService = createApi({
  reducerPath: 'ChatService',

  baseQuery: chatxBaseQuery,
  tagTypes: ['Chats'],
  endpoints: (builder) => ({

    fetchChats: builder.query({
      query: () => {
        return {
          url: '/chats',
          method: 'GET',
        }
      },
      providesTags: ['Chats']
    }),

    createChat: builder.mutation({
      query: (userId) => {
        return {
          url: '/chats',
          method: 'POST',
          body: {
            userId
          }
        }
      },
      invalidatesTags: ['Chats']
    }),

    createGroupChat: builder.mutation({
      query: (body) => {
        return {
          url: '/groups/create',
          method: 'POST',
          body,
        }
      },
      invalidatesTags: ['Chats']
    })
  })
})
export const {
  useFetchChatsQuery,
  useCreateChatMutation,
  useCreateGroupChatMutation
} = ChatService
export default ChatService

