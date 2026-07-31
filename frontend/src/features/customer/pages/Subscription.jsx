import React, { useState, useEffect } from 'react';
import SectionHeading from '../components/SectionHeading';
import { milkTypes, literOptions, slots } from '../data/subscriptionPlans';
import { mySubscriptions as initialSubscriptions } from '../data/mySubscriptions';
import { CheckCircle, Clock, ShieldCheck, ArrowRight, ArrowLeft, Plus, Minus, Check } from '../../../components/Icons';
import { formatCurrency } from '../../../utils/formatCurrency';
import subscriptionsApi from '../../../api/subscriptions.api';

export const Subscription = ({ onNavigate }) => {
  const [subscriptionsList, setSubscriptionsList] = useState(initialSubscriptions);
  const [loading, setLoading] = useState(true);

  // Configurator Form State
  const [selectedMilkTypeId, setSelectedMilkTypeId] = useState(milkTypes[0].id);
  const [literIndex, setLiterIndex] = useState(1); // default 1L (index 1 in [0.5, 1, 1.5, 2, 2.5, 3])
  const [selectedSlotId, setSelectedSlotId] = useState(slots[0].id); // morning by default
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [successToast, setSuccessToast] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const res = await subscriptionsApi.getMySubscriptions();
      if (res.data && Array.isArray(res.data.data)) {
        setSubscriptionsList(res.data.data);
      }
    } catch (err) {
      console.warn('⚠️ Real Subscriptions API offline, using fallback dataset');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

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

  const showToast = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 4000);
  };

  // Submit New Subscription
  const handleStartSubscription = async () => {
    setErrorMsg('');
    const finalAddress = deliveryAddress.trim() || 'Nayapura Main Road, House No 45';

    const payload = {
      milkTypeId: selectedMilkType.id,
      milkTypeName: selectedMilkType.name,
      litres: selectedLitre,
      slot: selectedSlot.id,
      address: finalAddress
    };

    try {
      const res = await subscriptionsApi.createSubscription(payload);
      if (res.data && res.data.success) {
        showToast(`🎉 Aapka Daily ${selectedMilkType.name} Subscription start ho gaya!`);
        await fetchSubscriptions();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Subscription create nahi ho paayi.';
      setErrorMsg(msg);
      // Local fallback
      const newSub = {
        id: `sub-${Date.now()}`,
        milkTypeId: selectedMilkType.id,
        milkTypeName: selectedMilkType.name,
        litres: selectedLitre,
        slot: selectedSlot.id,
        status: 'active',
        pausedDates: [],
        address: finalAddress
      };
      setSubscriptionsList((prev) => [newSub, ...prev]);
      showToast(`🎉 Subscription start ho gaya! (Dev Fallback)`);
    }
  };

  // Toggle Pause/Skip Date (e.g. tomorrow)
  const handleTogglePause = async (subscription, dateStr) => {
    const subId = subscription.id || subscription._id;

    try {
      const res = await subscriptionsApi.togglePauseDate(subId, dateStr);
      if (res.data && res.data.success) {
        showToast(res.data.message || 'Pause date update ho gayi!');
      }
      await fetchSubscriptions();
    } catch (err) {
      const msg = err.response?.data?.message || 'Pause date change fail ho gaya.';
      setErrorMsg(msg);

      // Local State fallback
      setSubscriptionsList((prev) =>
        prev.map((sub) => {
          if ((sub.id || sub._id) === subId) {
            const paused = sub.pausedDates || [];
            const idx = paused.indexOf(dateStr);
            const updatedDates = idx > -1 ? paused.filter((d) => d !== dateStr) : [...paused, dateStr];
            return { ...sub, pausedDates: updatedDates };
          }
          return sub;
        })
      );
    }
  };

  // Cancel Subscription
  const handleCancelSubscription = async (subscription) => {
    const confirmCancel = window.confirm(`Kya aap ${subscription.milkTypeName} subscription sachme cancel karna chahte hain?`);
    if (!confirmCancel) return;

    const subId = subscription.id || subscription._id;

    try {
      const res = await subscriptionsApi.cancelSubscription(subId);
      if (res.data && res.data.success) {
        showToast('Subscription cancel ho gayi.');
      }
      await fetchSubscriptions();
    } catch (err) {
      setSubscriptionsList((prev) =>
        prev.map((sub) => ((sub.id || sub._id) === subId ? { ...sub, status: 'cancelled' } : sub))
      );
    }
  };

  // Tomorrow date string format
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  return (
    <div style={{ padding: '2rem 0', backgroundColor: 'var(--color-cream)' }}>
      <div className="container">
        
        {/* Back Navigation Button */}
        <div style={{ marginBottom: '1.25rem' }}>
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
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={16} color="var(--color-navy)" /> Back to Home
          </button>
        </div>

        {/* Header Hero */}
        <div
          style={{
            backgroundColor: 'var(--color-navy)',
            color: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            padding: '2rem',
            marginBottom: '2.5rem',
            boxShadow: 'var(--shadow-md)',
            borderBottom: '3px solid var(--color-gold)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <span className="badge-gold" style={{ fontSize: '0.7rem', marginBottom: '0.5rem' }}>
            🥛 Daily Morning & Evening Delivery
          </span>
          <h1 className="font-display" style={{ fontSize: '2rem', fontWeight: '800', margin: '0.2rem 0 0.5rem' }}>
            Daily Shuddh Doodh Subscription
          </h1>
          <p style={{ color: '#CBD5E1', fontSize: '0.925rem', maxWidth: '600px', margin: 0, lineHeight: 1.5 }}>
            Har roz subah ya shaam bina kisi naage ke taaza full cream doodh seedha aapke darwaze par. Jab chahein 1-click me pause ya resume karein.
          </p>
        </div>

        {/* Success / Error Alerts */}
        {successToast && (
          <div style={{ backgroundColor: 'var(--color-success-bg)', border: '1.5px solid var(--color-success-border)', color: 'var(--color-success)', borderRadius: 'var(--radius-md)', padding: '0.85rem 1.25rem', marginBottom: '1.5rem', fontWeight: '800', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', animation: 'slideDownFade 0.3s ease' }}>
            <CheckCircle size={18} /> {successToast}
          </div>
        )}

        {errorMsg && (
          <div style={{ backgroundColor: 'var(--color-error-bg)', border: '1.5px solid var(--color-error-border)', color: 'var(--color-error)', borderRadius: 'var(--radius-md)', padding: '0.85rem 1.25rem', marginBottom: '1.5rem', fontWeight: '800', fontSize: '0.875rem' }}>
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Subscription Configurator Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', marginBottom: '3.5rem', alignItems: 'start' }} className="products-listing-layout">
          
          {/* Left Column: Plan Configurator */}
          <div style={{ backgroundColor: 'var(--color-cream-card)', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-border)', padding: '1.75rem', boxShadow: 'var(--shadow-sm)' }}>
            <h2 className="font-display" style={{ fontSize: '1.35rem', color: 'var(--color-navy)', fontWeight: '800', marginBottom: '1.25rem', paddingBottom: '0.65rem', borderBottom: '1.5px solid var(--color-border)' }}>
              1. Apni Requirement Choose Karein
            </h2>

            {/* Step A: Select Milk Type */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--color-navy)', display: 'block', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Select Milk Variant:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                {milkTypes.map((type) => (
                  <div
                    key={type.id}
                    onClick={() => setSelectedMilkTypeId(type.id)}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      border: selectedMilkTypeId === type.id ? '2px solid var(--color-gold-hover)' : '1.5px solid var(--color-border)',
                      backgroundColor: selectedMilkTypeId === type.id ? 'var(--color-gold-soft)' : 'var(--color-cream)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ fontWeight: '800', fontSize: '0.95rem', color: 'var(--color-navy)' }}>{type.name}</div>
                    <div style={{ fontSize: '0.775rem', color: 'var(--color-text-muted)', margin: '0.2rem 0 0.4rem' }}>{type.description}</div>
                    <div style={{ fontWeight: '900', fontSize: '0.9rem', color: 'var(--color-navy)' }}>₹{type.pricePerLitre}/Litre</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step B: Select Quantity */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--color-navy)', display: 'block', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Rozana Ki Quantity (Litres):
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--color-cream)', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-full)', padding: '0.35rem 0.85rem' }}>
                  <button type="button" onClick={() => setLiterIndex((prev) => Math.max(0, prev - 1))} style={{ background: 'none', border: 'none', color: 'var(--color-navy)', cursor: 'pointer', padding: '0.25rem 0.5rem' }}>
                    <Minus size={16} />
                  </button>
                  <span style={{ fontWeight: '900', fontSize: '1.1rem', color: 'var(--color-navy)', padding: '0 0.85rem', minWidth: '60px', textAlign: 'center' }}>
                    {selectedLitre} Litre
                  </span>
                  <button type="button" onClick={() => setLiterIndex((prev) => Math.min(literOptions.length - 1, prev + 1))} style={{ background: 'none', border: 'none', color: 'var(--color-navy)', cursor: 'pointer', padding: '0.25rem 0.5rem' }}>
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Step C: Select Slot */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--color-navy)', display: 'block', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Delivery Slot Time:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {slots.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => setSelectedSlotId(s.id)}
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      border: selectedSlotId === s.id ? '2px solid var(--color-gold-hover)' : '1.5px solid var(--color-border)',
                      backgroundColor: selectedSlotId === s.id ? 'var(--color-gold-soft)' : 'var(--color-cream)',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontWeight: '800', fontSize: '0.9rem', color: 'var(--color-navy)' }}>{s.label}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{s.time}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step D: Address Field */}
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--color-navy)', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Delivery Address:
              </label>
              <input
                type="text"
                placeholder="e.g. House No 45, Nayapura Main Road"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--color-border)', fontSize: '0.875rem', outline: 'none' }}
              />
            </div>

          </div>

          {/* Right Column: Pricing Summary Card */}
          <div style={{ position: 'sticky', top: '90px' }}>
            <div style={{ backgroundColor: 'var(--color-cream-card)', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-border)', padding: '1.5rem', boxShadow: 'var(--shadow-md)' }}>
              <h3 className="font-display" style={{ fontSize: '1.25rem', color: 'var(--color-navy)', fontWeight: '800', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1.5px solid var(--color-border)' }}>
                Subscription Summary
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Variant:</span>
                  <span style={{ fontWeight: '700', color: 'var(--color-navy)' }}>{selectedMilkType.name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Daily Quantity:</span>
                  <span style={{ fontWeight: '700', color: 'var(--color-navy)' }}>{selectedLitre} Litre</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Delivery Slot:</span>
                  <span style={{ fontWeight: '700', color: 'var(--color-navy)' }}>{selectedSlot.label}</span>
                </div>
                <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '0.2rem 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Daily Cost:</span>
                  <span style={{ fontWeight: '800', color: 'var(--color-navy)' }}>₹{perDayCost} / day</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: '900', color: 'var(--color-navy)' }}>
                  <span>Est. Monthly:</span>
                  <span>₹{monthlyEstimate}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleStartSubscription}
                className="btn btn-gold"
                style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem', fontWeight: '800' }}
              >
                Start Subscription Now <ArrowRight size={16} />
              </button>
            </div>
          </div>

        </div>

        {/* Existing Active Customer Subscriptions Section */}
        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1.5px solid var(--color-border)' }}>
          <h2 className="font-display" style={{ fontSize: '1.5rem', color: 'var(--color-navy)', fontWeight: '800', marginBottom: '1rem' }}>
            Aapke Active Subscriptions
          </h2>

          {subscriptionsList.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {subscriptionsList.map((sub) => {
                const subId = sub.id || sub._id;
                const isTomorrowPaused = (sub.pausedDates || []).includes(tomorrowStr);
                const isCancelled = sub.status === 'cancelled';

                return (
                  <div
                    key={subId}
                    style={{
                      backgroundColor: 'var(--color-cream-card)',
                      borderRadius: 'var(--radius-md)',
                      border: '1.5px solid var(--color-border)',
                      padding: '1.25rem',
                      boxShadow: 'var(--shadow-sm)',
                      opacity: isCancelled ? 0.7 : 1
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--color-border)' }}>
                      <div>
                        <span style={{ fontWeight: '800', fontSize: '1.1rem', color: 'var(--color-navy)' }}>{sub.milkTypeName}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginLeft: '0.6rem' }}>({sub.litres}L • {sub.slot === 'morning' ? 'Subah Slot' : 'Shaam Slot'})</span>
                      </div>

                      <span style={{ padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.775rem', fontWeight: '800', textTransform: 'capitalize', backgroundColor: isCancelled ? 'var(--color-error-bg)' : sub.status === 'active' ? 'var(--color-success-bg)' : 'var(--color-gold-soft)', color: isCancelled ? 'var(--color-error)' : sub.status === 'active' ? 'var(--color-success)' : 'var(--color-gold-hover)' }}>
                        Status: {sub.status}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                      Address: <strong style={{ color: 'var(--color-navy)' }}>{sub.address}</strong>
                    </div>

                    {!isCancelled && (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px dashed var(--color-border)' }}>
                        <button
                          type="button"
                          onClick={() => handleTogglePause(sub, tomorrowStr)}
                          style={{
                            padding: '0.45rem 0.85rem',
                            borderRadius: 'var(--radius-sm)',
                            border: isTomorrowPaused ? '1px solid var(--color-success-border)' : '1px solid var(--color-gold)',
                            backgroundColor: isTomorrowPaused ? 'var(--color-success-bg)' : 'var(--color-gold-soft)',
                            color: isTomorrowPaused ? 'var(--color-success)' : 'var(--color-navy)',
                            fontWeight: '800',
                            fontSize: '0.8rem',
                            cursor: 'pointer'
                          }}
                        >
                          {isTomorrowPaused ? '▶️ Kal Ke Liye Resume Karein' : '⏸️ Kal Ke Liye Pause / Skip Karein'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleCancelSubscription(sub)}
                          style={{ background: 'none', border: 'none', color: 'var(--color-error)', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer' }}
                        >
                          Cancel Subscription
                        </button>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Aapka abhi koi active subscription nahi hai.</p>
          )}

        </div>

      </div>
    </div>
  );
};

export default Subscription;
