import React from 'react';
import { ChevronRight, X } from '../../../components/Icons';

export const Sidebar = ({ currentPath, onNavigate, mobileOpen, onCloseMobile }) => {
  const menu = [
    { label: 'Dashboard', path: '/admin/dashboard' },
    { label: 'Products', path: '/admin/products' },
    { label: 'Categories', path: '/admin/categories' },
    { label: 'Zones', path: '/admin/zones' },
    { label: 'Orders', path: '/admin/orders' },
    { label: 'Subscriptions', path: '/admin/subscriptions' },
    { label: 'Settings', path: '/admin/settings' },
  ];

  const handleNav = (path) => {
    if (onNavigate) onNavigate(path);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(3px)',
            zIndex: 140
          }}
          className="mobile-backdrop"
        />
      )}

      <aside
        style={{
          width: '250px',
          flexShrink: 0,
          backgroundColor: 'var(--color-navy-dark)',
          color: '#FFFFFF',
          padding: '1.5rem 1rem',
          height: '100vh',
          position: 'sticky',
          top: 0,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 150,
          borderRight: '1px solid rgba(255,255,255,0.1)',
          transition: 'transform 0.3s ease'
        }}
        className={`admin-sidebar ${mobileOpen ? 'mobile-open' : ''}`}
      >
        {/* Header & Mobile Close */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div
            onClick={() => handleNav('/')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}
          >
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--color-wine)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-wine)' }}>
              <span className="font-display" style={{ color: 'var(--color-gold)', fontWeight: '900', fontSize: '1.1rem' }}>R</span>
            </div>
            <div>
              <span className="font-display" style={{ fontSize: '1.05rem', fontWeight: '800', display: 'block', lineHeight: 1.1 }}>Rasamrat Admin</span>
              <span style={{ fontSize: '0.675rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Control Panel</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onCloseMobile}
            style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', display: 'none' }}
            className="sidebar-close-btn"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
          {menu.map((item) => {
            const isActive = currentPath === item.path || (item.path === '/admin/dashboard' && (currentPath === '/admin' || currentPath === '/admin/'));
            return (
              <a
                key={item.path}
                href={item.path}
                onClick={(e) => {
                  e.preventDefault();
                  handleNav(item.path);
                }}
                style={{
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  color: isActive ? 'var(--color-gold)' : '#CBD5E1',
                  backgroundColor: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--color-gold)' : '3px solid transparent',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? '700' : '500',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>{item.label}</span>
                <ChevronRight size={13} color={isActive ? 'var(--color-gold)' : 'rgba(255,255,255,0.3)'} />
              </a>
            );
          })}
        </nav>

        {/* Customer Site Quick Back Switcher */}
        <div style={{ paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button
            type="button"
            onClick={() => handleNav('/')}
            style={{
              width: '100%',
              padding: '0.55rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(255,255,255,0.15)',
              backgroundColor: 'rgba(255,255,255,0.05)',
              color: '#FFFFFF',
              fontSize: '0.8rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem'
            }}
          >
            <span>🌐 Customer Website</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
