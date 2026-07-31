import React from 'react';

export const Loader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '3rem' }}>
    <div style={{ width: '36px', height: '36px', border: '3px solid var(--color-gold-soft)', borderTopColor: 'var(--color-wine)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
  </div>
);

export default Loader;
