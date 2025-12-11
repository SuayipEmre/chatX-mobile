import { createApi } from '@reduxjs/toolkit/query/react'
import { chatxBaseQuery } from './api'


const AuthService = createApi({
    reducerPath: 'AuthService',

    baseQuery: chatxBaseQuery,
    endpoints: (builder) => ({

        sendLoginRequest: builder.mutation({
            query: (body) => {
                return {
                    url: '/users/login',
                    method: 'POST',
                    body,
                }
            }
        }),

        sendRegisterRequest : builder.mutation({
            query : (body) => {
                return {
                    url : '/users/register',
                    method : 'POST',
                    body,
                }
            }
        }),

        sendLogoutRequest : builder.mutation({
            query : () => {
                return {
                    url : '/users/logout',
                    method : 'POST',
                }
            }
        })
    })
})
export const {
    useSendLoginRequestMutation,
    useSendRegisterRequestMutation,
    useSendLogoutRequestMutation
} = AuthService
export default AuthService





