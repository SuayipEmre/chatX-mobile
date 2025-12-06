import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    console.log("🔌 Creating NEW socket instance");

    socket = io(process.env.EXPO_PUBLIC_API_URL!.replace("/api", ""), {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 10,
    });
  } else {
    console.log("♻️ Reusing EXISTING SOCKET instance");
  }

  return socket;
};
