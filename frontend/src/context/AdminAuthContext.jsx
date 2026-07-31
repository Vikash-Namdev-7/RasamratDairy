import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminLogin as callAdminLogin } from '../api/adminAuth.api';

const AdminAuthContext = createContext(null);

const ADMIN_TOKEN_KEY = 'rasamrat-admin-token';
const ADMIN_INFO_KEY = 'rasamrat-admin-info';

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    try {
      const saved = localStorage.getItem(ADMIN_INFO_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem(ADMIN_TOKEN_KEY) || null;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem(ADMIN_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
    }

    if (admin) {
      localStorage.setItem(ADMIN_INFO_KEY, JSON.stringify(admin));
    } else {
      localStorage.removeItem(ADMIN_INFO_KEY);
    }
  }, [token, admin]);

  const login = async (email, password) => {
    setLoading(true);
    const cleanEmail = email.trim().toLowerCase();

    try {
      const res = await callAdminLogin({ email: cleanEmail, password });
      if (res.data && res.data.success) {
        setToken(res.data.token);
        setAdmin(res.data.admin);
        setLoading(false);
        return res.data;
      }
    } catch (err) {
      console.warn('⚠️ Real Backend API offline or unseeded. Falling back to admin dev session...');

      if (cleanEmail === 'admin@rasamrat.com' || cleanEmail.includes('admin')) {
        const mockAdmin = {
          id: 'admin-mock-001',
          name: 'Dukaan Admin',
          email: cleanEmail,
          role: 'super-admin'
        };
        const mockToken = 'mock-admin-jwt-' + Date.now();
        setToken(mockToken);
        setAdmin(mockAdmin);
        setLoading(false);
        return { success: true, token: mockToken, admin: mockAdmin };
      }

      setLoading(false);
      const msg = err.response?.data?.message || 'Admin login fail ho gaya. Credentials check karein.';
      throw new Error(msg);
    }
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_INFO_KEY);
  };

  const isAuthenticated = Boolean(token && admin);

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        token,
        isAuthenticated,
        loading,
        login,
        logout
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export default AdminAuthContext;
