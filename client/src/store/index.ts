import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authSlice from './features/auth/authSlice';
import modalSlice from "./features/modal/modalSlice";
import postSlice from "./features/post/postSlice";

const rootReducer = combineReducers({
    auth: authSlice,
    modal:modalSlice,
    post: postSlice,
})


export const store = configureStore({
    reducer: rootReducer
})

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof rootReducer>;