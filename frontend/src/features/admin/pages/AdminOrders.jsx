import React, { useState, useMemo } from 'react';
import { mockOrders as initialOrders } from '../data/mockOrders';
import AdminModal from '../components/AdminModal';
import { Search, X, Check, CheckCircle, Clock, Truck, ShieldCheck, ShoppingBag } from '../../../components/Icons';
import { formatCurrency } from '../../../utils/formatCurrency';

export const AdminOrders = () => {
  const [ordersList, setOrdersList] = useState(initialOrders);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'pending' | 'accepted' | 'out-for-delivery' | 'delivered' | 'rejected'
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [acceptModalOpen, setAcceptModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Accept Form State
  const [timeSelectionMode, setTimeSelectionMode] = useState('duration'); // 'duration' | 'specific'
  const [selectedDuration, setSelectedDuration] = useState('45 minutes');
  const [customMinutes, setCustomMinutes] = useState('');
  const [specificTime, setSpecificTime] = useState('18:30');

  // Reject Form State
  const [rejectReason, setRejectReason] = useState('Stock Khatam');
  const [customRejectNote, setCustomRejectNote] = useState('');

  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Counts per status
  const statusCounts = useMemo(() => {
    const counts = { all: ordersList.length, pending: 0, accepted: 0, 'out-for-delivery': 0, delivered: 0, rejected: 0 };
    ordersList.forEach((ord) => {
      if (counts[ord.status] !== undefined) {
        counts[ord.status] += 1;
      }
    });
    return counts;
  }, [ordersList]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    let result = [...ordersList];

    if (activeTab !== 'all') {
      result = result.filter((o) => o.status === activeTab);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          (o.customerPhone && o.customerPhone.toLowerCase().includes(q)) ||
          o.zone.toLowerCase().includes(q)
      );
    }

    return result;
  }, [ordersList, activeTab, searchQuery]);

  // Format Relative Time
  const formatRelativeTime = (isoString) => {
    if (!isoString) return 'Today';
    const date = new Date(isoString);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffHours < 1) return '30 min pehle';
    if (diffHours < 24) return `${diffHours} ghante pehle`;
    return `${Math.floor(diffHours / 24)} din pehle`;
  };

  // Status Badge Renderer
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return { label: '🟡 Pending Approval', bg: 'var(--color-gold-soft)', color: 'var(--color-gold-hover)', border: 'var(--color-gold)' };
      case 'accepted':
        return { label: '🔵 Accepted & Preparing', bg: 'rgba(28, 43, 74, 0.1)', color: 'var(--color-primary)', border: 'var(--color-primary-light)' };
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

  // Open Accept Modal
  const handleOpenAcceptModal = (order) => {
    setSelectedOrder(order);
    setTimeSelectionMode('duration');
    setSelectedDuration('45 minutes');
    setCustomMinutes('');
    setSpecificTime('18:30');
    setAcceptModalOpen(true);
  };

  // Submit Accept Modal
  const handleConfirmAccept = (e) => {
    e.preventDefault();
    if (!selectedOrder) return;

    let computedTimeStr = '';
    if (timeSelectionMode === 'duration') {
      if (customMinutes && !isNaN(customMinutes) && Number(customMinutes) > 0) {
        computedTimeStr = `${customMinutes} minutes me`;
      } else {
        computedTimeStr = `${selectedDuration} me`;
      }
    } else {
      computedTimeStr = `${specificTime} tak`;
    }

    setOrdersList((prev) =>
      prev.map((o) =>
        o.id === selectedOrder.id
          ? { ...o, status: 'accepted', deliveryTime: computedTimeStr, rejectReason: null }
          : o
      )
    );

    showToast(`🎉 Order #${selectedOrder.id} Accept ho gaya! Delivery: ${computedTimeStr}`);
    setAcceptModalOpen(false);
  };

  // Open Reject Modal
  const handleOpenRejectModal = (order) => {
    setSelectedOrder(order);
    setRejectReason('Stock Khatam');
    setCustomRejectNote('');
    setRejectModalOpen(true);
  };

  // Submit Reject Modal
  const handleConfirmReject = (e) => {
    e.preventDefault();
    if (!selectedOrder) return;

    const finalReason = rejectReason === 'Other' && customRejectNote ? customRejectNote : rejectReason;

    setOrdersList((prev) =>
      prev.map((o) =>
        o.id === selectedOrder.id
          ? { ...o, status: 'rejected', rejectReason: finalReason }
          : o
      )
    );

    showToast(`Order #${selectedOrder.id} Reject kar diya gaya.`);
    setRejectModalOpen(false);
  };

  // Status Lifecycle Progression Handlers
  const handleMarkOutForDelivery = (orderId) => {
    setOrdersList((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'out-for-delivery' } : o))
    );
    showToast(`🛵 Order #${orderId} Out For Delivery mark ho gaya!`);
  };

  const handleMarkDelivered = (orderId) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setOrdersList((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'delivered', deliveryTime: `Delivered at ${timeStr}` } : o))
    );
    showToast(`🟢 Order #${orderId} Delivered mark ho gaya!`);
  };

  return (
    <div style={{ padding: '1.5rem', paddingBottom: '3.5rem' }}>
      
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
            Orders Management
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
            Naye orders accept/reject karein, delivery time set karein aur order lifecycle track karein.
          </p>
        </div>

        {/* Search Box */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--color-cream-card)', padding: '0.45rem 0.85rem', borderRadius: 'var(--radius-full)', border: '1.5px solid var(--color-border)', minWidth: '260px' }}>
          <Search size={16} color="var(--color-text-muted)" />
          <input
            type="text"
            placeholder="Search Order ID, customer, phone..."
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

      {/* Status Filter Tabs Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem',
          marginBottom: '1.5rem'
        }}
        className="hide-scrollbar"
      >
        {[
          { key: 'all', label: 'All Orders' },
          { key: 'pending', label: 'Pending' },
          { key: 'accepted', label: 'Accepted' },
          { key: 'out-for-delivery', label: 'Out for Delivery' },
          { key: 'delivered', label: 'Delivered' },
          { key: 'rejected', label: 'Rejected' }
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          const count = statusCounts[tab.key] || 0;
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
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.2s ease'
              }}
            >
              <span>{tab.label}</span>
              <span
                style={{
                  fontSize: '0.725rem',
                  padding: '0.1rem 0.4rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'var(--color-cream)',
                  color: isActive ? '#FFFFFF' : 'var(--color-text-muted)'
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Orders Cards List */}
      {filteredOrders.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {filteredOrders.map((ord) => {
            const badge = getStatusBadge(ord.status);
            return (
              <div
                key={ord.id}
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
                {/* Card Top Strip: Order ID & Status Badge */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <div>
                      <span style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--color-primary)' }}>
                        {ord.id}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>
                        Placed {formatRelativeTime(ord.placedAt)}
                      </span>
                    </div>

                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: '800',
                        padding: '0.25rem 0.65rem',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: badge.bg,
                        color: badge.color,
                        border: `1px solid ${badge.border}`,
                        textTransform: 'uppercase',
                        letterSpacing: '0.4px'
                      }}
                    >
                      {badge.label}
                    </span>
                  </div>

                  {/* Customer Info */}
                  <div style={{ backgroundColor: 'var(--color-cream)', borderRadius: 'var(--radius-sm)', padding: '0.65rem 0.85rem', marginBottom: '0.85rem', fontSize: '0.825rem' }}>
                    <div style={{ fontWeight: '700', color: 'var(--color-primary)' }}>
                      👤 {ord.customerName} <span style={{ fontWeight: '500', color: 'var(--color-text-muted)' }}>({ord.customerPhone})</span>
                    </div>
                    <div style={{ fontSize: '0.775rem', color: 'var(--color-text-muted)', marginTop: '0.15rem' }}>
                      📍 {ord.address}
                    </div>
                    <div style={{ fontSize: '0.725rem', fontWeight: '700', color: 'var(--color-accent)', marginTop: '0.2rem' }}>
                      🚩 Zone: {ord.zone}
                    </div>
                  </div>

                  {/* Detailed Items List */}
                  <div style={{ marginBottom: '0.85rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block', marginBottom: '0.35rem' }}>
                      Ordered Items:
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.825rem' }}>
                      {ord.items.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-primary)' }}>
                          <span>• {item.name} × <strong>{item.qty}</strong></span>
                          <span style={{ fontWeight: '600' }}>{formatCurrency(item.price * item.qty)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Time / Reject Reason Banner if set */}
                  {ord.deliveryTime && ord.status !== 'rejected' && (
                    <div style={{ backgroundColor: 'rgba(212, 165, 66, 0.12)', border: '1px solid var(--color-gold)', borderRadius: 'var(--radius-sm)', padding: '0.5rem 0.75rem', marginBottom: '0.85rem', fontSize: '0.8rem', fontWeight: '700', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Clock size={15} color="var(--color-gold-hover)" />
                      <span>Delivery Time: <strong>{ord.deliveryTime}</strong></span>
                    </div>
                  )}

                  {ord.status === 'rejected' && ord.rejectReason && (
                    <div style={{ backgroundColor: 'var(--color-error-bg)', border: '1px solid var(--color-error-border)', borderRadius: 'var(--radius-sm)', padding: '0.5rem 0.75rem', marginBottom: '0.85rem', fontSize: '0.8rem', fontWeight: '700', color: 'var(--color-error)' }}>
                      ❌ Reject Reason: {ord.rejectReason}
                    </div>
                  )}

                  {/* Billing Breakdown */}
                  <div style={{ paddingTop: '0.65rem', borderTop: '1px dashed var(--color-border)', marginBottom: '1rem', fontSize: '0.825rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', marginBottom: '0.2rem' }}>
                      <span>Subtotal</span>
                      <span>{formatCurrency(ord.subtotal)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', marginBottom: '0.2rem' }}>
                      <span>Delivery Fee ({ord.zone})</span>
                      <span>{ord.deliveryFee === 0 ? 'FREE' : formatCurrency(ord.deliveryFee)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: '800', color: 'var(--color-primary)', marginTop: '0.35rem' }}>
                      <span>Total Payable (COD)</span>
                      <span>{formatCurrency(ord.totalPayable)}</span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons based on Status */}
                <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
                  {ord.status === 'pending' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                      <button
                        type="button"
                        onClick={() => handleOpenAcceptModal(ord)}
                        style={{
                          padding: '0.55rem',
                          borderRadius: 'var(--radius-sm)',
                          border: 'none',
                          backgroundColor: 'var(--color-primary)',
                          color: '#FFFFFF',
                          fontWeight: '800',
                          fontSize: '0.825rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.3rem'
                        }}
                      >
                        <Check size={15} color="#FFFFFF" /> Accept Order
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenRejectModal(ord)}
                        style={{
                          padding: '0.55rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--color-error-border)',
                          backgroundColor: 'var(--color-error-bg)',
                          color: 'var(--color-error)',
                          fontWeight: '800',
                          fontSize: '0.825rem',
                          cursor: 'pointer'
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {ord.status === 'accepted' && (
                    <button
                      type="button"
                      onClick={() => handleMarkOutForDelivery(ord.id)}
                      style={{
                        width: '100%',
                        padding: '0.6rem',
                        borderRadius: 'var(--radius-sm)',
                        border: 'none',
                        backgroundColor: '#1D4ED8',
                        color: '#FFFFFF',
                        fontWeight: '800',
                        fontSize: '0.825rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem'
                      }}
                    >
                      <Truck size={16} color="#FFFFFF" /> Mark Out For Delivery
                    </button>
                  )}

                  {ord.status === 'out-for-delivery' && (
                    <button
                      type="button"
                      onClick={() => handleMarkDelivered(ord.id)}
                      style={{
                        width: '100%',
                        padding: '0.6rem',
                        borderRadius: 'var(--radius-sm)',
                        border: 'none',
                        backgroundColor: 'var(--color-success)',
                        color: '#FFFFFF',
                        fontWeight: '800',
                        fontSize: '0.825rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem'
                      }}
                    >
                      <CheckCircle size={16} color="#FFFFFF" /> Mark Delivered
                    </button>
                  )}

                  {(ord.status === 'delivered' || ord.status === 'rejected') && (
                    <div style={{ textAlign: 'center', fontSize: '0.775rem', fontWeight: '700', color: 'var(--color-text-muted)', padding: '0.3rem' }}>
                      {ord.status === 'delivered' ? '✓ Order Completed & Delivered' : '❌ Order Closed (Rejected)'}
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ backgroundColor: 'var(--color-cream-card)', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-border)', padding: '3rem 1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📦</div>
          <h3 className="font-display" style={{ fontSize: '1.25rem', color: 'var(--color-primary)', fontWeight: '700', marginBottom: '0.35rem' }}>
            Koi Order Nahi Mila
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Search query ya active status tab change karke dekhein.
          </p>
        </div>
      )}

      {/* Accept Order Delivery Time Modal */}
      <AdminModal
        isOpen={acceptModalOpen}
        onClose={() => setAcceptModalOpen(false)}
        title={`🕒 Set Delivery Time (${selectedOrder?.id})`}
      >
        <form onSubmit={handleConfirmAccept} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
            Customer <strong>{selectedOrder?.customerName}</strong> ko kitne time me delivery pahunchegi?
          </p>

          {/* Time Selector Tabs / Radios */}
          <div style={{ display: 'flex', gap: '0.75rem', backgroundColor: 'var(--color-cream)', padding: '0.35rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
            <button
              type="button"
              onClick={() => setTimeSelectionMode('duration')}
              style={{
                flex: 1,
                padding: '0.45rem',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                backgroundColor: timeSelectionMode === 'duration' ? 'var(--color-primary)' : 'transparent',
                color: timeSelectionMode === 'duration' ? '#FFFFFF' : 'var(--color-primary)',
                fontWeight: '700',
                fontSize: '0.825rem',
                cursor: 'pointer'
              }}
            >
              ⏱️ Duration Se (Minutes)
            </button>

            <button
              type="button"
              onClick={() => setTimeSelectionMode('specific')}
              style={{
                flex: 1,
                padding: '0.45rem',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                backgroundColor: timeSelectionMode === 'specific' ? 'var(--color-primary)' : 'transparent',
                color: timeSelectionMode === 'specific' ? '#FFFFFF' : 'var(--color-primary)',
                fontWeight: '700',
                fontSize: '0.825rem',
                cursor: 'pointer'
              }}
            >
              🕐 Specific Time Se
            </button>
          </div>

          {timeSelectionMode === 'duration' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <label style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                Estimated Duration Options:
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                {['15 minutes', '30 minutes', '45 minutes', '1 hour', '2 hours'].map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => {
                      setSelectedDuration(dur);
                      setCustomMinutes('');
                    }}
                    style={{
                      padding: '0.55rem 0.35rem',
                      borderRadius: 'var(--radius-sm)',
                      border: selectedDuration === dur && !customMinutes ? '2px solid var(--color-gold)' : '1px solid var(--color-border)',
                      backgroundColor: selectedDuration === dur && !customMinutes ? 'var(--color-gold-soft)' : 'var(--color-cream)',
                      color: 'var(--color-primary)',
                      fontWeight: '700',
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    {dur}
                  </button>
                ))}
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                  Ya custom minutes enter karein:
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="e.g. 25"
                  value={customMinutes}
                  onChange={(e) => setCustomMinutes(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.85rem', backgroundColor: 'var(--color-cream)', outline: 'none' }}
                />
              </div>
            </div>
          ) : (
            <div>
              <label style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--color-primary)', display: 'block', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                Delivery Target Time:
              </label>
              <input
                type="time"
                value={specificTime}
                onChange={(e) => setSpecificTime(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--color-border)', fontSize: '1rem', backgroundColor: 'var(--color-cream)', outline: 'none', fontWeight: '700', color: 'var(--color-primary)' }}
              />
            </div>
          )}

          {/* Form Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
            <button
              type="button"
              onClick={() => setAcceptModalOpen(false)}
              className="btn btn-outline"
              style={{ padding: '0.55rem 1.1rem', fontSize: '0.85rem' }}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: '0.55rem 1.3rem', fontSize: '0.85rem' }}
            >
              Accept & Notify Customer
            </button>
          </div>

        </form>
      </AdminModal>

      {/* Reject Order Modal */}
      <AdminModal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title={`❌ Reject Order (${selectedOrder?.id})`}
      >
        <form onSubmit={handleConfirmReject} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
            Order Reject karne ka karan chunein:
          </p>

          <div>
            <label style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--color-primary)', display: 'block', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Reject Reason *
            </label>
            <select
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.85rem', backgroundColor: 'var(--color-cream)', outline: 'none', cursor: 'pointer' }}
            >
              <option value="Stock Khatam">Stock Khatam (Out of Stock)</option>
              <option value="Delivery Area Se Bahar">Delivery Area Se Bahar</option>
              <option value="Dukaan Band Hai">Dukaan Temporarily Band Hai</option>
              <option value="Minimum Order Threshold Not Met">Minimum Order Amount Not Met</option>
              <option value="Other">Other Reason...</option>
            </select>
          </div>

          {rejectReason === 'Other' && (
            <div>
              <label style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--color-primary)', display: 'block', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                Note Details
              </label>
              <input
                type="text"
                placeholder="Specific reason..."
                value={customRejectNote}
                onChange={(e) => setCustomRejectNote(e.target.value)}
                style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.85rem', backgroundColor: 'var(--color-cream)', outline: 'none' }}
              />
            </div>
          )}

          {/* Form Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
            <button
              type="button"
              onClick={() => setRejectModalOpen(false)}
              className="btn btn-outline"
              style={{ padding: '0.55rem 1.1rem', fontSize: '0.85rem' }}
            >
              Cancel
            </button>

            <button
              type="submit"
              style={{
                padding: '0.55rem 1.3rem',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                backgroundColor: 'var(--color-error)',
                color: '#FFFFFF',
                fontWeight: '700',
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              Confirm Reject
            </button>
          </div>

        </form>
      </AdminModal>

    </div>
  );
};

export default AdminOrders;
