import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IAddRetweet, IUserPost } from '../../../models/post';
export const postsApi = createApi({
  reducerPath: 'postsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/api' }),
  tagTypes: ['Posts'],
  endpoints: (builder) => ({
    getPosts: builder.query<Array<IUserPost>, void>({
      query: () => '/posts',
      providesTags: ['Posts'],
    }),
    deleteRetweet: builder.mutation<void, number>({
      query: (rtwId) => ({
        url: `/posts/retweet/${rtwId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Posts'],
    }),
    addRetweet: builder.mutation<IAddRetweet[], IAddRetweet>({
      query: ({ userId, rtwId }) => ({
        url: `/posts/retweet`,
        method: 'POST',
        body: { userId, rtwId },
      }),
      invalidatesTags: ['Posts'],
    }),
    addPost: builder.mutation<FormData, FormData>({
      query: (formData) => ({
        url: `/posts`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Posts'],
    }),
    addComment: builder.mutation<void, {comment:string, userId:number, postId:number}>({
      query: ({ comment, userId, postId }) => ({
        url: `/posts/comment`,
        method: 'POST',
        body: { comment, userId, postId },
      }),
      invalidatesTags: ['Posts'],
    }),
    addLike: builder.mutation<void, { userId: number; postId: number }>({
      query: ({ userId, postId }) => ({
        url: `/posts/like`,
        method: 'POST',
        body: { userId, postId },
      }),
      invalidatesTags: ['Posts'],
    }),
    removeLike: builder.mutation<void, { userId: number; postId: number }>({
      query: ({ userId, postId }) => ({
        url: `/posts/like`,
        method: 'DELETE',
        body: { userId, postId },
      }),
      invalidatesTags: ['Posts'],
    }),
  }),
});
export const {
  useDeleteRetweetMutation,
  useAddRetweetMutation,
  useAddPostMutation,
  useAddCommentMutation,
  useAddLikeMutation,
  useRemoveLikeMutation,
  useGetPostsQuery,
} = postsApi;
