import { baseApi } from "../../../api/baseApi";

const scheduleFacilityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getScheduleProviders: builder.query({
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
      providesTags: ["schedule_facility"],
    }),
    getSingleProvider: builder.query({
      query: (id) => ({
        url: `example/${id}`,
        method: "GET",
      }),
      providesTags: ["schedule_facility"],
    }),

    createReview: builder.mutation({
      query: (data) => {
        return {
          url: "example",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["schedule_facility"],
    }),

    // updateReplayMessage: builder.mutation({
    //   query: (data) => {
    //     return {
    //       url: `example/${data?.id}`,
    //       method: "POST",
    //       body: data?.formData,
    //     };
    //   },
    //   invalidatesTags: ["chat"],
    // }),
  }),
});

export const {
  useGetScheduleProvidersQuery,
  useGetSingleProviderQuery, 
  useCreateReviewMutation

} = scheduleFacilityApi;
