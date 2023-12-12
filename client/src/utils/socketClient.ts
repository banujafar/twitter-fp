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
const socketRealTimePosts = ({
  content,
  retweeted_id,
  user_id,
  files,
}: {
  content: string;
  retweeted_id: number | undefined;
  user_id: number | undefined;
  files: File[] | null;
}) => {
  console.log(files)
  socket.emit('realTimePosts', {
    
    content,
    user_id,
    files,
    retweeted_id,
  });
};
const socketRetweetPosts = (data: any) => {
  socket.emit('addRetweet', data);
};
export { socketSendNotification, socketRemoveNotification, socketRealTimePosts, socketRetweetPosts };
