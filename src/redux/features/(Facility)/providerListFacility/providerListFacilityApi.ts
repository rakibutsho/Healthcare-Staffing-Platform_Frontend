import { baseApi } from "../../../api/baseApi";

const providerListFacilityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProviders: builder.query({
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
      providesTags: ["providers"],
    }),
    getSingleProvider: builder.query({
      query: (id) => ({
        url: `example/${id}`,
        method: "GET",
      }),
      providesTags: ["providers"],
    }),

    // createReplayMessage: builder.mutation({
    //   query: (data) => {
    //     return {
    //       url: "example",
    //       method: "POST",
    //       body: data,
    //     };
    //   },
    //   invalidatesTags: ["chat"],
    // }),

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
  useGetAllProvidersQuery,
  useGetSingleProviderQuery
} = providerListFacilityApi;
