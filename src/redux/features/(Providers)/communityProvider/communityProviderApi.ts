import { baseApi } from "../../../api/baseApi";

const communityProviderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /community/get-all-post
    getAllPosts: builder.query({
      query: (params) => ({
        url: "/community/get-all-post",
        method: "GET",
        params,
      }),
      providesTags: ["AllPosts"],
    }),
    // GET /community/get-user-post
    getUserPosts: builder.query({
      query: () => ({
        url: "/community/get-user-post",
        method: "GET",
      }),
      providesTags: ["UserPosts"],
    }),
    // POST /community/create-post
    createPost: builder.mutation({
      query: (formData) => ({
        url: "/community/create-post",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["UserPosts", "AllPosts"],
    }),

    // PATCH /community/update-single-post/:postId
    updateMyPost: builder.mutation({
      query: ({ postId, formData }) => ({
        url: `/community/update-single-post/${postId}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["UserPosts", "AllPosts"],
    }),
    // POST /community/post-comment
    postComment: builder.mutation({
      query: (body) => ({
        url: "/community/post-comment",
        method: "POST",
        body,
      }),
      invalidatesTags: ["UserPosts", "AllPosts"],
    }),
    // POST /community/post-like
    postLike: builder.mutation({
      query: (body) => ({
        url: "/community/post-like",
        method: "POST",
        body,
      }),
      invalidatesTags: ["UserPosts", "AllPosts"],
    }),
    deletePost: builder.mutation({
      query: (postId) => ({
        url: `/community/delete-single-post/${postId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["UserPosts", "AllPosts"],
    }),
  }),
});

export const {
  useGetAllPostsQuery,
  useGetUserPostsQuery,
  useCreatePostMutation,
  usePostCommentMutation,
  usePostLikeMutation,
  useUpdateMyPostMutation,
  useDeletePostMutation,
} = communityProviderApi;
