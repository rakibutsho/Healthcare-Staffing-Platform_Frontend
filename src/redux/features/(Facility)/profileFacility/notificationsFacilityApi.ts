import { baseApi } from "../../../api/baseApi";

const notificationsFacilityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: (id) => ({
        url: `example/${id}`,
        method: "GET",
      }),
      providesTags: ["notifications"],
    }),
    updateNotifications: builder.mutation({
      query: (data) => {
        return {
          url: `example/${data?.id}`,
          method: "POST",
          body: data?.formData,
        };
      },
      invalidatesTags: ["notifications"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useUpdateNotificationsMutation
} = notificationsFacilityApi;
