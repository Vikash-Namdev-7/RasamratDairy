import React from 'react';
import Navbar from '../features/customer/components/Navbar';
import Footer from '../features/customer/components/Footer';

export const CustomerLayout = ({ currentPath, onNavigate, children }) => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-cream)' }}>
      <Navbar currentPath={currentPath} onNavigate={onNavigate} />
      <main style={{ flex: 1 }}>
        {children}
      </main>
      <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default CustomerLayout;
