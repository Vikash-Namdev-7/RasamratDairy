import React from 'react';
import { Quote, Star, CheckCircle } from './Icons';

export const TestimonialCard = ({ testimonial }) => {
  const { name, location, text } = testimonial;
  const initial = name ? name.charAt(0).toUpperCase() : 'G';

  return (
    <div
      className="card-hover"
      style={{
        backgroundColor: 'var(--color-cream-card)',
        padding: '2rem 1.75rem',
        borderRadius: 'var(--radius-md)',
        border: '1.5px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        height: '100%',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      <div>
        {/* Rating Stars & Quote Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.2rem' }}>
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} color="var(--color-gold)" fill="var(--color-gold)" />
            ))}
          </div>
          <Quote size={32} color="var(--color-gold)" />
        </div>

        {/* Review Text */}
        <p
          style={{
            fontSize: '0.985rem',
            color: 'var(--color-navy)',
            lineHeight: '1.7',
            fontStyle: 'italic',
            marginBottom: '1.5rem'
          }}
        >
          "{text}"
        </p>
      </div>

      {/* Author Footer Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1.1rem', borderTop: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Avatar Circle */}
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-navy)',
              color: 'var(--color-gold)',
              fontFamily: 'var(--font-display)',
              fontSize: '1.15rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(28, 43, 74, 0.2)'
            }}
          >
            {initial}
          </div>

          <div>
            <h4
              className="font-display"
              style={{
                fontSize: '1.025rem',
                fontWeight: '700',
                color: 'var(--color-navy)',
                margin: 0,
                lineHeight: '1.2'
              }}
            >
              {name}
            </h4>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              {location}
            </span>
          </div>
        </div>

        {/* Verified Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--color-wine)', fontWeight: '600', backgroundColor: 'var(--color-wine-soft)', padding: '0.25rem 0.6rem', borderRadius: '12px' }}>
          <CheckCircle size={14} color="var(--color-wine)" />
          <span>Verified</span>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
