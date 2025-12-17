import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { getAccessToken, setAccessTokenToStorage, clearTokens } from '../utils/storage';
import { setUserSession } from '../store/feature/user/actions';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
  prepareHeaders: async (headers) => {
    const token = await getAccessToken();
    console.log('Using token in request headers :', token);
    
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});


let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

export const chatxBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error) {
    console.log('API ERROR:', {
      status: result.error.status,
      data: result.error.data,
      originalArgs: args,
    });
  }
  
  if (result.error && result.error.status === 401) {
    if (!isRefreshing) {
      isRefreshing = true;

      try {
        const refreshResult = await rawBaseQuery(
          { url: "/users/refresh-token", method: "POST" },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          console.log('Token refreshed', refreshResult);
          
          const newToken = (refreshResult.data as any).data.accessToken;
          
          await setAccessTokenToStorage(newToken);

          processQueue(null, newToken);

          isRefreshing = false;

          // Retry original request
          return await rawBaseQuery(args, api, extraOptions);
        } else {
          throw refreshResult.error;
        }
      } catch (err) {
        processQueue(err, null);
        await clearTokens();

        isRefreshing = false;

        return result; 
      }
    }

    return new Promise((resolve, reject) => {
      failedQueue.push({
        resolve: (token) => resolve(rawBaseQuery(args, api, extraOptions)),
        reject: (err) => reject(err),
      });
    }) as any;
  }

  return result;
};
