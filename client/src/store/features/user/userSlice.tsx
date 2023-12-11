import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IUser, IUserInitial } from '../../../models/user';

const BASE_URL = 'https://twitter-server-73xd.onrender.com/auth';
export const getUsers = createAsyncThunk('user/getUsers', async () => {
  try {
    const response = await fetch(`${BASE_URL}`, {
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
      const response = await fetch(`${BASE_URL}/follow/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ targetUser }),
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

export const unfollowUser = createAsyncThunk(
  'user/unfollowUser',
  async ({ userId, targetUser }: { userId: number | undefined; targetUser: IUser | undefined }) => {
    try {
      const response = await fetch(`${BASE_URL}/unfollow/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ targetUser }),
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
  'auth/notifyUser',
  async ({ userId, notifiedUser }: { userId: number | undefined; notifiedUser: IUser | undefined }) => {
    try {
      const response = await fetch(`${BASE_URL}/notify-me/${userId}`, {
        method: 'POST',
        body: JSON.stringify(notifiedUser),
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
  },
);

export const removeNotifiedUser = createAsyncThunk(
  'auth/removeNotify',
  async ({ userId, notifiedUser }: { userId: number | undefined; notifiedUser: IUser | undefined }) => {
    try {
      const response = await fetch(`${BASE_URL}/notify-me/${userId}`, {
        method: 'Delete',
        body: JSON.stringify(notifiedUser),
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
        const targetUser = action.payload.targetUser;
        const currentUser = action.payload.currentUser;

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
      .addCase(notifyUser.fulfilled, (state, _) => {
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
      .addCase(removeNotifiedUser.fulfilled, (state, _) => {
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
