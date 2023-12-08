import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { INotificationsState } from '../../../models/post';

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (userId: number | undefined) => {
    const response = await fetch(`https://twitter-server-73xd.onrender.com/api/posts/notifications/${userId}`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  },
);
export const readNotifications = createAsyncThunk(
  'notifications/readNotifications',
  async (userId: number | undefined) => {
    const response = await fetch(`https://twitter-server-73xd.onrender.com/api/posts/notifications/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  },
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: [],
    error: null,
    loading: false,
  } as INotificationsState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.push(action.payload);
    },
    removeNotification: (state, action: PayloadAction<{ postId: number }>) => {
      const postIdToRemove = action.payload.postId;
      state.notifications = state.notifications.filter((notification: any) => notification.postId !== postIdToRemove);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message ?? 'An error occurred while fetching notifications.';
      })
      .addCase(readNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(readNotifications.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(readNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message ?? 'An error occurred while marking notifications as read.';
      });
  },
});

export const { addNotification, removeNotification } = notificationsSlice.actions;
export default notificationsSlice.reducer;
