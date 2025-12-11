import { createApi } from "@reduxjs/toolkit/query/react";
import { chatxBaseQuery } from "./api";

const MessageService = createApi({
  reducerPath: 'MessageService',

  baseQuery: chatxBaseQuery,
  endpoints: (builder) => ({

    fetchMessagesByChatId: builder.query({
      query: (chatId:string) => {
        return {
          url: `/messages/${chatId}`,
          method: 'GET',
        }
      },
    }),

    sendMessage: builder.mutation({
      query: ({chatId, content} : {chatId : string, content:  string} ) => {
        return {
          url: '/messages',
          method: 'POST',
          body: {
            chatId,
            content,
          }
        }
      },
    }),

  
  })
})
export const {
    useFetchMessagesByChatIdQuery,
    useSendMessageMutation,
} = MessageService
export default MessageService
