import { baseApi } from "../../../api/baseApi";

const myAvailabilityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyAvailabilityTime: builder.query({
      query: (id: string) => ({
        url: `example/${id}`,
        method: "GET",
      }),
      providesTags: ["provider_my_availability"],
    }),
    updateMyAvailabilityTime: builder.mutation({
      query: (data) => {
        return {
          url: `example/${data?.id}`,
          method: "POST",
          body: data?.formData,
        };
      },
      invalidatesTags: ["provider_my_availability"],
    }),
    createMyAvailabilityTime: builder.mutation({
      query: (data) => {
        return {
          url: `example`,
          method: "POST",
          body: data?.formData,
        };
      },
      invalidatesTags: ["provider_my_availability"],
    }),
  }),
});

export const {
  useGetMyAvailabilityTimeQuery,
  useCreateMyAvailabilityTimeMutation,
  useUpdateMyAvailabilityTimeMutation
} = myAvailabilityApi;
