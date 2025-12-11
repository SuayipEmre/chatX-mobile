import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (userId: string) => {
  if (!socket) {
    console.log("🔌 Creating NEW socket with userId:", userId);

    socket = io(
      process.env.EXPO_PUBLIC_API_URL!.replace("/api", ""),
      {
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: 10,

        auth: {
          userId,
        },
      }
    );
  }

  return socket;
};
