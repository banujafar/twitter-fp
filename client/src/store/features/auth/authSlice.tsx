import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AuthState, IUserRegister } from "../../../models/auth";

const initialState:AuthState = {
  token: null,
  error: null,
  user: null
};

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData: IUserRegister) => {
    try {
      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        credentials:'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData)
      });
      console.log(response)

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action)  => {
        state.token = null;
        state.user = null;
        state.error = action.error.message ?? null;
      });
  },
});


export default authSlice.reducer;