import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IUser, IUserInitial } from '../../../models/user';

export const getUsers = createAsyncThunk('user/getUsers', async () => {
  try {
    const response = await fetch(`http://localhost:3000/auth/`, {
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

export const followUser = createAsyncThunk(
  'user/followUser',
  async ({ userId, targetUser }: { userId: number | undefined; targetUser: IUser | undefined }) => {
    try {
      const response = await fetch(`http://localhost:3000/auth/follow/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({targetUser}),
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



const initialState: IUserInitial = {
  users: [],
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(followUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(followUser.fulfilled, (state, action) => {
        const targetUser = action.payload.targetUser;
        const currentUser = action.payload.currentUser;

        const updatedUsers = state.users.map((user) => {
          if (user.id === targetUser.id) {
            return {
              ...user,
              followers: [...(user.followers || []), currentUser],
            };
          } else if (user.id === currentUser.id) {
            return {
              ...user,
              following: [...(user.following || []), targetUser],
            };
          }
          return user;
        });
        state.users = updatedUsers
        state.loading = false;
        state.error = null;
      })
      .addCase(followUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      });
  },
});

export default userSlice.reducer;
