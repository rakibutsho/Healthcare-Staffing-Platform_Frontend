import { baseApi } from "../../../api/baseApi";

const providersReviewsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProvidersReview: builder.query({
      query: (id: string) => ({
        url: `example/${id}`,
        method: "GET",
      }),
      providesTags: ["provider_reviews"],
    })
  }),
});

export const {
  useGetProvidersReviewQuery
} = providersReviewsApi;
