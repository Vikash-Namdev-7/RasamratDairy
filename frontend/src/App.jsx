import React from 'react';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import AppRoutes from './routes/AppRoutes';

export function App() {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AdminAuthProvider>
    </AuthProvider>
  );
}

export default App;
