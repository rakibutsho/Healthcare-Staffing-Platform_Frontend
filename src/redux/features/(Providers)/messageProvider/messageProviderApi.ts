import { baseApi } from "../../../api/baseApi";

const messageProviderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllMessageUserList: builder.query({
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
      providesTags: ["provider_message"],
    }),
    getMessageSingleUsr: builder.query({
      query: (id) => ({
        url: `example/${id}`,
        method: "GET",
      }),
      providesTags: ["provider_message"],
    }),

    createReplayMessage: builder.mutation({
      query: (data) => {
        return {
          url: "example",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["provider_message"],
    }),

    updateReplayMessage: builder.mutation({
      query: (data) => {
        return {
          url: `example/${data?.id}`,
          method: "POST",
          body: data?.formData,
        };
      },
      invalidatesTags: ["provider_message"],
    }),
  }),
});

export const {
  useGetAllMessageUserListQuery,
  useGetMessageSingleUsrQuery,
  useCreateReplayMessageMutation,
  useUpdateReplayMessageMutation
} = messageProviderApi;
