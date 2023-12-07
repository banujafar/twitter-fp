import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authSlice from './features/auth/authSlice';
import modalSlice from "./features/modal/modalSlice";
import postSlice from "./features/post/postSlice";
import userSlice from "./features/user/userSlice";
import { postsApi } from "./features/post/postsApi";
import followModalSlice from "./features/modal/followModalSlice";
import chatSlice from "./features/chat/chatSlice";

const rootReducer = combineReducers({
    auth: authSlice,
    modal:modalSlice,
    post: postSlice,
    user: userSlice,
    followModal: followModalSlice,
    chat: chatSlice,

    [postsApi.reducerPath]: postsApi.reducer
})


export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(postsApi.middleware),
})

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof rootReducer>;

