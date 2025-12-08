import api from "./api";

export const fetchUserProfile = async () => {
  const res = await api.get("/users/me");
  return res.data.data;
};


export const fetchSearchUsers = async (
  query: string,
  page: number = 1,
  limit: number = 10
) => {
  const res = await api.get(
    `/users/search?query=${query}&page=${page}&limit=${limit}`
  );

  return res.data.data; 
};

export const updateProfile = async (payload: {
  email?: string;
  username?: string;
  avatar?: string;
}) => {
  const res = await api.put("/users/me", payload);
  return res.data;
};

export const uploadAvatar = async (base64: string) => {
  const res = await api.post("/users/me/avatar", { image: base64 });
  return res.data.data.imageUrl;
};
