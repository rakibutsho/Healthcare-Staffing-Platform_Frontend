import { baseApi } from "../../api/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (userInfo) => {
        return {
          url: "auth/login",
          method: "POST",
          body: userInfo,
        };
      },
      invalidatesTags: ["user"],
    }),
    forgotPassword: builder.mutation({
      query: (userInfo) => {
        console.log({ userInfo });
        return {
          url: "auth/forgetpassword-otp-to-gmail",
          method: "POST",
          body: userInfo,
        };
      },
      invalidatesTags: ["user"],
    }),
    resetPassword: builder.mutation({
      query: (userInfo) => {
        console.log({ userInfo });
        return {
          url: "auth/reset-password",
          method: "PATCH",
          body: userInfo,
        };
      },
      invalidatesTags: ["user"],
    }),
    updateUser: builder.mutation({
      query: (userInfo) => {
        return {
          url: "user/me",
          method: "PATCH",
          body: userInfo,
        };
      },
      invalidatesTags: ["user"],
    }),
    register: builder.mutation({
      query: (userInfo) => {
        return {
          url: "user/create",
          method: "POST",
          body: userInfo,
        };
      },
    }),
    otp: builder.mutation({
      query: ({ reason, otp }) => {
        return {
          url: "auth/verfiy-otp",
          method: "POST",
          body: { reason, otp },
        };
      },
    }),
    resendOtp: builder.mutation({
      query: (userInfo) => {
        return {
          url: "auth/resend-otp",
          method: "POST",
          body: userInfo,
        };
      },
      invalidatesTags: ["user"],
    }),
    getMe: builder.query({
      query: () => ({
        url: "user/me",
        method: "GET",
      }),
      providesTags: ["user"],
    }),
    createFacilityProfile: builder.mutation({
      query: (data) => {
        return {
          url: `/user/create-facility-profile`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["facility_profile"],
    }),
  }),
});

export const {
  useLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useRegisterMutation,
  useUpdateUserMutation,
  useOtpMutation,
  useResendOtpMutation,
  useGetMeQuery,
  useCreateFacilityProfileMutation,
} = authApi;
