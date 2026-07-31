import React from 'react';
import { ChevronRight } from '../../../components/Icons';

export const Footer = ({ onNavigate }) => {
  const handleLinkClick = (e, path) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(path);
    }
  };

  return (
    <footer className="site-footer">
      <div className="container">
        
        {/* Compact Header Bar */}
        <div className="footer-header-compact">
          <a
            href="/"
            onClick={(e) => handleLinkClick(e, '/')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              textDecoration: 'none',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-wine)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <span
                className="font-display"
                style={{
                  color: 'var(--color-gold)',
                  fontWeight: '800',
                  fontSize: '1rem',
                }}
              >
                R
              </span>
            </div>
            <span
              className="font-display"
              style={{
                fontSize: '1.15rem',
                fontWeight: '700',
                color: '#FFFFFF',
              }}
            >
              Rasamrat <span style={{ color: 'var(--color-gold)' }}>Dairy</span>
            </span>
          </a>

          <span className="badge-gold" style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}>
            100% Pure
          </span>
        </div>

        {/* Structured 3-Column Grid Side-by-Side */}
        <div className="footer-links-grid-3">
          
          {/* Column 1: Quick Links */}
          <div className="footer-col">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-list">
              {[
                { label: 'Home Page', path: '/' },
                { label: 'Products', path: '/products' },
                { label: 'Cart Page', path: '/cart' },
                { label: 'Subscription', path: '/subscription' },
              ].map((item) => (
                <li key={item.path}>
                  <a href={item.path} onClick={(e) => handleLinkClick(e, item.path)} className="footer-link">
                    <ChevronRight size={11} color="var(--color-gold)" />
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Categories */}
          <div className="footer-col">
            <h4 className="footer-heading">Categories</h4>
            <ul className="footer-list">
              {['doodh', 'dahi', 'paneer', 'ghee', 'makhan'].map((slug) => (
                <li key={slug}>
                  <a href={`/products?category=${slug}`} onClick={(e) => handleLinkClick(e, `/products?category=${slug}`)} className="footer-link">
                    <ChevronRight size={11} color="var(--color-gold)" />
                    <span style={{ textTransform: 'capitalize' }}>Taaza {slug}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Static Details (Support & Location) */}
          <div className="footer-col">
            <h4 className="footer-heading">Contact & Support</h4>
            <ul className="footer-list static-details-list">
              <li>
                <span className="detail-icon">📍</span>
                <span>Nayapura, Indore</span>
              </li>
              <li>
                <span className="detail-icon">📞</span>
                <span>+91 98765 43210</span>
              </li>
              <li>
                <span className="detail-icon">⏰</span>
                <span>Slot: 6-9 AM Daily</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Compact Bottom Copyright Bar */}
        <div className="footer-bottom-strip">
          <div className="strip-copy" style={{ margin: '0 auto', textAlign: 'center' }}>
            © {new Date().getFullYear()} Rasamrat Dairy • Farm Fresh Promise
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
