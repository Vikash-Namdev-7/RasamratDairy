import React, { useState, useMemo } from 'react';
import { mySubscriptions as initialSubscriptions } from '../../customer/data/mySubscriptions';
import { Search, X, Check, CheckCircle, Clock, Truck, ShieldCheck, Sun, Moon, Trash } from '../../../components/Icons';

export const AdminSubscriptions = () => {
  const [subscriptionsList, setSubscriptionsList] = useState(initialSubscriptions);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'morning' | 'evening' | 'active' | 'paused'
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Dynamic Summary Stats Calculations
  const stats = useMemo(() => {
    const activeSubs = subscriptionsList.filter((s) => s.status === 'active');
    const pausedSubs = subscriptionsList.filter((s) => s.status === 'paused');

    const morningLitre = activeSubs
      .filter((s) => s.slot === 'morning')
      .reduce((sum, s) => sum + s.litres, 0);

    const eveningLitre = activeSubs
      .filter((s) => s.slot === 'evening')
      .reduce((sum, s) => sum + s.litres, 0);

    return {
      activeCount: activeSubs.length,
      morningLitre,
      eveningLitre,
      pausedCount: pausedSubs.length
    };
  }, [subscriptionsList]);

  // Tomorrow Dispatch Calculation (Active + Not Paused for tomorrow)
  const tomorrowDispatch = useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const isEligible = (sub) => {
      if (sub.status !== 'active') return false;
      if (sub.pausedDates && sub.pausedDates.includes(tomorrowStr)) return false;
      return true;
    };

    const morningSubs = subscriptionsList.filter((s) => s.slot === 'morning' && isEligible(s));
    const eveningSubs = subscriptionsList.filter((s) => s.slot === 'evening' && isEligible(s));

    const morningTotalLitres = morningSubs.reduce((sum, s) => sum + s.litres, 0);
    const eveningTotalLitres = eveningSubs.reduce((sum, s) => sum + s.litres, 0);

    return {
      morningSubs,
      morningTotalLitres,
      eveningSubs,
      eveningTotalLitres
    };
  }, [subscriptionsList]);

  // Filtered Subscriptions
  const filteredSubscriptions = useMemo(() => {
    let result = [...subscriptionsList];

    if (activeTab === 'morning') {
      result = result.filter((s) => s.slot === 'morning');
    } else if (activeTab === 'evening') {
      result = result.filter((s) => s.slot === 'evening');
    } else if (activeTab === 'active') {
      result = result.filter((s) => s.status === 'active');
    } else if (activeTab === 'paused') {
      result = result.filter((s) => s.status === 'paused');
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.customerName.toLowerCase().includes(q) ||
          (s.customerPhone && s.customerPhone.toLowerCase().includes(q)) ||
          s.address.toLowerCase().includes(q) ||
          (s.milkTypeName && s.milkTypeName.toLowerCase().includes(q))
      );
    }

    return result;
  }, [subscriptionsList, activeTab, searchQuery]);

  // Toggle Subscription Pause / Resume
  const handleToggleStatus = (id) => {
    setSubscriptionsList((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const newStatus = s.status === 'active' ? 'paused' : 'active';
          return { ...s, status: newStatus };
        }
        return s;
      })
    );
    showToast('Subscription status update ho gaya!');
  };

  // Delete / Cancel Subscription
  const handleDeleteSubscription = (sub) => {
    if (window.confirm(`Pakka "${sub.customerName}" ki subscription cancel karna hai?`)) {
      setSubscriptionsList((prev) => prev.filter((s) => s.id !== sub.id));
      showToast(`"${sub.customerName}" ki subscription delete kar di gayi.`);
    }
  };

  return (
    <div className="admin-page-container">
      
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div
          style={{
            backgroundColor: 'var(--color-success-bg)',
            border: '1.5px solid var(--color-success-border)',
            color: 'var(--color-success)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1.25rem',
            marginBottom: '1.25rem',
            fontWeight: '700',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: 'var(--shadow-sm)',
            animation: 'slideDownFade 0.3s ease'
          }}
        >
          <CheckCircle size={18} color="var(--color-success)" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Actions Strip */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="font-display" style={{ fontSize: '1.65rem', color: 'var(--color-primary)', fontWeight: '800', lineHeight: '1.2' }}>
            Subscriptions Management
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
            Daily milk delivery dispatches, active plans aur customer pauses manage karein.
          </p>
        </div>

        {/* Search Box */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--color-cream-card)', padding: '0.45rem 0.85rem', borderRadius: 'var(--radius-full)', border: '1.5px solid var(--color-border)', minWidth: '260px' }}>
          <Search size={16} color="var(--color-text-muted)" />
          <input
            type="text"
            placeholder="Search customer, phone, milk type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: 'none', background: 'none', outline: 'none', width: '100%', fontSize: '0.85rem', color: 'var(--color-primary)' }}
          />
          {searchQuery && (
            <button type="button" onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Summary Stats Row (Dynamic Calculation) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem',
          marginBottom: '1.75rem'
        }}
      >
        <div style={{ backgroundColor: 'var(--color-cream-card)', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-border)', padding: '1.15rem', boxShadow: 'var(--shadow-sm)' }}>
          <span style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
            Active Subscriptions
          </span>
          <div style={{ fontSize: '1.65rem', fontWeight: '800', color: 'var(--color-primary)', marginTop: '0.2rem' }}>
            {stats.activeCount}
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--color-cream-card)', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-border)', padding: '1.15rem', boxShadow: 'var(--shadow-sm)' }}>
          <span style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--color-gold-hover)', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            ☀ Subah Delivery Litres
          </span>
          <div style={{ fontSize: '1.65rem', fontWeight: '800', color: 'var(--color-primary)', marginTop: '0.2rem' }}>
            {stats.morningLitre} <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Litres</span>
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--color-cream-card)', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-border)', padding: '1.15rem', boxShadow: 'var(--shadow-sm)' }}>
          <span style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            🌙 Shaam Delivery Litres
          </span>
          <div style={{ fontSize: '1.65rem', fontWeight: '800', color: 'var(--color-primary)', marginTop: '0.2rem' }}>
            {stats.eveningLitre} <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Litres</span>
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--color-cream-card)', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-border)', padding: '1.15rem', boxShadow: 'var(--shadow-sm)' }}>
          <span style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
            Paused Subscriptions
          </span>
          <div style={{ fontSize: '1.65rem', fontWeight: '800', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
            {stats.pausedCount}
          </div>
        </div>
      </div>

      {/* CORE BUSINESS FEATURE — Kal Ke Liye Delivery Summary */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ marginBottom: '0.85rem' }}>
          <h2 className="font-display" style={{ fontSize: '1.25rem', color: 'var(--color-primary)', fontWeight: '800' }}>
            📋 Kal Ke Liye Dispatch & Packing Summary
          </h2>
          <p style={{ fontSize: '0.825rem', color: 'var(--color-text-muted)' }}>
            Delivery boys ke liye kal ke morning/evening active non-paused orders list:
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          
          {/* Kal Subah Card */}
          <div
            style={{
              backgroundColor: 'var(--color-cream-card)',
              borderRadius: 'var(--radius-md)',
              border: '2px solid var(--color-gold)',
              padding: '1.25rem',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-primary)', fontWeight: '800' }}>
                <Sun size={18} color="var(--color-gold-hover)" />
                <span className="font-display" style={{ fontSize: '1.05rem' }}>Kal Subah (6 AM - 9 AM)</span>
              </div>
              <span className="badge-gold" style={{ fontSize: '0.75rem' }}>
                {tomorrowDispatch.morningTotalLitres} L Total ({tomorrowDispatch.morningSubs.length} Customers)
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '180px', overflowY: 'auto' }} className="hide-scrollbar">
              {tomorrowDispatch.morningSubs.length > 0 ? (
                tomorrowDispatch.morningSubs.map((s) => (
                  <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--color-cream)', padding: '0.45rem 0.65rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}>
                    <div>
                      <div style={{ fontWeight: '700', color: 'var(--color-primary)' }}>{s.customerName}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>📍 {s.address}</div>
                    </div>
                    <span style={{ fontWeight: '800', color: 'var(--color-primary)' }}>
                      {s.litres}L ({s.milkTypeName || 'Doodh'})
                    </span>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textAlign: 'center', padding: '1rem' }}>
                  Kal subah ke liye koi dispatch nahi hai.
                </div>
              )}
            </div>
          </div>

          {/* Kal Shaam Card */}
          <div
            style={{
              backgroundColor: 'var(--color-cream-card)',
              borderRadius: 'var(--radius-md)',
              border: '2px solid var(--color-primary)',
              padding: '1.25rem',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-primary)', fontWeight: '800' }}>
                <Moon size={18} color="var(--color-primary)" />
                <span className="font-display" style={{ fontSize: '1.05rem' }}>Kal Shaam (5 PM - 7 PM)</span>
              </div>
              <span className="badge-wine" style={{ fontSize: '0.75rem' }}>
                {tomorrowDispatch.eveningTotalLitres} L Total ({tomorrowDispatch.eveningSubs.length} Customers)
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '180px', overflowY: 'auto' }} className="hide-scrollbar">
              {tomorrowDispatch.eveningSubs.length > 0 ? (
                tomorrowDispatch.eveningSubs.map((s) => (
                  <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--color-cream)', padding: '0.45rem 0.65rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}>
                    <div>
                      <div style={{ fontWeight: '700', color: 'var(--color-primary)' }}>{s.customerName}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>📍 {s.address}</div>
                    </div>
                    <span style={{ fontWeight: '800', color: 'var(--color-primary)' }}>
                      {s.litres}L ({s.milkTypeName || 'Doodh'})
                    </span>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textAlign: 'center', padding: '1rem' }}>
                  Kal shaam ke liye koi dispatch nahi hai.
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem',
          marginBottom: '1.25rem'
        }}
        className="hide-scrollbar"
      >
        {[
          { key: 'all', label: 'All Subscriptions' },
          { key: 'morning', label: '☀ Morning Slot' },
          { key: 'evening', label: '🌙 Evening Slot' },
          { key: 'active', label: 'Active' },
          { key: 'paused', label: 'Paused' }
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '0.5rem 0.95rem',
                borderRadius: 'var(--radius-full)',
                border: isActive ? '1.5px solid var(--color-primary)' : '1px solid var(--color-border)',
                backgroundColor: isActive ? 'var(--color-primary)' : 'var(--color-cream-card)',
                color: isActive ? '#FFFFFF' : 'var(--color-primary)',
                fontSize: '0.825rem',
                fontWeight: isActive ? '800' : '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Subscriptions Table */}
      <div
        style={{
          backgroundColor: 'var(--color-cream-card)',
          borderRadius: 'var(--radius-md)',
          border: '1.5px solid var(--color-border)',
          padding: '1.25rem',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        {filteredSubscriptions.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1.5px solid var(--color-border)', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '0.75rem' }}>Customer & Contact</th>
                  <th style={{ padding: '0.75rem' }}>Milk Type</th>
                  <th style={{ padding: '0.75rem' }}>Quantity</th>
                  <th style={{ padding: '0.75rem' }}>Delivery Slot</th>
                  <th style={{ padding: '0.75rem' }}>Status</th>
                  <th style={{ padding: '0.75rem' }}>Start Date</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubscriptions.map((s) => {
                  const isActive = s.status === 'active';
                  const isMorning = s.slot === 'morning';

                  return (
                    <tr key={s.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      {/* Customer Name & Address */}
                      <td style={{ padding: '0.75rem' }}>
                        <div style={{ fontWeight: '700', color: 'var(--color-primary)' }}>{s.customerName}</div>
                        <span style={{ fontSize: '0.725rem', color: 'var(--color-text-muted)', display: 'block' }}>
                          {s.customerPhone} • {s.address}
                        </span>
                      </td>

                      {/* Milk Type */}
                      <td style={{ padding: '0.75rem', fontWeight: '600', color: 'var(--color-primary)' }}>
                        {s.milkTypeName || 'Full Cream Doodh'}
                      </td>

                      {/* Litres */}
                      <td style={{ padding: '0.75rem', fontWeight: '800', color: 'var(--color-primary)' }}>
                        {s.litres} Litre / day
                      </td>

                      {/* Slot */}
                      <td style={{ padding: '0.75rem' }}>
                        <span
                          style={{
                            fontSize: '0.725rem',
                            fontWeight: '700',
                            padding: '0.2rem 0.55rem',
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: isMorning ? 'var(--color-gold-soft)' : 'rgba(28, 43, 74, 0.1)',
                            color: isMorning ? 'var(--color-gold-hover)' : 'var(--color-primary)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}
                        >
                          {isMorning ? '☀ Subah (6-9 AM)' : '🌙 Shaam (5-7 PM)'}
                        </span>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '0.75rem' }}>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: '800',
                            padding: '0.2rem 0.55rem',
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: isActive ? 'var(--color-success-bg)' : '#E2E8F0',
                            color: isActive ? 'var(--color-success)' : '#64748B',
                            border: isActive ? '1px solid var(--color-success-border)' : '1px solid var(--color-border)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.4px',
                            display: 'inline-block'
                          }}
                        >
                          {isActive ? '● Active' : '⏸ Paused'}
                        </span>
                      </td>

                      {/* Start Date */}
                      <td style={{ padding: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {s.startDate || '2026-07-01'}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(s.id)}
                            style={{
                              backgroundColor: 'var(--color-cream)',
                              border: '1px solid var(--color-border)',
                              borderRadius: '6px',
                              padding: '0.3rem 0.6rem',
                              fontSize: '0.75rem',
                              fontWeight: '700',
                              color: 'var(--color-primary)',
                              cursor: 'pointer'
                            }}
                          >
                            {isActive ? 'Pause' : 'Resume'}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteSubscription(s)}
                            style={{
                              backgroundColor: 'var(--color-error-bg)',
                              border: '1px solid var(--color-error-border)',
                              borderRadius: '6px',
                              padding: '0.3rem 0.55rem',
                              color: 'var(--color-error)',
                              cursor: 'pointer'
                            }}
                            title="Cancel Subscription"
                          >
                            <Trash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '3rem 1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🥛</div>
            <h3 className="font-display" style={{ fontSize: '1.2rem', color: 'var(--color-primary)' }}>
              Koi Subscription Nahi Mili
            </h3>
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminSubscriptions;
