let onlineUsers = [];
const addNewUser = (username, socketId) => {
  !onlineUsers.some((user) => user.username === username) && onlineUsers.push({ username, socketId });
};
const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};
const getUser = (username) => {
  return onlineUsers.find((user) => user.username === username);
};
console.log(onlineUsers);
const socketService = (io) => {
  io.on('connect', (socket) => {
    console.log('A user connected', socket.id);
    socket.on('newUser', ({ username }) => {
      addNewUser(username, socket.id);
    });
    socket.on('sendNotification', ({ senderName, receiverName, type, postId }) => {
      const receiver = getUser(receiverName);
      io.to(receiver?.socketId).emit('getNotification', {
        senderName,
        type,
        postId,
      });
    });
    socket.on('removeNotification', ({ senderName, receiverName, type, postId }) => {
      const receiver = getUser(receiverName);
      io.to(receiver?.socketId).emit('getFilteredNotification', {
        senderName,
        type,
        postId,
      });
    });
    socket.on('realTimePosts', (data) => {
      onlineUsers.forEach((user) => {
        io.to(user.socketId).emit('getRealTimePosts', data);
      });
    });
    socket.on('addRetweet', (data) => {
      const receivers = onlineUsers;
      receivers.map((receiver) => {
        io.to(receiver.socketId).emit('getRetweetedPosts', data);
      });
    });
    socket.on('removeRetweet', (data) => {
      const receivers = onlineUsers;
      receivers.map((receiver) => {
        io.to(receiver.socketId).emit('removeRetweetedPosts', data);
      });
    });
    socket.on('sendMessage', ({ chat_id, sender_id, text }) => {
      console.log('Received new message:', text);
      io.emit('receiveMessage', { chat_id, sender_id, text });
    });
    socket.on('users', ({ username, receiverName }) => {
      const receiver = getUser(receiverName);
      io.to(receiver?.socketId).emit('getUsers');
    });
    socket.on('posts', ({ username, receiverName }) => {
      console.log(receiverName, username);
      const filteredUsers = onlineUsers.filter((user) => user.username !== username);
      if (!receiverName) {
        filteredUsers.forEach((user) => {
          console.log(user);
          io.to(user.socketId).emit('getPosts');
        });
      }
      const receiver = getUser(receiverName);
      io.to(receiver?.socketId).emit('getPosts');
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected');
      removeUser(socket.id);
    });
  });
};
export default socketService;
