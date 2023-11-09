import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AuthState, IConfirmReset, IResetParams, IUserLogin, IUserRegister } from '../../../models/auth';
import fetchWrapper from '../../helpers/fetchWrapper.ts';
const initialState: AuthState = {
  token: null,
  error: null,
  loading: null,
  user: null
};

const BASE_URL = 'http://localhost:3000/auth';

export const registerUser = createAsyncThunk('auth/registerUser', async (userData: IUserRegister) => {
  return fetchWrapper(`${BASE_URL}/register`, 'POST', userData);
});

export const verifyEmail = createAsyncThunk('auth/verifyEmail', async (verificationToken: string) => {
  return fetchWrapper(`${BASE_URL}/verify?token=${verificationToken}`, 'GET');
})

export const loginUser = createAsyncThunk('auth/loginUser', async (userData: IUserLogin) => {
  return fetchWrapper(`${BASE_URL}/login`, 'POST', userData);
});

export const forgotPass = createAsyncThunk('auth/forgotPass', async (email: object) => {
  return fetchWrapper(`${BASE_URL}/forgotpass`, 'POST', email);
});

export const resetPass = createAsyncThunk('auth/resetPass', async (resetData: IResetParams) => {
  const { id, token } = resetData;
  return fetchWrapper(`${BASE_URL}/reset_password/${id}/${token}`, 'GET');
});

export const confirmResetPassword = createAsyncThunk(
  'auth/confirmResetPassword',
  async (confirmPassData: IConfirmReset) => {
    const { id, token, password, confirm_password } = confirmPassData;
    return fetchWrapper(`${BASE_URL}/reset_password/${id}/${token}`, 'POST', { id, password, confirm_password });
  },
);

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  return fetchWrapper(`${BASE_URL}/logout`, 'POST');
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.token = null;
        state.user = null;
        state.error = action.error.message ?? null;
      })
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'verify failed';
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.error.message ?? null;
      })
      .addCase(forgotPass.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(forgotPass.rejected, (state, action) => {
        state.error = action.error.message ?? null;
      })
      .addCase(resetPass.pending, (state) => {
        state.loading = true;
      })
      .addCase(resetPass.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(resetPass.rejected, (state, action) => {
        state.token = null;
        state.error = action.error.message || 'Reset password Request failed';
      })
      .addCase(confirmResetPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(confirmResetPassword.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(confirmResetPassword.rejected, (state, action) => {
        state.error = action.error.message || 'Reset passwrod failed';
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.error.message || 'Logout failed';
      });
  },
});

export default authSlice.reducer;
