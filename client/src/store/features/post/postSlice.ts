import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
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
      });
  },
});

export default postSlice.reducer;
