import { createApi } from '@reduxjs/toolkit/query/react'
import { chatxBaseQuery } from './api'


const GroupService = createApi({
    reducerPath: 'GroupService',

    baseQuery: chatxBaseQuery,
    endpoints: (builder) => ({
    
        getGroupDetails: builder.query({
            query: (groupId: string) => {
                return {
                    url: `/groups/details?id=${groupId}`,
                    method: 'GET',
                }
            }
        })

    })
})
export const {
    useGetGroupDetailsQuery,
} = GroupService
export default GroupService





