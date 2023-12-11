import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IMessageInitial } from '../../../models/message';

const initialState: IMessageInitial = {
  messages: [],
  error: null,
  loading: null,
};


export const sendMessage = createAsyncThunk(
  'message/sendMessage',
  async ({ chat_id, sender_id, text }: { chat_id: number | undefined; sender_id: number | undefined; text: string }) => {
    try {
      const response = await fetch(`https://twitter-server-73xd.onrender.com/api/messages/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chat_id, sender_id, text }),
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

export const getMessages = createAsyncThunk('message/getMessages', async (chat_id: number | undefined) => {
  try {
    const response = await fetch(`https://twitter-server-73xd.onrender.com/api/messages/${chat_id}`, {
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

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages = state.messages ? [...state.messages, action.payload] : [action.payload];
        state.loading = false;
        state.error = null;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(getMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.messages = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      });
  },
});

export default messageSlice.reducer;
