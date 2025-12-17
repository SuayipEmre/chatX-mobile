import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserSession } from "../types/UserSessionType";

const SESSION_KEY = "userSession";

export const setUserSessionToStorage = async (session: UserSession ) => {
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const getUserSessionFromStorage = async () => {
  const value = await AsyncStorage.getItem(SESSION_KEY);
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export const clearUserSessionFromStorage = async () => {
  await AsyncStorage.removeItem(SESSION_KEY);
};


export const getAccessToken = async () => {
  const session = await getUserSessionFromStorage();
  return session?.accessToken ?? null;
};

export const setAccessTokenToStorage = async (token: string) => {
  const session = await getUserSessionFromStorage();
  if (!session) return;

  const updated = { ...session, accessToken: token };
  console.log('Updated session with new token :', updated);
  
  await setUserSessionToStorage(updated);
};

export const clearTokens = async () => {
  await clearUserSessionFromStorage();
};
