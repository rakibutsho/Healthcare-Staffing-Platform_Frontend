import { baseApi } from "../../../api/baseApi";

const hrDetailsFacilityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFacilityProfile: builder.query({
      query: (id) => ({
        url: `/user/get-profile`,
        method: "GET",
      }),
      providesTags: ["hr_details"],
    }),
    updateFacilityProfile: builder.mutation({
      query: (data) => {
        return {
          url: `/user/update-facility-profile`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["hr_details"],
    }),
    updateFacilityHrProfile: builder.mutation({
      query: (data) => {
        return {
          url: `/user/update-facility-profile`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["hr_details"],
    }),
  }),
});

export const {
  useGetFacilityProfileQuery,
  useUpdateFacilityProfileMutation,
  useUpdateFacilityHrProfileMutation,
} = hrDetailsFacilityApi;
