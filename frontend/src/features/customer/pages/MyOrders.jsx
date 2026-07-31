import React, { useState, useEffect } from 'react';
import { mockOrders } from '../../admin/data/mockOrders';
import { Clock, Truck, CheckCircle, ArrowLeft, ShoppingBag } from '../../../components/Icons';
import { formatCurrency } from '../../../utils/formatCurrency';
import ordersApi from '../../../api/orders.api';

export const MyOrders = ({ onNavigate }) => {
  const [orders, setOrders] = useState(mockOrders);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchOrders() {
      try {
        setLoading(true);
        const res = await ordersApi.getMyOrders();
        if (isMounted && res.data && Array.isArray(res.data.data)) {
          setOrders(res.data.data);
        }
      } catch (err) {
        console.warn('⚠️ Real API offline, using local fallback orders for My Orders');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchOrders();
    return () => { isMounted = false; };
  }, []);

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
              fontSize: '0.875rem',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={16} color="var(--color-primary)" /> Back to Home
          </button>
        </div>

        {/* Title */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="font-display" style={{ fontSize: '1.85rem', color: 'var(--color-primary)', fontWeight: '800', lineHeight: 1.2 }}>
              Mere Orders Ki History
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
              Aapke pichhle sabhi fresh dairy orders ki status aur delivery updates.
            </p>
          </div>
        </div>

        {/* Orders List */}
        {orders.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {orders.map((order) => {
              const badge = getStatusBadge(order.status);
              const orderIdStr = order.orderNumber || order.id || order._id;
              const dateStr = order.createdAt ? new Date(order.createdAt).toLocaleDateString('hi-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : (order.date || 'Today');

              return (
                <div
                  key={order._id || order.id || order.orderNumber}
                  style={{
                    backgroundColor: 'var(--color-cream-card)',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--color-border)',
                    padding: '1.25rem',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  {/* Header Row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--color-border)' }}>
                    <div>
                      <span style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--color-primary)' }}>
                        {orderIdStr}
                      </span>
                      <span style={{ fontSize: '0.775rem', color: 'var(--color-text-muted)', marginLeft: '0.6rem' }}>
                        • {dateStr}
                      </span>
                    </div>

                    <span
                      style={{
                        padding: '0.35rem 0.85rem',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: badge.bg,
                        color: badge.color,
                        border: `1px solid ${badge.border}`,
                        fontSize: '0.775rem',
                        fontWeight: '800'
                      }}
                    >
                      {badge.label}
                    </span>
                  </div>

                  {/* Delivery Time / Reject Reason Alert Box */}
                  {order.status === 'accepted' && order.deliveryTime && (
                    <div style={{ backgroundColor: 'rgba(28, 43, 74, 0.06)', border: '1px solid var(--color-primary-light)', borderRadius: 'var(--radius-sm)', padding: '0.65rem 0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Clock size={16} color="var(--color-primary)" />
                      <span style={{ fontSize: '0.825rem', fontWeight: '700', color: 'var(--color-primary)' }}>
                        Estimated Delivery Time: {order.deliveryTime}
                      </span>
                    </div>
                  )}

                  {order.status === 'rejected' && order.rejectReason && (
                    <div style={{ backgroundColor: 'var(--color-error-bg)', border: '1px solid var(--color-error-border)', borderRadius: 'var(--radius-sm)', padding: '0.65rem 0.85rem', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '0.825rem', fontWeight: '700', color: 'var(--color-error)' }}>
                        🔴 Rejection Reason: {order.rejectReason}
                      </span>
                    </div>
                  )}

                  {/* Items List Snapshot */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', marginBottom: '1rem' }}>
                    {order.items && order.items.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <span style={{ fontWeight: '600', color: 'var(--color-primary)' }}>
                          {item.name || item.title} <span style={{ color: 'var(--color-text-muted)', fontSize: '0.775rem' }}>(x{item.qty})</span>
                        </span>
                        <span style={{ fontWeight: '700', color: 'var(--color-primary)' }}>
                          {formatCurrency((item.price || 0) * item.qty)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Footer Totals Row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px dashed var(--color-border)', fontSize: '0.875rem' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      Address: <span style={{ fontWeight: '600', color: 'var(--color-primary)' }}>{order.address || order.customerAddress}</span>
                    </div>
                    <div style={{ fontWeight: '900', fontSize: '1.05rem', color: 'var(--color-primary)' }}>
                      Total: {formatCurrency(order.totalPayable || order.totalAmount || 0)}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', backgroundColor: 'var(--color-cream-card)', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-border)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🛍️</div>
            <h3 className="font-display" style={{ fontSize: '1.25rem', color: 'var(--color-primary)', fontWeight: '700', marginBottom: '0.4rem' }}>
              Aapne Abhi Tak Koi Order Nahi Kiya Hai
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
              Hamare fresh doodh, dahi, paneer aur desi ghee products browse karein aur pehla order place karein!
            </p>
            <button type="button" className="btn btn-primary" onClick={() => onNavigate && onNavigate('/products')}>
              Shop Fresh Dairy Products
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default MyOrders;
