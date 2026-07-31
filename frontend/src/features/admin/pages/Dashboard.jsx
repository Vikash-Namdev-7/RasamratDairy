import React from 'react';
import { dashboardStats } from '../data/dashboardStats';
import { mockOrders } from '../data/mockOrders';
import { mockActivity } from '../data/mockActivity';
import { ShoppingBag, Clock, ChevronRight, Plus, ArrowRight } from '../../../components/Icons';
import { formatCurrency } from '../../../utils/formatCurrency';

export const Dashboard = ({ onNavigate }) => {

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return { label: 'Pending', bg: 'var(--color-gold-soft)', color: 'var(--color-gold-hover)', border: 'var(--color-gold)' };
      case 'accepted':
        return { label: 'Accepted', bg: 'rgba(28, 43, 74, 0.1)', color: 'var(--color-primary)', border: 'var(--color-primary-light)' };
      case 'delivered':
        return { label: 'Delivered', bg: 'var(--color-success-bg)', color: 'var(--color-success)', border: 'var(--color-success-border)' };
      case 'rejected':
        return { label: 'Rejected', bg: 'var(--color-error-bg)', color: 'var(--color-error)', border: 'var(--color-error-border)' };
      default:
        return { label: status, bg: 'var(--color-cream)', color: 'var(--color-text-muted)', border: 'var(--color-border)' };
    }
  };

  const formatRelativeTime = (isoString) => {
    if (!isoString) return 'Today';
    const date = new Date(isoString);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffHours < 1) return '30 min pehle';
    if (diffHours < 24) return `${diffHours} ghante pehle`;
    return `${Math.floor(diffHours / 24)} din pehle`;
  };

  return (
    <div className="admin-page-container">
      
      {/* Page Title & Tagline */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 className="font-display" style={{ fontSize: '1.65rem', color: 'var(--color-primary)', fontWeight: '800', lineHeight: '1.2' }}>
          Admin Dashboard & Analytics
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
          Rasamrat Dairy ki daily sales, active subscriptions aur orders summary.
        </p>
      </div>

      {/* Section A — Stat Cards Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}
      >
        {dashboardStats.map((stat) => {
          const isUp = stat.trend === 'up';
          return (
            <div
              key={stat.id}
              style={{
                backgroundColor: 'var(--color-cream-card)',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--color-border)',
                padding: '1.25rem',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                  {stat.label}
                </span>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--color-cream)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShoppingBag size={16} color="var(--color-primary)" />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '1.65rem', fontWeight: '800', color: 'var(--color-primary)' }}>
                  {stat.value}
                </div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: '800',
                    padding: '0.15rem 0.45rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: isUp ? 'var(--color-success-bg)' : 'var(--color-error-bg)',
                    color: isUp ? 'var(--color-success)' : 'var(--color-error)'
                  }}
                >
                  {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Section D — Quick Actions Bar */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-primary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Quick Admin Actions
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('/admin/products')}
            style={{
              padding: '0.6rem 1rem',
              borderRadius: 'var(--radius-sm)',
              border: '1.5px solid var(--color-primary)',
              backgroundColor: 'var(--color-primary)',
              color: '#FFFFFF',
              fontSize: '0.825rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Plus size={15} color="#FFFFFF" /> Naya Product Add Karein
          </button>

          <button
            type="button"
            onClick={() => onNavigate && onNavigate('/admin/zones')}
            style={{
              padding: '0.6rem 1rem',
              borderRadius: 'var(--radius-sm)',
              border: '1.5px solid var(--color-border)',
              backgroundColor: 'var(--color-cream-card)',
              color: 'var(--color-primary)',
              fontSize: '0.825rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            Delivery Zones Manage Karein <ArrowRight size={14} />
          </button>

          <button
            type="button"
            onClick={() => onNavigate && onNavigate('/admin/subscriptions')}
            style={{
              padding: '0.6rem 1rem',
              borderRadius: 'var(--radius-sm)',
              border: '1.5px solid var(--color-border)',
              backgroundColor: 'var(--color-cream-card)',
              color: 'var(--color-primary)',
              fontSize: '0.825rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            Active Subscriptions Check Karein <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Main 2-Column Section: Orders Table (Left) + Activity Feed (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.75rem', alignItems: 'start' }} className="products-listing-layout">
        
        {/* Section B — Recent Orders Table */}
        <div
          style={{
            backgroundColor: 'var(--color-cream-card)',
            borderRadius: 'var(--radius-md)',
            border: '1.5px solid var(--color-border)',
            padding: '1.25rem',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.6rem', borderBottom: '1px solid var(--color-border)' }}>
            <h2 className="font-display" style={{ fontSize: '1.2rem', color: 'var(--color-primary)', fontWeight: '700' }}>
              Recent Delivery Orders ({mockOrders.length})
            </h2>

            <button
              type="button"
              onClick={() => onNavigate && onNavigate('/admin/orders')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-accent)',
                fontWeight: '700',
                fontSize: '0.825rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              View All Orders <ChevronRight size={14} />
            </button>
          </div>

          {/* Table Container */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1.5px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                  <th style={{ padding: '0.65rem 0.75rem', fontWeight: '700' }}>Order ID</th>
                  <th style={{ padding: '0.65rem 0.75rem', fontWeight: '700' }}>Customer</th>
                  <th style={{ padding: '0.65rem 0.75rem', fontWeight: '700' }}>Zone</th>
                  <th style={{ padding: '0.65rem 0.75rem', fontWeight: '700' }}>Amount</th>
                  <th style={{ padding: '0.65rem 0.75rem', fontWeight: '700' }}>Status</th>
                  <th style={{ padding: '0.65rem 0.75rem', fontWeight: '700' }}>Placed At</th>
                  <th style={{ padding: '0.65rem 0.75rem', fontWeight: '700', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {mockOrders.map((ord) => {
                  const badge = getStatusBadge(ord.status);
                  return (
                    <tr key={ord.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: '700', color: 'var(--color-primary)' }}>
                        {ord.id}
                      </td>
                      <td style={{ padding: '0.75rem', fontWeight: '600', color: 'var(--color-primary)' }}>
                        {ord.customerName}
                        <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', display: 'block' }}>
                          {Array.isArray(ord.items) ? ord.items.reduce((sum, item) => sum + item.qty, 0) : (ord.items || 0)} items
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {ord.zone}
                      </td>
                      <td style={{ padding: '0.75rem', fontWeight: '800', color: 'var(--color-primary)' }}>
                        {formatCurrency(ord.totalPayable !== undefined ? ord.totalPayable : ord.amount)}
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: '800',
                            padding: '0.2rem 0.55rem',
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: badge.bg,
                            color: badge.color,
                            border: `1px solid ${badge.border}`,
                            textTransform: 'uppercase',
                            letterSpacing: '0.4px',
                            display: 'inline-block'
                          }}
                        >
                          {badge.label}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {formatRelativeTime(ord.placedAt)}
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => onNavigate && onNavigate('/admin/orders')}
                          style={{
                            backgroundColor: 'var(--color-cream)',
                            border: '1px solid var(--color-border)',
                            borderRadius: '4px',
                            padding: '0.25rem 0.55rem',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            color: 'var(--color-primary)',
                            cursor: 'pointer'
                          }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section C — Recent Activity Feed */}
        <div
          style={{
            backgroundColor: 'var(--color-cream-card)',
            borderRadius: 'var(--radius-md)',
            border: '1.5px solid var(--color-border)',
            padding: '1.25rem',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <h2 className="font-display" style={{ fontSize: '1.15rem', color: 'var(--color-primary)', fontWeight: '700', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border)' }}>
            Live Activity Feed
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
            {mockActivity.map((act) => (
              <div key={act.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-accent)', marginTop: '0.4rem', flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: '0.825rem', color: 'var(--color-primary)', fontWeight: '600', margin: 0, lineHeight: '1.4' }}>
                    {act.text}
                  </p>
                  <span style={{ fontSize: '0.725rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.15rem' }}>
                    <Clock size={12} color="var(--color-gold-hover)" /> {act.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
