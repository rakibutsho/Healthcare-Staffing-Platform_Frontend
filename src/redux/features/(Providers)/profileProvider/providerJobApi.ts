import { baseApi } from "@/redux/api/baseApi";

export const providerJobApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSearchJobs: builder.query({
      query: ({ searchTerm, page = 1, limit = 10 }) => ({
        url: "/job/search-jobs",
        method: "GET",
        params: { searchTerm, page, limit },
      }),
    }),
    getJobById: builder.query({
      query: (id) => ({
        url: `/job/${id}`,
        method: "GET",
      }),
    }),
    applyJob: builder.mutation({
      query: (body) => ({
        url: "/job/apply",
        method: "POST",
        body,
      }),
    }),
    getAllAppliedJobsByProvider: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: "/job/get-all-applied-jobs-by-provider",
        method: "GET",
        params: { page, limit },
      }),
    }),
    cancelJobRequestFromProvider: builder.mutation({
      query: (body) => ({
        url: "/job/cancel-request-from-provider",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetSearchJobsQuery,
  useGetJobByIdQuery,
  useApplyJobMutation,
  useGetAllAppliedJobsByProviderQuery,
  useCancelJobRequestFromProviderMutation,
} = providerJobApi;
