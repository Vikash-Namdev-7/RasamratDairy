import React, { useState, useEffect } from 'react';
import { deliveryZones as initialZones } from '../../customer/data/zones';
import AdminModal from '../components/AdminModal';
import { Plus, Trash, CheckCircle, MapPin, Check } from '../../../components/Icons';
import { formatCurrency } from '../../../utils/formatCurrency';
import adminZonesApi from '../../../api/adminZones.api';

export const AdminZones = () => {
  const [zonesList, setZonesList] = useState(initialZones);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
  const [editingZoneId, setEditingZoneId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    distanceLabel: '0-1 km',
    minOrderAmount: '100',
    deliveryFee: '0',
    description: '',
    isActive: true
  });

  const [validationError, setValidationError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Fetch Delivery Zones from REST API
  const fetchZones = async () => {
    try {
      setLoading(true);
      const res = await adminZonesApi.getZones();
      if (res.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
        setZonesList(res.data.data);
      }
    } catch (err) {
      console.warn('⚠️ Real API offline, using local fallback dataset for Admin Zones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (validationError) setValidationError('');
  };

  const handleOpenAddModal = () => {
    setModalMode('add');
    setEditingZoneId(null);
    setFormData({
      name: '',
      distanceLabel: '1-2 km',
      minOrderAmount: '150',
      deliveryFee: '15',
      description: '',
      isActive: true
    });
    setValidationError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (zone) => {
    setModalMode('edit');
    setEditingZoneId(zone.id || zone._id);
    setFormData({
      name: zone.name,
      distanceLabel: zone.distanceLabel,
      minOrderAmount: String(zone.minOrderAmount),
      deliveryFee: String(zone.deliveryFee),
      description: zone.description || '',
      isActive: zone.isActive !== undefined ? zone.isActive : true
    });
    setValidationError('');
    setIsModalOpen(true);
  };

  const handleSaveZone = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setValidationError('Zone Name zaroori hai.');
      return;
    }
    if (formData.minOrderAmount === '' || Number(formData.minOrderAmount) < 0) {
      setValidationError('Valid Minimum Order Amount set karein.');
      return;
    }

    const payload = {
      name: formData.name.trim(),
      distanceLabel: formData.distanceLabel.trim(),
      minOrderAmount: Number(formData.minOrderAmount),
      deliveryFee: Number(formData.deliveryFee || 0),
      description: formData.description.trim(),
      isActive: formData.isActive
    };

    try {
      if (modalMode === 'add') {
        const res = await adminZonesApi.createZone(payload);
        if (res.data && res.data.success) {
          showToast('🎉 Nayi Delivery Zone Add ho gayi!');
        }
      } else {
        const res = await adminZonesApi.updateZone(editingZoneId, payload);
        if (res.data && res.data.success) {
          showToast('✨ Delivery Zone settings update ho gayi!');
        }
      }
      await fetchZones();
    } catch (err) {
      const msg = err.response?.data?.message || 'Zone save nahi ho paayi.';
      showToast(`⚠️ ${msg}`);
    }

    setIsModalOpen(false);
  };

  const handleDeleteZone = async (zone) => {
    const zoneId = zone.id || zone._id;
    const confirmDelete = window.confirm(`Kya aap "${zone.name}" zone ko sachme delete karna chahte hain?`);
    if (!confirmDelete) return;

    try {
      const res = await adminZonesApi.deleteZone(zoneId);
      if (res.data && res.data.success) {
        showToast('🗑️ Delivery Zone delete ho gayi!');
      }
      await fetchZones();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Zone delete nahi ho paayi.';
      showToast(`⚠️ ${errorMsg}`);
    }
  };

  return (
    <div className="admin-page-container">
      
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div
          style={{
            backgroundColor: toastMessage.includes('⚠️') ? 'var(--color-error-bg)' : 'var(--color-success-bg)',
            border: toastMessage.includes('⚠️') ? '1.5px solid var(--color-error-border)' : '1.5px solid var(--color-success-border)',
            color: toastMessage.includes('⚠️') ? 'var(--color-error)' : 'var(--color-success)',
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
            padding: '0.65rem 1.25rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--color-primary)',
            color: '#FFFFFF',
            fontWeight: '700',
            fontSize: '0.875rem',
            border: 'none',
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
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: '600' }}>
              Distance Tier Rules
            </span>
          </div>

          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '550px' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-cream)', borderBottom: '1.5px solid var(--color-border)' }}>
                  <th style={{ padding: '0.75rem 0.85rem', fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Zone / Area</th>
                  <th style={{ padding: '0.75rem 0.85rem', fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Distance</th>
                  <th style={{ padding: '0.75rem 0.85rem', fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Min Order</th>
                  <th style={{ padding: '0.75rem 0.85rem', fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Delivery Fee</th>
                  <th style={{ padding: '0.75rem 0.85rem', fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {zonesList.map((z) => {
                  const zoneId = z.id || z._id;
                  return (
                    <tr key={zoneId} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '0.85rem' }}>
                        <div style={{ fontWeight: '700', fontSize: '0.875rem', color: 'var(--color-primary)' }}>{z.name}</div>
                        {z.description && (
                          <div style={{ fontSize: '0.725rem', color: 'var(--color-text-muted)', marginTop: '0.1rem' }}>{z.description}</div>
                        )}
                      </td>
                      <td style={{ padding: '0.85rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--color-gold-hover)', backgroundColor: 'var(--color-gold-soft)', padding: '0.2rem 0.55rem', borderRadius: 'var(--radius-full)' }}>
                          {z.distanceLabel}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--color-primary)' }}>
                          {formatCurrency(z.minOrderAmount)}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: '700', color: z.deliveryFee === 0 ? 'var(--color-success)' : 'var(--color-primary)' }}>
                          {z.deliveryFee === 0 ? 'FREE' : formatCurrency(z.deliveryFee)}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(z)}
                            style={{
                              padding: '0.3rem 0.65rem',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--color-border)',
                              backgroundColor: 'var(--color-cream)',
                              color: 'var(--color-primary)',
                              fontSize: '0.75rem',
                              fontWeight: '700',
                              cursor: 'pointer'
                            }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteZone(z)}
                            style={{
                              padding: '0.3rem 0.5rem',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--color-error-border)',
                              backgroundColor: 'var(--color-error-bg)',
                              color: 'var(--color-error)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                            title="Delete Zone"
                          >
                            <Trash size={14} color="var(--color-error)" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Distance Rules Visual Card */}
        <div
          style={{
            backgroundColor: 'var(--color-cream-card)',
            borderRadius: 'var(--radius-md)',
            border: '1.5px solid var(--color-border)',
            padding: '1.25rem',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border)' }}>
            <MapPin size={18} color="var(--color-gold-hover)" />
            <h3 className="font-display" style={{ fontSize: '1.05rem', color: 'var(--color-primary)', fontWeight: '800' }}>
              Distance Tier Rules
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {zonesList.map((z) => (
              <div
                key={z.id || z._id}
                style={{
                  backgroundColor: 'var(--color-cream)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                  padding: '0.85rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <span style={{ fontSize: '0.825rem', fontWeight: '800', color: 'var(--color-primary)' }}>{z.name}</span>
                  <span style={{ fontSize: '0.725rem', fontWeight: '700', color: 'var(--color-gold-hover)' }}>{z.distanceLabel}</span>
                </div>
                <div style={{ fontSize: '0.775rem', color: 'var(--color-text-muted)' }}>
                  Min Order: <strong>{formatCurrency(z.minOrderAmount)}</strong> • Delivery: <strong>{z.deliveryFee === 0 ? 'FREE' : formatCurrency(z.deliveryFee)}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Admin Add/Edit Zone Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'add' ? '➕ Add Delivery Zone' : '✏️ Edit Delivery Zone'}
      >
        <form onSubmit={handleSaveZone} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {validationError && (
            <div style={{ padding: '0.5rem 0.85rem', backgroundColor: 'var(--color-error-bg)', border: '1px solid var(--color-error-border)', color: 'var(--color-error)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', fontWeight: '700' }}>
              ⚠️ {validationError}
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--color-primary)', display: 'block', marginBottom: '0.35rem' }}>
              Zone Name *
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. Nazdeek Area (0-1 km)"
              value={formData.name}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--color-border)', fontSize: '0.875rem', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
            <div>
              <label style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--color-primary)', display: 'block', marginBottom: '0.35rem' }}>
                Distance Label *
              </label>
              <input
                type="text"
                name="distanceLabel"
                required
                placeholder="e.g. 0-1 km"
                value={formData.distanceLabel}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--color-border)', fontSize: '0.875rem', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--color-primary)', display: 'block', marginBottom: '0.35rem' }}>
                Minimum Order (₹) *
              </label>
              <input
                type="number"
                name="minOrderAmount"
                required
                placeholder="100"
                value={formData.minOrderAmount}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--color-border)', fontSize: '0.875rem', outline: 'none' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--color-primary)', display: 'block', marginBottom: '0.35rem' }}>
              Delivery Fee (₹) *
            </label>
            <input
              type="number"
              name="deliveryFee"
              required
              placeholder="0 (Free) ya 15"
              value={formData.deliveryFee}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--color-border)', fontSize: '0.875rem', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--color-primary)', display: 'block', marginBottom: '0.35rem' }}>
              Zone Description
            </label>
            <input
              type="text"
              name="description"
              placeholder="Farm-local fast delivery details..."
              value={formData.description}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--color-border)', fontSize: '0.875rem', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1px solid var(--color-border)' }}>
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
              {modalMode === 'add' ? 'Add Delivery Zone' : 'Save Changes'}
            </button>
          </div>

        </form>
      </AdminModal>

    </div>
  );
};

export default AdminZones;
