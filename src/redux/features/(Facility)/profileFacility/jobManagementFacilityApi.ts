import { baseApi } from "../../../api/baseApi";

const jobManagementFacilityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllJobPost: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/job/facility?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["facility_profile"],
    }),
    getAllPendingJobRequests: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/job/all-pending-requests?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["facility_profile"],
    }),

    getSingleJobDetails: builder.query({
      query: ({ id }) => ({
        url: `/job/${id}`,
        method: "GET",
      }),
      providesTags: ["facility_profile"],
    }),

    createNewJobPost: builder.mutation({
      query: (data) => {
        return {
          url: `/job/create/`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["facility_profile"],
    }),
    getProviderProfile: builder.query({
      query: ({ id }) => ({
        url: `/user/get-profile`,
        method: "GET",
        params: { id },
      }),
      providesTags: ["facility_profile"],
    }),
    getProviderProfileById: builder.query({
      query: ({ id }) => ({
        url: `/user/get-profile-by-id/${id}`,
        method: "GET",
      }),
      providesTags: ["facility_profile"],
    }),
    jobAcceptOrDeclineApplication: builder.mutation({
      query: ({ id, data }) => {
        return {
          url: `/job/accept-or-decline-application/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["facility_profile"],
    }),
    jobAllJobsByDate: builder.query({
      query: ({ page = 1, limit = 10, date }) => ({
        url: `/job/all-approved-jobs-by-date/?page=${page}&limit=${limit}&date=${date}`,
        method: "GET",
      }),
      providesTags: ["facility_profile"],
    }),
    // New review submission endpoint
    submitReview: builder.mutation({
      query: (reviewData) => ({
        url: "/reviews",
        method: "POST",
        body: reviewData,
      }),
      // invalidatesTags: ["Reviews", "Jobs"],
    }),
    getProvidersByFacility: builder.query({
      query: ({
        page = 1,
        limit = 10,
        searchTerm,
        jobRoles,
        certificates,
        states,
        ratings,
        experience,
      }) => {
        // Build query parameters dynamically
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });

        // Add optional parameters only if they have values
        if (searchTerm) {
          params.append("searchTerm", searchTerm);
        }

        if (jobRoles) {
          params.append("jobRoles", jobRoles);
        }

        if (certificates) {
          params.append("certificates", certificates);
        }

        if (states) {
          params.append("states", states);
        }

        if (ratings) {
          params.append("ratings", ratings.toString());
        }

        if (experience) {
          params.append("experience", experience);
        }

        return {
          url: `/user/get-providers-by-facility?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["facility_profile"],
    }),
    getMyProfile: builder.query({
      query: () => ({
        url: `/user/get-profile/`,
        method: "GET",
        // params: { id },
      }),
      providesTags: ["facility_profile"],
    }),

    getSingleFacilityReview: builder.query({
      query: ({ id, page = 1, limit = 5 }) => ({
        url: `/reviews/received/${id}`,
        method: "GET",
        params: { page, limit },
      }),
      providesTags: ["facility_profile"],
    }),
    jobCompleteApplication: builder.mutation({
      query: ({ id, data }) => ({
        url: `/job/complete-application/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["facility_profile"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAllJobPostQuery,
  // useUpdateFacilityProfileMutation,
  useGetAllPendingJobRequestsQuery,
  useGetSingleJobDetailsQuery,
  useCreateNewJobPostMutation,
  useGetProviderProfileQuery,
  useGetProviderProfileByIdQuery,
  useJobAcceptOrDeclineApplicationMutation,
  useJobAllJobsByDateQuery,
  useSubmitReviewMutation,
  useGetProvidersByFacilityQuery,
  useGetMyProfileQuery,
  useGetSingleFacilityReviewQuery,
  useJobCompleteApplicationMutation,
} = jobManagementFacilityApi;
