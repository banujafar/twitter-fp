import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit';
import { IUser, IUserInitial } from '../../../models/user';
import fetchWrapper from '../../helpers/fetchWrapper';

const BASE_URL = 'https://twitter-server-73xd.onrender.com/auth';
let isFirstTimeLoading = true;
export const getUsers = createAsyncThunk('user/getUsers', async () => {
  return fetchWrapper(`${BASE_URL}`, 'GET');
});
export const followUser = createAsyncThunk(
  'user/followUsers',
  async ({ userId, targetUser }: { userId: number | undefined; targetUser: IUser | undefined }) => {
    return fetchWrapper(`${BASE_URL}/follow/${userId}`, 'POST', { targetUser });
  },
);

export const unfollowUser = createAsyncThunk(
  'user/unfollowUser',
  async ({ userId, targetUser }: { userId: number | undefined; targetUser: IUser | undefined }) => {
    return fetchWrapper(`${BASE_URL}/unfollow/${userId}`, 'DELETE', { targetUser });
  },
);

export const editUser = createAsyncThunk(
  'auth/editUser',
  async ({ formData, userId }: { formData: FormData; userId: number | undefined }) => {
    try {
      const response = await fetch(`${BASE_URL}/user/${userId}`, {
        method: 'PUT',
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
  },
);

export const notifyUser = createAsyncThunk(
  'user/notifyUser',
  async ({ userId, notifiedUser }: { userId: number | undefined; notifiedUser: IUser | undefined }) => {
    return fetchWrapper(`${BASE_URL}/notify-me/${userId}`, 'POST', notifiedUser);
  },
);

export const removeNotifiedUser = createAsyncThunk(
  'user/removeNotify',
  async ({ userId, notifiedUser }: { userId: number | undefined; notifiedUser: IUser | undefined }) => {
    return fetchWrapper(`${BASE_URL}/notify-me/${userId}`, 'Delete', notifiedUser);
  },
);

const initialState: IUserInitial = {
  users: [],
  error: null,
  loading: false,
  isNotified: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        if (isFirstTimeLoading) {
          state.loading = true;
        }
        isFirstTimeLoading = false;
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
        state.users = updatedUsers;
        state.loading = false;
        state.error = null;
      })
      .addCase(followUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(unfollowUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        console.log(action.payload);
        const targetUser = action.payload.targetUser;
        const currentUser = action.payload.currentUser;
        console.log(targetUser);
        const updatedUsers = state.users.map((user) => {
          if (user.id === targetUser.id) {
            return {
              ...user,
              followers: (user.followers || []).filter((follower) => follower.id !== currentUser.id),
            };
          } else if (user.id === currentUser.id) {
            return {
              ...user,
              following: (user.following || []).filter((followingUser) => followingUser.id !== targetUser.id),
            };
          }
          return user;
        });

        state.users = updatedUsers;
        state.loading = false;
        state.error = null;
      })
      .addCase(unfollowUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(editUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editUser.fulfilled, (state, action) => {
        const currentUser = action.payload;
        const updatedUsers = state.users.map((user) => {
          if (user.id === currentUser.id) {
            return currentUser;
          }

          return user;
        });

        state.users = updatedUsers;
        state.loading = false;
        state.error = action.payload?.error?.message || null;
      })
      .addCase(editUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(notifyUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(notifyUser.fulfilled, (state, action) => {
        const updatedUsers = current(state.users).map((user) => {
          if (user.id === action.payload.id) {
            return action.payload;
          }
          return user;
        });
        state.users = updatedUsers;
        state.loading = false;
        state.error = null;
        state.isNotified = true;
      })
      .addCase(notifyUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(removeNotifiedUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeNotifiedUser.fulfilled, (state, action) => {
        const updatedUsers = current(state.users).map((user) => {
          if (user.id === action.payload.id) {
            return action.payload;
          }
          return user;
        });
        state.users = updatedUsers;
        state.loading = false;
        state.error = null;
        state.isNotified = false;
      })
      .addCase(removeNotifiedUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      });
  },
});

export default userSlice.reducer;
