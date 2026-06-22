"use client";

import { useEffect, useRef, useState } from "react";

type WebSocketEvent = "joinPrivateChat" | "sendPrivateMessage" | "joinApp";

export interface WebSocketMessage {
  type: WebSocketEvent;
  receiverId?: string;
  content?: string;
  user2Id?: string;
  conversationId?: string;
}

const useWebSocket = (baseUrl: string, authToken: string) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messageList, setMessageList] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // keep a queue of messages to send once connected
  const messageQueue = useRef<WebSocketMessage[]>([]);

  useEffect(() => {
    if (!authToken) return;

    const ws = new WebSocket(`${baseUrl}?token=${authToken}`);

    ws.onopen = () => {
      // console.log("✅ Connected to WebSocket");
      setIsConnected(true);

      // send joinApp immediately
      ws.send(JSON.stringify({ type: "joinApp" }));

      // flush queued messages
      messageQueue.current.forEach((msg) => {
        ws.send(JSON.stringify(msg));
      });
      messageQueue.current = [];
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // console.log("📩 WS EVENT:", data.event, data, data?.type);

      if (data?.type === "receivePrivateMessage") {
        setChatMessages(data);
      }

      if (data?.type === "conversationList") {
        setMessageList(data?.result?.conversations?.[0]);
      }
    };

    ws.onclose = () => setIsConnected(false);
    ws.onerror = () => setIsConnected(false);

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [baseUrl, authToken]);

  const sendMessage = (data: WebSocketMessage) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify(data));
    } else {
      messageQueue.current.push(data);
    }
  };

  const joinPrivateChat = (userId: string) => {
    sendMessage({ type: "joinPrivateChat", user2Id: userId });
    setLoading(true);
  };

  return {
    socket,
    messageList,
    chatMessages,
    loading,
    sendMessage,
    joinPrivateChat,
  };
};

export default useWebSocket;
