import React, { useEffect } from 'react';
import { CheckCircle, AlertTriangle, Truck, ShoppingBag, X } from './Icons';

export const NotificationToast = ({ toast, onClose }) => {
  if (!toast) return null;

  const { title, message, type = 'order' } = toast;

  const getIcon = () => {
    if (title.toLowerCase().includes('accept')) {
      return <CheckCircle size={22} color="var(--color-primary)" />;
    }
    if (title.toLowerCase().includes('reject')) {
      return <AlertTriangle size={22} color="var(--color-error)" />;
    }
    if (title.toLowerCase().includes('nikal') || title.toLowerCase().includes('out for delivery')) {
      return <Truck size={22} color="var(--color-primary)" />;
    }
    if (title.toLowerCase().includes('deliver')) {
      return <CheckCircle size={22} color="var(--color-success)" />;
    }
    return <ShoppingBag size={22} color="var(--color-gold-hover)" />;
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        maxWidth: '380px',
        width: 'calc(100% - 40px)',
        backgroundColor: 'var(--color-cream-card)',
        borderRadius: 'var(--radius-md)',
        border: '2px solid var(--color-gold)',
        boxShadow: 'var(--shadow-wine)',
        padding: '1rem 1.1rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.85rem',
        animation: 'slideDownFade 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }}
    >
      <div
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-gold-soft)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        {getIcon()}
      </div>

      <div style={{ flex: 1 }}>
        <h4
          style={{
            fontSize: '0.9rem',
            fontWeight: '800',
            color: 'var(--color-primary)',
            margin: '0 0 0.2rem 0',
            lineHeight: '1.2'
          }}
        >
          {title}
        </h4>
        <p
          style={{
            fontSize: '0.8rem',
            color: 'var(--color-text-muted)',
            margin: 0,
            lineHeight: '1.45'
          }}
        >
          {message}
        </p>
      </div>

      <button
        type="button"
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--color-text-light)',
          cursor: 'pointer',
          padding: '0.2rem',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default NotificationToast;
