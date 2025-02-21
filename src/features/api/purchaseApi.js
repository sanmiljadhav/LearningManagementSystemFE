import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_PURCAHSE_API = "http://localhost:8080/api/v1/purchase";

export const purchaseApi = createApi({
  reducerPath: "purchaseApi",
//   tagTypes:['Refetch_Creator_Course','Refetch_Lectures_for_a_particular_course'],
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_PURCAHSE_API,
    credentials: "include",
  }),

  endpoints: (builder) => ({
    getCourseDetailsWithPurchaseStatus: builder.query({
      query: (courseId) => ({
        url: `/course/${courseId}/detail-with-status`,
        method: "GET",
      }),
    }),

    getPurchasedCourses: builder.query({
        query: () => ({
          url: `/`,
          method: "GET",
        }),
      })

    
  }),
});

export const { useGetCourseDetailsWithPurchaseStatusQuery, useGetPurchasedCoursesQuery} = purchaseApi;
