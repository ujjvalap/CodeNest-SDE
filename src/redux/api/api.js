import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { server } from '../../constants/config';

export const questionsApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: `${server}/api/v1`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    'Users',
    'Categories',
    'Questions',
    'AdminEmails',
    'AllData',
    'CategoryData',        // ✅ NEW
    'CategoryResponses',   // ✅ NEW
  ],
  endpoints: (builder) => ({

    // ---------- Categories ----------
    addCategory: builder.mutation({
      query: (body) => ({
        url: '/category/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Categories'],
    }),
    deleteCategory: builder.mutation({
      query: (categoryId) => ({
        url: `/category/delete/${categoryId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Categories'],
    }),
    updateCategory: builder.mutation({
      query: ({ categoryId, updatedData }) => ({
        url: `/category/update/${categoryId}`,
        method: 'PATCH',
        body: updatedData,
      }),
      invalidatesTags: ['Categories'],
    }),
    getCategories: builder.query({
      query: () => '/category/show',
      providesTags: ['Categories'],
    }),
    getAllCategories: builder.query({
      query: () => '/data/get-all-categories',
      providesTags: ['Categories'],
    }),

    // ---------- Questions ----------
    addQuestion: builder.mutation({
      query: ({ categoryId, ...question }) => ({
        url: `/question/add/${categoryId}`,
        method: 'POST',
        body: question,
      }),
      invalidatesTags: ['Questions', 'CategoryData'],
    }),
    deleteQuestion: builder.mutation({
      query: ({ questionId, categoryId }) => ({
        url: `/question/delete/${questionId}/${categoryId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Questions', 'Categories', 'CategoryData'],
    }),
    updateQuestion: builder.mutation({
      query: ({ questionId, updatedData }) => ({
        url: `/question/update/${questionId}`,
        method: 'PATCH',
        body: updatedData,
      }),
      invalidatesTags: ['Questions', 'Categories', 'CategoryData'],
    }),
    updateQuestionStatus: builder.mutation({
      query: ({ qid, status }) => ({
        url: `/response/status/add/${qid}`,
        method: 'POST',
        body: { status },
      }),
      invalidatesTags: ['Questions', 'CategoryResponses'],
    }),
    addQuestionNote: builder.mutation({
      query: ({ qid, notes }) => ({
        url: `/response/notes/add/${qid}`,
        method: 'POST',
        body: { notes },
      }),
      invalidatesTags: ['Questions', 'CategoryResponses', 'CategoryData'], // ✅ Added both
    }),

    // ---------- Category Data ----------
    getCategoryData: builder.query({
      query: (id) => `/data/get-categories-data/${id}`,
      providesTags: (result, error, id) => [{ type: 'CategoryData', id }],
    }),
    getCategoryDataGuest: builder.query({
      query: (id) => `/data/get-categories-data-guest/${id}`,
      providesTags: (result, error, id) => [{ type: 'CategoryData', id }],
    }),
    getCategoryResponses: builder.query({
      query: (id) => `/data/get-category-responses/${id}`,
      providesTags: (result, error, id) => [{ type: 'CategoryResponses', id }],
    }),

    // ---------- All Data ----------
    getAllData: builder.query({
      query: () => '/data/get-all-data',
      providesTags: ['AllData'],
    }),

    // ---------- Users ----------
    getUsers: builder.query({
      query: () => '/auth/users',
      providesTags: ['Users'],
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/auth/users/delete/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users'],
    }),
    updateUser: builder.mutation({
      query: ({ userId, updatedData }) => ({
        url: `/auth/users/update/${userId}`,
        method: 'PATCH',
        body: updatedData,
      }),
      invalidatesTags: ['Users'],
    }),

    // ---------- Admin Emails ----------
    addAdminEmail: builder.mutation({
      query: (body) => ({
        url: '/auth/adminEmails/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['AdminEmails'],
    }),
    deleteAdminEmail: builder.mutation({
      query: (body) => ({
        url: '/auth/adminEmails/delete',
        method: 'DELETE',
        body,
      }),
      invalidatesTags: ['AdminEmails'],
    }),

    // ---------- Auth ----------
    sendForgotPasswordOtp: builder.mutation({
      query: (body) => ({
        url: '/otp/password',
        method: 'POST',
        body,
      }),
    }),
    changePasswordWithOtp: builder.mutation({
      query: (body) => ({
        url: '/auth/change-password',
        method: 'POST',
        body,
      }),
    }),
    loginUser: builder.mutation({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
    }),
    registerUser: builder.mutation({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
    }),
    sendSignupOtp: builder.mutation({
      query: (body) => ({
        url: '/otp/signup',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  // Category
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
  useGetCategoriesQuery,
  useLazyGetCategoriesQuery,
  useGetAllCategoriesQuery,
  useLazyGetAllCategoriesQuery,

  // Questions
  useAddQuestionMutation,
  useDeleteQuestionMutation,
  useUpdateQuestionMutation,
  useUpdateQuestionStatusMutation,
  useAddQuestionNoteMutation,

  // Category Data
  useGetCategoryDataQuery,
  useGetCategoryDataGuestQuery,
  useGetCategoryResponsesQuery,

  // All Data
  useGetAllDataQuery,
  useLazyGetAllDataQuery,

  // Users
  useGetUsersQuery,
  useLazyGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,

  // Admin Email
  useAddAdminEmailMutation,
  useDeleteAdminEmailMutation,

  // Auth
  useSendForgotPasswordOtpMutation,
  useChangePasswordWithOtpMutation,
  useLoginUserMutation,
  useSendSignupOtpMutation,
  useRegisterUserMutation,
} = questionsApi;
