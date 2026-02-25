import { createApi } from "@reduxjs/toolkit/query/react";
import { chatxBaseQuery } from "./api";

const MessageService = createApi({
  reducerPath: 'MessageService',

  baseQuery: chatxBaseQuery,
  tagTypes: ['Message', 'Chat'],
  endpoints: (builder) => ({

    fetchMessagesByChatId: builder.query({
      query: (chatId: string) => {
        return {
          url: `/messages/${chatId}`,
          method: 'GET',
        }
      },
    }),

    sendMessage: builder.mutation({
      query: ({ chatId, content }: { chatId: string, content: string }) => {
        return {
          url: '/messages',
          method: 'POST',
          body: {
            chatId,
            content,
          }
        }
      },
      invalidatesTags: (result, error, { chatId }) => [{ type: 'Message' as const, id: chatId }],
    }),

    markAsRead: builder.mutation({
      query: ({ chatId }: { chatId: string }) => {
        return {
          url: '/messages/read',
          method: 'POST',
          body: {
            chatId,
          }
        }
      },
      invalidatesTags: (result, error, { chatId }) => [
        { type: 'Message' as const, id: chatId },
        { type: 'Chat' as const, id: 'LIST' }
      ],
    }),


  })
})
export const {
  useFetchMessagesByChatIdQuery,
  useSendMessageMutation,
  useMarkAsReadMutation,
} = MessageService
export default MessageService
