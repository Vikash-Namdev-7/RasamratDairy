import React, { useState, useEffect } from 'react';
import { zones as initialZones } from '../../customer/data/zones';
import AdminModal from '../components/AdminModal';
import { Plus, Trash, Check, CheckCircle, X, Truck, ShieldCheck } from '../../../components/Icons';
import { formatCurrency } from '../../../utils/formatCurrency';

const LOCAL_STORAGE_ALL_ZONES_KEY = 'rasamrat-zones-all';

export const AdminZones = () => {
  const [zonesList, setZonesList] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_ALL_ZONES_KEY);
      return saved ? JSON.parse(saved) : initialZones;
    } catch (e) {
      return initialZones;
    }
  });

  // Track inline edited amounts
  const [inlineAmounts, setInlineAmounts] = useState({});
  const [toastMessage, setToastMessage] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    distance: '',
    minOrderAmount: '100',
    deliveryFee: '0',
    active: true,
    description: ''
  });
  const [validationError, setValidationError] = useState('');

  // Sync to localStorage and dispatch event for Cart page
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_ALL_ZONES_KEY, JSON.stringify(zonesList));
      window.dispatchEvent(new Event('rasamrat-zones-updated'));
    } catch (e) {
      console.error('Failed to sync zones to localStorage', e);
    }
  }, [zonesList]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Inline Min Order Amount Change Handler
  const handleInlineAmountChange = (zoneId, val) => {
    setInlineAmounts((prev) => ({ ...prev, [zoneId]: val }));
  };

  // Save Inline Edited Amount
  const handleSaveInlineAmount = (zoneId) => {
    const val = inlineAmounts[zoneId];
    if (val === undefined || isNaN(val) || Number(val) < 0) {
      alert('Kripya valid non-negative minimum order amount enter karein.');
      return;
    }

    const numAmount = Number(val);
    setZonesList((prev) =>
      prev.map((z) => (z.id === zoneId ? { ...z, minOrderAmount: numAmount } : z))
    );

    // Clear inline edit state for this row
    setInlineAmounts((prev) => {
      const copy = { ...prev };
      delete copy[zoneId];
      return copy;
    });

    showToast('Minimum Order Amount update ho gaya! (Customer Cart synced)');
  };

  // Toggle Active / Inactive Status
  const handleToggleZoneStatus = (zoneId) => {
    setZonesList((prev) =>
      prev.map((z) => {
        if (z.id === zoneId) {
          const newStatus = z.active === false ? true : false;
          return { ...z, active: newStatus };
        }
        return z;
      })
    );
    showToast('Zone delivery status update ho gaya!');
  };

  // Delete Zone Handler
  const handleDeleteZone = (zone) => {
    if (window.confirm(`Pakka "${zone.name}" zone delete karna hai?`)) {
      setZonesList((prev) => prev.filter((z) => z.id !== zone.id));
      showToast(`Zone "${zone.name}" delete kar di gayi.`);
    }
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      distance: '',
      minOrderAmount: '100',
      deliveryFee: '0',
      active: true,
      description: ''
    });
    setValidationError('');
    setIsModalOpen(true);
  };

  // Save Add Zone Form
  const handleSubmitAddZone = (e) => {
    e.preventDefault();
    setValidationError('');

    if (!formData.name.trim()) {
      setValidationError('Zone Name bharna zaroori hai.');
      return;
    }

    if (!formData.minOrderAmount || isNaN(formData.minOrderAmount) || Number(formData.minOrderAmount) < 0) {
      setValidationError('Valid Minimum Order Amount (>= 0) bharein.');
      return;
    }

    const newZone = {
      id: `zone-${Date.now()}`,
      name: formData.name.trim(),
      distance: formData.distance.trim() || '0-2 km',
      minOrderAmount: Number(formData.minOrderAmount),
      deliveryFee: Number(formData.deliveryFee || 0),
      active: formData.active,
      description: formData.description.trim() || `Delivery zone with ₹${formData.minOrderAmount} min order threshold.`
    };

    setZonesList((prev) => [...prev, newZone]);
    showToast('🎉 Nayi Delivery Zone Add ho gayi!');
    setIsModalOpen(false);
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
        <div>
          <h1 className="font-display" style={{ fontSize: '1.65rem', color: 'var(--color-primary)', fontWeight: '800', lineHeight: '1.2' }}>
            Delivery Zones & Minimum Order Limits
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
            Apne aas-paas ke areas ke liye minimum order amount set karein — jitna dur utna zyada limit rakh sakte hain.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          style={{
            padding: '0.65rem 1.2rem',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            backgroundColor: 'var(--color-primary)',
            color: '#FFFFFF',
            fontWeight: '700',
            fontSize: '0.875rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <Plus size={16} color="#FFFFFF" /> Nayi Zone Add Karein
        </button>
      </div>

      {/* Main 2-Column Grid: Zones Table (Left) + Zone Radar Preview (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.75rem', alignItems: 'start' }} className="products-listing-layout">
        
        {/* Left Column: Zones Table */}
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
              Configured Delivery Zones ({zonesList.length})
            </h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              ⚡ Table Me Amounts Directly Inline Edit Karein
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1.5px solid var(--color-border)', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '0.75rem' }}>Zone Name</th>
                  <th style={{ padding: '0.75rem' }}>Distance</th>
                  <th style={{ padding: '0.75rem' }}>Min Order (₹)</th>
                  <th style={{ padding: '0.75rem' }}>Status</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {zonesList.map((z) => {
                  const isEditingInline = inlineAmounts[z.id] !== undefined;
                  const currentInputValue = isEditingInline ? inlineAmounts[z.id] : z.minOrderAmount;
                  const isActive = z.active !== false;

                  return (
                    <tr key={z.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      {/* Name & Desc */}
                      <td style={{ padding: '0.75rem' }}>
                        <div style={{ fontWeight: '700', color: 'var(--color-primary)' }}>{z.name}</div>
                        <span style={{ fontSize: '0.725rem', color: 'var(--color-text-muted)', display: 'block' }}>
                          {z.description || 'Standard delivery zone'}
                        </span>
                      </td>

                      {/* Distance Label */}
                      <td style={{ padding: '0.75rem', color: 'var(--color-text-muted)', fontWeight: '600' }}>
                        {z.distance || '0-1 km'}
                      </td>

                      {/* Inline Editable Min Order Amount */}
                      <td style={{ padding: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--color-primary)' }}>₹</span>
                          <input
                            type="number"
                            min="0"
                            value={currentInputValue}
                            onChange={(e) => handleInlineAmountChange(z.id, e.target.value)}
                            style={{
                              width: '80px',
                              padding: '0.3rem 0.5rem',
                              borderRadius: 'var(--radius-sm)',
                              border: isEditingInline ? '2px solid var(--color-gold)' : '1px solid var(--color-border)',
                              backgroundColor: isEditingInline ? '#FEFCE8' : 'var(--color-cream)',
                              fontWeight: '800',
                              fontSize: '0.9rem',
                              color: 'var(--color-primary)',
                              outline: 'none'
                            }}
                          />
                          {isEditingInline && (
                            <button
                              type="button"
                              onClick={() => handleSaveInlineAmount(z.id)}
                              style={{
                                backgroundColor: 'var(--color-success)',
                                border: 'none',
                                color: '#FFFFFF',
                                borderRadius: '4px',
                                padding: '0.3rem 0.55rem',
                                fontSize: '0.75rem',
                                fontWeight: '700',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.2rem'
                              }}
                              title="Save new minimum order amount"
                            >
                              <Check size={12} color="#FFFFFF" /> Save
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Status Toggle Switch */}
                      <td style={{ padding: '0.75rem' }}>
                        <button
                          type="button"
                          onClick={() => handleToggleZoneStatus(z.id)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.25rem 0.6rem',
                            borderRadius: 'var(--radius-full)',
                            border: isActive ? '1px solid var(--color-success-border)' : '1px solid var(--color-border)',
                            backgroundColor: isActive ? 'var(--color-success-bg)' : '#E2E8F0',
                            color: isActive ? 'var(--color-success)' : '#64748B',
                            fontWeight: '800',
                            fontSize: '0.725rem',
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            letterSpacing: '0.4px'
                          }}
                        >
                          {isActive ? '● Active' : '⏸ Inactive'}
                        </button>
                      </td>

                      {/* Delete Action */}
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => handleDeleteZone(z)}
                          style={{
                            backgroundColor: 'var(--color-error-bg)',
                            border: '1px solid var(--color-error-border)',
                            borderRadius: '6px',
                            padding: '0.35rem 0.55rem',
                            color: 'var(--color-error)',
                            cursor: 'pointer'
                          }}
                          title="Delete Zone"
                        >
                          <Trash size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Live Zone Radar & Distance Map Preview */}
        <div
          style={{
            backgroundColor: 'var(--color-cream-card)',
            borderRadius: 'var(--radius-md)',
            border: '1.5px solid var(--color-border)',
            padding: '1.25rem',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <h3 className="font-display" style={{ fontSize: '1.1rem', color: 'var(--color-primary)', fontWeight: '700', marginBottom: '0.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border)' }}>
            📡 Live Zone Radius Radar
          </h3>
          <p style={{ fontSize: '0.775rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
            Dairy hub se distance rings par minimum order limits ki visual graph preview:
          </p>

          {/* Radar Circles Display */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '240px',
              backgroundColor: '#111827',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1.5px solid var(--color-gold)'
            }}
          >
            {/* Concentric Distance Rings */}
            <div style={{ position: 'absolute', width: '210px', height: '210px', borderRadius: '50%', border: '1px dashed rgba(212, 165, 66, 0.25)' }} />
            <div style={{ position: 'absolute', width: '150px', height: '150px', borderRadius: '50%', border: '1px dashed rgba(212, 165, 66, 0.4)' }} />
            <div style={{ position: 'absolute', width: '90px', height: '90px', borderRadius: '50%', border: '1.5px solid var(--color-gold)', backgroundColor: 'rgba(212, 165, 66, 0.1)' }} />

            {/* Center Dairy Hub */}
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-accent)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '900',
                fontSize: '0.75rem',
                boxShadow: '0 0 15px rgba(155, 58, 68, 0.8)',
                zIndex: 3
              }}
              title="Rasamrat Dairy Hub"
            >
              HUB
            </div>

            {/* Zone Ring Badges */}
            {zonesList.slice(0, 3).map((z, idx) => {
              const offsets = [
                { top: '32%', left: '55%' },
                { top: '20%', left: '68%' },
                { top: '10%', left: '76%' }
              ];
              const pos = offsets[idx] || { top: '50%', left: '50%' };

              return (
                <div
                  key={z.id}
                  style={{
                    position: 'absolute',
                    top: pos.top,
                    left: pos.left,
                    backgroundColor: z.active !== false ? 'rgba(212, 165, 66, 0.95)' : 'rgba(100, 116, 139, 0.85)',
                    color: 'var(--color-primary)',
                    padding: '0.2rem 0.5rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.675rem',
                    fontWeight: '800',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                    whiteSpace: 'nowrap',
                    zIndex: 4,
                    transition: 'all 0.3s ease'
                  }}
                >
                  {z.distance || `R${idx + 1}`}: Min {formatCurrency(z.minOrderAmount)}
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Truck size={13} color="var(--color-gold)" />
              <span>Door ke areas me higher minimum limit automated.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <ShieldCheck size={13} color="var(--color-success)" />
              <span>Customer Cart is threshold ke mutabiq check karta hai.</span>
            </div>
          </div>

        </div>

      </div>

      {/* Add New Zone Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="➕ Nayi Delivery Zone Add Karein"
      >
        {validationError && (
          <div style={{ backgroundColor: 'var(--color-error-bg)', border: '1px solid var(--color-error-border)', color: 'var(--color-error)', borderRadius: 'var(--radius-sm)', padding: '0.65rem 0.85rem', marginBottom: '1rem', fontSize: '0.825rem', fontWeight: '700' }}>
            ⚠️ {validationError}
          </div>
        )}

        <form onSubmit={handleSubmitAddZone} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Zone Name */}
          <div>
            <label style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--color-primary)', display: 'block', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Zone Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Gaon ABC / Sector 5"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.85rem', backgroundColor: 'var(--color-cream)', outline: 'none' }}
            />
          </div>

          {/* Distance Label & Min Order Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
            <div>
              <label style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--color-primary)', display: 'block', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                Approx Distance Label
              </label>
              <input
                type="text"
                placeholder="e.g., 2-3 km"
                value={formData.distance}
                onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.85rem', backgroundColor: 'var(--color-cream)', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--color-primary)', display: 'block', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                Minimum Order (₹) *
              </label>
              <input
                type="number"
                min="0"
                required
                placeholder="e.g., 180"
                value={formData.minOrderAmount}
                onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.85rem', backgroundColor: 'var(--color-cream)', outline: 'none' }}
              />
            </div>
          </div>

          {/* Delivery Fee & Status Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
            <div>
              <label style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--color-primary)', display: 'block', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                Delivery Fee (₹)
              </label>
              <input
                type="number"
                min="0"
                placeholder="e.g., 15"
                value={formData.deliveryFee}
                onChange={(e) => setFormData({ ...formData, deliveryFee: e.target.value })}
                style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.85rem', backgroundColor: 'var(--color-cream)', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', paddingTop: '1.25rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', userSelect: 'none' }}>
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  style={{ accentColor: 'var(--color-primary)', width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-primary)' }}>
                  Active Zone (Visible to Customer)
                </span>
              </label>
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--color-primary)', display: 'block', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Description
            </label>
            <textarea
              rows={2}
              placeholder="Zone coverage details..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.85rem', backgroundColor: 'var(--color-cream)', outline: 'none', fontFamily: 'inherit' }}
            />
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
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
              Save & Add Zone
            </button>
          </div>

        </form>
      </AdminModal>

    </div>
  );
};

export default AdminZones;
