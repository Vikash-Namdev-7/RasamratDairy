import React, { useState, useEffect } from 'react';
import { User, MapPin, Plus, Trash, Edit, CheckCircle, ArrowLeft, ShieldCheck, AlertTriangle } from '../../../components/Icons';
import customerApi from '../../../api/customer.api';
import zonesApi from '../../../api/zones.api';
import { useAuth } from '../../../context/AuthContext';

export const Profile = ({ onNavigate }) => {
  const { customer: authCustomer } = useAuth();
  const [profile, setProfile] = useState(null);
  const [zonesList, setZonesList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Profile Edit State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Address Form State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressLabel, setAddressLabel] = useState('Home');
  const [fullAddress, setFullAddress] = useState('');
  const [selectedZoneId, setSelectedZoneId] = useState('');

  const [toastMessage, setToastMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const fetchProfileAndZones = async () => {
    try {
      setLoading(true);
      const [profileRes, zonesRes] = await Promise.all([
        customerApi.getProfile(),
        zonesApi.getZones()
      ]);

      if (profileRes.data && profileRes.data.data) {
        const custData = profileRes.data.data;
        setProfile(custData);
        setName(custData.name || '');
        setPhone(custData.phone || '');
      }

      if (zonesRes.data && Array.isArray(zonesRes.data.data)) {
        setZonesList(zonesRes.data.data);
        if (zonesRes.data.data.length > 0) {
          setSelectedZoneId(zonesRes.data.data[0]._id || zonesRes.data.data[0].id);
        }
      }
    } catch (err) {
      console.warn('Could not fetch real profile data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAndZones();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || !phone.trim()) {
      setErrorMsg('Kripya Naam aur Phone Number dono bharein.');
      return;
    }

    try {
      setIsUpdatingProfile(true);
      const res = await customerApi.updateProfile({ name, phone });
      if (res.data && res.data.success) {
        showToast('Aapki Profile details update ho gayi!');
        setProfile(res.data.data);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Profile update nahi ho paayi.');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleOpenAddAddressModal = () => {
    setEditingAddressId(null);
    setAddressLabel('Home');
    setFullAddress('');
    if (zonesList.length > 0) {
      setSelectedZoneId(zonesList[0]._id || zonesList[0].id);
    }
    setErrorMsg('');
    setIsAddressModalOpen(true);
  };

  const handleOpenEditAddressModal = (addr) => {
    setEditingAddressId(addr._id || addr.id);
    setAddressLabel(addr.label || 'Home');
    setFullAddress(addr.fullAddress || '');
    setSelectedZoneId(addr.zoneId || (zonesList[0]?._id || zonesList[0]?.id || ''));
    setErrorMsg('');
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullAddress.trim()) {
      setErrorMsg('Pura delivery address likhna zaroori hai.');
      return;
    }

    const payload = {
      label: addressLabel,
      fullAddress: fullAddress.trim(),
      zoneId: selectedZoneId
    };

    try {
      if (editingAddressId) {
        const res = await customerApi.updateAddress(editingAddressId, payload);
        if (res.data && res.data.success) {
          showToast('Saved Address update ho gaya!');
        }
      } else {
        const res = await customerApi.addAddress(payload);
        if (res.data && res.data.success) {
          showToast('Naya Address save ho gaya!');
        }
      }
      await fetchProfileAndZones();
      setIsAddressModalOpen(false);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Address save nahi ho paaya.');
    }
  };

  const handleDeleteAddress = async (addrId) => {
    const confirmDelete = window.confirm('Kya aap is saved address ko delete karna chahte hain?');
    if (!confirmDelete) return;

    try {
      const res = await customerApi.deleteAddress(addrId);
      if (res.data && res.data.success) {
        showToast('Address remove ho gaya.');
      }
      await fetchProfileAndZones();
    } catch (err) {
      showToast('Address delete nahi ho paaya.');
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--color-cream)', minHeight: '85vh', padding: '2rem 1rem' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        
        {/* Back Navigation Button */}
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
              color: 'var(--color-navy)',
              fontWeight: '700',
              fontSize: '0.875rem',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={16} color="var(--color-navy)" /> Back to Home
          </button>
        </div>

        {/* Header Title */}
        <div style={{ marginBottom: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="font-display" style={{ fontSize: '1.85rem', color: 'var(--color-navy)', fontWeight: '800', lineHeight: 1.2 }}>
              Meri Profile & Saved Addresses
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
              Apne personal details aur delivery locations ko manage karein.
            </p>
          </div>
        </div>

        {/* Toast Alert Banner */}
        {toastMessage && (
          <div
            style={{
              backgroundColor: 'var(--color-success-bg)',
              border: '1.5px solid var(--color-success-border)',
              color: 'var(--color-success)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1.25rem',
              marginBottom: '1.5rem',
              fontWeight: '800',
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

        {errorMsg && (
          <div
            style={{
              backgroundColor: 'var(--color-error-bg)',
              border: '1.5px solid var(--color-error-border)',
              color: 'var(--color-error)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1.25rem',
              marginBottom: '1.5rem',
              fontWeight: '800',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <AlertTriangle size={16} /> <span>{errorMsg}</span>
          </div>
        )}

        {/* Section 1: Customer Personal Details Card */}
        <div
          style={{
            backgroundColor: 'var(--color-cream-card)',
            borderRadius: 'var(--radius-md)',
            border: '1.5px solid var(--color-border)',
            padding: '1.5rem',
            marginBottom: '2rem',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', paddingBottom: '0.65rem', borderBottom: '1.5px solid var(--color-border)' }}>
            <User size={20} color="var(--color-navy)" />
            <h2 className="font-display" style={{ fontSize: '1.25rem', color: 'var(--color-navy)', fontWeight: '800', margin: 0 }}>
              Personal Info
            </h2>
          </div>

          <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: '800', color: 'var(--color-navy)', marginBottom: '0.35rem' }}>
                  Pura Naam *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--color-border)', fontSize: '0.875rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: '800', color: 'var(--color-navy)', marginBottom: '0.35rem' }}>
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--color-border)', fontSize: '0.875rem', outline: 'none' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: '800', color: 'var(--color-text-muted)', marginBottom: '0.35rem' }}>
                Email Address (Login Credential — Read Only)
              </label>
              <input
                type="email"
                disabled
                value={profile?.email || authCustomer?.email || ''}
                style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--color-border)', backgroundColor: 'var(--color-cream)', color: 'var(--color-text-muted)', fontSize: '0.875rem', cursor: 'not-allowed' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button
                type="submit"
                disabled={isUpdatingProfile}
                className="btn btn-primary"
                style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem' }}
              >
                {isUpdatingProfile ? 'Saving...' : 'Update Profile Details'}
              </button>
            </div>

          </form>
        </div>

        {/* Section 2: Saved Addresses Book */}
        <div
          style={{
            backgroundColor: 'var(--color-cream-card)',
            borderRadius: 'var(--radius-md)',
            border: '1.5px solid var(--color-border)',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '0.65rem', borderBottom: '1.5px solid var(--color-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={20} color="var(--color-navy)" />
              <h2 className="font-display" style={{ fontSize: '1.25rem', color: 'var(--color-navy)', fontWeight: '800', margin: 0 }}>
                Saved Delivery Addresses ({profile?.addresses?.length || 0})
              </h2>
            </div>

            <button
              type="button"
              onClick={handleOpenAddAddressModal}
              className="btn btn-gold"
              style={{ padding: '0.45rem 0.95rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
            >
              <Plus size={15} /> Add New Address
            </button>
          </div>

          {/* Address Cards List */}
          {profile?.addresses && profile.addresses.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {profile.addresses.map((addr) => {
                const addrId = addr._id || addr.id;
                const matchedZone = zonesList.find((z) => (z._id || z.id) === addr.zoneId);

                return (
                  <div
                    key={addrId}
                    style={{
                      backgroundColor: 'var(--color-cream)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-border)',
                      padding: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '1rem'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: '800', backgroundColor: 'var(--color-navy)', color: '#FFFFFF', padding: '0.15rem 0.55rem', borderRadius: 'var(--radius-full)', textTransform: 'uppercase' }}>
                          {addr.label || 'Home'}
                        </span>
                        {matchedZone && (
                          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-gold-hover)' }}>
                            Zone: {matchedZone.name} ({matchedZone.distanceLabel})
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--color-navy)', fontWeight: '600', lineHeight: '1.4' }}>
                        {addr.fullAddress}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => handleOpenEditAddressModal(addr)}
                        style={{ padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', backgroundColor: '#FFFFFF', color: 'var(--color-navy)', fontSize: '0.775rem', fontWeight: '700', cursor: 'pointer' }}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteAddress(addrId)}
                        style={{ padding: '0.35rem 0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-error-border)', backgroundColor: 'var(--color-error-bg)', color: 'var(--color-error)', cursor: 'pointer' }}
                        title="Delete Address"
                      >
                        <Trash size={14} color="var(--color-error)" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', margin: 0 }}>
              Abhi koi saved address nahi hai. Checkout me aasani ke liye naya address save karein!
            </p>
          )}

        </div>

        {/* Add/Edit Address Modal Form */}
        {isAddressModalOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-md)', padding: '1.5rem', width: '100%', maxWidth: '480px', boxShadow: 'var(--shadow-md)' }}>
              
              <h3 className="font-display" style={{ fontSize: '1.2rem', color: 'var(--color-navy)', fontWeight: '800', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border)' }}>
                {editingAddressId ? 'Edit Saved Address' : 'Save New Delivery Address'}
              </h3>

              <form onSubmit={handleSaveAddress} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                <div>
                  <label style={{ fontSize: '0.775rem', fontWeight: '800', color: 'var(--color-navy)', display: 'block', marginBottom: '0.35rem' }}>
                    Address Tag / Label (e.g. Home, Office) *
                  </label>
                  <select
                    value={addressLabel}
                    onChange={(e) => setAddressLabel(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--color-border)', fontSize: '0.875rem', outline: 'none' }}
                  >
                    <option value="Home">Home (Ghar)</option>
                    <option value="Office">Office (Daftar)</option>
                    <option value="Shop">Shop (Dukaan)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.775rem', fontWeight: '800', color: 'var(--color-navy)', display: 'block', marginBottom: '0.35rem' }}>
                    Pura Pata (Full Address) *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="House No., Colony, Street, Landmark..."
                    value={fullAddress}
                    onChange={(e) => setFullAddress(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--color-border)', fontSize: '0.875rem', outline: 'none', resize: 'vertical' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.775rem', fontWeight: '800', color: 'var(--color-navy)', display: 'block', marginBottom: '0.35rem' }}>
                    Delivery Zone (Distance Area)
                  </label>
                  <select
                    value={selectedZoneId}
                    onChange={(e) => setSelectedZoneId(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--color-border)', fontSize: '0.875rem', outline: 'none' }}
                  >
                    {zonesList.map((z) => (
                      <option key={z._id || z.id} value={z._id || z.id}>
                        {z.name} ({z.distanceLabel}) — Min Order: ₹{z.minOrderAmount}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1px solid var(--color-border)' }}>
                  <button
                    type="button"
                    onClick={() => setIsAddressModalOpen(false)}
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
                    {editingAddressId ? 'Save Changes' : 'Add Address'}
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Profile;
