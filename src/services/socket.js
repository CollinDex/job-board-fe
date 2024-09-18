import { io } from 'socket.io-client';

const socket = io('https://job-board-api-production.up.railway.app');

export const setupNotifications = (userId, callback) => {
  socket.on('connect', () => {
    console.log('Connected to Socket.IO server');
    socket.emit('join', userId);
  });

  socket.on('notification', (data) => {
    callback(data);
  });

  return () => {
    socket.off('notification');
    socket.disconnect();
  };
};

export default socket;