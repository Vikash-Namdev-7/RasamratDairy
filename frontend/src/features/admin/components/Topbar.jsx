import React, { useState } from 'react';
import { Menu, ShieldCheck, User, Bell } from '../../../components/Icons';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { useNotifications } from '../../../context/NotificationContext';

export const Topbar = ({ currentPath, onToggleMobile }) => {
  const { admin } = useAdminAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

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

      {/* Right: Real Admin Profile Badge, Notification Bell & Status Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {/* Admin Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: notifDropdownOpen ? 'var(--color-gold-soft)' : 'var(--color-cream)',
              border: '1.5px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--color-primary)',
              position: 'relative',
              transition: 'all 0.2s ease'
            }}
            title="Admin Notifications"
          >
            <Bell size={18} color="var(--color-primary)" />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  backgroundColor: 'var(--color-error)',
                  color: '#FFFFFF',
                  fontWeight: '900',
                  fontSize: '0.65rem',
                  minWidth: '16px',
                  height: '16px',
                  padding: '0 4px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1.5px solid #FFFFFF',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {/* Admin Notification Dropdown */}
          {notifDropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '0.5rem',
                width: '320px',
                backgroundColor: 'var(--color-cream-card)',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--color-border)',
                boxShadow: 'var(--shadow-md)',
                overflow: 'hidden',
                zIndex: 115,
                animation: 'slideDownFade 0.2s ease'
              }}
            >
              <div
                style={{
                  padding: '0.75rem 1rem',
                  borderBottom: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: 'var(--color-cream-alt)'
                }}
              >
                <h4 style={{ fontSize: '0.875rem', fontWeight: '800', color: 'var(--color-primary)', margin: 0 }}>
                  Store Alerts {unreadCount > 0 && <span style={{ color: 'var(--color-wine)' }}>({unreadCount})</span>}
                </h4>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={() => markAllAsRead()}
                    style={{ background: 'none', border: 'none', color: 'var(--color-wine)', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                {notifications.length > 0 ? (
                  notifications.map((n) => {
                    const id = n._id || n.id;
                    return (
                      <div
                        key={id}
                        onClick={() => {
                          markAsRead(id);
                          setNotifDropdownOpen(false);
                          window.location.href = '/admin/orders';
                        }}
                        style={{
                          padding: '0.75rem 1rem',
                          borderBottom: '1px solid var(--color-border)',
                          backgroundColor: n.isRead ? 'transparent' : 'var(--color-gold-soft)',
                          cursor: 'pointer',
                          transition: 'background 0.2s'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--color-primary)' }}>
                            {n.title}
                          </span>
                          {!n.isRead && (
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-wine)' }} />
                          )}
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: '1.4' }}>
                          {n.message}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                    Koi store alerts nahi hain.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
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
