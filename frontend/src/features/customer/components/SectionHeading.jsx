import React from 'react';

export const SectionHeading = ({ eyebrow, title, description, align = 'center' }) => {
  return (
    <div
      style={{
        textAlign: align,
        marginBottom: '2.5rem',
        maxWidth: align === 'center' ? '680px' : '100%',
        marginInline: align === 'center' ? 'auto' : '0',
      }}
    >
      {eyebrow && (
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: '800',
            color: 'var(--color-wine)',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            display: 'inline-block',
            marginBottom: '0.4rem',
          }}
        >
          {eyebrow}
        </span>
      )}
      {title && (
        <h2
          className="font-display"
          style={{
            fontSize: '2rem',
            color: 'var(--color-navy)',
            fontWeight: '700',
            lineHeight: '1.25',
            marginBottom: '0.6rem',
          }}
        >
          {title}
        </h2>
      )}
      {description && (
        <p
          style={{
            color: 'var(--color-text-muted)',
            fontSize: '0.975rem',
            lineHeight: '1.6',
          }}
        >
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;
