import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { useDispatch } from "react-redux";
import { userLoggedIn, userLoggedOut } from "../authSlice";

const USER_API = "http://localhost:8080/api/v1/user/";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: USER_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (inputData) => ({
        url: "register",
        method: "POST",
        body: inputData,
      }),
    }),

    loginUser: builder.mutation({
      query: (inputData) => ({
        url: "login",
        method: "POST",
        body: inputData,
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(userLoggedIn({ user: result.data.user, isAuthenticated:true }));
        } catch (error) {
          console.log(error);
        }
      },
    }),

    logoutUser: builder.mutation({
      query:()=>({
        url:"logout",
        method:"GET"
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          
          dispatch(userLoggedOut({ user: null,isAuthenticated:false}));
        } catch (error) {
          console.log(error);
        }
      },

      
  }),

    loadUser: builder.query({ //or get User
      query: () => ({
        url: "profile",
        method: "GET",
      }),

      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(userLoggedIn({ user: result.data.user, isAuthenticated:true}));
        } catch (error) {
          console.log(error);
        }
      },
    }),

    updateUser: builder.mutation({
        query: (formData)=>({
            url:"profile/update",
            method:"PUT",
            body:formData,
            credentials:"include"

        })
    })
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useLoadUserQuery,
  useUpdateUserMutation
} = authApi;

//I want to POST So I used mutation
// inputData -> Here inputData is that data which we are passing to the Api
// url -> its the endpoint to which the data will be passed
