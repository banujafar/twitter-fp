import { io } from 'socket.io-client';
//import { useEffect } from 'react';
import { IUserPost } from '../models/post';
const socket = io('https://twitter-server-73xd.onrender.com');

const socketSendNotification = ({
  username,
  postData,
  action,
}: {
  username: string | undefined;
  postData?: IUserPost;
  action?: string;
}) => {
  socket.emit('sendNotification', {
    senderName: username,
    receiverName: postData?.user.username,
    type: action,
    postId: postData?.id,
  });
};
const socketRemoveNotification = ({
  username,
  postData,
  action,
}: {
  username: string | undefined;
  postData?: IUserPost;
  action?: string;
}) => {
  socket.emit('removeNotification', {
    senderName: username,
    receiverName: postData?.user.username,
    type: action,
    postId: postData?.id,
  });
};
export { socketSendNotification, socketRemoveNotification };
