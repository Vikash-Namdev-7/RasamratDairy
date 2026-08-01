import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { ArrowLeft, CheckCircle, ShieldCheck, AlertTriangle } from '../../../components/Icons';

export const Login = ({ onNavigate, redirectPath }) => {
  const { login, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFillDummy = () => {
    setEmail('customer@rasamrat.com');
    setPassword('customer123');
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Kripya Email aur Password dono fill karein.');
      return;
    }

    try {
      await login(email.trim(), password);
      if (onNavigate) onNavigate(redirectPath || '/');
    } catch (err) {
      setErrorMessage(err.message || 'Login fail ho gaya. Kripya credentials check karein.');
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
        {/* Glow circles */}
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
            Shuddh Desi Doodh & Dairy Products Ka Bharosa
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#CBD5E1', lineHeight: '1.6', maxWidth: '420px', marginBottom: '2rem' }}>
            Roz subah farm se direct packed A2 doodh, dahi, paneer aur bilona ghee apne doorstep par deliver karwayein.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.875rem' }}>
              <CheckCircle size={18} color="var(--color-gold)" />
              <span>100% Pure & Lab Tested Quality</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.875rem' }}>
              <CheckCircle size={18} color="var(--color-gold)" />
              <span>Daily Morning & Evening Delivery</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.875rem' }}>
              <CheckCircle size={18} color="var(--color-gold)" />
              <span>Easy Subscriptions Pause & Resume</span>
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
            maxWidth: '420px',
            backgroundColor: 'var(--color-cream-card)',
            borderRadius: 'var(--radius-md)',
            border: '1.5px solid var(--color-border)',
            padding: '2rem 1.75rem',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          <div style={{ marginBottom: '1.5rem' }}>
            <h1 className="font-display" style={{ fontSize: '1.65rem', color: 'var(--color-primary)', fontWeight: '800', lineHeight: 1.2 }}>
              Customer Login
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
              Apne registered account se login karein.
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

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            
            {/* Email Input */}
            <div>
              <label style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--color-primary)', display: 'block', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="customer@rasamrat.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--color-border)', fontSize: '0.875rem', backgroundColor: 'var(--color-cream)', outline: 'none' }}
              />
            </div>

            {/* Password Input with Toggle */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                  Password *
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--color-border)', fontSize: '0.875rem', backgroundColor: 'var(--color-cream)', outline: 'none' }}
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.75rem', fontSize: '0.925rem', marginTop: '0.4rem' }}
            >
              {loading ? 'Logging in...' : 'Login Karein'}
            </button>

            {/* Fill Test Account Quick Button (Development Only) */}
            {import.meta.env.DEV && (
              <div style={{ textAlign: 'center', marginTop: '0.2rem' }}>
                <button
                  type="button"
                  onClick={handleFillDummy}
                  style={{
                    background: 'var(--color-gold-soft)',
                    border: '1px solid var(--color-gold)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--color-primary)',
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Fill Test Account (customer@rasamrat.com)
                </button>
              </div>
            )}

            {/* Footer Signup Link */}
            <div style={{ textAlign: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              Naya account nahi hai?{' '}
              <a
                href="/signup"
                onClick={(e) => {
                  e.preventDefault();
                  if (onNavigate) onNavigate(redirectPath ? `/signup?redirect=${encodeURIComponent(redirectPath)}` : '/signup');
                }}
                style={{ color: 'var(--color-accent)', fontWeight: '800', textDecoration: 'underline', cursor: 'pointer' }}
              >
                Sign Up Karein
              </a>
            </div>

          </form>
        </div>
      </div>

    </div>
  );
};

export default Login;
