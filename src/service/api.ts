import { refreshToken } from './../../../chatx-backend/src/modules/user/user.controller';
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  createApi,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import { clearTokens, clearUserSessionFromStorage, getTokens, setTokens } from '../utils/cleanStorage';



const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

/* ---------------- RAW BASE QUERY ---------------- */

const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: async (headers) => {
    const token = await getTokens();

    if (token) {
      headers.set('Authorization', `Bearer ${token.accessToken}`);
    }

    return headers;
  },
});

/* ---------------- REFRESH QUEUE LOGIC ---------------- */

let isRefreshing = false;

let failedQueue: {
  resolve: (token?: string | null) => void;
  reject: (error?: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });

  failedQueue = [];
};

/* ---------------- BASE QUERY ---------------- */

export const chatxBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (
    result.error &&
    result.error.status === 401 &&
    (args as FetchArgs).url !== '/users/refresh-token'
  ) {
    console.log('401 detected, attempting token refresh...');
    
    if (!isRefreshing) {
      isRefreshing = true;

      try {
        const tokens = await getTokens();
        console.log('tokens for refresh: ', tokens);
        
        const refresh = tokens.refreshToken
        if (!tokens) {
          throw new Error('No tokens');
        }

        const refreshResult = await rawBaseQuery(
          {
            url: '/users/refresh-token',
            method: 'POST',
            body: { refreshToken: refresh},
          },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          const newAccessToken = (refreshResult.data as any).data.accessToken;

          await setTokens({
            accessToken: newAccessToken,
            refreshToken: (refreshResult.data as any).data.refreshToken,
          });

          processQueue(null, newAccessToken);
          isRefreshing = false;

          // 🔁 Retry original request
          return await rawBaseQuery(args, api, extraOptions);
        } else {
          console.log('Refresh token failed: ', refreshResult.error);
          
          await clearTokens();
          throw refreshResult.error;

        }
      } catch (err) {
        console.log('Refresh token error: ', err);
        
        processQueue(err, null);
        isRefreshing = false;

        await clearTokens();

        return result;
      }
    }

    // 🕒 Wait for refresh to complete
    return new Promise((resolve, reject) => {
      failedQueue.push({
        resolve: async () => {
          resolve(await rawBaseQuery(args, api, extraOptions));
        },
        reject,
      });
    }) as any;
  }

  return result;
};


export const api = createApi({
  reducerPath: 'api',
  baseQuery: chatxBaseQuery,
  tagTypes: ['User', 'Chat', 'Message'],
  endpoints: () => ({}),
});