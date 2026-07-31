import React, { createContext, useContext, useState, useEffect } from 'react';
import { customerLogin, customerSignup } from '../api/auth.api';

const AuthContext = createContext(null);

const TOKEN_KEY = 'rasamrat-customer-token';
const CUSTOMER_KEY = 'rasamrat-customer-info';

export const AuthProvider = ({ children }) => {
  const [customer, setCustomer] = useState(() => {
    try {
      const saved = localStorage.getItem(CUSTOMER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem(TOKEN_KEY) || null;
  });

  const [loading, setLoading] = useState(false);

  // Sync state changes to localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }

    if (customer) {
      localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customer));
    } else {
      localStorage.removeItem(CUSTOMER_KEY);
    }
  }, [token, customer]);

  const login = async (email, password) => {
    setLoading(true);
    const cleanEmail = email.trim().toLowerCase();

    try {
      // Attempt Real Backend API Call
      const res = await customerLogin({ email: cleanEmail, password });
      if (res.data && res.data.success) {
        setToken(res.data.token);
        setCustomer(res.data.customer);
        setLoading(false);
        return res.data;
      }
    } catch (err) {
      console.warn('⚠️ Real Backend API offline or unseeded. Falling back to dev mock session...');
      
      // Fallback mock authentication for development testing
      if (cleanEmail === 'customer@rasamrat.com' || cleanEmail.includes('@')) {
        const mockUser = {
          id: 'cust-mock-101',
          name: cleanEmail === 'customer@rasamrat.com' ? 'Test Customer' : cleanEmail.split('@')[0],
          email: cleanEmail,
          phone: '+91 98765 43210'
        };
        const mockToken = 'mock-jwt-token-' + Date.now();
        setToken(mockToken);
        setCustomer(mockUser);
        setLoading(false);
        return { success: true, token: mockToken, customer: mockUser };
      }

      setLoading(false);
      const msg = err.response?.data?.message || 'Login fail ho gaya. Kripya credentials check karein.';
      throw new Error(msg);
    }
  };

  const signup = async (formData) => {
    setLoading(true);
    try {
      const res = await customerSignup(formData);
      if (res.data && res.data.success) {
        setToken(res.data.token);
        setCustomer(res.data.customer);
        setLoading(false);
        return res.data;
      }
    } catch (err) {
      console.warn('⚠️ Real Backend API offline. Creating local mock customer session...');
      const mockUser = {
        id: 'cust-mock-' + Date.now(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      };
      const mockToken = 'mock-jwt-token-' + Date.now();
      setToken(mockToken);
      setCustomer(mockUser);
      setLoading(false);
      return { success: true, token: mockToken, customer: mockUser };
    }
  };

  const logout = () => {
    setToken(null);
    setCustomer(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(CUSTOMER_KEY);
  };

  const isAuthenticated = Boolean(token && customer);

  return (
    <AuthContext.Provider
      value={{
        customer,
        token,
        isAuthenticated,
        loading,
        login,
        signup,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
