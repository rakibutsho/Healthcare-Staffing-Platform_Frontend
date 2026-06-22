import { baseApi } from "@/redux/api/baseApi";
import { UpcomingScheduleResponse } from "@/types/UpcommingSchedule";

export const providerScheduleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUpcomingProviderSchedule: builder.query<
      UpcomingScheduleResponse,
      {
        filter: "monthly" | "weekly";
        month?: number;
        year?: number;
        weekStart?: string;
        weekEnd?: string;
      }
    >({
      query: (params) => ({
        url: `/user/get-upcoming-schedule`,
        method: "GET",
        params,
      }),
      providesTags: ["Schedule"],
    }),

    getJobsByDate: builder.query<any, string>({
      query: (date) => ({
        url: `/job/all-jobs-by-date`,
        method: "GET",
        params: { date },
      }),
    }),
    getCompletedJobsByProvider: builder.query<
      any,
      { page?: number; limit?: number } | void
    >({
      query: (args) => {
        const page = args?.page ?? 1;
        const limit = args?.limit ?? 10;
        return {
          url: `/job/get-all-completed-jobs-by-provider?page=${page}&limit=${limit}`,
          method: "GET",
        };
      },
    }),
    getAllRequestedJobsByProvider: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/job/get-all-requested-jobs-by-provider`,
        method: "GET",
        params: { page, limit }, // if backend supports pagination
      }),
    }),
  }),
});

export const {
  useGetUpcomingProviderScheduleQuery,
  useGetJobsByDateQuery,
  useGetCompletedJobsByProviderQuery,
  useGetAllRequestedJobsByProviderQuery,
} = providerScheduleApi;
