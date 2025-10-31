"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = exports.setupSocketIO = void 0;
const socket_io_1 = require("socket.io");
let io;
const setupSocketIO = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:3000',
            methods: ['GET', 'POST'],
        },
    });
    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);
        // Join chat room
        socket.on('join_chat', (room) => {
            socket.join(room);
            console.log(`User ${socket.id} joined room: ${room}`);
        });
        // Send chat message
        socket.on('send_message', (data) => {
            io.to(data.room).emit('receive_message', {
                message: data.message,
                username: data.username,
                timestamp: new Date(),
            });
        });
        // PvP Battle updates
        socket.on('pvp_action', (data) => {
            io.to(`pvp_${data.battleId}`).emit('pvp_update', data);
        });
        // World Boss updates
        socket.on('world_boss_attack', (data) => {
            io.emit('world_boss_update', data);
        });
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
    return io;
};
exports.setupSocketIO = setupSocketIO;
const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
};
exports.getIO = getIO;
//# sourceMappingURL=socket.js.map