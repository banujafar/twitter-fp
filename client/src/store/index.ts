import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authSlice from './features/auth/authSlice';
import modalSlice from "./features/modal/modalSlice";
import postSlice from "./features/post/postSlice";
import userSlice from "./features/user/userSlice";

const rootReducer = combineReducers({
    auth: authSlice,
    modal:modalSlice,
    post: postSlice,
    user: userSlice,
})


export const store = configureStore({
    reducer: rootReducer
})

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof rootReducer>;