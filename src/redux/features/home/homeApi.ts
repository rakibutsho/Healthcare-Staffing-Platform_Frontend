import { baseApi } from "@/redux/api/baseApi";

export const homeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReviews: builder.query({
      query: () => ({
        url: "/reviews/web",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetReviewsQuery } = homeApi;
