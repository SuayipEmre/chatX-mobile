import api from "./api";
import { setAccessToken } from "../utils/storage";

export const fetchChats = async () => {
  const res = await api.get("/chats");

  const token = res.data.data.accessToken;

  if (token) {
    await setAccessToken(token);
  }

  return res.data.data;
};

