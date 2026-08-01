import React from 'react';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { SocketProvider } from './context/SocketContext';
import { NotificationProvider } from './context/NotificationContext';
import AppRoutes from './routes/AppRoutes';

export function App() {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <SocketProvider>
          <NotificationProvider>
            <CartProvider>
              <AppRoutes />
            </CartProvider>
          </NotificationProvider>
        </SocketProvider>
      </AdminAuthProvider>
    </AuthProvider>
  );
}

export default App;
