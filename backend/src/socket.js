const jwt = require('jsonwebtoken');

let io = null;

const initSocket = (server) => {
  let Server;
  try {
    Server = require('socket.io').Server;
  } catch (e) {
    console.warn('⚠️ socket.io module not installed yet in backend node_modules.');
    return null;
  }

  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true
    }
  });

  // Strict JWT Authentication Middleware
  io.use((socket, next) => {
    try {
      const authHeader = socket.handshake.auth?.token || socket.handshake.headers?.authorization;
      if (!authHeader) {
        return next(new Error('Authentication failed: Token is required'));
      }

      const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
      const secret = process.env.JWT_SECRET || 'rasamrat_dairy_super_secret_jwt_key_2026';

      const decoded = jwt.verify(token, secret);
      socket.user = decoded;
      return next();
    } catch (err) {
      console.warn('🔒 Socket Auth Failed:', err.message);
      return next(new Error('Authentication failed: Invalid or expired token'));
    }
  });

  // Connection Handler
  io.on('connection', (socket) => {
    const { id, role } = socket.user || {};

    if (role === 'admin') {
      socket.join('admin_room');
      console.log(`🔌 Admin connected to socket (id: ${id}, socket: ${socket.id})`);
    } else if (role === 'customer' && id) {
      const customerRoom = `customer_${id}`;
      socket.join(customerRoom);
      console.log(`🔌 Customer connected to socket room '${customerRoom}' (socket: ${socket.id})`);
    }

    socket.on('disconnect', () => {
      // Clean disconnect
    });
  });

  console.log('⚡ Socket.io Server initialized successfully');
  return io;
};

const getIO = () => {
  return io;
};

module.exports = {
  initSocket,
  getIO
};
