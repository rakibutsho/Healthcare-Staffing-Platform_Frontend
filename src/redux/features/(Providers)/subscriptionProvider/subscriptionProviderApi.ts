import { baseApi } from "@/redux/api/baseApi";

export const providerSubscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProviderSubscriptionPlan: builder.query({
      query: () => ({
        url: "/subscription/get-subscription",
        method: "GET",
      }),
      providesTags: ["Subscription"],
    }),
    confirmPayment: builder.mutation({
      query: (body) => ({
        url: "/subscription/purchase-subscription",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Subscription"],
    }),
    // createPaymentMethodId: builder.mutation({
    //   query: (body) => ({
    //     url: "https://api.stripe.com//v1/payment_methods",
    //     method: "POST",
    //     body,
    //   }),
    // }),
    cancelSubscription: builder.mutation({
      query: (subscriptionId: string) => ({
        url: `/subscription/cancel-subscription/${subscriptionId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Subscription"],
    }),
  }),
});

export const {
  useGetProviderSubscriptionPlanQuery,
  useConfirmPaymentMutation,
  // useCreatePaymentMethodIdMutation,
  useCancelSubscriptionMutation,
} = providerSubscriptionApi;
