import { baseApi } from "@/redux/api/baseApi";
import { TQueryParams } from "@/types/global.type";

const communityProviderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    messageList: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item: TQueryParams) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: "/chat/convarstion-list",
          method: "GET",
          params: params,
        };
      },
      providesTags: ["Notifications"],
    }),

    chatList: builder.query({
      query: ({ id, args }) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item: TQueryParams) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: `/chat/get-single-message/${id}`,
          method: "GET",
          params: params,
        };
      },
      providesTags: ["Notifications"],
    }),
  }),
});

export const { useMessageListQuery, useChatListQuery } = communityProviderApi;
