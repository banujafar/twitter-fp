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
      const receivers = onlineUsers;
      receivers.map((receiver) => {
        io.to(receiver.socketId).emit('getRealTimePosts', data);
      });
    });
    socket.on('addRetweet', (data) => {
      const receivers = onlineUsers;
      receivers.map((receiver) => {
        io.to(receiver.socketId).emit('getRetweetedPosts',data);
      });
    });
    socket.on('disconnect', () => {
      console.log('A user disconnected');
      removeUser(socket.id);
    });
  });
};
export default socketService;
