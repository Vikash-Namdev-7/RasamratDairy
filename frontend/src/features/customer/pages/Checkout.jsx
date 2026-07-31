import React, { useState, useEffect } from 'react';
import { useCart } from '../../../context/CartContext';
import { ShieldCheck, Clock, ArrowRight, ArrowLeft, CheckCircle, Truck } from '../../../components/Icons';
import { formatCurrency } from '../../../utils/formatCurrency';

export const Checkout = ({ onNavigate }) => {
  const { cartItems, selectedZone, subtotal, deliveryFee, grandTotal, clearCart } = useCart();

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
    deliveryTimeOption: 'asap', // asap or flexible-time
    customTimeNote: '',
    paymentMethod: 'cod', // COD strictly active
  });

  const [errorMsg, setErrorMsg] = useState('');

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setErrorMsg('Kripya Naam, Phone Number, aur Delivery Address bharein.');
      return;
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderId = `#RD-${randomNum}`;

    clearCart();
    if (onNavigate) {
      onNavigate(`/order-confirmation?id=${encodeURIComponent(orderId)}`);
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

        {/* Page Header */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="font-display" style={{ fontSize: '1.65rem', color: 'var(--color-navy)', fontWeight: '800', lineHeight: '1.2' }}>
              Final Checkout
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
              Apna delivery address bharein aur order place karein.
            </p>
          </div>

          {/* Selected Zone Pill Badge */}
          <div
            style={{
              backgroundColor: 'var(--color-cream-card)',
              border: '1.5px solid var(--color-gold)',
              borderRadius: 'var(--radius-full)',
              padding: '0.4rem 0.95rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <Truck size={16} color="var(--color-gold-hover)" />
            <span style={{ fontSize: '0.825rem', fontWeight: '700', color: 'var(--color-navy)' }}>
              {selectedZone ? selectedZone.name : 'Selected Zone'}
            </span>
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('/cart')}
              style={{ background: 'none', border: 'none', color: 'var(--color-wine)', fontWeight: '700', fontSize: '0.775rem', cursor: 'pointer', marginLeft: '0.25rem' }}
            >
              Change
            </button>
          </div>
        </div>

        {errorMsg && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #EF4444', color: '#DC2626', borderRadius: 'var(--radius-sm)', padding: '0.75rem 1rem', marginBottom: '1.25rem', fontSize: '0.875rem', fontWeight: '600' }}>
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '1.5rem', alignItems: 'start' }} className="products-listing-layout">
          
          {/* Left Column: Step-by-Step Checkout Sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Step 1: Customer Details & Address */}
            <div style={{ backgroundColor: 'var(--color-cream-card)', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-border)', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem', paddingBottom: '0.6rem', borderBottom: '1px solid var(--color-border)' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--color-navy)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: '800' }}>
                  1
                </div>
                <h3 className="font-display" style={{ fontSize: '1.1rem', color: 'var(--color-navy)', fontWeight: '700' }}>
                  Delivery Address & Contact
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '0.85rem' }}>
                <div>
                  <label style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--color-navy)', display: 'block', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="e.g., Rahul Sharma"
                    value={formData.fullName}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.85rem', outline: 'none', backgroundColor: 'var(--color-cream)' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--color-navy)', display: 'block', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                    Mobile Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.85rem', outline: 'none', backgroundColor: 'var(--color-cream)' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '0.85rem' }}>
                <label style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--color-navy)', display: 'block', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                  House / Flat / Street Address *
                </label>
                <textarea
                  name="address"
                  required
                  rows={2}
                  placeholder="House No., Building Name, Street Address"
                  value={formData.address}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.85rem', outline: 'none', fontFamily: 'inherit', backgroundColor: 'var(--color-cream)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--color-navy)', display: 'block', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                  Landmark (Optional)
                </label>
                <input
                  type="text"
                  name="landmark"
                  placeholder="Near Temple / School / Park"
                  value={formData.landmark}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.85rem', outline: 'none', backgroundColor: 'var(--color-cream)' }}
                />
              </div>
            </div>

            {/* Step 2: Delivery Preference */}
            <div style={{ backgroundColor: 'var(--color-cream-card)', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-border)', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem', paddingBottom: '0.6rem', borderBottom: '1px solid var(--color-border)' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--color-navy)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: '800' }}>
                  2
                </div>
                <h3 className="font-display" style={{ fontSize: '1.1rem', color: 'var(--color-navy)', fontWeight: '700' }}>
                  Delivery Time Preference
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '0.75rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: formData.deliveryTimeOption === 'asap' ? '2px solid var(--color-navy)' : '1px solid var(--color-border)', backgroundColor: formData.deliveryTimeOption === 'asap' ? 'var(--color-cream)' : 'transparent', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="deliveryTimeOption"
                    value="asap"
                    checked={formData.deliveryTimeOption === 'asap'}
                    onChange={handleChange}
                    style={{ accentColor: 'var(--color-navy)', width: '16px', height: '16px' }}
                  />
                  <div>
                    <span style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--color-navy)', display: 'block' }}>Jaldi Se Jaldi (Express Delivery)</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Agli delivery batch me fast dispatch (approx 2-4 ghante)</span>
                  </div>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: formData.deliveryTimeOption === 'flexible-time' ? '2px solid var(--color-navy)' : '1px solid var(--color-border)', backgroundColor: formData.deliveryTimeOption === 'flexible-time' ? 'var(--color-cream)' : 'transparent', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="deliveryTimeOption"
                    value="flexible-time"
                    checked={formData.deliveryTimeOption === 'flexible-time'}
                    onChange={handleChange}
                    style={{ accentColor: 'var(--color-navy)', width: '16px', height: '16px' }}
                  />
                  <div>
                    <span style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--color-navy)', display: 'block' }}>Specific Time Window Chunein</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Apne anusar delivery timing note likhein</span>
                  </div>
                </label>
              </div>

              {formData.deliveryTimeOption === 'flexible-time' && (
                <div style={{ marginTop: '0.5rem' }}>
                  <input
                    type="text"
                    name="customTimeNote"
                    placeholder="e.g., Deliver between 5:00 PM and 7:00 PM"
                    value={formData.customTimeNote}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.85rem', backgroundColor: 'var(--color-cream)' }}
                  />
                </div>
              )}

              <p style={{ fontSize: '0.725rem', color: 'var(--color-text-muted)', marginTop: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Clock size={14} color="var(--color-gold)" />
                <span>Note: Dukaan owner order accept karne ke baad exact delivery time confirm karenge.</span>
              </p>
            </div>

            {/* Step 3: Payment Method */}
            <div style={{ backgroundColor: 'var(--color-cream-card)', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-border)', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem', paddingBottom: '0.6rem', borderBottom: '1px solid var(--color-border)' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--color-navy)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: '800' }}>
                  3
                </div>
                <h3 className="font-display" style={{ fontSize: '1.1rem', color: 'var(--color-navy)', fontWeight: '700' }}>
                  Payment Options
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {/* Active COD Option */}
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '2px solid var(--color-navy)', backgroundColor: 'var(--color-cream)', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={true}
                    readOnly
                    style={{ accentColor: 'var(--color-navy)', width: '16px', height: '16px' }}
                  />
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--color-navy)', display: 'block' }}>Cash on Delivery (COD)</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Doodh milne par cash ya delivery partner ke QR par pay karein</span>
                  </div>
                  <span className="badge-wine" style={{ fontSize: '0.65rem' }}>Active</span>
                </label>

                {/* Disabled Online Payment (UPI) Option */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1.5px dashed var(--color-border)', backgroundColor: '#F8FAFC', opacity: 0.6, cursor: 'not-allowed' }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    disabled={true}
                    checked={false}
                    style={{ width: '16px', height: '16px', cursor: 'not-allowed' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-text-muted)' }}>Online Payment (UPI / Cards)</span>
                      <span className="badge-gold" style={{ fontSize: '0.6rem', padding: '0.1rem 0.35rem' }}>Coming Soon</span>
                    </div>
                    <span style={{ fontSize: '0.725rem', color: 'var(--color-text-light)' }}>Real payment gateway integration aane par active hoga</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Sticky Order Summary & Confirmation CTA */}
          <div
            style={{
              backgroundColor: 'var(--color-cream-card)',
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid var(--color-border)',
              padding: '1.25rem',
              position: 'sticky',
              top: '90px',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <h3 className="font-display" style={{ fontSize: '1.1rem', color: 'var(--color-navy)', fontWeight: '700', marginBottom: '0.85rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border)' }}>
              Order Summary ({cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'})
            </h3>

            {/* Items List with Thumbnails */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1rem', maxHeight: '200px', overflowY: 'auto' }} className="hide-scrollbar">
              {cartItems.map((item) => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.825rem', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <img src={item.image} alt={item.name} style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover', backgroundColor: '#F3ECE1' }} />
                    <div>
                      <div style={{ color: 'var(--color-navy)', fontWeight: '700' }}>{item.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Qty: {item.quantity} • {item.unit}</div>
                    </div>
                  </div>
                  <span style={{ fontWeight: '800', color: 'var(--color-navy)' }}>
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Cost Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem', paddingTop: '0.65rem', borderTop: '1px dashed var(--color-border)', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
                <span>Delivery ({selectedZone ? selectedZone.name : 'Selected Area'})</span>
                <span style={{ color: deliveryFee === 0 ? '#15803D' : 'var(--color-navy)', fontWeight: '600' }}>
                  {deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}
                </span>
              </div>
              <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '0.35rem 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: '800', color: 'var(--color-navy)' }}>
                <span>Grand Total</span>
                <span>{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-wine"
              style={{ width: '100%', padding: '0.85rem', fontSize: '0.925rem' }}
            >
              Confirm & Place Order (COD) <CheckCircle size={16} />
            </button>

            <div style={{ marginTop: '0.85rem', textAlign: 'center', fontSize: '0.725rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
              <ShieldCheck size={15} color="var(--color-wine)" />
              <span>100% Shuddh & Fresh Guarantee</span>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};

export default Checkout;
