import React, { useState } from 'react';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { ShieldCheck, ArrowLeft } from '../../../components/Icons';

export const AdminLogin = ({ onNavigate }) => {
  const { login, loading } = useAdminAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFillDummy = () => {
    setEmail('admin@rasamrat.com');
    setPassword('admin123');
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Kripya Admin Email aur Password dono bharein.');
      return;
    }

    try {
      await login(email.trim(), password);
      if (onNavigate) onNavigate('/admin/dashboard');
    } catch (err) {
      setErrorMessage(err.message || 'Admin login fail ho gaya. Credentials re-check karein.');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0A0F1D',
        backgroundImage: 'radial-gradient(circle at 50% 20%, rgba(212, 165, 66, 0.08) 0%, rgba(10, 15, 29, 1) 70%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        color: '#FFFFFF'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          borderRadius: 'var(--radius-md)',
          border: '1.5px solid rgba(212, 165, 66, 0.35)',
          padding: '2.25rem 1.85rem',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)'
        }}
      >
        {/* Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              backgroundColor: 'rgba(212, 165, 66, 0.15)',
              border: '1.5px solid var(--color-gold)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.75rem',
              boxShadow: 'var(--shadow-gold)'
            }}
          >
            <ShieldCheck size={28} color="var(--color-gold)" />
          </div>

          <h1 className="font-display" style={{ fontSize: '1.45rem', fontWeight: '800', color: '#FFFFFF', margin: 0, lineHeight: 1.2 }}>
            Rasamrat Admin
          </h1>
          <span style={{ fontSize: '0.725rem', color: 'var(--color-gold)', letterSpacing: '1.2px', textTransform: 'uppercase', fontWeight: '700' }}>
            Control Panel Authentication
          </span>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1.5px solid rgba(239, 68, 68, 0.4)',
              color: '#F87171',
              borderRadius: 'var(--radius-sm)',
              padding: '0.65rem 0.85rem',
              marginBottom: '1.25rem',
              fontSize: '0.825rem',
              fontWeight: '700'
            }}
          >
            ⚠️ {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          
          {/* Email Input */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94A3B8', display: 'block', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Admin Email *
            </label>
            <input
              type="email"
              required
              placeholder="admin@rasamrat.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '0.7rem 0.9rem',
                borderRadius: 'var(--radius-sm)',
                border: '1.5px solid rgba(255, 255, 255, 0.15)',
                fontSize: '0.875rem',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: '#FFFFFF',
                outline: 'none'
              }}
            />
          </div>

          {/* Password Input */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Password *
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ background: 'none', border: 'none', color: 'var(--color-gold)', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}
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
              style={{
                width: '100%',
                padding: '0.7rem 0.9rem',
                borderRadius: 'var(--radius-sm)',
                border: '1.5px solid rgba(255, 255, 255, 0.15)',
                fontSize: '0.875rem',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: '#FFFFFF',
                outline: 'none'
              }}
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-gold"
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '0.925rem',
              fontWeight: '800',
              marginTop: '0.5rem'
            }}
          >
            {loading ? 'Authenticating...' : 'Login to Control Panel'}
          </button>

          {/* Development Shortcut Button */}
          {import.meta.env.DEV && (
            <div style={{ textAlign: 'center', marginTop: '0.2rem' }}>
              <button
                type="button"
                onClick={handleFillDummy}
                style={{
                  background: 'rgba(212, 165, 66, 0.15)',
                  border: '1px solid var(--color-gold)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--color-gold)',
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Fill Test Admin (admin@rasamrat.com)
              </button>
            </div>
          )}

          {/* Access Warning Footer */}
          <div
            style={{
              textAlign: 'center',
              marginTop: '1rem',
              paddingTop: '0.85rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '0.75rem',
              color: '#64748B'
            }}
          >
            🔒 Authorized store management staff only.
          </div>

        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
