import { id } from "zod/v4/locales";
import { baseApi } from "../../../api/baseApi";

const homeProvidersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyJobPost: builder.query({
      query: (data) => {
        const params = new URLSearchParams();
        if (data?.queryObj) {
          data?.queryObj.forEach((item: any) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: `example`,
          method: "GET",
          params: params,
        };
      },
      providesTags: ["providers_home"],
    }),
    getMyJobPostDetails: builder.query({
      query: ({ id }: { id: string }) => {
        return {
          url: `example/${id}`,
          method: "GET",
        };
      },
      providesTags: ["providers_home"],
    }),

    createJobPostApply: builder.mutation({
      query: (data) => {
        return {
          url: "example",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["providers_home"],
    }),
    savedJobPost: builder.mutation({
      query: (id: string) => ({
        url: `/job/save-job/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["providers_home"],
    }),
    removeSavedJobPost: builder.mutation({
      query: (id: string) => ({
        url: `/job/remove-saved-job/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["providers_home"],
    }),
  }),
});

export const {
  useGetMyJobPostQuery,
  useGetMyJobPostDetailsQuery,
  useCreateJobPostApplyMutation,
  useSavedJobPostMutation,
  useRemoveSavedJobPostMutation,
} = homeProvidersApi;
