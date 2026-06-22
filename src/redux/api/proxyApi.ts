import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const proxyApi = createApi({
  reducerPath: "proxyApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "", // ✅ same-origin (frontend domain)
    credentials: "include", // ✅ send cookie "token" to Next routes
  }),

  // ✅ calm defaults so Topbar doesn't refetch constantly
  refetchOnMountOrArgChange: false,
  refetchOnFocus: false,
  refetchOnReconnect: false,
  keepUnusedDataFor: 60,

  tagTypes: ["Notifications", "NotificationCount"],
  endpoints: () => ({}),
});
