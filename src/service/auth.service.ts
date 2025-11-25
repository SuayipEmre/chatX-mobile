import api from "./api";
import { setAccessToken } from "../utils/storage";

export const login = async (email: string, password: string) => {
  const res = await api.post("/users/login", { email, password });

  const token = res.data.data.accessToken;

  if (token) {
    await setAccessToken(token);
  }

  return res.data.data;
};

export const getMe = async () => {
  const res = await api.get("/users/me");
  return res.data.data;
};

export const logout = async () => {
  const res = await api.post("/users/logout");
  return res.data;
};
