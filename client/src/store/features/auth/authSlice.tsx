import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AuthState, IUserLogin, IUserRegister } from '../../../models/auth';

const initialState: AuthState = {
  token: null,
  error: null,
  user: null,
};

export const registerUser = createAsyncThunk('auth/registerUser', async (userData: IUserRegister) => {
  try {
    const response = await fetch('http://localhost:3000/auth/register', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    console.log(response);

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
});

export const loginUser = createAsyncThunk('auth/loginUser', async (userData: IUserLogin) => {
  try {
    const response = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    console.log(response);

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
});

export const forgotPass = createAsyncThunk('auth/forgotPass', async (email:object) => {
  console.log(email)
  try {
    const response = await fetch('http://localhost:3000/auth/forgotpass', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-type': 'application/json',
      },
      body:JSON.stringify(email),
    });
    if (!response.ok) {
      throw new Error('Forgot password failed');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.token = null;
        state.user = null;
        state.error = action.error.message ?? null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.user = null;
        state.error = action.error.message ?? null;
      })
      .addCase(forgotPass.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(forgotPass.rejected, (state, action) => {
        (state.user = null), (state.error = action.error.message ?? null);
      });
  },
});

export default authSlice.reducer;
