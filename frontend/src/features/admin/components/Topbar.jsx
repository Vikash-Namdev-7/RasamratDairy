import React from 'react';
import { Menu, ShieldCheck, User } from '../../../components/Icons';
import { useAdminAuth } from '../../../context/AdminAuthContext';

export const Topbar = ({ currentPath, onToggleMobile }) => {
  const { admin } = useAdminAuth();

  const getPageInfo = (path) => {
    if (!path || path === '/admin' || path === '/admin/dashboard' || path === '/admin/') {
      return { title: 'Dashboard Overview', tag: 'Real-time Metrics' };
    }
    if (path.includes('/products')) return { title: 'Products Catalog', tag: 'Inventory & Stock' };
    if (path.includes('/categories')) return { title: 'Categories Management', tag: 'Dairy Types' };
    if (path.includes('/zones')) return { title: 'Delivery Zones', tag: 'Rates & Distance' };
    if (path.includes('/orders')) return { title: 'Orders Center', tag: 'Fulfillment Lifecycle' };
    if (path.includes('/subscriptions')) return { title: 'Subscriptions Hub', tag: 'Daily Dispatches' };
    if (path.includes('/settings')) return { title: 'Store Settings', tag: 'Configuration' };
    return { title: 'Admin Control Center', tag: 'Management' };
  };

  const pageInfo = getPageInfo(currentPath);
  const adminName = admin?.name || 'Dukaan Admin';
  const adminRole = admin?.role === 'super-admin' ? 'Super Admin' : (admin?.role || 'Store Staff');
  const initials = adminName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <header
      style={{
        height: '64px',
        backgroundColor: '#FFFFFF',
        borderBottom: '1.5px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}
    >
      {/* Left: Mobile Toggle & Page Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <button
          type="button"
          onClick={onToggleMobile}
          style={{
            background: 'var(--color-cream)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.35rem 0.55rem',
            cursor: 'pointer',
            color: 'var(--color-primary)',
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          className="admin-mobile-menu-btn"
          title="Toggle Sidebar"
        >
          <Menu size={20} />
        </button>

        <div>
          <h3
            className="font-display"
            style={{
              fontSize: '1.15rem',
              color: 'var(--color-primary)',
              fontWeight: '800',
              lineHeight: 1.1,
              margin: 0
            }}
          >
            {pageInfo.title}
          </h3>
          <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: '600', letterSpacing: '0.3px' }}>
            {pageInfo.tag}
          </span>
        </div>
      </div>

      {/* Right: Real Admin Profile Badge & Status Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {/* Live Admin Role Badge */}
        <span
          style={{
            backgroundColor: 'rgba(212, 165, 66, 0.12)',
            border: '1px solid rgba(212, 165, 66, 0.4)',
            color: 'var(--color-gold-hover)',
            fontSize: '0.725rem',
            fontWeight: '800',
            padding: '0.25rem 0.65rem',
            borderRadius: 'var(--radius-full)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            letterSpacing: '0.4px',
            textTransform: 'uppercase'
          }}
        >
          <ShieldCheck size={14} color="var(--color-gold-hover)" />
          <span>{adminRole}</span>
        </span>

        {/* User Avatar & Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '800',
              fontSize: '0.85rem',
              boxShadow: 'var(--shadow-sm)',
              border: '1.5px solid var(--color-gold)'
            }}
          >
            {initials || <User size={18} />}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--color-primary)', lineHeight: 1.1 }}>
              {adminName}
            </span>
            <span style={{ fontSize: '0.675rem', color: 'var(--color-text-muted)', fontWeight: '600' }}>
              Online
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
