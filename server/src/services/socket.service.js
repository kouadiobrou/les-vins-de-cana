const socketIO = require('socket.io');

class SocketService {
  constructor() {
    this.io = null;
    this.connections = new Map();
  }

  initialize(server) {
    this.io = socketIO(server, {
      cors: {
        origin: process.env.CLIENT_URL,
        methods: ['GET', 'POST']
      }
    });

    this.io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      socket.on('register', ({ userId }) => {
        if (userId) {
          this.connections.set(userId, socket.id);
          console.log(`User ${userId} registered with socket ${socket.id}`);
        }
      });

      socket.on('disconnect', () => {
        for (const [userId, socketId] of this.connections.entries()) {
          if (socketId === socket.id) {
            this.connections.delete(userId);
            console.log(`User ${userId} disconnected`);
            break;
          }
        }
      });
    });
  }

  sendPaymentUpdate(userId, data) {
    const socketId = this.connections.get(userId);
    if (socketId) {
      this.io.to(socketId).emit('payment_update', data);
    }
  }

  sendPaymentConfirmation(userId, data) {
    const socketId = this.connections.get(userId);
    if (socketId) {
      this.io.to(socketId).emit('payment_confirmation', data);
    }
  }

  sendPaymentError(userId, data) {
    const socketId = this.connections.get(userId);
    if (socketId) {
      this.io.to(socketId).emit('payment_error', data);
    }
  }

  broadcastOrderUpdate(sellerId, data) {
    const socketId = this.connections.get(sellerId);
    if (socketId) {
      this.io.to(socketId).emit('order_update', data);
    }
  }
}

module.exports = new SocketService();
