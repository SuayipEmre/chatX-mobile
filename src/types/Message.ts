export interface IMessage {
    _id: string;
    content: string;
    chat: {
      _id: string;
      chatName: string;
      isGroupChat: boolean;
      users: string[] | { _id: string; username: string; email: string }[];
      createdAt: string;
      updatedAt: string;
      __v: number;
      latestMessage?: string;
    };
    sender: {
      _id: string;
      username: string;
      email: string;
      avatar?: string;
    };
    readBy: string[] | { _id: string; username: string }[];
    createdAt: string;
    updatedAt: string;
    __v: number;
  }
  