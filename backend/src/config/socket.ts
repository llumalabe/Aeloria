import { Server as HTTPServer } from 'http';
import { Server, Socket } from 'socket.io';

let io: Server;

export const setupSocketIO = (server: HTTPServer): Server => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join chat room
    socket.on('join_chat', (room: string) => {
      socket.join(room);
      console.log(`User ${socket.id} joined room: ${room}`);
    });

    // Send chat message
    socket.on('send_message', (data: { room: string; message: string; username: string }) => {
      io.to(data.room).emit('receive_message', {
        message: data.message,
        username: data.username,
        timestamp: new Date(),
      });
    });

    // PvP Battle updates
    socket.on('pvp_action', (data: any) => {
      io.to(`pvp_${data.battleId}`).emit('pvp_update', data);
    });

    // World Boss updates
    socket.on('world_boss_attack', (data: any) => {
      io.emit('world_boss_update', data);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};
