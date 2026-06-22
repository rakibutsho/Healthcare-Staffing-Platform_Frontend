"use client";
import {
  useGetNotificationCountQuery,
  useGetNotificationsQuery,
} from "@/redux/features/notification/notificationApi";
import { useAppSelector } from "@/redux/hooks";
import { Bell, X } from "lucide-react";
import { useState } from "react";

export default function NotificationDetails() {
  const [isOpen, setIsOpen] = useState(false);
  const user = useAppSelector((state) => state.auth.user);
  const userId = user?._id || user?.id;

  const { data: notificationsData } = useGetNotificationsQuery(undefined, {
    skip: !userId,
  });
  const { data: countData } = useGetNotificationCountQuery(userId, {
    skip: !userId,
  });

  const notifications = notificationsData?.result ?? [];
  const unreadCount = countData?.count ?? 0;

  return (
    <div>
      {/* Notification Bell */}
      <button
        type="button"
        className="relative p-1.5 sm:p-2 hover:bg-gray-200 border-2 border-gray-200 rounded-full transition-colors"
        onClick={() => setIsOpen(true)}
      >
        <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 text-xs flex items-center justify-center bg-red-500 text-white rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Drawer */}
      {isOpen && (
        <>
          <div className="fixed top-0 right-0 w-80 h-full bg-white shadow-xl transition-transform duration-300 transform z-[100000]">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Notifications</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-600"
              >
                <X />
              </button>
            </div>
            <div className="p-4 max-h-[calc(100%-60px)] overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((n: any) => (
                  <div
                    key={n.id}
                    className="p-2 hover:bg-gray-100 rounded cursor-pointer"
                  >
                    {n.title?.startsWith("http") ? (
                      <img
                        src={n.title}
                        alt="Notification"
                        className="w-16 h-16 object-cover rounded mb-2"
                      />
                    ) : (
                      <p className="font-medium text-sm">{n.title}</p>
                    )}
                    <p className="text-gray-600 text-sm">{n.body}</p>
                    <p className="text-gray-400 text-xs mt-1">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No notifications found
                </p>
              )}
            </div>
          </div>

          {/* Lighter backdrop */}
          <div
            className="fixed inset-0 bg-transparent duration-300 z-[99999]"
            onClick={() => setIsOpen(false)}
          />
        </>
      )}
    </div>
  );
}
