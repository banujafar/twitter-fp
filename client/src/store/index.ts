import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authSlice from './features/auth/authSlice';
import modalSlice from './features/modal/modalSlice';
import postSlice from './features/post/postSlice';
import userSlice from './features/user/userSlice';
import followModalSlice from './features/modal/followModalSlice';
import notificationSlice from './features/notifications/notificationSlice';
import chatSlice from './features/chat/chatSlice';
import messageSlice from './features/message/messageSlice';
import postModalSlice from './features/modal/postModalSlice';


const rootReducer = combineReducers({
  auth: authSlice,
  modal: modalSlice,
  post: postSlice,
  user: userSlice,
  followModal: followModalSlice,
  notifications: notificationSlice,
  chat: chatSlice,
  message: messageSlice,
  postModal: postModalSlice,

});

export const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof rootReducer>;
