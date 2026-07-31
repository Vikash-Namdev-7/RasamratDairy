import React, { useState, useEffect } from 'react';
import SectionHeading from '../components/SectionHeading';
import { milkTypes, literOptions, slots } from '../data/subscriptionPlans';
import { mySubscriptions as initialSubscriptions } from '../data/mySubscriptions';
import { CheckCircle, Clock, ShieldCheck, ArrowRight, ArrowLeft, Plus, Minus, Check } from '../../../components/Icons';
import { formatCurrency } from '../../../utils/formatCurrency';

export const Subscription = ({ onNavigate }) => {
  // 1. Local state initialized with localStorage fallback or mock data
  const [subscriptionsList, setSubscriptionsList] = useState(() => {
    const saved = localStorage.getItem('rasamrat-subscriptions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse subscriptions', e);
      }
    }
    return initialSubscriptions;
  });

  // 2. Configurator Form State
  const [selectedMilkTypeId, setSelectedMilkTypeId] = useState(milkTypes[0].id);
  const [literIndex, setLiterIndex] = useState(1); // default 1L (index 1 in [0.5, 1, 1.5, 2, 2.5, 3])
  const [selectedSlotId, setSelectedSlotId] = useState(slots[0].id); // morning by default
  const [successToast, setSuccessToast] = useState('');

  // Persist subscriptions to localStorage
  useEffect(() => {
    localStorage.setItem('rasamrat-subscriptions', JSON.stringify(subscriptionsList));
  }, [subscriptionsList]);

  const selectedMilkType = milkTypes.find((m) => m.id === selectedMilkTypeId) || milkTypes[0];
  const selectedLitre = literOptions[literIndex];
  const selectedSlot = slots.find((s) => s.id === selectedSlotId) || slots[0];

  const perDayCost = selectedMilkType.pricePerLitre * selectedLitre;
  const monthlyEstimate = perDayCost * 30;

  const handleBackClick = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else if (onNavigate) {
      onNavigate('/');
    }
  };

  const handleDecrementLitre = () => {
    setLiterIndex((prev) => Math.max(0, prev - 1));
  };

  const handleIncrementLitre = () => {
    setLiterIndex((prev) => Math.min(literOptions.length - 1, prev + 1));
  };

  const handleCreateSubscription = (e) => {
    e.preventDefault();

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const startDateStr = tomorrow.toISOString().split('T')[0];

    const newSub = {
      id: `sub-${Date.now()}`,
      milkTypeId: selectedMilkTypeId,
      litres: selectedLitre,
      slot: selectedSlotId,
      status: 'active',
      pausedDates: [],
      startDate: startDateStr,
    };

    setSubscriptionsList((prev) => [newSub, ...prev]);
    setSuccessToast('🎉 Subscription successfully shuru ho gayi!');

    setTimeout(() => {
      setSuccessToast('');
    }, 3500);
  };

  const handleTogglePause = (subId) => {
    const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    setSubscriptionsList((prev) =>
      prev.map((sub) => {
        if (sub.id === subId) {
          const isCurrentlyActive = sub.status === 'active';
          const newStatus = isCurrentlyActive ? 'paused' : 'active';
          const updatedPausedDates = isCurrentlyActive
            ? Array.from(new Set([...(sub.pausedDates || []), tomorrowStr]))
            : (sub.pausedDates || []).filter((d) => d !== tomorrowStr);
          return {
            ...sub,
            status: newStatus,
            pausedDates: updatedPausedDates,
          };
        }
        return sub;
      })
    );
  };

  const handleCancelSubscription = (subId) => {
    if (window.confirm('Pakka is subscription ko cancel karna hai?')) {
      setSubscriptionsList((prev) => prev.filter((sub) => sub.id !== subId));
    }
  };

  return (
    <div style={{ paddingTop: '1.25rem', paddingBottom: '4rem' }}>
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

        {/* Section A — Hero / Intro */}
        <SectionHeading
          eyebrow="Roz Ki Doodh-Bandi"
          title="Apni Subscription Set Karein"
          description="Ek baar set karein, roz automatic delivery — jab chahe pause ya badlein."
        />

        {/* Success Alert Banner */}
        {successToast && (
          <div
            style={{
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              border: '1.5px solid #22C55E',
              color: '#15803D',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1.25rem',
              marginBottom: '1.5rem',
              fontWeight: '700',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              animation: 'slideDownFade 0.3s ease'
            }}
          >
            <CheckCircle size={18} color="#15803D" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Section B — Configurator Widget */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', alignItems: 'start', marginBottom: '3.5rem' }} className="products-listing-layout">
          
          {/* Configurator Controls */}
          <div style={{ backgroundColor: 'var(--color-cream-card)', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-border)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
            
            {/* 1. Milk Type Select */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label style={{ fontSize: '0.825rem', fontWeight: '700', color: 'var(--color-navy)', display: 'block', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                1. Select Milk Type *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.85rem' }}>
                {milkTypes.map((milk) => {
                  const isSelected = selectedMilkTypeId === milk.id;
                  return (
                    <button
                      key={milk.id}
                      type="button"
                      onClick={() => setSelectedMilkTypeId(milk.id)}
                      style={{
                        padding: '0.85rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        border: isSelected ? '2px solid var(--color-navy)' : '1px solid var(--color-border)',
                        backgroundColor: isSelected ? 'var(--color-cream)' : 'transparent',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--color-navy)', marginBottom: '0.2rem' }}>
                        {milk.name}
                      </div>
                      <div style={{ fontSize: '0.825rem', color: 'var(--color-wine)', fontWeight: '800' }}>
                        ₹{milk.pricePerLitre} / Litre
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Litre Stepper Picker */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label style={{ fontSize: '0.825rem', fontWeight: '700', color: 'var(--color-navy)', display: 'block', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                2. Select Daily Quantity (Litres) *
              </label>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    border: '1.5px solid var(--color-border)',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--color-cream)',
                    padding: '0.25rem 0.5rem'
                  }}
                >
                  <button
                    type="button"
                    onClick={handleDecrementLitre}
                    disabled={literIndex === 0}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      border: 'none',
                      backgroundColor: literIndex === 0 ? 'transparent' : 'var(--color-cream-card)',
                      cursor: literIndex === 0 ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: literIndex === 0 ? 0.4 : 1
                    }}
                  >
                    <Minus size={15} color="var(--color-navy)" />
                  </button>

                  <span style={{ minWidth: '70px', textAlign: 'center', fontWeight: '800', fontSize: '1.1rem', color: 'var(--color-navy)' }}>
                    {selectedLitre} L
                  </span>

                  <button
                    type="button"
                    onClick={handleIncrementLitre}
                    disabled={literIndex === literOptions.length - 1}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      border: 'none',
                      backgroundColor: literIndex === literOptions.length - 1 ? 'transparent' : 'var(--color-cream-card)',
                      cursor: literIndex === literOptions.length - 1 ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: literIndex === literOptions.length - 1 ? 0.4 : 1
                    }}
                  >
                    <Plus size={15} color="var(--color-navy)" />
                  </button>
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                  (0.5L steps, max 3.0L per day)
                </div>
              </div>
            </div>

            {/* 3. Slot Toggle Buttons */}
            <div>
              <label style={{ fontSize: '0.825rem', fontWeight: '700', color: 'var(--color-navy)', display: 'block', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                3. Preferred Delivery Slot *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                {slots.map((slot) => {
                  const isSelected = selectedSlotId === slot.id;
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => setSelectedSlotId(slot.id)}
                      style={{
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        border: isSelected ? '2px solid var(--color-navy)' : '1px solid var(--color-border)',
                        backgroundColor: isSelected ? 'var(--color-navy)' : 'transparent',
                        color: isSelected ? '#FFFFFF' : 'var(--color-navy)',
                        fontWeight: '700',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <span>{slot.icon}</span>
                      <span>{slot.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Summary Card & Live Price */}
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
              Plan Summary & Price
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Milk Type</span>
                <span style={{ fontWeight: '700', color: 'var(--color-navy)' }}>{selectedMilkType.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Daily Litres</span>
                <span style={{ fontWeight: '700', color: 'var(--color-navy)' }}>{selectedLitre} L / day</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Delivery Slot</span>
                <span style={{ fontWeight: '700', color: 'var(--color-navy)' }}>{selectedSlot.label}</span>
              </div>
              <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '0.25rem 0' }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
                <span>Per Day Cost</span>
                <span style={{ fontWeight: '700', color: 'var(--color-wine)' }}>{formatCurrency(perDayCost)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: '800', color: 'var(--color-navy)' }}>
                <span>Monthly Estimate</span>
                <span>{formatCurrency(monthlyEstimate)}</span>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-wine"
              onClick={handleCreateSubscription}
              style={{ width: '100%', padding: '0.85rem', fontSize: '0.9rem' }}
            >
              Subscription Shuru Karein <CheckCircle size={16} />
            </button>

            <div style={{ marginTop: '1rem', fontSize: '0.725rem', color: 'var(--color-text-muted)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <CheckCircle size={13} color="#15803D" />
                <span>Jab chahe 1-click me pause ya cancel karein</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <ShieldCheck size={13} color="var(--color-wine)" />
                <span>100% Shuddh Farm-Fresh Doodh</span>
              </div>
            </div>
          </div>

        </div>

        {/* Section C — Meri Subscriptions (My Active Subscriptions Cards) */}
        <div style={{ marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '0.5rem', borderBottom: '1.5px solid var(--color-border)' }}>
            <h2 className="font-display" style={{ fontSize: '1.35rem', color: 'var(--color-navy)', fontWeight: '800' }}>
              Meri Subscriptions ({subscriptionsList.length})
            </h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Active & Scheduled Orders</span>
          </div>

          {subscriptionsList.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {subscriptionsList.map((sub) => {
                const milkInfo = milkTypes.find((m) => m.id === sub.milkTypeId) || milkTypes[0];
                const slotInfo = slots.find((s) => s.id === sub.slot) || slots[0];
                const isActive = sub.status === 'active';

                return (
                  <div
                    key={sub.id}
                    style={{
                      backgroundColor: 'var(--color-cream-card)',
                      borderRadius: 'var(--radius-md)',
                      border: '1.5px solid var(--color-border)',
                      padding: '1.15rem',
                      boxShadow: 'var(--shadow-sm)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      {/* Badge Header */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: '800',
                            padding: '0.2rem 0.6rem',
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: isActive ? 'rgba(34, 197, 94, 0.15)' : '#E2E8F0',
                            color: isActive ? '#15803D' : '#64748B',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}
                        >
                          {isActive ? '● Active' : '⏸ Paused / Skipped'}
                        </span>
                        <span style={{ fontSize: '0.725rem', color: 'var(--color-text-muted)' }}>
                          Start: {sub.startDate}
                        </span>
                      </div>

                      {/* Title & Info */}
                      <h3 className="font-display" style={{ fontSize: '1.05rem', color: 'var(--color-navy)', fontWeight: '700', marginBottom: '0.25rem' }}>
                        {sub.litres}L {milkInfo.name}
                      </h3>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Clock size={14} color="var(--color-gold-hover)" />
                        <span>{slotInfo.label}</span>
                      </div>
                    </div>

                    {/* Actions Row */}
                    <div style={{ paddingTop: '0.75rem', borderTop: '1px dashed var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => handleTogglePause(sub.id)}
                        className={`btn ${isActive ? 'btn-outline' : 'btn-gold'}`}
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.775rem' }}
                      >
                        {isActive ? 'Kal Ke Liye Skip Karein' : 'Resume Karein'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCancelSubscription(sub.id)}
                        style={{ background: 'none', border: 'none', color: '#EF4444', fontSize: '0.775rem', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              style={{
                backgroundColor: 'var(--color-cream-card)',
                borderRadius: 'var(--radius-md)',
                border: '1.5px dashed var(--color-border)',
                padding: '2.5rem 1rem',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🥛</div>
              <h3 className="font-display" style={{ fontSize: '1.15rem', color: 'var(--color-navy)', fontWeight: '700', marginBottom: '0.3rem' }}>
                Abhi Koi Subscription Active Nahi Hai
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
                Upar se milk type, litre aur delivery slot chun kar apni pehli subscription shuru karein.
              </p>
            </div>
          )}
        </div>

        {/* Section D — How It Works (Info Section) */}
        <div>
          <SectionHeading
            eyebrow="Aasan Prakriya"
            title="Subscription Kaise Kaam Karti Hai?"
            description="Bina kisi jhanjhat ke rozana taaza doodh aapke ghar tak pahunchane ka tarika"
          />

          <div className="grid-4" style={{ marginTop: '1.5rem' }}>
            <div style={{ backgroundColor: 'var(--color-cream-card)', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-border)', padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>1️⃣</div>
              <h4 className="font-display" style={{ fontSize: '0.95rem', color: 'var(--color-navy)', fontWeight: '700', marginBottom: '0.35rem' }}>
                Milk & Litre Chunein
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0 }}>
                Apne pariwar ki zaroorat ke anusar doodh ka prakar aur litre set karein.
              </p>
            </div>

            <div style={{ backgroundColor: 'var(--color-cream-card)', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-border)', padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>2️⃣</div>
              <h4 className="font-display" style={{ fontSize: '0.95rem', color: 'var(--color-navy)', fontWeight: '700', marginBottom: '0.35rem' }}>
                Slot Decide Karein
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0 }}>
                Subah (6-9 AM) ya Shaam (5-7 PM) me se delivery ka timing slot choose karein.
              </p>
            </div>

            <div style={{ backgroundColor: 'var(--color-cream-card)', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-border)', padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>3️⃣</div>
              <h4 className="font-display" style={{ fontSize: '0.95rem', color: 'var(--color-navy)', fontWeight: '700', marginBottom: '0.35rem' }}>
                Roz Automatic Delivery
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0 }}>
                Humara delivery agent roz fixed timing par taaza doodh aapke ghar rakhega.
              </p>
            </div>

            <div style={{ backgroundColor: 'var(--color-cream-card)', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-border)', padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>4️⃣</div>
              <h4 className="font-display" style={{ fontSize: '0.95rem', color: 'var(--color-navy)', fontWeight: '700', marginBottom: '0.35rem' }}>
                Jab Chahe Pause / Cancel
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0 }}>
                Kahi bahar jane par 1-click me agle din ki delivery skip ya cancel karein.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Subscription;
