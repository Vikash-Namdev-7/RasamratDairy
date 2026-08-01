import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { ArrowLeft, CheckCircle, ShieldCheck, AlertTriangle } from '../../../components/Icons';

export const Signup = ({ onNavigate, redirectPath }) => {
  const { signup, loading } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.password) {
      setErrorMessage('Kripya saare required fields bharein.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('Password kam se kam 6 characters ka hona chahiye.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Password aur Confirm Password match nahi kar rahe hain.');
      return;
    }

    // Determine target redirect path (either prop or query param)
    const urlParams = new URLSearchParams(window.location.search);
    const targetRedirect = redirectPath || urlParams.get('redirect') || '/';

    try {
      await signup({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password
      });
      if (onNavigate) onNavigate(targetRedirect);
    } catch (err) {
      setErrorMessage(err.message || 'Signup fail ho gaya. Kripya details check karein.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: 'var(--color-cream)' }}>
      
      {/* Left Brand Illustration Panel (Desktop) */}
      <div
        style={{
          flex: 1,
          backgroundColor: 'var(--color-primary-dark)',
          color: '#FFFFFF',
          padding: '3rem 2.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden'
        }}
        className="login-brand-panel"
      >
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,165,66,0.2) 0%, rgba(0,0,0,0) 70%)', pointerEvents: 'none' }} />

        <div>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('/')}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 'var(--radius-full)',
              color: '#FFFFFF',
              padding: '0.4rem 0.85rem',
              fontSize: '0.8rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              marginBottom: '2rem'
            }}
          >
            <ArrowLeft size={14} color="#FFFFFF" /> Back to Store
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.5rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-wine)' }}>
              <span className="font-display" style={{ color: 'var(--color-gold)', fontWeight: '900', fontSize: '1.4rem' }}>R</span>
            </div>
            <div>
              <h2 className="font-display" style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0, lineHeight: 1.1 }}>Rasamrat Dairy</h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-gold)', letterSpacing: '1px', textTransform: 'uppercase' }}>Gau-Dhara Se Seedha Dwar Tak</span>
            </div>
          </div>

          <h3 className="font-display" style={{ fontSize: '1.85rem', fontWeight: '800', lineHeight: '1.25', marginBottom: '1rem', color: '#FBF8F2' }}>
            Naya Account Banayein & Fresh Dairy Order Karein
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#CBD5E1', lineHeight: '1.6', maxWidth: '420px', marginBottom: '2rem' }}>
            Aapki family ke liye shuddh farm-fresh doodh, dahi aur paneer delivery services.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.875rem' }}>
              <CheckCircle size={18} color="var(--color-gold)" />
              <span>Instant Account Creation in 30 Seconds</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.875rem' }}>
              <CheckCircle size={18} color="var(--color-gold)" />
              <span>COD & Flexible Subscriptions Option</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.875rem' }}>
              <CheckCircle size={18} color="var(--color-gold)" />
              <span>Live Order Tracking & Status Updates</span>
            </div>
          </div>
        </div>

        <div style={{ fontSize: '0.75rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <ShieldCheck size={16} color="var(--color-gold)" />
          <span>© 2026 Rasamrat Dairy. All rights reserved.</span>
        </div>
      </div>

      {/* Right Form Panel */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2.5rem 1.5rem'
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '440px',
            backgroundColor: 'var(--color-cream-card)',
            borderRadius: 'var(--radius-md)',
            border: '1.5px solid var(--color-border)',
            padding: '2rem 1.75rem',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          <div style={{ marginBottom: '1.5rem' }}>
            <h1 className="font-display" style={{ fontSize: '1.65rem', color: 'var(--color-primary)', fontWeight: '800', lineHeight: 1.2 }}>
              Customer Sign Up
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
              Naya account banane ke liye apni details bharein.
            </p>
          </div>

          {/* Error Message Box */}
          {errorMessage && (
            <div
              style={{
                backgroundColor: 'var(--color-error-bg)',
                border: '1.5px solid var(--color-error-border)',
                color: 'var(--color-error)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.65rem 0.85rem',
                marginBottom: '1.25rem',
                fontSize: '0.825rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <AlertTriangle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* Name */}
            <div>
              <label style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--color-primary)', display: 'block', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Rahul Sharma"
                value={formData.name}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--color-border)', fontSize: '0.875rem', backgroundColor: 'var(--color-cream)', outline: 'none' }}
              />
            </div>

            {/* Email & Phone Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--color-primary)', display: 'block', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="rahul@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--color-border)', fontSize: '0.875rem', backgroundColor: 'var(--color-cream)', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--color-primary)', display: 'block', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--color-border)', fontSize: '0.875rem', backgroundColor: 'var(--color-cream)', outline: 'none' }}
                />
              </div>
            </div>

            {/* Password & Confirm Password Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--color-primary)', display: 'block', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="Min 6 chars"
                  value={formData.password}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--color-border)', fontSize: '0.875rem', backgroundColor: 'var(--color-cream)', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--color-primary)', display: 'block', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                  Confirm *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  placeholder="Re-enter"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--color-border)', fontSize: '0.875rem', backgroundColor: 'var(--color-cream)', outline: 'none' }}
                />
              </div>
            </div>

            {/* Signup Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.75rem', fontSize: '0.925rem', marginTop: '0.5rem' }}
            >
              {loading ? 'Creating account...' : 'Sign Up Karein'}
            </button>

            {/* Footer Login Link */}
            <div style={{ textAlign: 'center', marginTop: '0.85rem', paddingTop: '0.85rem', borderTop: '1px solid var(--color-border)', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              Pehle se account hai?{' '}
              <a
                href="/login"
                onClick={(e) => {
                  e.preventDefault();
                  if (onNavigate) onNavigate('/login');
                }}
                style={{ color: 'var(--color-accent)', fontWeight: '800', textDecoration: 'underline', cursor: 'pointer' }}
              >
                Login Karein
              </a>
            </div>

          </form>
        </div>
      </div>

    </div>
  );
};

export default Signup;
