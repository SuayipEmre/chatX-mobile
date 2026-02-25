import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserSession } from '../types/UserSessionType';

const SESSION_KEY = "userSession";
const TOKEN_KEY = "authTokens";

// USER SESSIONS
export const setUserSessionToStorage = async (session: UserSession) => {
    try {
        await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch (error) {
        console.log('Error setting user session to storage: ', error);
        process.exit(1);
    }
}

export const getUserSession = async () => {
    try {
        const sessionData = await AsyncStorage.getItem(SESSION_KEY);
        return JSON.parse(sessionData!)
    } catch (error) {
        console.log('Error getting user session from storage: ', error);
        process.exit(1);

    }
}

export const clearUserSessionFromStorage = async () => {
    try {
        await AsyncStorage.removeItem(SESSION_KEY);
        return null
    } catch (error) {
        console.log('Error clearing user session from storage: ', error);
        process.exit(1);
    }
}




// TOKENS

type tokens = {
    accessToken: string;
    refreshToken: string;
}
export const setTokens = async (tokens: tokens) => {
    try {
        await AsyncStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
    } catch (error) {
        console.log('Error setting tokens to storage: ', error);
        process.exit(1);

    }
}

export const getTokens = async () => {
    try {
        const tokenData =  await AsyncStorage.getItem(TOKEN_KEY);
        console.log('Retrieved token data from storage: ', tokenData);
        
        return JSON.parse(tokenData!)
    } catch (error) {
        console.log('Error getting tokens from storage: ', error);
        process.exit(1);

    }
}

export const clearTokens = async () => {
    try {
        await AsyncStorage.removeItem(TOKEN_KEY);
        await clearUserSessionFromStorage();
        return null
    } catch (error) {
        console.log('Error clearing tokens from storage: ', error);
        process.exit(1);

    }
}