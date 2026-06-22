/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Spinner from "@/components/common/Spinner";
import useWebSocket, { WebSocketMessage } from "@/hook/useWebSocket";
import { useGetProviderProfileByIdQuery } from "@/redux/features/(Facility)/profileFacility/jobManagementFacilityApi";
import { selectCurrentToken } from "@/redux/features/auth/authSlice";
import {
  useChatListQuery,
  useMessageListQuery,
} from "@/redux/features/message/message.api";
import { useAppSelector } from "@/redux/hooks";
import { format } from "date-fns";
import { CircleUser, Send } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

export default function CommonMessage() {
  const authToken: any = useAppSelector(selectCurrentToken);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userList, setUserList] = useState<any[]>([]);
  const [chatList, setChatList] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userId = useSearchParams().get("user");
  const { data: userData } = useGetProviderProfileByIdQuery(
    { id: userId },
    { skip: !userId },
  );

  const { data, isLoading } = useMessageListQuery(undefined);
  const { data: messages, isLoading: loginMessages } = useChatListQuery(
    { id: selectedUser?.conversationId },
    { skip: !selectedUser?.conversationId },
  );

  const { sendMessage, chatMessages, messageList, joinPrivateChat } =
    useWebSocket("wss://api.anesthelink.com", authToken);

  const currentUserId = useAppSelector((state) => state.auth?.user?.id);

  // Auto join when userId from query
  useEffect(() => {
    if (userData?.result) {
      console.log("selected id", userData?.result?.id);
      joinPrivateChat(userData?.result?.id);
      setSelectedUserId(userData?.result?.id);
      setSelectedUser({
        participants: {
          username: userData?.result?.fullName,
          image: "",
          userId: userData?.result?.id,
        },
      });
    }
  }, [userData]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [chatList]);

  const handleUserSelect = (userId: string, user: any) => {
    setSelectedUserId(userId);
    setSelectedUser(user);
    joinPrivateChat(userId);
    // if (user?.conversationId) {
    //   refetch();
    // }
  };

  const { register, handleSubmit, reset } = useForm<{ message: string }>({
    defaultValues: { message: "" },
  });

  const onSubmit = (data: { message: string }) => {
    if (!selectedUserId || !data.message.trim()) return;
    const messageData: WebSocketMessage = {
      type: "sendPrivateMessage",
      receiverId: selectedUserId,
      content: data.message,
    };

    const optimisticMsg = {
      id: Date.now().toString(),
      senderId: currentUserId,
      content: data.message,
      createdAt: new Date().toISOString(),
      conversationId: selectedUser?.conversationId,
      optimistic: true,
    };

    setChatList((prev) => [optimisticMsg, ...prev]);

    sendMessage(messageData);
    // console.log("msg==>", messageData);

    if (userId) {
      setTimeout(() => {
        window.location.href = "/facility/messages";
      }, 1000);
    }

    reset();
  };

  // ==== arrange conversation list ===
  useEffect(() => {
    if (data?.result) {
      setUserList(data.result);
    }
  }, [data]);

  useEffect(() => {
    if (!messageList?.conversationId) return;
    if (selectedUser?.conversationId === messageList.conversationId) return;

    setUserList((prev) => {
      const filtered = prev.filter(
        (u) => u.conversationId !== messageList.conversationId,
      );
      return [messageList, ...filtered];
    });
  }, [messageList]);

  // ==== arrange message list ===
  useEffect(() => {
    if (messages?.result) {
      setChatList(messages?.result);
    }
  }, [messages]);

  useEffect(() => {
    if (!selectedUser?.conversationId || !chatMessages) return;

    if (chatMessages.conversationId === selectedUser.conversationId) {
      setChatList((prev) => {
        const exists = prev.some((m) => m?.id === chatMessages.id);
        if (exists) return prev;

        const filtered = prev.filter(
          (m) =>
            !(
              m.optimistic &&
              m.content === chatMessages.content &&
              m.senderId === chatMessages.senderId
            ),
        );

        return [...filtered, chatMessages];
      });
    }
  }, [chatMessages, selectedUser]);

  return (
    <div className={`flex h-[90vh] bg-secondary`}>
      {/* Left Sidebar */}
      <div className="w-80 border-r flex flex-col bg-white">
        <div className="p-[14px] border-b">
          <h1 className="text-xl font-semibold">Chats</h1>
        </div>

        <div className="overflow-auto flex-1">
          {isLoading ? (
            <Spinner />
          ) : (
            userList?.map((chat: any) => (
              <button
                key={chat?.conversationId}
                className={`flex items-center gap-3 p-4 hover:bg-gray-200 cursor-pointer w-full text-left ${
                  selectedUserId === chat?.participants?.userId
                    ? "bg-gray-200"
                    : ""
                }`}
                onClick={() =>
                  handleUserSelect(chat?.participants?.userId, chat)
                }
              >
                {chat?.participants?.image ? (
                  <Image
                    src={
                      chat?.participants?.image?.trim() &&
                      chat.participants.image.trim() !== ""
                        ? chat.participants.image.trim()
                        : "/default-avatar.png"
                    }
                    alt={
                      chat?.name ||
                      chat?.participants?.username ||
                      "User avatar"
                    }
                    width={50}
                    height={50}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <CircleUser className="text-3xl w-10 h-10" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <span className="font-medium">
                      {chat?.participants?.username}
                    </span>
                    {chat?.lastMessageTime && (
                      <span className="text-xs text-gray-500">
                        {format(new Date(chat?.lastMessageTime), "HH:mm")}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-start truncate">
                    {chat?.lastMessage}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="flex justify-between items-center gap-3 p-3 border-b">
              <div className="flex items-center gap-4">
                {selectedUser?.participants?.image ? (
                  <Image
                    src={
                      selectedUser?.participants?.image?.trim() &&
                      selectedUser.participants.image.trim() !== ""
                        ? selectedUser.participants.image.trim()
                        : "/default-avatar.png"
                    }
                    alt={
                      selectedUser?.participants?.username ||
                      "Selected user avatar"
                    }
                    width={50}
                    height={50}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <CircleUser className="text-3xl w-8 h-8" />
                )}
                <div className="flex-1">
                  <h2 className="font-semibold">
                    {selectedUser?.participants?.username}
                  </h2>
                </div>
              </div>
              {/* <Link
                href={`/call?id=${selectedUser?.conversationId}`}
                className="md:mx-8 mx-2 "
              >
                <div className="text-[#00786f] p-2 border-2 border-[#00786f] rounded-full">
                  <Phone />
                </div>
              </Link> */}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-auto p-4 space-y-4">
              {loginMessages ? (
                <div className="flex justify-center items-center h-full">
                  <Spinner />
                </div>
              ) : chatList?.filter((msg: any) => msg)?.length === 0 ? (
                <div className="flex justify-center items-center h-full text-gray-500">
                  <p>No messages yet. Start a conversation!</p>
                </div>
              ) : (
                chatList?.map((msg: any) => (
                  <div
                    key={msg?.id}
                    className={`flex ${
                      msg?.senderId === currentUserId
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        msg?.senderId === currentUserId
                          ? "bg-[#00786f] text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      <p>{msg?.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg?.senderId === currentUserId
                            ? "text-green-100"
                            : "text-gray-500"
                        }`}
                      >
                        {format(new Date(msg?.createdAt), "HH:mm")}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex gap-2 w-full"
              >
                <input
                  {...register("message")}
                  placeholder="Type a message..."
                  className="w-full border rounded-lg px-3 py-2"
                />
                <button
                  type="submit"
                  className="bg-[#00786f] hover:bg-green-700 p-3 rounded-lg text-white"
                >
                  <Send className="h-6 w-6" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <CircleUser className="mx-auto h-16 w-16 mb-4" />
              <h3 className="text-xl font-medium mb-2">
                Select a conversation
              </h3>
              <p>Choose a contact from the left to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
