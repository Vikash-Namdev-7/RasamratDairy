import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { useAdminAuth } from './AdminAuthContext';

let ioClient = null;
try {
  ioClient = require('socket.io-client').io;
} catch (e) {
  // ESM dynamic import or module fallback handled inside useEffect
}

const SocketContext = createContext({ socket: null, isConnected: false });

export const SocketProvider = ({ children }) => {
  const { isAuthenticated: isCustomerAuth } = useAuth();
  const { isAuthenticated: isAdminAuth } = useAdminAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let socketInstance = null;

    async function connectSocket() {
      const customerToken = localStorage.getItem('rasamrat_token') || localStorage.getItem('token');
      const adminToken = localStorage.getItem('rasamrat_admin_token') || localStorage.getItem('adminToken');
      const token = isAdminAuth ? adminToken : customerToken;

      if (!token) {
        if (socket) {
          socket.disconnect();
          setSocket(null);
          setIsConnected(false);
        }
        return;
      }

      let ioFunc = ioClient;
      if (!ioFunc) {
        try {
          const mod = await import('socket.io-client');
          ioFunc = mod.io || mod.default;
        } catch (err) {
          console.warn('⚠️ socket.io-client not installed yet on frontend.');
          return;
        }
      }

      const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

      socketInstance = ioFunc(socketUrl, {
        auth: { token },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 2000
      });

      socketInstance.on('connect', () => {
        console.log('⚡ Connected to Rasamrat Real-time Socket Server');
        setIsConnected(true);
      });

      socketInstance.on('disconnect', () => {
        setIsConnected(false);
      });

      socketInstance.on('connect_error', (err) => {
        console.warn('🔒 Socket connection warning:', err.message);
        setIsConnected(false);
      });

      setSocket(socketInstance);
    }

    connectSocket();

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, [isCustomerAuth, isAdminAuth]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
export default SocketContext;
