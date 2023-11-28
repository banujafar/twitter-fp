import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IUserInitial } from '../../../models/user';

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
  },
});

export default userSlice.reducer;
