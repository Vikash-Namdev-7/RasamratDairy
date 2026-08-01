import React from 'react';
import { Home, AlertTriangle, ArrowLeft } from '../../../components/Icons';

export const NotFound = ({ onNavigate }) => {
  return (
    <div
      style={{
        minHeight: '65vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        textAlign: 'center',
        backgroundColor: 'var(--color-cream)'
      }}
    >
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-gold-soft)',
          border: '1.5px solid var(--color-gold)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.25rem'
        }}
      >
        <AlertTriangle size={36} color="var(--color-gold-hover)" />
      </div>

      <h1
        className="font-display"
        style={{
          fontSize: '3rem',
          fontWeight: '900',
          color: 'var(--color-primary)',
          lineHeight: '1.1',
          marginBottom: '0.5rem'
        }}
      >
        404
      </h1>

      <h2
        className="font-display"
        style={{
          fontSize: '1.35rem',
          fontWeight: '700',
          color: 'var(--color-primary)',
          marginBottom: '0.75rem'
        }}
      >
        Page Nahi Mila (Page Not Found)
      </h2>

      <p
        style={{
          fontSize: '0.9rem',
          color: 'var(--color-text-muted)',
          maxWidth: '440px',
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}
      >
        Aap jis page par jaane ki koshish kar rahe hain wo exist nahi karta ya remove kar diya gaya hai.
      </p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          type="button"
          onClick={() => onNavigate && onNavigate('/')}
          className="btn btn-primary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.7rem 1.4rem',
            fontSize: '0.875rem'
          }}
        >
          <Home size={16} /> Home Page Par Wapas Jayein
        </button>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="btn btn-outline"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.7rem 1.4rem',
            fontSize: '0.875rem'
          }}
        >
          <ArrowLeft size={16} /> Peeche Jayein
        </button>
      </div>
    </div>
  );
};

export default NotFound;
