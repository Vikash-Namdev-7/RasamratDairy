import React, { useState, useEffect } from 'react';
import CustomerLayout from '../layouts/CustomerLayout';
import AdminLayout from '../layouts/AdminLayout';
import Home from '../features/customer/pages/Home';
import Products from '../features/customer/pages/Products';
import ProductDetail from '../features/customer/pages/ProductDetail';
import Category from '../features/customer/pages/Category';
import Cart from '../features/customer/pages/Cart';
import Checkout from '../features/customer/pages/Checkout';
import OrderConfirmation from '../features/customer/pages/OrderConfirmation';
import Subscription from '../features/customer/pages/Subscription';
import MyOrders from '../features/customer/pages/MyOrders';
import Profile from '../features/customer/pages/Profile';
import Login from '../features/customer/pages/Login';
import Signup from '../features/customer/pages/Signup';
import NotFound from '../features/customer/pages/NotFound';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../context/AuthContext';
import { useAdminAuth } from '../context/AdminAuthContext';

import Dashboard from '../features/admin/pages/Dashboard';
import AdminProducts from '../features/admin/pages/AdminProducts';
import AdminCategories from '../features/admin/pages/AdminCategories';
import AdminZones from '../features/admin/pages/AdminZones';
import AdminOrders from '../features/admin/pages/AdminOrders';
import AdminSubscriptions from '../features/admin/pages/AdminSubscriptions';
import AdminSettings from '../features/admin/pages/AdminSettings';
import AdminLogin from '../features/admin/pages/AdminLogin';

export const AppRoutes = () => {
  const { isAuthenticated: isCustomerAuthenticated } = useAuth();
  const { isAuthenticated: isAdminAuthenticated } = useAdminAuth();
  const [currentPath, setCurrentPath] = useState(window.location.pathname || '/');

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pathname = currentPath.split('?')[0];

  // 1. Un-protected Admin Login route
  if (pathname === '/admin/login') {
    if (isAdminAuthenticated) {
      return (
        <AdminLayout currentPath="/admin/dashboard" onNavigate={navigate}>
          <Dashboard onNavigate={navigate} />
        </AdminLayout>
      );
    }
    return <AdminLogin onNavigate={navigate} />;
  }

  // 2. Admin Routes Protection
  if (pathname.startsWith('/admin')) {
    if (!isAdminAuthenticated) {
      return <AdminLogin onNavigate={navigate} />;
    }

    let AdminPageComponent = Dashboard;
    if (pathname === '/admin/products') AdminPageComponent = AdminProducts;
    else if (pathname === '/admin/categories') AdminPageComponent = AdminCategories;
    else if (pathname === '/admin/zones') AdminPageComponent = AdminZones;
    else if (pathname === '/admin/orders') AdminPageComponent = AdminOrders;
    else if (pathname === '/admin/subscriptions') AdminPageComponent = AdminSubscriptions;
    else if (pathname === '/admin/settings') AdminPageComponent = AdminSettings;

    return (
      <AdminLayout currentPath={currentPath} onNavigate={navigate}>
        <AdminPageComponent onNavigate={navigate} />
      </AdminLayout>
    );
  }

  // 3. Public Signup Route
  if (pathname === '/signup') {
    return <Signup onNavigate={navigate} redirectPath={new URLSearchParams(window.location.search).get('redirect')} />;
  }

  // 4. Customer Login route
  if (pathname === '/login') {
    if (isCustomerAuthenticated) {
      const redirectTarget = new URLSearchParams(window.location.search).get('redirect') || '/';
      return (
        <CustomerLayout currentPath={redirectTarget} onNavigate={navigate}>
          <Home onNavigate={navigate} />
        </CustomerLayout>
      );
    }
    return <Login onNavigate={navigate} redirectPath={new URLSearchParams(window.location.search).get('redirect')} />;
  }

  // 5. Customer Routes Container (Public & Protected via ProtectedRoute)
  const renderCustomerPage = () => {
    if (pathname === '/' || pathname === '') {
      return <Home onNavigate={navigate} />;
    }

    if (pathname === '/products') {
      return <Products onNavigate={navigate} />;
    }

    if (pathname.startsWith('/products/')) {
      const productId = pathname.replace('/products/', '').trim();
      return <ProductDetail productId={productId} onNavigate={navigate} />;
    }

    if (pathname.startsWith('/category/')) {
      const slug = pathname.replace('/category/', '').trim();
      return <Category slug={slug} onNavigate={navigate} />;
    }

    if (pathname === '/cart') {
      return <Cart onNavigate={navigate} />;
    }

    // Protected Customer Routes
    if (pathname === '/checkout') {
      return (
        <ProtectedRoute currentPath={currentPath} onNavigate={navigate}>
          <Checkout onNavigate={navigate} />
        </ProtectedRoute>
      );
    }

    if (pathname.startsWith('/order-confirmation')) {
      return (
        <ProtectedRoute currentPath={currentPath} onNavigate={navigate}>
          <OrderConfirmation onNavigate={navigate} />
        </ProtectedRoute>
      );
    }

    if (pathname === '/subscription') {
      return (
        <ProtectedRoute currentPath={currentPath} onNavigate={navigate}>
          <Subscription onNavigate={navigate} />
        </ProtectedRoute>
      );
    }

    if (pathname === '/my-orders') {
      return (
        <ProtectedRoute currentPath={currentPath} onNavigate={navigate}>
          <MyOrders onNavigate={navigate} />
        </ProtectedRoute>
      );
    }

    if (pathname === '/profile') {
      return (
        <ProtectedRoute currentPath={currentPath} onNavigate={navigate}>
          <Profile onNavigate={navigate} />
        </ProtectedRoute>
      );
    }

    // Unmatched Customer Route -> 404
    return <NotFound onNavigate={navigate} />;
  };

  return (
    <CustomerLayout currentPath={currentPath} onNavigate={navigate}>
      {renderCustomerPage()}
    </CustomerLayout>
  );
};

export default AppRoutes;
