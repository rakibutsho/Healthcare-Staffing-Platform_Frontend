import { baseApi } from "../../../api/baseApi";

const homeFacilityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFacilityProfile: builder.query({
      query: (id) => ({
        url: `example/${id}`,
        method: "GET",
      }),
      providesTags: ["facility_profile"],
    }),
    getAllPendingJobRequests: builder.query({
      query: (id) => ({
        url: `example/${id}`,
        method: "GET",
      }),
      providesTags: ["facility_profile"],
    }),
    updateFacilityProfile: builder.mutation({
      query: (data) => {
        return {
          url: `example/${data?.id}`,
          method: "POST",
          body: data?.formData,
        };
      },
      invalidatesTags: ["facility_profile"],
    }),
  }),
});

export const { useGetFacilityProfileQuery, useUpdateFacilityProfileMutation } =
  homeFacilityApi;
