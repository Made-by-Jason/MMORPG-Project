import { Server } from 'socket.io';
import http from 'http';
import { handlePlayerMessage } from '../services/world';

export function initSocket(server: http.Server) {
  const io = new Server(server, {
    cors: { origin: '*' }
  });

  io.on('connection', (socket) => {
    console.log('socket connected', socket.id);

    socket.on('message', (msg) => {
      // Dispatch to world service; include socket for direct emit if needed
      handlePlayerMessage(socket, msg, io);
    });

    socket.on('disconnect', () => {
      console.log('socket disconnected', socket.id);
    });
  });

  return io;
}
