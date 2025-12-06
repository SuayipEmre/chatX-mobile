import api from "./api";

export const fetchChats = async () => {
  try {
    const res = await api.get("/chats");


    return res.data.data;
  } catch (error) {
    return null
  }
};

