import React from 'react';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Access Denied</div>;
  }
  return children;
};

export default ProtectedRoute;
