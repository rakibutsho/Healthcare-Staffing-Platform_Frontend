import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { signOut } from "next-auth/react";
import Swal from "sweetalert2";
import { logout, setUser } from "../features/auth/authSlice";
import { RootState } from "../store";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  credentials: "include", // send cookies
  prepareHeaders: (headers, { getState }) => {
    const access_token = (getState() as RootState).auth.access_token;
    headers.set("accept", "application/json");
    if (access_token) {
      headers.set("authorization", `Bearer ${access_token}`);
    }
    return headers;
  },
});

const baseQueryWithRefreshToken: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // If access token is invalid/expired
  if (result.error?.status === 401) {
    try {
      const refreshToken = (api.getState() as RootState).auth.refresh_token;

      const refreshResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}refresh-token`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${refreshToken}`,
          },
        },
      );

      const data = await refreshResponse.json();

      if (data?.success && data?.data?.token) {
        const currentState = api.getState() as RootState;
        const user = currentState.auth.user;

        // Update store with new access token
        api.dispatch(
          setUser({
            user,
            access_token: data.data.token,
            refresh_token: refreshToken,
          }),
        );

        // Retry original query with new token
        result = await baseQuery(args, api, extraOptions);
      } else {
        // If refresh token also fails
        Swal.fire({
          icon: "error",
          title: "Session Expired",
          text: "Please login again to continue.",
          showConfirmButton: false,
          showCancelButton: true,
          cancelButtonText: "Stay Logged Out",
        }).then(() => {
          api.dispatch(logout());
          signOut();
        });
      }
    } catch (error) {
      console.error("Token refresh error:", error);
      api.dispatch(logout());
      signOut();
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: [
    "user",
    "example",
    "chat",
    "schedule_facility",
    "providers",
    "facility_profile",
    "hr_details",
    "reviews_facility",
    "promotions_management",
    "manage_plan",
    "notifications",
    "Schedule",
    "providers_home",
    "providers_schedule",
    "providers_community",
    "provider_message",
    "provider_profile",
    "provider_my_availability",
    "provider_reviews",
    "AllPosts",
    "UserPosts",
    "Schedule",
    "Subscription",
    "Notifications",
  ],
  refetchOnMountOrArgChange: true, // ✅ global
  refetchOnFocus: true, // ✅ global
  refetchOnReconnect: true, // ✅ global
  keepUnusedDataFor: 0, // ✅ global (no stale cache)
  endpoints: () => ({}),
});
