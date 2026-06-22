import { baseApi } from "@/redux/api/baseApi";

export const contactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    contactMessageSend: builder.mutation({
      query: (contactData) => ({
        url: "/contact/create",
        method: "POST",
        body: contactData,
      }),
    }),
  }),
});

export const { useContactMessageSendMutation } = contactApi;
