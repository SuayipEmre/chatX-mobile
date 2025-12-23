// src/providers/SocketProvider.tsx
import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
  } from "react";
  import { Socket } from "socket.io-client";
  import { getSocket } from "../socket";
  import { useUserSession } from "../store/feature/user/hooks";
  
  type SocketContextType = {
    socket: Socket | null;
    onlineUsers: Set<string>;
  };
  
  const SocketContext = createContext<SocketContextType | null>(null);
  
  export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => {
    const userSession = useUserSession();
    const userId = userSession?.user?._id;
  
    const socketRef = useRef<Socket | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  
    useEffect(() => {
      if (!userId) return;
  
      const socket = getSocket(userId);
      socketRef.current = socket;
  
      // 🔵 ONLINE
      socket.on("user_online", (onlineUserId: string) => {
        setOnlineUsers(prev => new Set(prev).add(onlineUserId));
      });
  
      // 🔴 OFFLINE
      socket.on(
        "user_offline",
        ({ userId: offlineUserId }: { userId: string }) => {
          setOnlineUsers(prev => {
            const next = new Set(prev);
            next.delete(offlineUserId);
            return next;
          });
        }
      );
  
      return () => {
        socket.off("user_online");
        socket.off("user_offline");
      };
    }, [userId]);
  
    return (
      <SocketContext.Provider
        value={{
          socket: socketRef.current,
          onlineUsers,
        }}
      >
        {children}
      </SocketContext.Provider>
    );
  };
  
  export const useSocketPresence = () => {
    const ctx = useContext(SocketContext);
    if (!ctx) {
      throw new Error(
        "useSocketPresence must be used inside SocketProvider"
      );
    }
    return ctx;
  };
  