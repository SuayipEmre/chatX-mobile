import api from "./api";
import { setAccessToken, setAccessTokenToStorage } from "../utils/storage";
import { setUserSession } from "../store/feature/user/actions";

export const login = async (email: string, password: string) => {
  const res = await api.post("/users/login", { email, password });

  const token = res.data.data.accessToken;

  if (token) {
    await setAccessToken(token);
  }

  return res.data.data;
};

export const register = async (email: string, password: string, username: string) => {
  try{
    console.log('registering with ', email, password, username);
  
  const {data} = await api.post("/users/register", { email, password, username });
  console.log('register response: ', data.data);
  console.log('accessToken: ', data.data.accessToken);
  console.log('refreshToken: ', data.data.refreshToken);
  
  
  const token = data.data.accessToken;
  
  if (token) {
    setUserSession(data.data);
    await setAccessTokenToStorage(token);
  }

  return data
  } catch (e){
    console.log('registration error', e);
    
    throw new Error('Registration failed');
  }
}

export const getMe = async () => {
  const res = await api.get("/users/me");
  return res.data.data;
};

export const logout = async () => {
  const res = await api.post("/users/logout");
  return res.data;
};
