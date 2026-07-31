import React from 'react';
import { CheckCircle, ArrowRight, Clock, ShieldCheck } from '../../../components/Icons';

export const OrderConfirmation = ({ onNavigate }) => {
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get('id') || `#RD-${Math.floor(1000 + Math.random() * 9000)}`;

  return (
    <div style={{ paddingTop: '3.5rem', paddingBottom: '4.5rem', textAlign: 'center' }}>
      <div className="container" style={{ maxWidth: '540px' }}>
        
        <div
          style={{
            backgroundColor: 'var(--color-cream-card)',
            borderRadius: 'var(--radius-lg)',
            border: '2px solid var(--color-gold)',
            padding: '2.5rem 1.75rem',
            boxShadow: 'var(--shadow-strong)'
          }}
        >
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(34, 197, 94, 0.12)', color: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <CheckCircle size={40} color="#22C55E" />
          </div>

          <span className="badge-gold" style={{ marginBottom: '0.65rem' }}>
            Order Placed Successfully! 🎉
          </span>

          <h1 className="font-display" style={{ fontSize: '1.75rem', color: 'var(--color-navy)', fontWeight: '800', marginBottom: '0.4rem' }}>
            Aapka Order Place Ho Gaya!
          </h1>

          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: '1.5', marginBottom: '1.5rem' }}>
            Dukaan owner jaldi hi aapka order confirm karenge aur delivery timing ke baare me update denge.
          </p>

          <div style={{ backgroundColor: 'var(--color-cream)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', padding: '1rem 1.15rem', marginBottom: '1.75rem', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Order ID:</span>
              <span style={{ fontWeight: '800', color: 'var(--color-navy)' }}>{orderId}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Status:</span>
              <span style={{ fontWeight: '700', color: 'var(--color-wine)' }}>Pending Confirmation</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Payment Method:</span>
              <span style={{ fontWeight: '700', color: '#15803D' }}>Cash on Delivery (COD)</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => onNavigate && onNavigate('/')}
              style={{ padding: '0.75rem 1.4rem', fontSize: '0.875rem' }}
            >
              Back to Home <ArrowRight size={16} />
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => onNavigate && onNavigate('/products')}
              style={{ padding: '0.75rem 1.4rem', fontSize: '0.875rem' }}
            >
              Order More Items
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderConfirmation;
