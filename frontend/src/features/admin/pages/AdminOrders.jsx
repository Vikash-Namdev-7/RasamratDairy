import React, { useState, useEffect, useMemo } from 'react';
import { mockOrders as initialOrders } from '../data/mockOrders';
import AdminModal from '../components/AdminModal';
import { Search, X, Check, CheckCircle, Clock, Truck, ShieldCheck, ShoppingBag, Phone, AlertTriangle } from '../../../components/Icons';
import { formatCurrency } from '../../../utils/formatCurrency';
import adminOrdersApi from '../../../api/adminOrders.api';

export const AdminOrders = () => {
  const [ordersList, setOrdersList] = useState(initialOrders);
  const [loading, setLoading] = useState(true);
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
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Fetch Orders from Real REST API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await adminOrdersApi.getOrders(activeTab);
      if (res.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
        setOrdersList(res.data.data);
      }
    } catch (err) {
      console.warn('Real Orders API offline, using local fallback dataset for Admin Orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

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
          (o.orderNumber && o.orderNumber.toLowerCase().includes(q)) ||
          (o.id && o.id.toLowerCase().includes(q)) ||
          (o.customerName && o.customerName.toLowerCase().includes(q)) ||
          (o.customerPhone && o.customerPhone.includes(q)) ||
          (o.address && o.address.toLowerCase().includes(q))
      );
    }

    return result;
  }, [ordersList, activeTab, searchQuery]);

  // Open Accept Modal
  const handleOpenAcceptModal = (order) => {
    setSelectedOrder(order);
    setTimeSelectionMode('duration');
    setSelectedDuration('45 minutes');
    setCustomMinutes('');
    setSpecificTime('18:30');
    setAcceptModalOpen(true);
  };

  // Confirm Accept
  const handleConfirmAccept = async () => {
    if (!selectedOrder) return;

    let computedTime = '';
    if (timeSelectionMode === 'duration') {
      if (selectedDuration === 'custom') {
        computedTime = `${customMinutes || '30'} minutes me delivery`;
      } else {
        computedTime = `${selectedDuration} me delivery`;
      }
    } else {
      computedTime = `Aaj shaam ${specificTime} tak delivery`;
    }

    const orderId = selectedOrder.id || selectedOrder._id;

    try {
      const res = await adminOrdersApi.updateStatus(orderId, {
        status: 'accepted',
        deliveryTime: computedTime
      });
      if (res.data && res.data.success) {
        showToast(`Order #${selectedOrder.orderNumber || orderId} Accept ho gaya! (${computedTime})`);
      }
      await fetchOrders();
    } catch (err) {
      setOrdersList((prev) =>
        prev.map((o) =>
          (o.id || o._id) === orderId ? { ...o, status: 'accepted', deliveryTime: computedTime } : o
        )
      );
      showToast(`Order #${selectedOrder.orderNumber || orderId} Accept ho gaya!`);
    }

    setAcceptModalOpen(false);
  };

  // Open Reject Modal
  const handleOpenRejectModal = (order) => {
    setSelectedOrder(order);
    setRejectReason('Stock Khatam');
    setCustomRejectNote('');
    setRejectModalOpen(true);
  };

  // Confirm Reject
  const handleConfirmReject = async () => {
    if (!selectedOrder) return;

    const finalReason = rejectReason === 'Other' ? (customRejectNote || 'Store unavailable') : rejectReason;
    const orderId = selectedOrder.id || selectedOrder._id;

    try {
      const res = await adminOrdersApi.updateStatus(orderId, {
        status: 'rejected',
        rejectReason: finalReason
      });
      if (res.data && res.data.success) {
        showToast(`Order #${selectedOrder.orderNumber || orderId} Reject mark kar diya gaya.`);
      }
      await fetchOrders();
    } catch (err) {
      setOrdersList((prev) =>
        prev.map((o) =>
          (o.id || o._id) === orderId ? { ...o, status: 'rejected', rejectReason: finalReason } : o
        )
      );
      showToast(`Order #${selectedOrder.orderNumber || orderId} Reject mark ho gaya.`);
    }

    setRejectModalOpen(false);
  };

  // Quick Direct Status Transition (Out for delivery / Delivered)
  const handleDirectStatusChange = async (order, newStatus) => {
    const orderId = order.id || order._id;

    try {
      const res = await adminOrdersApi.updateStatus(orderId, { status: newStatus });
      if (res.data && res.data.success) {
        showToast(`Order #${order.orderNumber || orderId} status '${newStatus}' update ho gaya!`);
      }
      await fetchOrders();
    } catch (err) {
      setOrdersList((prev) =>
        prev.map((o) => ((o.id || o._id) === orderId ? { ...o, status: newStatus } : o))
      );
      showToast(`Order status '${newStatus}' update ho gaya!`);
    }
  };

  return (
    <div className="admin-page-container">
      
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div
          style={{
            backgroundColor: toastMessage.toLowerCase().includes('reject') ? 'var(--color-error-bg)' : 'var(--color-success-bg)',
            border: toastMessage.toLowerCase().includes('reject') ? '1.5px solid var(--color-error-border)' : '1.5px solid var(--color-success-border)',
            color: toastMessage.toLowerCase().includes('reject') ? 'var(--color-error)' : 'var(--color-success)',
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
          Customer Orders Management
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
          Store me aaye saare daily customer orders dekhein, accept/reject karein, aur delivery time assign karein.
        </p>
      </div>

      {/* Tabs & Search Toolbar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
        
        {/* Status Filter Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {[
            { id: 'all', label: 'Sabhi Orders' },
            { id: 'pending', label: 'Pending' },
            { id: 'accepted', label: 'Accepted' },
            { id: 'out-for-delivery', label: 'Out For Delivery' },
            { id: 'delivered', label: 'Delivered' },
            { id: 'rejected', label: 'Rejected' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-full)',
                border: activeTab === tab.id ? '2px solid var(--color-primary)' : '1.5px solid var(--color-border)',
                backgroundColor: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-cream-card)',
                color: activeTab === tab.id ? '#FFFFFF' : 'var(--color-primary)',
                fontWeight: '700',
                fontSize: '0.825rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <span>{tab.label}</span>
              <span
                style={{
                  backgroundColor: activeTab === tab.id ? 'rgba(255,255,255,0.2)' : 'var(--color-cream)',
                  padding: '0.1rem 0.45rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.725rem'
                }}
              >
                {statusCounts[tab.id] || 0}
              </span>
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--color-cream-card)', padding: '0.5rem 0.9rem', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-border)' }}>
          <Search size={16} color="var(--color-text-muted)" />
          <input
            type="text"
            placeholder="Search order number (#RD-...), customer name, phone, address..."
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

      {/* Orders List Cards Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {filteredOrders.length > 0 ? (
          filteredOrders.map((ord) => {
            const orderId = ord.id || ord._id;
            const orderNumStr = ord.orderNumber || orderId;
            const dateStr = ord.createdAt ? new Date(ord.createdAt).toLocaleDateString('hi-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : (ord.date || 'Today');

            return (
              <div
                key={orderId}
                style={{
                  backgroundColor: 'var(--color-cream-card)',
                  borderRadius: 'var(--radius-md)',
                  border: '1.5px solid var(--color-border)',
                  padding: '1.25rem',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                {/* Top Header Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--color-border)' }}>
                  <div>
                    <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--color-primary)' }}>
                      {orderNumStr}
                    </span>
                    <span style={{ fontSize: '0.775rem', color: 'var(--color-text-muted)', marginLeft: '0.6rem' }}>
                      • {dateStr}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span
                      style={{
                        padding: '0.3rem 0.75rem',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.75rem',
                        fontWeight: '800',
                        textTransform: 'capitalize',
                        backgroundColor:
                          ord.status === 'pending'
                            ? 'var(--color-gold-soft)'
                            : ord.status === 'accepted'
                            ? 'rgba(28, 43, 74, 0.1)'
                            : ord.status === 'out-for-delivery'
                            ? 'rgba(59, 130, 246, 0.12)'
                            : ord.status === 'delivered'
                            ? 'var(--color-success-bg)'
                            : 'var(--color-error-bg)',
                        color:
                          ord.status === 'pending'
                            ? 'var(--color-gold-hover)'
                            : ord.status === 'accepted'
                            ? 'var(--color-primary)'
                            : ord.status === 'out-for-delivery'
                            ? '#1D4ED8'
                            : ord.status === 'delivered'
                            ? 'var(--color-success)'
                            : 'var(--color-error)'
                      }}
                    >
                      Status: {ord.status}
                    </span>
                  </div>
                </div>

                {/* Customer Details & Address Block */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1rem', backgroundColor: 'var(--color-cream)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
                  <div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Customer</div>
                    <div style={{ fontWeight: '800', fontSize: '0.9rem', color: 'var(--color-primary)', marginTop: '0.1rem' }}>{ord.customerName}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.15rem' }}>
                      <Phone size={13} /> {ord.customerPhone}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Delivery Address</div>
                    <div style={{ fontSize: '0.825rem', fontWeight: '600', color: 'var(--color-primary)', marginTop: '0.1rem' }}>{ord.address || ord.customerAddress}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-gold-hover)', fontWeight: '700', marginTop: '0.15rem' }}>Zone: {ord.zoneName || 'Local Delivery'}</div>
                  </div>
                </div>

                {/* Status Specific Notes / Delivery Time Alerts */}
                {ord.status === 'accepted' && ord.deliveryTime && (
                  <div style={{ backgroundColor: 'rgba(28, 43, 74, 0.06)', border: '1px solid var(--color-primary-light)', borderRadius: 'var(--radius-sm)', padding: '0.55rem 0.75rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.825rem', fontWeight: '700', color: 'var(--color-primary)' }}>
                    <Clock size={15} /> Assigned Delivery Time: {ord.deliveryTime}
                  </div>
                )}

                {ord.status === 'rejected' && ord.rejectReason && (
                  <div style={{ backgroundColor: 'var(--color-error-bg)', border: '1px solid var(--color-error-border)', borderRadius: 'var(--radius-sm)', padding: '0.55rem 0.75rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.825rem', fontWeight: '700', color: 'var(--color-error)' }}>
                    <AlertTriangle size={15} /> Rejection Reason: {ord.rejectReason}
                  </div>
                )}

                {/* Items Snapshot */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' }}>
                  {ord.items && ord.items.map((item, idx) => (
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

                {/* Footer Actions & Payable */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', paddingTop: '0.85rem', borderTop: '1px dashed var(--color-border)' }}>
                  
                  <div style={{ fontWeight: '900', fontSize: '1.1rem', color: 'var(--color-primary)' }}>
                    Total Payable: {formatCurrency(ord.totalPayable || ord.totalAmount || 0)}
                  </div>

                  {/* Action Buttons based on status */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    {ord.status === 'pending' && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleOpenRejectModal(ord)}
                          style={{
                            padding: '0.45rem 0.85rem',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--color-error-border)',
                            backgroundColor: 'var(--color-error-bg)',
                            color: 'var(--color-error)',
                            fontWeight: '700',
                            fontSize: '0.825rem',
                            cursor: 'pointer'
                          }}
                        >
                          Reject Order
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenAcceptModal(ord)}
                          style={{
                            padding: '0.45rem 1.1rem',
                            borderRadius: 'var(--radius-sm)',
                            border: 'none',
                            backgroundColor: 'var(--color-primary)',
                            color: '#FFFFFF',
                            fontWeight: '800',
                            fontSize: '0.825rem',
                            cursor: 'pointer'
                          }}
                        >
                          Accept Order & Assign Time
                        </button>
                      </>
                    )}

                    {ord.status === 'accepted' && (
                      <button
                        type="button"
                        onClick={() => handleDirectStatusChange(ord, 'out-for-delivery')}
                        style={{
                          padding: '0.45rem 1.1rem',
                          borderRadius: 'var(--radius-sm)',
                          border: 'none',
                          backgroundColor: 'var(--color-primary)',
                          color: '#FFFFFF',
                          fontWeight: '800',
                          fontSize: '0.825rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem'
                        }}
                      >
                        <Truck size={14} /> Dispatch (Out For Delivery)
                      </button>
                    )}

                    {ord.status === 'out-for-delivery' && (
                      <button
                        type="button"
                        onClick={() => handleDirectStatusChange(ord, 'delivered')}
                        style={{
                          padding: '0.45rem 1.1rem',
                          borderRadius: 'var(--radius-sm)',
                          border: 'none',
                          backgroundColor: 'var(--color-success)',
                          color: '#FFFFFF',
                          fontWeight: '800',
                          fontSize: '0.825rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem'
                        }}
                      >
                        <CheckCircle size={14} /> Mark As Delivered
                      </button>
                    )}
                  </div>

                </div>

              </div>
            );
          })
        ) : (
          <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', backgroundColor: 'var(--color-cream-card)', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-border)' }}>
            <h3 className="font-display" style={{ fontSize: '1.25rem', color: 'var(--color-primary)', fontWeight: '700' }}>
              Is category me koi order nahi hai.
            </h3>
          </div>
        )}
      </div>

      {/* Admin Accept Order Modal */}
      <AdminModal
        isOpen={acceptModalOpen}
        onClose={() => setAcceptModalOpen(false)}
        title={`Accept Order #${selectedOrder?.orderNumber || selectedOrder?.id || ''}`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Customer ko <strong>{selectedOrder?.customerName}</strong> batayein ki order kitne samay me delivery hoga.
          </p>

          <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer' }}>
              <input
                type="radio"
                name="timeMode"
                value="duration"
                checked={timeSelectionMode === 'duration'}
                onChange={() => setTimeSelectionMode('duration')}
              />
              Duration (Minutes)
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer' }}>
              <input
                type="radio"
                name="timeMode"
                value="specific"
                checked={timeSelectionMode === 'specific'}
                onChange={() => setTimeSelectionMode('specific')}
              />
              Specific Clock Time
            </label>
          </div>

          {timeSelectionMode === 'duration' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {['30 minutes', '45 minutes', '60 minutes'].map((dur) => (
                <label key={dur} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="durationOpt"
                    value={dur}
                    checked={selectedDuration === dur}
                    onChange={(e) => setSelectedDuration(e.target.value)}
                  />
                  <span>Within {dur}</span>
                </label>
              ))}
            </div>
          ) : (
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: '700', display: 'block', marginBottom: '0.35rem' }}>
                Exact Delivery Time (HH:MM)
              </label>
              <input
                type="time"
                value={specificTime}
                onChange={(e) => setSpecificTime(e.target.value)}
                style={{ padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--color-border)', fontSize: '0.9rem' }}
              />
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1px solid var(--color-border)' }}>
            <button type="button" onClick={() => setAcceptModalOpen(false)} className="btn btn-outline" style={{ padding: '0.55rem 1.1rem', fontSize: '0.85rem' }}>
              Cancel
            </button>
            <button type="button" onClick={handleConfirmAccept} className="btn btn-primary" style={{ padding: '0.55rem 1.3rem', fontSize: '0.85rem' }}>
              Confirm Accept Order
            </button>
          </div>
        </div>
      </AdminModal>

      {/* Admin Reject Order Modal */}
      <AdminModal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title={`Reject Order #${selectedOrder?.orderNumber || selectedOrder?.id || ''}`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Order reject karne ka karan select karein:
          </p>

          <select
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--color-border)', fontSize: '0.875rem' }}
          >
            <option value="Stock Khatam">Stock Khatam (Out of Stock)</option>
            <option value="Delivery Zone ke Bahar">Delivery Zone ke Bahar hai</option>
            <option value="Store Closed Today">Aaj Store Closed hai</option>
            <option value="Other">Doosra Karan (Custom Reason)</option>
          </select>

          {rejectReason === 'Other' && (
            <textarea
              rows={2}
              placeholder="Reason explain karein..."
              value={customRejectNote}
              onChange={(e) => setCustomRejectNote(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--color-border)', fontSize: '0.85rem' }}
            />
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1px solid var(--color-border)' }}>
            <button type="button" onClick={() => setRejectModalOpen(false)} className="btn btn-outline" style={{ padding: '0.55rem 1.1rem', fontSize: '0.85rem' }}>
              Cancel
            </button>
            <button type="button" onClick={handleConfirmReject} className="btn btn-primary" style={{ padding: '0.55rem 1.3rem', fontSize: '0.85rem', backgroundColor: 'var(--color-error)' }}>
              Confirm Reject
            </button>
          </div>
        </div>
      </AdminModal>

    </div>
  );
};

export default AdminOrders;
