import { proxyApi } from "@/redux/api/proxyApi";

export const notificationApi = proxyApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<any, void>({
      query: () => ({
        url: "/api/notifications",
        method: "GET",
      }),
      providesTags: ["Notifications"],
    }),

    // ✅ accept string, but we will guard at runtime too
    getNotificationCount: builder.query<{ count: number }, string>({
      query: (id) => ({
        url: `/api/notifications/count/${encodeURIComponent(id)}`,
        method: "GET",
      }),
      providesTags: ["NotificationCount"],
    }),
  }),
});

export const { useGetNotificationsQuery, useGetNotificationCountQuery } =
  notificationApi;
