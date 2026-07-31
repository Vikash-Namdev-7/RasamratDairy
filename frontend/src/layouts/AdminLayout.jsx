import React, { useState } from 'react';
import Sidebar from '../features/admin/components/Sidebar';
import Topbar from '../features/admin/components/Topbar';

export const AdminLayout = ({ currentPath, onNavigate, children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: 'var(--color-cream)' }}>
      <Sidebar
        currentPath={currentPath}
        onNavigate={onNavigate}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100vh', overflowY: 'auto' }}>
        <Topbar
          currentPath={currentPath}
          onToggleMobile={() => setMobileOpen(!mobileOpen)}
        />
        <main style={{ flex: 1 }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
