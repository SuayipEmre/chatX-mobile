import api from "./api";

export const fetchChats = async () => {
  try {
    const res = await api.get("/chats");
    return res.data.data;
  } catch (error) {
    return null
  }
};


export const createChat = async (userId: string) => {
  const res = await api.post("/chats", { userId });
  return res.data.data;
}

export const createGroupChat = async (data: { users: string[]; groupName: string, adminId? : string }) => {
  const res = await api.post("/groups/create", {...data});
  return res.data.data;
}