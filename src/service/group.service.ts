import { createApi } from '@reduxjs/toolkit/query/react'
import { chatxBaseQuery } from './api'


const GroupService = createApi({
    reducerPath: 'GroupService',

    baseQuery: chatxBaseQuery,
    tagTypes: ['Group'],
    endpoints: (builder) => ({

        getGroupDetails: builder.query({
            query: (groupId: string) => {
                return {
                    url: `/groups/details?id=${groupId}`,
                    method: 'GET',
                }
            },
            providesTags: ['Group']
        }),

        removeFromGroup: builder.mutation({
            query: ({ groupId, userId }: { groupId: string, userId: string }) => {
                return {
                    url: `/groups/remove-user`,
                    method: 'POST',
                    body: {
                        groupId,
                        userId
                    }
                }
            },
            invalidatesTags: ['Group']
        }),

        changeGroupAdmin: builder.mutation({
            query: ({ groupId, newAdminId }: { groupId: string, newAdminId: string }) => {
                return {
                    url: `/groups/change-admin`,
                    method: 'PATCH',
                    body: {
                        groupId,
                        newAdminId
                    }
                }
            },
            invalidatesTags: ['Group']

        }),

        renameGroup: builder.mutation({
            query: ({ groupId, newName }: { groupId: string, newName: string }) => {
                return {
                    url: `/groups/rename`,
                    method: 'PATCH',
                    body: {
                        groupId,
                        newName
                    }
                }
            },
            invalidatesTags: ['Group']
        }),

        addUserToGroup: builder.mutation({
            query: ({ groupId, userId }: { groupId: string, userId: string }) => {
                return {
                    url: `/groups/add-user`,
                    method: 'POST',
                    body: {
                        groupId,
                        userId
                    }
                }
            },
            invalidatesTags: ['Group']
        })

    })
})
export const {
    useGetGroupDetailsQuery,
    useRemoveFromGroupMutation,
    useChangeGroupAdminMutation,
    useRenameGroupMutation,
    useAddUserToGroupMutation
} = GroupService
export default GroupService





