import React, { useState, useEffect, useMemo } from 'react';
import { mySubscriptions as initialSubscriptions } from '../../customer/data/mySubscriptions';
import { Search, X, Check, CheckCircle, Clock, Truck, ShieldCheck, Sun, Moon, Trash, Phone } from '../../../components/Icons';
import adminSubscriptionsApi from '../../../api/adminSubscriptions.api';

export const AdminSubscriptions = () => {
  const [subscriptionsList, setSubscriptionsList] = useState(initialSubscriptions);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'morning' | 'evening' | 'active' | 'paused'
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Fetch Subscriptions from Real REST API
  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const res = await adminSubscriptionsApi.getSubscriptions();
      if (res.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
        setSubscriptionsList(res.data.data);
      }
    } catch (err) {
      console.warn('Real Subscriptions API offline, using local fallback dataset for Admin Subscriptions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  // Dynamic Summary Stats Calculations
  const stats = useMemo(() => {
    const activeSubs = subscriptionsList.filter((s) => s.status === 'active');
    const pausedSubs = subscriptionsList.filter((s) => s.status === 'paused');

    const morningLitre = activeSubs
      .filter((s) => s.slot === 'morning')
      .reduce((sum, s) => sum + Number(s.litres || 0), 0);

    const eveningLitre = activeSubs
      .filter((s) => s.slot === 'evening')
      .reduce((sum, s) => sum + Number(s.litres || 0), 0);

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

    return {
      morningCount: morningSubs.length,
      morningTotalLitre: morningSubs.reduce((sum, s) => sum + Number(s.litres || 0), 0),
      eveningCount: eveningSubs.length,
      eveningTotalLitre: eveningSubs.reduce((sum, s) => sum + Number(s.litres || 0), 0)
    };
  }, [subscriptionsList]);

  // Filtered List
  const filteredSubscriptions = useMemo(() => {
    let result = [...subscriptionsList];

    if (activeTab === 'morning' || activeTab === 'evening') {
      result = result.filter((s) => s.slot === activeTab);
    } else if (activeTab === 'active' || activeTab === 'paused') {
      result = result.filter((s) => s.status === activeTab);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (s) =>
          (s.customerName && s.customerName.toLowerCase().includes(q)) ||
          (s.customerPhone && s.customerPhone.includes(q)) ||
          (s.milkTypeName && s.milkTypeName.toLowerCase().includes(q)) ||
          (s.address && s.address.toLowerCase().includes(q))
      );
    }

    return result;
  }, [subscriptionsList, activeTab, searchQuery]);

  // Toggle Active/Paused Status (Admin)
  const handleToggleStatus = async (sub) => {
    const subId = sub.id || sub._id;
    try {
      const res = await adminSubscriptionsApi.toggleStatus(subId);
      if (res.data && res.data.success) {
        showToast(res.data.message || 'Status update ho gaya!');
      }
      await fetchSubscriptions();
    } catch (err) {
      setSubscriptionsList((prev) =>
        prev.map((s) => {
          if ((s.id || s._id) === subId) {
            const nextStatus = s.status === 'active' ? 'paused' : 'active';
            showToast(`Subscription status ab '${nextStatus}' set ho gaya!`);
            return { ...s, status: nextStatus };
          }
          return s;
        })
      );
    }
  };

  // Cancel Subscription (Admin)
  const handleCancel = async (sub) => {
    const subId = sub.id || sub._id;
    const confirmCancel = window.confirm(`Kya aap "${sub.customerName}" ki ${sub.milkTypeName} subscription sachme cancel karna chahte hain?`);
    if (!confirmCancel) return;

    try {
      const res = await adminSubscriptionsApi.cancelSubscription(subId);
      if (res.data && res.data.success) {
        showToast('Subscription cancel ho gayi!');
      }
      await fetchSubscriptions();
    } catch (err) {
      setSubscriptionsList((prev) =>
        prev.map((s) => ((s.id || s._id) === subId ? { ...s, status: 'cancelled' } : s))
      );
      showToast('Subscription cancel ho gayi!');
    }
  };

  return (
    <div className="admin-page-container">
      
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div
          style={{
            backgroundColor: toastMessage.toLowerCase().includes('cancel') ? 'var(--color-error-bg)' : 'var(--color-success-bg)',
            border: toastMessage.toLowerCase().includes('cancel') ? '1.5px solid var(--color-error-border)' : '1.5px solid var(--color-success-border)',
            color: toastMessage.toLowerCase().includes('cancel') ? 'var(--color-error)' : 'var(--color-success)',
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
          <CheckCircle size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 className="font-display" style={{ fontSize: '1.65rem', color: 'var(--color-primary)', fontWeight: '800', lineHeight: 1.2 }}>
          Daily Milk Subscriptions Management
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
          Grahakon ke daily morning/evening milk slots, status (Active/Paused), aur Kal ki dispatch summary manage karein.
        </p>
      </div>

      {/* Top 4 Summary Cards Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
        
        <div style={{ backgroundColor: 'var(--color-cream-card)', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-border)', padding: '1rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '0.725rem', color: 'var(--color-text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Active Subscriptions</div>
          <div style={{ fontSize: '1.65rem', fontWeight: '900', color: 'var(--color-primary)', marginTop: '0.2rem' }}>{stats.activeCount}</div>
        </div>

        <div style={{ backgroundColor: 'var(--color-cream-card)', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-border)', padding: '1rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '0.725rem', color: 'var(--color-text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Sun size={14} color="var(--color-gold-hover)" /> Subah Slot Required
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: '900', color: 'var(--color-gold-hover)', marginTop: '0.2rem' }}>{stats.morningLitre} Litres</div>
        </div>

        <div style={{ backgroundColor: 'var(--color-cream-card)', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-border)', padding: '1rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '0.725rem', color: 'var(--color-text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Moon size={14} color="var(--color-primary)" /> Shaam Slot Required
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: '900', color: 'var(--color-primary)', marginTop: '0.2rem' }}>{stats.eveningLitre} Litres</div>
        </div>

        <div style={{ backgroundColor: 'var(--color-cream-card)', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-border)', padding: '1rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '0.725rem', color: 'var(--color-text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Paused / Skipped</div>
          <div style={{ fontSize: '1.65rem', fontWeight: '900', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>{stats.pausedCount}</div>
        </div>

      </div>

      {/* Kal Ki Dispatch Summary Highlight Card */}
      <div
        style={{
          backgroundColor: 'var(--color-primary)',
          color: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem 1.5rem',
          marginBottom: '1.75rem',
          boxShadow: 'var(--shadow-md)',
          borderBottom: '3px solid var(--color-gold)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-gold)', fontWeight: '800', fontSize: '0.8rem', textTransform: 'uppercase' }}>
            <Clock size={16} color="var(--color-gold)" /> Kal Ki Packing & Dispatch Requirement (Tomorrow)
          </div>
          <div style={{ fontSize: '0.9rem', color: '#E2E8F0', marginTop: '0.25rem' }}>
            Subah: <strong>{tomorrowDispatch.morningTotalLitre} L</strong> ({tomorrowDispatch.morningCount} customer) • Shaam: <strong>{tomorrowDispatch.eveningTotalLitre} L</strong> ({tomorrowDispatch.eveningCount} customer)
          </div>
        </div>

        <span className="badge-gold" style={{ fontSize: '0.75rem' }}>
          Total Requirement: {tomorrowDispatch.morningTotalLitre + tomorrowDispatch.eveningTotalLitre} Litres
        </span>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        
        {/* Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflowX: 'auto' }}>
          {[
            { id: 'all', label: 'Sabhi' },
            { id: 'morning', label: 'Subah Slot' },
            { id: 'evening', label: 'Shaam Slot' },
            { id: 'active', label: 'Active Only' },
            { id: 'paused', label: 'Paused Only' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: 'var(--radius-full)',
                border: activeTab === tab.id ? '2px solid var(--color-primary)' : '1.5px solid var(--color-border)',
                backgroundColor: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-cream-card)',
                color: activeTab === tab.id ? '#FFFFFF' : 'var(--color-primary)',
                fontWeight: '700',
                fontSize: '0.825rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--color-cream-card)', padding: '0.45rem 0.85rem', borderRadius: 'var(--radius-full)', border: '1.5px solid var(--color-border)', width: '280px' }}>
          <Search size={15} color="var(--color-text-muted)" />
          <input
            type="text"
            placeholder="Search customer, phone, variant..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: 'none', background: 'none', outline: 'none', width: '100%', fontSize: '0.825rem', color: 'var(--color-primary)' }}
          />
          {searchQuery && (
            <button type="button" onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
              <X size={13} />
            </button>
          )}
        </div>

      </div>

      {/* Subscriptions Table Container */}
      <div
        style={{
          backgroundColor: 'var(--color-cream-card)',
          borderRadius: 'var(--radius-md)',
          border: '1.5px solid var(--color-border)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-cream)', borderBottom: '1.5px solid var(--color-border)' }}>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.775rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Customer</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.775rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Variant & Litres</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.775rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Slot</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.775rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Delivery Address</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.775rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center' }}>Status</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.775rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubscriptions.length > 0 ? (
                filteredSubscriptions.map((sub) => {
                  const subId = sub.id || sub._id;
                  const isCancelled = sub.status === 'cancelled';
                  return (
                    <tr key={subId} style={{ borderBottom: '1px solid var(--color-border)', opacity: isCancelled ? 0.6 : 1 }}>
                      
                      {/* Customer Info */}
                      <td style={{ padding: '0.9rem 1rem' }}>
                        <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--color-primary)' }}>{sub.customerName}</div>
                        <div style={{ fontSize: '0.775rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Phone size={12} color="var(--color-text-muted)" /> <span>{sub.customerPhone}</span>
                        </div>
                      </td>

                      {/* Variant & Litres */}
                      <td style={{ padding: '0.9rem 1rem' }}>
                        <div style={{ fontWeight: '800', fontSize: '0.9rem', color: 'var(--color-primary)' }}>{sub.milkTypeName}</div>
                        <div style={{ fontSize: '0.775rem', color: 'var(--color-gold-hover)', fontWeight: '700' }}>{sub.litres} Litres / day</div>
                      </td>

                      {/* Slot */}
                      <td style={{ padding: '0.9rem 1rem' }}>
                        <span
                          style={{
                            fontSize: '0.775rem',
                            fontWeight: '700',
                            padding: '0.2rem 0.55rem',
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: sub.slot === 'morning' ? 'var(--color-gold-soft)' : 'rgba(28, 43, 74, 0.1)',
                            color: sub.slot === 'morning' ? 'var(--color-gold-hover)' : 'var(--color-primary)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem'
                          }}
                        >
                          {sub.slot === 'morning' ? <Sun size={13} /> : <Moon size={13} />}
                          {sub.slot === 'morning' ? 'Subah Slot' : 'Shaam Slot'}
                        </span>
                      </td>

                      {/* Address */}
                      <td style={{ padding: '0.9rem 1rem' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-main)', maxWidth: '220px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {sub.address}
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '0.9rem 1rem', textAlign: 'center' }}>
                        <span
                          style={{
                            padding: '0.3rem 0.75rem',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.75rem',
                            fontWeight: '800',
                            textTransform: 'capitalize',
                            backgroundColor: isCancelled ? 'var(--color-error-bg)' : sub.status === 'active' ? 'var(--color-success-bg)' : 'var(--color-gold-soft)',
                            color: isCancelled ? 'var(--color-error)' : sub.status === 'active' ? 'var(--color-success)' : 'var(--color-gold-hover)'
                          }}
                        >
                          {sub.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '0.9rem 1rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                          {!isCancelled && (
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(sub)}
                              style={{
                                padding: '0.35rem 0.75rem',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--color-border)',
                                backgroundColor: 'var(--color-cream)',
                                color: 'var(--color-primary)',
                                fontSize: '0.775rem',
                                fontWeight: '700',
                                cursor: 'pointer'
                              }}
                            >
                              {sub.status === 'active' ? 'Pause' : 'Activate'}
                            </button>
                          )}

                          {!isCancelled && (
                            <button
                              type="button"
                              onClick={() => handleCancel(sub)}
                              style={{
                                padding: '0.35rem 0.55rem',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--color-error-border)',
                                backgroundColor: 'var(--color-error-bg)',
                                color: 'var(--color-error)',
                                cursor: 'pointer'
                              }}
                              title="Cancel Subscription"
                            >
                              <Trash size={14} color="var(--color-error)" />
                            </button>
                          )}
                        </div>
                      </td>

                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    Koi matching subscription nahi mili.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminSubscriptions;
