import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit';
import { IPostInitialState } from '../../../models/post';

export const getPosts = createAsyncThunk('post/getPosts', async () => {
  try {
    const response = await fetch(`http://localhost:3000/api/posts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
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

export const addPost = createAsyncThunk('post/addPost', async (formData: FormData) => {
  try {
    const response = await fetch(`http://localhost:3000/api/posts`, {
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
    try {
      const response = await fetch('http://localhost:3000/api/posts/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId, userId }),
      });

      if (!response.ok) {
        throw new Error('Error');
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      throw error;
    }
  },
);
export const addComment = createAsyncThunk('post/addComment', async (formData: any) => {
  console.log(formData);
  try {
    const response = await fetch(`http://localhost:3000/api/posts/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
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
export const removeLike = createAsyncThunk(
  'like/removeLike',
  async ({ postId, userId }: { postId: number; userId: number }) => {
    try {
      const response = await fetch('http://localhost:3000/api/posts/like', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId, userId }),
      });

      if (!response.ok) {
        throw new Error('Error');
      }

      const responseData = await response.json();
      console.log(responseData);
      return responseData;
    } catch (error) {
      throw error;
    }
  },
);

export const retweetPost = createAsyncThunk(
  'post/retweetPost',
  async ({ userId, rtwId }: { userId: number; rtwId: number }) => {
    try {
      const response = await fetch(`http://localhost:3000/api/posts/retweet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, rtwId }),
      });

      if (!response.ok) {
        throw new Error('Error');
      }

      const responseData = await response.json();
      console.log(responseData);
      return responseData;
    } catch (error) {
      throw error;
    }
  },
);

const initialState: IPostInitialState = {
  post: [],
  error: null,
  loading: false,
};

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.post = state.post ? [...state.post, action.payload] : [action.payload];
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
              likes: [...p.likes, likedPost],
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
        console.log(action.payload);
        const removedLikeId = action.payload;

        const updatedPosts = state.post.map((p) => {
          if (p.likes.some((like) => like.id === removedLikeId)) {
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
        state.loading = true;
        state.error = null;
      })
      .addCase(retweetPost.fulfilled, (state, action) => {
        console.log(action.payload);
        // state.post = state.post ? [...state.post, action.payload] : [action.payload];
        state.loading = false;
        state.error = null;
      })
      .addCase(retweetPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      });
  },
});

export default postSlice.reducer;
