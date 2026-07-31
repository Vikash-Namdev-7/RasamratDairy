import React from 'react';
import { Star, Quote } from '../../../components/Icons';

export const TestimonialCard = ({ testimonial }) => {
  const { name, location, rating, comment, avatar } = testimonial;

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '18px',
        border: '1.5px solid var(--color-border)',
        padding: '1.25rem 1.15rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        height: '100%',
        boxShadow: '0 8px 24px rgba(28, 43, 74, 0.06)',
        scrollSnapAlign: 'center',
        userSelect: 'none'
      }}
    >
      <div style={{ position: 'absolute', top: '12px', right: '14px', opacity: 0.8, pointerEvents: 'none' }}>
        <Quote size={28} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, marginBottom: '0.85rem' }}>
        <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '0.5rem' }}>
          {[...Array(rating)].map((_, i) => (
            <Star key={i} size={14} color="var(--color-gold)" fill="var(--color-gold)" />
          ))}
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--color-navy)', lineHeight: '1.55', fontStyle: 'italic' }}>
          "{comment}"
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', paddingTop: '0.65rem', borderTop: '1px dashed var(--color-border)' }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-wine)',
            color: '#FFFFFF',
            fontWeight: '700',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-display)',
            boxShadow: '0 2px 8px rgba(155, 58, 68, 0.3)',
            flexShrink: 0
          }}
        >
          {avatar}
        </div>
        <div>
          <h4 className="font-display" style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--color-navy)', lineHeight: '1.2' }}>
            {name}
          </h4>
          <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', display: 'block' }}>{location}</span>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
