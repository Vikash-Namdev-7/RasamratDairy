import React from 'react';
import SectionHeading from '../components/common/SectionHeading';
import { ArrowRight, Check } from '../components/common/Icons';

export const Subscription = ({ onNavigate }) => {
  return (
    <div style={{ paddingTop: '2.5rem' }}>
      <div className="container">
        <SectionHeading
          eyebrow="Daily Morning Slot"
          title="Daily Doodh Subscription"
          description="Har roz subah 6:00 AM se 9:00 AM ke beech taaza doodh bina kisi nagada ke seedha aapke ghar tak."
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            marginTop: '2rem'
          }}
        >
          {/* Plan 1: Full Cream Milk */}
          <div
            className="card-hover"
            style={{
              backgroundColor: 'var(--color-cream-card)',
              borderRadius: 'var(--radius-lg)',
              padding: '2.5rem 2rem',
              border: '2px solid var(--color-wine)',
              position: 'relative',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <span className="badge-gold" style={{ backgroundColor: 'var(--color-wine)', color: '#FFFFFF', position: 'absolute', top: '-12px', right: '20px' }}>
              Most Popular
            </span>

            <h3 className="font-display" style={{ fontSize: '1.5rem', color: 'var(--color-navy)', fontWeight: '700' }}>
              Full Cream Milk Subscription
            </h3>
            <p className="text-muted" style={{ fontSize: '0.9rem', margin: '0.5rem 0 1.5rem 0' }}>
              Rozana 1 Liter / 2 Liter taaza full cream doodh.
            </p>

            <div style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--color-navy)', marginBottom: '1.5rem' }}>
              ₹64 <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: '400' }}>/ liter</span>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {['Free Daily Morning Delivery', 'Pause or Modify Anytime', 'Zero Delivery Charges', 'Monthly Bill Payment Option'].map((feat, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.925rem' }}>
                  <Check size={18} color="var(--color-wine)" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              className="btn btn-wine"
              style={{ width: '100%', padding: '0.85rem' }}
              onClick={() => onNavigate && onNavigate('/products')}
            >
              Subscription Start Karein <ArrowRight size={18} />
            </button>
          </div>

          {/* Plan 2: Toned Milk */}
          <div
            className="card-hover"
            style={{
              backgroundColor: 'var(--color-cream-card)',
              borderRadius: 'var(--radius-lg)',
              padding: '2.5rem 2rem',
              border: '1.5px solid var(--color-border)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <h3 className="font-display" style={{ fontSize: '1.5rem', color: 'var(--color-navy)', fontWeight: '700' }}>
              Toned Milk Subscription
            </h3>
            <p className="text-muted" style={{ fontSize: '0.9rem', margin: '0.5rem 0 1.5rem 0' }}>
              Halka aur healthy toned milk daily delivery.
            </p>

            <div style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--color-navy)', marginBottom: '1.5rem' }}>
              ₹52 <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: '400' }}>/ liter</span>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {['Free Daily Morning Delivery', 'Flexible Quantity Selection', 'Hygienic Pouch Packaging', 'Easy Online Renewal'].map((feat, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.925rem' }}>
                  <Check size={18} color="var(--color-gold)" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              className="btn btn-gold"
              style={{ width: '100%', padding: '0.85rem' }}
              onClick={() => onNavigate && onNavigate('/products')}
            >
              Subscription Start Karein <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
