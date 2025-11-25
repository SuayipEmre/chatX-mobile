import api from "./api";
import { setAccessToken } from "../utils/storage";

export const fetchUserProfile = async () => {
  const res = await api.get("/users/me");
  return res.data.data;
};

