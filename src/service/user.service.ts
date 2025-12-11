import { createApi } from "@reduxjs/toolkit/query/react";
import { chatxBaseQuery } from "./api";

const UserService = createApi({
  reducerPath: 'UserService',

  baseQuery: chatxBaseQuery,
  tagTypes: ['users'],
  endpoints: (builder) => ({

    fetchUserProfile: builder.query({
      query: () => {
        return {
          url: `/users/me`,
          method: 'GET',
        }
      },
      providesTags: ['users']
    }),

    fetchSearchUsers : builder.query({
      query: ({query, page = 1, limit =10} : {query : string, page?: number, limit?: number}) => {
        return {
          url: `/users/search?query=${query}&page=${page}&limit=${limit}`,
          method: 'GET',
        }
      },
    }),

    updateProfile: builder.mutation({
      query: (body) => {
        return {
          url: '/users/me',
          method: 'PUT',
          body,
        }
      },
      invalidatesTags: ['users']
    }),

    uploadAvatar:builder.mutation({
      query: (base64 : string) => {
        return {
          url: '/users/me/avatar',
          method: 'POST',
          body: { image: base64 },
        }
      },
      invalidatesTags: ['users']
    })
  })
})
export const {
  useFetchUserProfileQuery,
  useFetchSearchUsersQuery,
  useUpdateProfileMutation,
  useUploadAvatarMutation
} = UserService
export default UserService

