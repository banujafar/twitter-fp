import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AuthState, IConfirmReset, IResetParams, IUserLogin, IUserRegister } from '../../../models/auth';
import fetchWrapper from '../../helpers/fetchWrapper.ts';

const initialState: AuthState = {
  error: null,
  loading: null,
  user: null,
  isAuth: null,
};

const BASE_URL = 'http://localhost:3000/auth';

export const registerUser = createAsyncThunk('auth/registerUser', async (userData: IUserRegister) => {
  return fetchWrapper(`${BASE_URL}/register`, 'POST', userData);
});

export const verifyEmail = createAsyncThunk('auth/verifyEmail', async (verificationToken: string | null) => {
  return fetchWrapper(`${BASE_URL}/verify?token=${verificationToken}`, 'GET');
});

export const checkAuth = createAsyncThunk('auth/checkAuth', async () => {
  return fetchWrapper('http://localhost:3000/checkAuth', 'GET');
});
export const loginUser = createAsyncThunk('auth/loginUser', async (userData: IUserLogin) => {
  // return await fetchWrapper(`${BASE_URL}/login`, 'POST', userData);
  try {
    const response = await fetchWrapper(`${BASE_URL}/login`, 'POST', userData);

    localStorage.setItem('token', response.token);

    return response;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
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
    const setPending = (state: any) => {
      state.loading = true;
    };

    const setError = (state: any, action: any) => {
      state.error = action.error.message || null;
      state.loading = false;
    };

    const setFulfilled = (state: any, action: any) => {
      state.error = action.payload?.error?.message || null;
      state.loading = false;
    };

    builder
      .addCase(registerUser.pending, setPending)
      .addCase(registerUser.fulfilled, (state, action) => {
        setFulfilled(state, action);
        if (!state.error) {
          state.user = action.payload.user;
        }
      })
      .addCase(registerUser.rejected, setError)
      .addCase(verifyEmail.pending, setPending)
      .addCase(verifyEmail.fulfilled, setFulfilled)
      .addCase(verifyEmail.rejected, setError)
      .addCase(loginUser.pending, setPending)
      .addCase(loginUser.fulfilled, setFulfilled)
      .addCase(loginUser.rejected, setError)
      .addCase(forgotPass.fulfilled, setFulfilled)
      .addCase(forgotPass.rejected, setError)
      .addCase(resetPass.pending, setPending)
      .addCase(resetPass.fulfilled, setFulfilled)
      .addCase(resetPass.rejected, setError)
      .addCase(confirmResetPassword.pending, setPending)
      .addCase(confirmResetPassword.fulfilled, setFulfilled)
      .addCase(confirmResetPassword.rejected, setError)
      .addCase(logoutUser.pending, setPending)
      .addCase(logoutUser.fulfilled, setFulfilled)
      .addCase(logoutUser.rejected, setError)
      .addCase(checkAuth.pending, setPending)
      .addCase(checkAuth.fulfilled, (state, action) => {
        setFulfilled(state, action);
        state.user = action.payload.user;
        state.isAuth = action.payload.isAuth;
      })
      .addCase(checkAuth.rejected, setError);
  },
});

export default authSlice.reducer;
