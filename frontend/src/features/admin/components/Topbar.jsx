import React from 'react';
import { Menu } from '../../../components/Icons';

export const Topbar = ({ currentPath, onToggleMobile }) => {
  const getPageTitle = (path) => {
    if (!path || path === '/admin' || path === '/admin/dashboard' || path === '/admin/') {
      return 'Admin Dashboard';
    }
    if (path.includes('/products')) return 'Products Management';
    if (path.includes('/categories')) return 'Categories Management';
    if (path.includes('/zones')) return 'Delivery Zones';
    if (path.includes('/orders')) return 'Orders Management';
    if (path.includes('/subscriptions')) return 'Subscriptions Management';
    if (path.includes('/settings')) return 'Admin Settings';
    return 'Admin Control Center';
  };

  return (
    <header
      style={{
        height: '64px',
        backgroundColor: 'var(--color-cream-card)',
        borderBottom: '1.5px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        boxShadow: 'var(--shadow-sm)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <button
          type="button"
          onClick={onToggleMobile}
          style={{
            background: 'none',
            border: '1px solid var(--color-border)',
            borderRadius: '6px',
            padding: '0.35rem 0.5rem',
            cursor: 'pointer',
            color: 'var(--color-primary)',
            display: 'none'
          }}
          className="admin-mobile-menu-btn"
          title="Toggle Menu"
        >
          <Menu size={20} />
        </button>

        <h3 className="font-display" style={{ fontSize: '1.15rem', color: 'var(--color-primary)', fontWeight: '800' }}>
          {getPageTitle(currentPath)}
        </h3>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <span className="badge-wine" style={{ fontSize: '0.725rem', padding: '0.2rem 0.6rem' }}>
          Mock Admin Mode
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-primary)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '0.85rem'
            }}
          >
            AD
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-primary)' }}>
            Admin
          </span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
