import { io } from 'socket.io-client';
const socket = io('https://twitter-server-73xd.onrender.com');

const socketSendNotification = ({
  username,
  receiverName,
  action,
  postId,
}: {
  username: string | undefined;
  receiverName: string | undefined;
  postId?: number | null;
  action?: string;
}) => {
  socket.emit('sendNotification', {
    senderName: username,
    receiverName: receiverName,
    type: action,
    postId: postId,
  });
};
const socketRemoveNotification = ({
  username,
  receiverName,
  action,
  postId,
}: {
  username: string | undefined;
  receiverName: string | undefined;
  postId?: number | null;
  action?: string;
}) => {
  socket.emit('removeNotification', {
    senderName: username,
    receiverName: receiverName,
    type: action,
    postId: postId,
  });
};
const socketRealTimePosts = (postId: number | undefined) => {
  socket.emit('realTimePosts', postId);
};
const socketRetweetPosts = (postId: number | undefined) => {
  socket.emit('addRetweet', postId);
};
const socketRemoveRetweets = (postId: number | undefined) => {
  socket.emit('removeRetweet', postId);
};
export {
  socketSendNotification,
  socketRemoveNotification,
  socketRealTimePosts,
  socketRetweetPosts,
  socketRemoveRetweets,
};
