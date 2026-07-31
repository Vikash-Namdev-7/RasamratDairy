import React from 'react';
import { useCart } from '../../../context/CartContext';
import { Plus, Minus, Trash, ArrowRight, ArrowLeft, ShieldCheck, Truck, Check } from '../../../components/Icons';
import { formatCurrency } from '../../../utils/formatCurrency';

export const Cart = ({ onNavigate }) => {
  const {
    cartItems,
    updateQty,
    removeFromCart,
    selectedZone,
    setZone,
    zones,
    subtotal,
    deliveryFee,
    minOrderAmount,
    shortfall,
    isMinOrderMet,
    progressPercent,
    grandTotal
  } = useCart();

  const handleBackClick = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else if (onNavigate) {
      onNavigate('/');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div style={{ paddingTop: '3.5rem', paddingBottom: '4.5rem', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '460px' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🛒</div>
          <h2 className="font-display" style={{ fontSize: '1.6rem', color: 'var(--color-navy)', fontWeight: '700', marginBottom: '0.5rem' }}>
            Aapka Cart Khaali Hai
          </h2>
          <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1.75rem', lineHeight: '1.6' }}>
            Aapne abhi tak koi fresh dairy product cart me add nahi kiya hai. Shuddh doodh, dahi ya paneer add karke order shuru karein.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onNavigate && onNavigate('/products')}
            style={{ padding: '0.75rem 1.6rem', fontSize: '0.9rem' }}
          >
            Products Dekhein <ArrowRight size={16} />
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

        <h1 className="font-display" style={{ fontSize: '1.75rem', color: 'var(--color-navy)', fontWeight: '700', marginBottom: '1.25rem' }}>
          Aapki Shopping Cart ({cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'})
        </h1>

        {/* Zone Minimum Order Alert Banner */}
        <div
          style={{
            backgroundColor: isMinOrderMet ? 'rgba(34, 197, 94, 0.08)' : 'rgba(239, 68, 68, 0.08)',
            border: `1.5px solid ${isMinOrderMet ? '#22C55E' : 'var(--color-wine)'}`,
            borderRadius: 'var(--radius-md)',
            padding: '1rem 1.15rem',
            marginBottom: '1.5rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Truck size={18} color={isMinOrderMet ? '#15803D' : 'var(--color-wine)'} />
              <span style={{ fontSize: '0.875rem', fontWeight: '700', color: isMinOrderMet ? '#15803D' : 'var(--color-wine)' }}>
                {selectedZone ? selectedZone.name : 'Delivery Area'} (Min Order: {formatCurrency(minOrderAmount)})
              </span>
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--color-navy)' }}>
              {formatCurrency(subtotal)} / {formatCurrency(minOrderAmount)}
            </span>
          </div>

          {/* Progress Bar */}
          <div style={{ height: '7px', backgroundColor: 'rgba(0,0,0,0.08)', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.5rem' }}>
            <div style={{ height: '100%', width: `${progressPercent}%`, backgroundColor: isMinOrderMet ? '#22C55E' : 'var(--color-wine)', transition: 'width 0.4s ease' }} />
          </div>

          {!isMinOrderMet ? (
            <p style={{ fontSize: '0.825rem', color: 'var(--color-wine)', fontWeight: '600', margin: 0 }}>
              ⚠️ Is area me home delivery ke liye minimum {formatCurrency(minOrderAmount)} ka order zaroori hai. <strong>Aur {formatCurrency(shortfall)} ka saman jodiye home delivery ke liye.</strong>
            </p>
          ) : (
            <p style={{ fontSize: '0.825rem', color: '#15803D', fontWeight: '600', margin: 0, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Check size={16} color="#15803D" /> Aap home delivery ke liye eligible hain ✓
            </p>
          )}
        </div>

        {/* 2-Column Main Cart Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', alignItems: 'start' }} className="products-listing-layout">
          
          {/* Left Column: Cart Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {cartItems.map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: 'var(--color-cream-card)',
                  borderRadius: 'var(--radius-md)',
                  border: '1.5px solid var(--color-border)',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.85rem',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', backgroundColor: '#F3ECE1' }}
                  />
                  <div>
                    <h3 className="font-display" style={{ fontSize: '0.95rem', color: 'var(--color-navy)', fontWeight: '700', marginBottom: '0.15rem' }}>
                      {item.name}
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                      {item.unit} Pack • {formatCurrency(item.price)} each
                    </span>
                    <span style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--color-navy)' }}>
                      Total: {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                </div>

                {/* Actions: Stepper + Trash Button */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-cream)', padding: '0.15rem 0.35rem' }}>
                    <button
                      type="button"
                      onClick={() => updateQty(item.id, item.quantity - 1)}
                      style={{ width: '26px', height: '26px', borderRadius: '50%', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Minus size={13} color="var(--color-navy)" />
                    </button>
                    <span style={{ width: '28px', textAlign: 'center', fontWeight: '800', fontSize: '0.875rem', color: 'var(--color-navy)' }}>
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQty(item.id, item.quantity + 1)}
                      style={{ width: '26px', height: '26px', borderRadius: '50%', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Plus size={13} color="var(--color-navy)" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '0.35rem' }}
                    title="Remove item"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Order Summary & Zone Picker */}
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
            <h3 className="font-display" style={{ fontSize: '1.1rem', color: 'var(--color-navy)', fontWeight: '700', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border)' }}>
              Order Summary
            </h3>

            {/* Delivery Zone Selector */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--color-navy)', display: 'block', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Apna Delivery Area Chunein *
              </label>
              <select
                value={selectedZone ? selectedZone.id : ''}
                onChange={(e) => setZone(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1.5px solid var(--color-border)',
                  backgroundColor: 'var(--color-cream)',
                  fontSize: '0.85rem',
                  color: 'var(--color-navy)',
                  fontWeight: '600',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {zones.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name} (Min: ₹{z.minOrderAmount || z.minOrder})
                  </option>
                ))}
              </select>
              <span style={{ fontSize: '0.725rem', color: 'var(--color-text-muted)', display: 'block', marginTop: '0.3rem' }}>
                {selectedZone ? selectedZone.description : ''}
              </span>
            </div>

            {/* Bill Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal ({cartItems.length} items)</span>
                <span style={{ fontWeight: '700', color: 'var(--color-navy)' }}>{formatCurrency(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Delivery Charge</span>
                <span style={{ fontWeight: '700', color: deliveryFee === 0 ? '#15803D' : 'var(--color-navy)' }}>
                  {deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}
                </span>
              </div>
              <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '0.35rem 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: '800', color: 'var(--color-navy)' }}>
                <span>Total Payable</span>
                <span>{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            {/* Proceed to Checkout CTA */}
            <button
              type="button"
              disabled={!isMinOrderMet}
              onClick={() => onNavigate && onNavigate('/checkout')}
              className={`btn ${isMinOrderMet ? 'btn-wine' : 'btn-outline'}`}
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '0.925rem',
                cursor: isMinOrderMet ? 'pointer' : 'not-allowed',
                opacity: isMinOrderMet ? 1 : 0.65
              }}
            >
              Proceed to Checkout <ArrowRight size={16} />
            </button>

            {!isMinOrderMet && (
              <p style={{ fontSize: '0.75rem', color: 'var(--color-wine)', textAlign: 'center', marginTop: '0.5rem', fontWeight: '600' }}>
                Aur {formatCurrency(shortfall)} ka saman jodiye home delivery ke liye.
              </p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default Cart;
