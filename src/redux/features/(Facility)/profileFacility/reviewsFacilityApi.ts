import { baseApi } from "../../../api/baseApi";

const reviewsFacilityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFacilityReviews: builder.query({
      query: (id) => ({
        url: `example/${id}`,
        method: "GET",
      }),
      providesTags: ["reviews_facility"],
    }),
  }),
});

export const {
  useGetFacilityReviewsQuery
} = reviewsFacilityApi;
