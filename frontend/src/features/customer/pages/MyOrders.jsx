import React from 'react';
import { mockOrders } from '../../admin/data/mockOrders';
import { Clock, Truck, CheckCircle, ArrowLeft, ShoppingBag } from '../../../components/Icons';
import { formatCurrency } from '../../../utils/formatCurrency';

export const MyOrders = ({ onNavigate }) => {

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return { label: '🟡 Waiting For Store Approval', bg: 'var(--color-gold-soft)', color: 'var(--color-gold-hover)', border: 'var(--color-gold)' };
      case 'accepted':
        return { label: '🔵 Order Accepted & Preparing', bg: 'rgba(28, 43, 74, 0.1)', color: 'var(--color-primary)', border: 'var(--color-primary-light)' };
      case 'out-for-delivery':
        return { label: '🛵 Out For Delivery', bg: 'rgba(59, 130, 246, 0.12)', color: '#1D4ED8', border: '#3B82F6' };
      case 'delivered':
        return { label: '🟢 Delivered', bg: 'var(--color-success-bg)', color: 'var(--color-success)', border: 'var(--color-success-border)' };
      case 'rejected':
        return { label: '🔴 Rejected', bg: 'var(--color-error-bg)', color: 'var(--color-error)', border: 'var(--color-error-border)' };
      default:
        return { label: status, bg: 'var(--color-cream)', color: 'var(--color-text-muted)', border: 'var(--color-border)' };
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--color-cream)', minHeight: '80vh', padding: '2rem 1rem' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        
        {/* Back Button Header */}
        <div style={{ marginBottom: '1.25rem' }}>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('/')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'none',
              border: 'none',
              color: 'var(--color-primary)',
              fontWeight: '700',
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={16} /> Back to Home
          </button>
        </div>

        <div style={{ marginBottom: '1.75rem' }}>
          <h1 className="font-display" style={{ fontSize: '1.75rem', color: 'var(--color-primary)', fontWeight: '800', lineHeight: '1.2' }}>
            Mere Orders (My Orders)
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            Aapke haal hi me diye gaye COD orders ki live status aur delivery timing.
          </p>
        </div>

        {mockOrders.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {mockOrders.map((ord) => {
              const badge = getStatusBadge(ord.status);
              return (
                <div
                  key={ord.id}
                  style={{
                    backgroundColor: 'var(--color-cream-card)',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--color-border)',
                    padding: '1.25rem',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                    <div>
                      <span style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--color-primary)' }}>
                        {ord.id}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>
                        Area: {ord.zone}
                      </span>
                    </div>

                    <span
                      style={{
                        fontSize: '0.725rem',
                        fontWeight: '800',
                        padding: '0.25rem 0.65rem',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: badge.bg,
                        color: badge.color,
                        border: `1px solid ${badge.border}`
                      }}
                    >
                      {badge.label}
                    </span>
                  </div>

                  {/* Delivery Time / Status Alert Banner */}
                  {ord.deliveryTime && ord.status !== 'rejected' && (
                    <div style={{ backgroundColor: 'var(--color-gold-soft)', border: '1px solid var(--color-gold)', borderRadius: 'var(--radius-sm)', padding: '0.65rem 0.85rem', marginBottom: '0.85rem', color: 'var(--color-primary)', fontWeight: '700', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Clock size={16} color="var(--color-gold-hover)" />
                      <span>Expected Delivery: <strong>{ord.deliveryTime}</strong></span>
                    </div>
                  )}

                  {ord.status === 'rejected' && (
                    <div style={{ backgroundColor: 'var(--color-error-bg)', border: '1px solid var(--color-error-border)', borderRadius: 'var(--radius-sm)', padding: '0.65rem 0.85rem', marginBottom: '0.85rem', color: 'var(--color-error)', fontWeight: '700', fontSize: '0.85rem' }}>
                      ❌ Order Cancelled: {ord.rejectReason || 'Store unavailable'}
                    </div>
                  )}

                  {/* Items List */}
                  <div style={{ marginBottom: '0.85rem', fontSize: '0.85rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                      Items:
                    </span>
                    {ord.items.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-primary)', marginBottom: '0.2rem' }}>
                        <span>{item.name} × {item.qty}</span>
                        <span style={{ fontWeight: '600' }}>{formatCurrency(item.price * item.qty)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px dashed var(--color-border)', fontSize: '0.95rem' }}>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Total Payable (COD):</span>
                    <span style={{ fontWeight: '800', color: 'var(--color-primary)', fontSize: '1.1rem' }}>
                      {formatCurrency(ord.totalPayable)}
                    </span>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ backgroundColor: 'var(--color-cream-card)', borderRadius: 'var(--radius-md)', padding: '3rem 1rem', textAlign: 'center' }}>
            <ShoppingBag size={32} color="var(--color-text-muted)" />
            <h3 className="font-display" style={{ fontSize: '1.2rem', color: 'var(--color-primary)', marginTop: '0.5rem' }}>
              Koi Active Order Nahi Hai
            </h3>
          </div>
        )}

      </div>
    </div>
  );
};

export default MyOrders;
