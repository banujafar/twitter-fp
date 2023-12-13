import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit';
import { IPostInitialState, IUserPost } from '../../../models/post';
import fetchWrapper from '../../helpers/fetchWrapper';

const BASE_URL = 'https://twitter-server-73xd.onrender.com/api/posts';

export const getPosts = createAsyncThunk('like/getPosts', async () => {
  return fetchWrapper(`${BASE_URL}`, 'GET');
});

export const getPost = createAsyncThunk('like/getPost', async (postId: number) => {
  return fetchWrapper(`${BASE_URL}/${postId}`, 'GET');
});

export const addPost = createAsyncThunk('post/addPost', async (formData: FormData) => {
  try {
    const response = await fetch(`${BASE_URL}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Error');
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    throw error;
  }
});

export const likePost = createAsyncThunk(
  'like/likePost',
  async ({ postId, userId }: { postId: number; userId: number }) => {
    return fetchWrapper(`${BASE_URL}/like`, 'POST', { postId, userId });
  },
);

export const addComment = createAsyncThunk('post/addComment', async (formData: any) => {
  return fetchWrapper(`${BASE_URL}/comment`, 'POST', formData);
});

export const removeLike = createAsyncThunk(
  'like/removeLike',
  async ({ postId, userId }: { postId: number; userId: number }) => {
    return fetchWrapper(`${BASE_URL}/like`, 'DELETE', { postId, userId });
  },
);

export const removeRetweet = createAsyncThunk('retweet/removeRetweet', async (rtwId: number) => {
  return fetchWrapper(`${BASE_URL}/retweet/${rtwId}`, 'DELETE');
});

export const retweetPost = createAsyncThunk(
  'retweet/retweetPost',
  async ({ content, userId, rtwId }: { content?: string; userId: number; rtwId: number }) => {
    return fetchWrapper(`${BASE_URL}/retweet`, 'POST', { content, userId, rtwId });
  },
);

export const deletePost = createAsyncThunk('post/deletePost', async (post_id: number | undefined) => {
  return fetchWrapper(`${BASE_URL}/${post_id}`, 'DELETE');
});

const initialState: IPostInitialState = {
  post: [],
  error: null,
  loading: false,
};

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    filterRetweet: (state, action) => {
      console.log(action.payload)
      state.post = current(state.post).filter((item) => item.id !== action.payload);
      console.log(state.post)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addPost.pending, (state) => {
        state.error = null;
      })
      .addCase(addPost.fulfilled, (state, action) => {
        const { originalPost } = action.payload;
        if (originalPost) {
          const updatedPosts = current(state.post).map((singlePost) => {
            if (singlePost.id === originalPost.id) {
              return originalPost;
            }
            return singlePost;
          });
          state.post = updatedPosts;
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(addPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(getPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.post = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(getPost.pending, (state) => {
        state.error = null;
      })
      .addCase(getPost.fulfilled, (state, action) => {
        state.post = [...state.post, action.payload];
        state.loading = false;
        state.error = null;
      })
      .addCase(getPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(likePost.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const likedPost = action.payload;
        const updatedPosts = state.post.map((p) => {
          if (p.id === likedPost.post.id) {
            return {
              ...p,
              likes: [...p?.likes, likedPost],
            };
          }
          return p;
        });
        state.post = updatedPosts;
        state.loading = false;
        state.error = null;
      })
      .addCase(likePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(removeLike.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(removeLike.fulfilled, (state, action) => {
        const removedLikeId = action.payload;
        const updatedPosts = state.post.map((p) => {
          if (p.likes?.some((like) => like.id === removedLikeId)) {
            return {
              ...p,
              likes: p.likes.filter((like) => like.id !== removedLikeId),
            };
          }
          return p;
        });
        state.post = updatedPosts;
        state.loading = false;
        state.error = null;
      })
      .addCase(removeLike.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(addComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const updatedPosts = current(state.post).map((singlePost) => {
          if (singlePost.id === action.payload.post?.id) {
            return {
              ...singlePost,
              comments: singlePost.comments ? [...singlePost.comments, action.payload] : [action.payload],
            };
          }
          return singlePost;
        });
        state.post = updatedPosts;
        state.loading = false;
        state.error = null;
      })
      .addCase(addComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(retweetPost.pending, (state) => {
        state.error = null;
      })
      .addCase(retweetPost.fulfilled, (state, action) => {
        const { originalPost } = action.payload;
        console.log(action.payload)
        const updatedPosts = current(state.post).map((post) => {
          if (post.id === originalPost.id) {
            return originalPost;
          }
          return post;
        });
        state.post = updatedPosts;
        state.loading = false;
        state.error = null;
      })
      .addCase(retweetPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(removeRetweet.pending, (state) => {
        state.error = null;
      })
      .addCase(removeRetweet.fulfilled, (state, action) => {
        const { retweetedPostId, mainPostId } = action.payload;
        const filteredPosts: IUserPost[] = current(state.post).filter((post) => post.id !== retweetedPostId);
        const updatedPosts = filteredPosts.map((singlePost) => {
          if (singlePost.id === mainPostId) {
            const filteredRetweets =
              singlePost.retweets &&
              singlePost.retweets?.filter((singleRetweet: any) => singleRetweet.post?.id !== retweetedPostId);
            return { ...singlePost, retweets: filteredRetweets };
          }
          return singlePost;
        });
        state.post = updatedPosts;
        state.loading = false;
        state.error = null;
      })
      .addCase(removeRetweet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(deletePost.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        const postId = action.payload.id;
        console.log(postId)
        const updatedPosts = state.post.filter((p)=> {p.id !== postId})
        state.post = updatedPosts;
        state.loading = false;
        state.error = null;
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
  },
});

export const { filterRetweet } = postSlice.actions;
export default postSlice.reducer;
