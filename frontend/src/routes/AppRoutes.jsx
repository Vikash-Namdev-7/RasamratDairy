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

  // 1. Un-protected Admin Login route
  if (currentPath === '/admin/login') {
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
  if (currentPath.startsWith('/admin')) {
    if (!isAdminAuthenticated) {
      return <AdminLogin onNavigate={navigate} />;
    }

    let AdminPageComponent = Dashboard;
    if (currentPath === '/admin/products') AdminPageComponent = AdminProducts;
    else if (currentPath === '/admin/categories') AdminPageComponent = AdminCategories;
    else if (currentPath === '/admin/zones') AdminPageComponent = AdminZones;
    else if (currentPath === '/admin/orders') AdminPageComponent = AdminOrders;
    else if (currentPath === '/admin/subscriptions') AdminPageComponent = AdminSubscriptions;
    else if (currentPath === '/admin/settings') AdminPageComponent = AdminSettings;

    return (
      <AdminLayout currentPath={currentPath} onNavigate={navigate}>
        <AdminPageComponent onNavigate={navigate} />
      </AdminLayout>
    );
  }

  // 3. Public Signup Route
  if (currentPath === '/signup') {
    return <Signup onNavigate={navigate} />;
  }

  // 4. Customer Access Guard
  if (!isCustomerAuthenticated) {
    return <Login onNavigate={navigate} />;
  }

  // 5. Explicit Customer Login route when already authenticated -> Redirect to Home
  if (currentPath === '/login') {
    return (
      <CustomerLayout currentPath="/" onNavigate={navigate}>
        <Home onNavigate={navigate} />
      </CustomerLayout>
    );
  }

  // 6. Authenticated Customer Routes Container
  const renderCustomerPage = () => {
    if (currentPath === '/' || currentPath === '') {
      return <Home onNavigate={navigate} />;
    }

    if (currentPath === '/products' || currentPath.startsWith('/products?')) {
      return <Products onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/products/')) {
      const productId = currentPath.replace('/products/', '').trim();
      return <ProductDetail productId={productId} onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/category/')) {
      const slug = currentPath.replace('/category/', '').trim();
      return <Category slug={slug} onNavigate={navigate} />;
    }

    if (currentPath === '/cart') {
      return <Cart onNavigate={navigate} />;
    }

    if (currentPath === '/checkout') {
      return <Checkout onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/order-confirmation')) {
      return <OrderConfirmation onNavigate={navigate} />;
    }

    if (currentPath === '/subscription') {
      return <Subscription onNavigate={navigate} />;
    }

    if (currentPath === '/my-orders') {
      return <MyOrders onNavigate={navigate} />;
    }

    if (currentPath === '/profile') {
      return <Profile onNavigate={navigate} />;
    }

    // Default Fallback Page
    return <Home onNavigate={navigate} />;
  };

  return (
    <CustomerLayout currentPath={currentPath} onNavigate={navigate}>
      {renderCustomerPage()}
    </CustomerLayout>
  );
};

export default AppRoutes;
