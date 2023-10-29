import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authSlice from './features/auth/authSlice';

const rootReducer = combineReducers({
    auth: authSlice
})


export const store = configureStore({
    reducer: rootReducer
})

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof rootReducer>;