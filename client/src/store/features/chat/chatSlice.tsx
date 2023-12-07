import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IChatInitial } from '../../../models/chat';

const initialState: IChatInitial = {
  chats: [],
  error: null,
  loading: null,
};

export const createChat = createAsyncThunk(
  'chat/createChat',
  async ({ firstId, secondId }: { firstId: number | undefined; secondId: number | undefined }) => {
    try {
      const response = await fetch(`http://localhost:3000/api/chats/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstId, secondId }),
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

export const getUserChats = createAsyncThunk('chat/getUserChats', async (userId: number | undefined) => {
  try {
    const response = await fetch(`http://localhost:3000/api/chats/${userId}`, {
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

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createChat.fulfilled, (state, action) => {
        state.chats = state.chats ? [...state.chats, action.payload] : [action.payload];
        state.loading = false;
        state.error = null;
      })
      .addCase(createChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(getUserChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserChats.fulfilled, (state, action) => {
        state.chats = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getUserChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      });
  },
});

export default chatSlice.reducer;
