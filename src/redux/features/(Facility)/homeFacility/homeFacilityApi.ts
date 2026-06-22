import { baseApi } from "../../../api/baseApi";

const homeFacilityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllJobPost: builder.query({
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
      providesTags: ["schedule_facility"],
    }),
    getHomeCount: builder.query({
      query: (id) => ({
        url: `example/${id}`,
        method: "GET",
      }),
      providesTags: ["schedule_facility"],
    }),

    createJobPost: builder.mutation({
      query: (data) => {
        return {
          url: "example",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["schedule_facility"],
    }),
  }),
});

export const {
  useGetAllJobPostQuery,
  useGetHomeCountQuery,
  useCreateJobPostMutation

} = homeFacilityApi;
