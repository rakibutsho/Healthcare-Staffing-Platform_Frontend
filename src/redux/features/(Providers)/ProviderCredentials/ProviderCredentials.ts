import { baseApi } from "@/redux/api/baseApi";

export const providerCredentials = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addBLSCredential: builder.mutation({
      query: (data) => ({
        url: "/user/update-provider-BLS",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["provider_profile"],
    }),
    addACLSCredential: builder.mutation({
      query: (data) => ({
        url: "/user/update-provider-ACLS",
        method: "PATCH",
        body: data,
      }),
    }),
    addPALSCredential: builder.mutation({
      query: (data) => ({
        url: "/user/update-provider-PALS",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["provider_profile"],
    }),
    addDIPLOMACredential: builder.mutation({
      query: (data) => ({
        url: "/user/update-provider-DIPLOMA",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["provider_profile"],
    }),
    addLICENCECredential: builder.mutation({
      query: (data) => ({
        url: "/user/update-provider-LICENCE",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["provider_profile"],
    }),
    deleteBLSDocument: builder.mutation({
      query: (data) => ({
        url: "/user/delete-provider-BLS",
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["provider_profile"],
    }),
    deleteACLSDocument: builder.mutation({
      query: (data) => ({
        url: "/user/delete-provider-ACLS",
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["provider_profile"],
    }),
    deletePALSDocument: builder.mutation({
      query: (data) => ({
        url: "/user/delete-provider-PALS",
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["provider_profile"],
    }),
    deleteDIPLOMADocument: builder.mutation({
      query: (data) => ({
        url: "/user/delete-provider-DIPLOMA",
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["provider_profile"],
    }),
    deleteLICENCEDocument: builder.mutation({
      query: (data) => ({
        url: "/user/delete-provider-LICENCE",
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["provider_profile"],
    }),
  }),
});

export const {
  useAddBLSCredentialMutation,
  useAddACLSCredentialMutation,
  useAddPALSCredentialMutation,
  useAddDIPLOMACredentialMutation,
  useAddLICENCECredentialMutation,
  useDeleteBLSDocumentMutation,
  useDeleteACLSDocumentMutation,
  useDeletePALSDocumentMutation,
  useDeleteDIPLOMADocumentMutation,
  useDeleteLICENCEDocumentMutation,
} = providerCredentials;
