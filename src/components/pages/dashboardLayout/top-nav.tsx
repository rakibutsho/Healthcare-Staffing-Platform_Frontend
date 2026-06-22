"use client";

import { Bell, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../../../assets/images/logo.png";
import { Button } from "@/components/ui/buttons/button/Button";
import { useAppSelector } from "@/redux/hooks";
import {
  useGetNotificationCountQuery,
  useGetNotificationsQuery,
} from "@/redux/features/notification/notificationApi";

interface TopProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (value: boolean) => void;
}

export default function TopNav({ isSidebarOpen, setIsSidebarOpen }: TopProps) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const user = useAppSelector((state) => state?.auth?.user);

  const userId = user?.id;

  console.log("user:", user);

  console.log("user id:", userId);

  const safeUserId = typeof userId === "string" ? userId : "";

  // ✅ Only count polling (lightweight)
  const { data: countData, refetch: refetchCount } =
    useGetNotificationCountQuery(safeUserId, {
      skip: !safeUserId,
      pollingInterval: 0,
      refetchOnFocus: false,
      refetchOnReconnect: false,
    });

  useEffect(() => {
    if (safeUserId) refetchCount();
  }, [safeUserId, refetchCount]);

  // ✅ Details only fetch when dropdown open
  const { data: notificationsData, refetch } = useGetNotificationsQuery(
    undefined,
    {
      skip: !userId || !isNotificationOpen,
      refetchOnFocus: false,
      refetchOnReconnect: false,
      pollingInterval: isNotificationOpen ? 15000 : 0, // optional
    },
  );

  useEffect(() => {
    if (isNotificationOpen && safeUserId) refetch();
  }, [isNotificationOpen, safeUserId, refetch]);

  const notifications = notificationsData?.result ?? [];
  const unreadCount = countData?.count ?? 0;

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 relative z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2"
          >
            <Menu className="w-5 h-5" />
          </Button>

          <Link href="/">
            <Image
              width={1000}
              height={1000}
              src={logo}
              alt="logo"
              className="w-37.5 object-contain"
            />
          </Link>

          <span className="hidden sm:block text-gray-600">
            Welcome, {user?.fullName?.split(" ")[0] ?? "User"}
          </span>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notification */}
          <div className="relative">
            <div
              className="w-10 h-10 border border-gray-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setIsNotificationOpen((p) => !p)}
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </div>

            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-10000 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  <button
                    className="text-sm text-gray-500 hover:text-gray-800"
                    onClick={() => refetch()}
                  >
                    Refresh
                  </button>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {notifications.length ? (
                    <ul className="divide-y divide-gray-100">
                      {notifications.map((n: any) => (
                        <li
                          key={n.id || n._id}
                          className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <h4 className="font-medium text-sm text-gray-900">
                            {n.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">{n.body}</p>
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(n.createdAt).toLocaleString()}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-6 text-center text-gray-500 text-sm">
                      No new notifications
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* your profile dropdown stays same */}
        </div>
      </div>
    </header>
  );
}
