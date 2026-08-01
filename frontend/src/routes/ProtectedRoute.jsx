import React from 'react';
import { useAuth } from '../context/AuthContext';
import Login from '../features/customer/pages/Login';

export const ProtectedRoute = ({ children, currentPath, onNavigate }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Login onNavigate={onNavigate} redirectPath={currentPath} />;
  }
  return children;
};

export default ProtectedRoute;
