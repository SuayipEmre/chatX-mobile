export interface IChatUser {
    _id: string;
    username: string;
    email: string;
  }
  
  export interface IChat {
    _id: string;
    chatName: string;
    isGroupChat: boolean;
    users: IChatUser[];
    otherUser?: IChatUser; 
    createdAt: string;
    updatedAt: string;
    __v?: number;
  }
  