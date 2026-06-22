import { baseApi } from "../../../api/baseApi";

const profileProviderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get provider profile
    getProviderProfile: builder.query({
      query: () => ({
        url: `/user/get-profile`,
        method: "GET",
      }),
      providesTags: ["provider_profile"], // mark query with this tag
    }),

    // ✅ Update profile
    updateProviderProfile: builder.mutation<
      any,
      { bodyData: any; document?: File; profileImage?: File }
    >({
      query: ({ bodyData, document, profileImage }) => {
        const formData = new FormData();

        formData.append("bodyData", JSON.stringify(bodyData));

        if (document) {
          formData.append("document", document);
        }
        if (profileImage) {
          formData.append("profileImage", profileImage);
        }

        return {
          url: "/user/update-provider-profile",
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: ["provider_profile"], // auto refetch
    }),

    // ✅ Update provider document
    updateProviderDocument: builder.mutation({
      query: (formData) => ({
        url: "/user/update-provider-document",
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["provider_profile"], // auto refetch
    }),

    // ✅ Select uploaded resume
    selectUploadedResume: builder.mutation({
      query: (body) => ({
        url: "/user/select-uploaded-resume",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["provider_profile"], // auto refetch
    }),

    // ✅ Delete document
    deleteDocument: builder.mutation({
      query: (body) => ({
        url: "/user/delete-document",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["provider_profile"], // auto refetch
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetProviderProfileQuery,
  useUpdateProviderProfileMutation,
  useDeleteDocumentMutation,
  useSelectUploadedResumeMutation,
  useUpdateProviderDocumentMutation,
} = profileProviderApi;
