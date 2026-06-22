import { baseApi } from "../../../api/baseApi";

const promotionsManagementFacilityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPromotionsHistory: builder.query({
      query: () => ({
        url: `/promotion/get-promotion-facility?status=history`,
        method: "GET",
      }),
      providesTags: ["promotions_management"],
    }),

    getPromotionsRunning: builder.query({
      query: (id) => ({
        url: `/promotion/get-promotion-facility?status=running`,
        method: "GET",
      }),
      providesTags: ["promotions_management"],
    }),
    createPromotionsRunning: builder.mutation({
      query: (data) => {
        return {
          url: `/promotion/create`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["promotions_management"],
    }),
    updatePromotionsRunning: builder.mutation({
      query: (data) => {
        return {
          url: `example/${data?.id}`,
          method: "POST",
          body: data?.formData,
        };
      },
      invalidatesTags: ["promotions_management"],
    }),

    getSinglePromotions: builder.query({
      query: (id) => ({
        url: `/promotion/get-single-promotion/${id}`,
        method: "GET",
      }),
      providesTags: ["promotions_management"],
    }),

    rePromition: builder.mutation({
      query: ({ id, data }) => {
        return {
          url: `/promotion/get-single-promotion/${id}`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["promotions_management"],
    }),
  }),
});

export const {
  useGetPromotionsRunningQuery,
  useRePromitionMutation,
  useGetPromotionsHistoryQuery,
  useCreatePromotionsRunningMutation,
  useUpdatePromotionsRunningMutation,
  useGetSinglePromotionsQuery,
} = promotionsManagementFacilityApi;
