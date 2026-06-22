import { baseApi } from "../../../api/baseApi";

const managePlanFacilityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getManagePlan: builder.query({
      query: (id) => ({
        url: `example/${id}`,
        method: "GET",
      }),
      providesTags: ["manage_plan"],
    }),
    updateManagePlan: builder.mutation({
      query: (data) => {
        return {
          url: `example/${data?.id}`,
          method: "POST",
          body: data?.formData,
        };
      },
      invalidatesTags: ["manage_plan"],
    }),
  }),
});

export const {
  useGetManagePlanQuery,
  useUpdateManagePlanMutation
} = managePlanFacilityApi;
