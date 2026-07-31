import React from 'react';

export const SectionHeading = ({ eyebrow, title, description, center = false }) => {
  return (
    <div style={{ textAlign: center ? 'center' : 'left', marginBottom: '2rem' }}>
      {eyebrow && (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
          <span style={{ width: '18px', height: '2px', backgroundColor: 'var(--color-gold)', borderRadius: '2px' }}></span>
          <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--color-wine)' }}>
            {eyebrow}
          </span>
        </div>
      )}
      <h2 className="font-display" style={{ fontSize: 'clamp(1.65rem, 3vw, 2.25rem)', color: 'var(--color-navy)', fontWeight: '700', lineHeight: '1.2' }}>
        {title}
      </h2>
      {description && (
        <p className="text-muted" style={{ marginTop: '0.4rem', fontSize: '0.95rem', maxWidth: center ? '600px' : '100%', marginInline: center ? 'auto' : '0' }}>
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;
