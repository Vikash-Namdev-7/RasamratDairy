import React, { useState, useEffect } from 'react';
import { useCart } from '../../../context/CartContext';
import { ShieldCheck, Clock, ArrowRight, ArrowLeft, CheckCircle, Truck, MapPin, Plus } from '../../../components/Icons';
import { formatCurrency } from '../../../utils/formatCurrency';
import ordersApi from '../../../api/orders.api';
import customerApi from '../../../api/customer.api';

export const Checkout = ({ onNavigate }) => {
  const { cartItems, selectedZone, setSelectedZoneId, zones, subtotal, deliveryFee, grandTotal, clearCart } = useCart();

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('manual'); // 'manual' or addressId

  useEffect(() => {
    if (cartItems.length === 0 && onNavigate) {
      onNavigate('/cart');
    }
  }, [cartItems.length, onNavigate]);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    landmark: '',
    deliveryTimeOption: 'asap', // asap or morning
    customTimeNote: '',
    paymentMethod: 'cod',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch Saved Addresses on mount
  useEffect(() => {
    let isMounted = true;
    async function fetchSavedAddresses() {
      try {
        const res = await customerApi.getProfile();
        if (isMounted && res.data && res.data.data) {
          const profile = res.data.data;
          setFormData((prev) => ({
            ...prev,
            fullName: profile.name || prev.fullName,
            phone: profile.phone || prev.phone
          }));

          if (Array.isArray(profile.addresses) && profile.addresses.length > 0) {
            setSavedAddresses(profile.addresses);
            const firstAddr = profile.addresses[0];
            const firstId = firstAddr._id || firstAddr.id;
            setSelectedAddressId(firstId);
            setFormData((prev) => ({
              ...prev,
              address: firstAddr.fullAddress
            }));
            if (firstAddr.zoneId && setSelectedZoneId) {
              setSelectedZoneId(firstAddr.zoneId);
            }
          }
        }
      } catch (err) {
        console.warn('⚠️ Could not fetch saved addresses in Checkout');
      }
    }
    fetchSavedAddresses();
    return () => { isMounted = false; };
  }, [setSelectedZoneId]);

  const handleSelectSavedAddress = (addr) => {
    const addrId = addr._id || addr.id;
    setSelectedAddressId(addrId);
    setFormData((prev) => ({
      ...prev,
      address: addr.fullAddress
    }));
    if (addr.zoneId && setSelectedZoneId) {
      setSelectedZoneId(addr.zoneId);
    }
    setErrorMsg('');
  };

  const handleSelectManualEntry = () => {
    setSelectedAddressId('manual');
    setFormData((prev) => ({ ...prev, address: '' }));
    setErrorMsg('');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handleBackClick = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else if (onNavigate) {
      onNavigate('/cart');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setErrorMsg('Kripya Naam, Phone Number, aur Delivery Address bharein.');
      return;
    }

    setIsSubmitting(true);

    const fullAddress = `${formData.address.trim()}${
      formData.landmark.trim() ? `, Landmark: ${formData.landmark.trim()}` : ''
    }`;

    const payload = {
      items: cartItems.map((i) => ({
        productId: i.id || i._id,
        qty: i.qty
      })),
      zoneId: selectedZone.id || selectedZone._id,
      address: fullAddress,
      deliveryTimeOption: formData.deliveryTimeOption,
      customTimeNote: formData.customTimeNote
    };

    try {
      const res = await ordersApi.createOrder(payload);
      if (res.data && res.data.success) {
        const orderData = res.data.data;
        const orderIdParam = orderData._id || orderData.orderNumber || 'RD-1001';
        clearCart();
        setIsSubmitting(false);
        if (onNavigate) {
          onNavigate(`/order-confirmation?id=${encodeURIComponent(orderIdParam)}`);
        }
      }
    } catch (err) {
      setIsSubmitting(false);
      const backendError = err.response?.data?.message || 'Order place nahi ho paaya. Details re-check karein.';
      setErrorMsg(backendError);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div style={{ paddingTop: '3.5rem', paddingBottom: '4.5rem', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '460px' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🛍️</div>
          <h2 className="font-display" style={{ fontSize: '1.6rem', color: 'var(--color-navy)', fontWeight: '700', marginBottom: '0.5rem' }}>
            Cart Me Koi Item Nahi Hai
          </h2>
          <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1.75rem' }}>
            Pehle cart me fresh dairy items add karein, fir checkout par aayein.
          </p>
          <button type="button" className="btn btn-primary" onClick={() => onNavigate && onNavigate('/products')}>
            Products Catalog Dekhein <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '1.25rem', paddingBottom: '3.5rem' }}>
      <div className="container">
        
        {/* Top Back Navigation Button */}
        <div style={{ marginBottom: '1rem' }}>
          <button
            type="button"
            onClick={handleBackClick}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'none',
              border: 'none',
              color: 'var(--color-navy)',
              fontWeight: '700',
              fontSize: '0.875rem',
              cursor: 'pointer',
              padding: '0.35rem 0'
            }}
          >
            <ArrowLeft size={18} color="var(--color-navy)" />
            <span>Back</span>
          </button>
        </div>

        {/* Page Title & Micro Trust Strip */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="font-display" style={{ fontSize: '1.85rem', color: 'var(--color-navy)', fontWeight: '800', lineHeight: 1.2 }}>
              Delivery Details & Checkout
            </h1>
            <p className="text-muted" style={{ fontSize: '0.875rem', marginTop: '0.2rem' }}>
              Subah 7 Baje Tak Fresh Delivery • Cash / UPI on Delivery
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--color-cream-card)', padding: '0.4rem 0.85rem', borderRadius: 'var(--radius-full)', border: '1.5px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
            <ShieldCheck size={18} color="var(--color-gold-hover)" />
            <span style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--color-navy)' }}>100% Secure Checkout</span>
          </div>
        </div>

        {/* Main 2-Column Split: Form (Left) + Order Summary (Right) */}
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'start' }} className="products-listing-layout">
          
          {/* Left Column: Customer & Delivery Details Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Error Banner */}
            {errorMsg && (
              <div
                style={{
                  backgroundColor: 'var(--color-error-bg)',
                  border: '1.5px solid var(--color-error-border)',
                  color: 'var(--color-error)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem 1.1rem',
                  fontSize: '0.875rem',
                  fontWeight: '700',
                  animation: 'slideDownFade 0.25s ease'
                }}
              >
                ⚠️ {errorMsg}
              </div>
            )}

            {/* Section 1: Customer Contact Info */}
            <div
              style={{
                backgroundColor: 'var(--color-cream-card)',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--color-border)',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <h3 className="font-display" style={{ fontSize: '1.15rem', color: 'var(--color-navy)', fontWeight: '700', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border)' }}>
                1. Grahak Ki Jankari (Contact Info)
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--color-navy)', marginBottom: '0.35rem' }}>
                    Pura Naam *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="e.g. Ramesh Patel"
                    value={formData.fullName}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1.5px solid var(--color-border)',
                      fontSize: '0.875rem',
                      outline: 'none',
                      backgroundColor: 'var(--color-cream)'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--color-navy)', marginBottom: '0.35rem' }}>
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="e.g. 98260 12345"
                    value={formData.phone}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1.5px solid var(--color-border)',
                      fontSize: '0.875rem',
                      outline: 'none',
                      backgroundColor: 'var(--color-cream)'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Delivery Address (Saved Addresses Selector + Manual Form) */}
            <div
              style={{
                backgroundColor: 'var(--color-cream-card)',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--color-border)',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <h3 className="font-display" style={{ fontSize: '1.15rem', color: 'var(--color-navy)', fontWeight: '700', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border)' }}>
                2. Delivery Address (Pura Pata)
              </h3>

              {/* Saved Address Selection Cards (if any exist) */}
              {savedAddresses.length > 0 && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', color: 'var(--color-navy)', marginBottom: '0.5rem' }}>
                    Aapke Saved Addresses Me Se Select Karein:
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {savedAddresses.map((addr) => {
                      const addrId = addr._id || addr.id;
                      const isSelected = selectedAddressId === addrId;
                      return (
                        <div
                          key={addrId}
                          onClick={() => handleSelectSavedAddress(addr)}
                          style={{
                            padding: '0.85rem 1rem',
                            borderRadius: 'var(--radius-sm)',
                            border: isSelected ? '2px solid var(--color-gold-hover)' : '1px solid var(--color-border)',
                            backgroundColor: isSelected ? 'var(--color-gold-soft)' : 'var(--color-cream)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem'
                          }}
                        >
                          <input
                            type="radio"
                            name="addressSelection"
                            checked={isSelected}
                            onChange={() => handleSelectSavedAddress(addr)}
                            style={{ accentColor: 'var(--color-navy)', width: '16px', height: '16px' }}
                          />
                          <div>
                            <span style={{ fontSize: '0.75rem', fontWeight: '800', backgroundColor: 'var(--color-navy)', color: '#FFFFFF', padding: '0.15rem 0.55rem', borderRadius: 'var(--radius-full)', textTransform: 'uppercase', marginRight: '0.4rem' }}>
                              {addr.label || 'Home'}
                            </span>
                            <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-navy)' }}>
                              {addr.fullAddress}
                            </span>
                          </div>
                        </div>
                      );
                    })}

                    {/* Manual Entry Option */}
                    <div
                      onClick={handleSelectManualEntry}
                      style={{
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        border: selectedAddressId === 'manual' ? '2px solid var(--color-gold-hover)' : '1px dashed var(--color-border)',
                        backgroundColor: selectedAddressId === 'manual' ? 'var(--color-gold-soft)' : 'transparent',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        color: 'var(--color-navy)'
                      }}
                    >
                      <input
                        type="radio"
                        name="addressSelection"
                        checked={selectedAddressId === 'manual'}
                        onChange={handleSelectManualEntry}
                        style={{ accentColor: 'var(--color-navy)', width: '16px', height: '16px' }}
                      />
                      <Plus size={16} /> <span>➕ High-speed Manual Address Input</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Manual Input Fields */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--color-navy)', marginBottom: '0.35rem' }}>
                    Ghar / Plot / Flat Number & Colony Name *
                  </label>
                  <textarea
                    name="address"
                    required
                    rows={2}
                    placeholder="e.g. House No 45, Nayapura Main Road, Near Central Park"
                    value={formData.address}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1.5px solid var(--color-border)',
                      fontSize: '0.875rem',
                      outline: 'none',
                      resize: 'vertical',
                      backgroundColor: 'var(--color-cream)'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--color-navy)', marginBottom: '0.35rem' }}>
                    Landmark / Paas Ki Jagah (Optional)
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    placeholder="e.g. Mandir ke paas, Water tank ke samne"
                    value={formData.landmark}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1.5px solid var(--color-border)',
                      fontSize: '0.875rem',
                      outline: 'none',
                      backgroundColor: 'var(--color-cream)'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Delivery Timing Preference */}
            <div
              style={{
                backgroundColor: 'var(--color-cream-card)',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--color-border)',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <h3 className="font-display" style={{ fontSize: '1.15rem', color: 'var(--color-navy)', fontWeight: '700', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border)' }}>
                3. Delivery Timing Options
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    border: formData.deliveryTimeOption === 'asap' ? '2px solid var(--color-gold-hover)' : '1px solid var(--color-border)',
                    backgroundColor: formData.deliveryTimeOption === 'asap' ? 'var(--color-gold-soft)' : 'var(--color-cream)',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="radio"
                    name="deliveryTimeOption"
                    value="asap"
                    checked={formData.deliveryTimeOption === 'asap'}
                    onChange={handleChange}
                    style={{ accentColor: 'var(--color-navy)', width: '16px', height: '16px' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--color-navy)' }}>
                      ⚡ Jald Se Jald (Within 45-60 Minutes)
                    </div>
                    <div style={{ fontSize: '0.775rem', color: 'var(--color-text-muted)', marginTop: '0.1rem' }}>
                      Farm se turant fresh pack hokar niklega.
                    </div>
                  </div>
                </label>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    border: formData.deliveryTimeOption === 'morning' ? '2px solid var(--color-gold-hover)' : '1px solid var(--color-border)',
                    backgroundColor: formData.deliveryTimeOption === 'morning' ? 'var(--color-gold-soft)' : 'var(--color-cream)',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="radio"
                    name="deliveryTimeOption"
                    value="morning"
                    checked={formData.deliveryTimeOption === 'morning'}
                    onChange={handleChange}
                    style={{ accentColor: 'var(--color-navy)', width: '16px', height: '16px' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--color-navy)' }}>
                      🌅 Kal Subah Early Morning Slot (6:00 AM - 7:30 AM)
                    </div>
                    <div style={{ fontSize: '0.775rem', color: 'var(--color-text-muted)', marginTop: '0.1rem' }}>
                      Rozana ki subah ki chai ke liye fresh doodh batch.
                    </div>
                  </div>
                </label>
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary & Place Order CTA */}
          <div style={{ position: 'sticky', top: '90px' }}>
            <div
              style={{
                backgroundColor: 'var(--color-cream-card)',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--color-border)',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              <h3 className="font-display" style={{ fontSize: '1.25rem', color: 'var(--color-navy)', fontWeight: '800', marginBottom: '1rem', paddingBottom: '0.65rem', borderBottom: '1.5px solid var(--color-border)' }}>
                Order Summary ({cartItems.length} Items)
              </h3>

              {/* Items List Snapshot */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '220px', overflowY: 'auto', marginBottom: '1.25rem', paddingRight: '0.25rem' }}>
                {cartItems.map((item) => (
                  <div key={item.id || item._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <img src={item.image} alt={item.name} style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: '700', color: 'var(--color-navy)' }}>{item.name}</div>
                        <div style={{ fontSize: '0.725rem', color: 'var(--color-text-muted)' }}>{item.qty} × ₹{item.price}</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: '800', color: 'var(--color-navy)' }}>
                      {formatCurrency(item.price * item.qty)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Zone Tag */}
              <div style={{ backgroundColor: 'var(--color-cream)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.725rem', color: 'var(--color-text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Delivery Area</div>
                <div style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--color-navy)', marginTop: '0.1rem' }}>{selectedZone?.name}</div>
              </div>

              {/* Bill Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
                  <span>Delivery Charge ({selectedZone?.distanceLabel})</span>
                  <span>{deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}</span>
                </div>
                <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '0.35rem 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '900', fontSize: '1.15rem', color: 'var(--color-navy)' }}>
                  <span>Total Payable</span>
                  <span>{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              {/* Payment Mode Note */}
              <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 'var(--radius-sm)', padding: '0.65rem 0.85rem', marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Truck size={16} color="var(--color-success)" /> Payment Method: Cash / UPI on Delivery
                </div>
                <div style={{ fontSize: '0.725rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                  Ghar par delivery ke waqt cash ya QR code scan karke UPI payment karein.
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-gold"
                style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', fontWeight: '800' }}
              >
                {isSubmitting ? 'Order Processing...' : `Order Place Karein (${formatCurrency(grandTotal)})`}
              </button>

            </div>
          </div>

        </form>

      </div>
    </div>
  );
};

export default Checkout;
