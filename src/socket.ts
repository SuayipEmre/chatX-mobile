import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (userId: string) => {
  if (!socket) {
    socket = io(
      process.env.EXPO_PUBLIC_API_URL!.replace("/api", ""),
      {
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: 10,
        auth: { userId },
      }
    );
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket.removeAllListeners();
    socket = null;
  }
};
