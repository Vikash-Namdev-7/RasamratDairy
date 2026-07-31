import React, { useState } from 'react';
import { ShoppingBag, Search, X, Menu, ArrowRight, ChevronRight } from '../common/Icons';
import { categories } from '../../data/categories';

export const Navbar = ({ currentPath, onNavigate, cartItems = [], cartCount = 0 }) => {
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [catDropdownOpen, setCatDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Milk Subscription', path: '/subscription' },
  ];

  const handleLinkClick = (e, path) => {
    e.preventDefault();
    setCartOpen(false);
    setSearchOpen(false);
    setMobileMenuOpen(false);
    setCatDropdownOpen(false);
    if (onNavigate) {
      onNavigate(path);
    }
  };

  const handleCategoryClick = (e, slug) => {
    e.preventDefault();
    setCartOpen(false);
    setSearchOpen(false);
    setMobileMenuOpen(false);
    setCatDropdownOpen(false);
    if (onNavigate) {
      onNavigate(`/products?category=${slug}`);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + (item.price || 0), 0);
  };

  return (
    <>
      <header
        className="glass-nav"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '76px',
          }}
        >
          {/* Brand Logo */}
          <a
            href="/"
            onClick={(e) => handleLinkClick(e, '/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              textDecoration: 'none',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-wine)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 16px rgba(155, 58, 68, 0.5)',
                border: '1.5px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <span
                className="font-display"
                style={{
                  color: 'var(--color-gold)',
                  fontWeight: '800',
                  fontSize: '1.25rem',
                }}
              >
                R
              </span>
            </div>
            <div>
              <span
                className="font-display"
                style={{
                  fontSize: '1.35rem',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  letterSpacing: '0.5px',
                  display: 'block',
                  lineHeight: '1.1',
                }}
              >
                Rasamrat <span style={{ color: 'var(--color-gold)' }}>Dairy</span>
              </span>
              <span
                style={{
                  fontSize: '0.65rem',
                  color: 'rgba(255, 255, 255, 0.75)',
                  letterSpacing: '0.8px',
                  textTransform: 'uppercase',
                  fontWeight: '600',
                }}
              >
                100% Pure & Farm Fresh
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="desktop-nav">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <a
                  key={link.path}
                  href={link.path}
                  onClick={(e) => handleLinkClick(e, link.path)}
                  style={{
                    color: isActive ? 'var(--color-gold)' : '#E2E8F0',
                    fontWeight: isActive ? '700' : '500',
                    fontSize: '0.95rem',
                    textDecoration: 'none',
                    position: 'relative',
                    padding: '0.5rem 0',
                    transition: 'color 0.2s ease',
                  }}
                >
                  {link.name}
                  {isActive && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '-2px',
                        left: 0,
                        right: 0,
                        height: '2.5px',
                        backgroundColor: 'var(--color-gold)',
                        borderRadius: '2px',
                        boxShadow: '0 0 8px var(--color-gold)'
                      }}
                    />
                  )}
                </a>
              );
            })}

            {/* Desktop Categories Dropdown */}
            <div
              style={{ position: 'relative' }}
              onMouseEnter={() => setCatDropdownOpen(true)}
              onMouseLeave={() => setCatDropdownOpen(false)}
            >
              <button
                type="button"
                onClick={() => setCatDropdownOpen(!catDropdownOpen)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#E2E8F0',
                  fontWeight: '500',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                  padding: '0.5rem 0'
                }}
              >
                Categories <span style={{ fontSize: '0.75rem' }}>▼</span>
              </button>

              {catDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    width: '190px',
                    backgroundColor: 'var(--color-navy-dark)',
                    border: '1.5px solid rgba(255,255,255,0.12)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-strong)',
                    padding: '0.5rem 0',
                    zIndex: 110,
                    animation: 'slideDownFade 0.2s ease'
                  }}
                >
                  {categories.map((cat) => (
                    <a
                      key={cat.id}
                      href={`/products?category=${cat.slug}`}
                      onClick={(e) => handleCategoryClick(e, cat.slug)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.55rem 1rem',
                        color: '#CBD5E1',
                        fontSize: '0.875rem',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-gold)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = '#CBD5E1'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      <span>Taaza {cat.name}</span>
                      <ChevronRight size={13} color="var(--color-gold)" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Actions: Search, Cart, Subscribe & Hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            
            {/* Search Trigger */}
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1.5px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#FFFFFF',
                transition: 'all 0.2s ease',
              }}
              title="Search products"
            >
              <Search size={18} color="#FFFFFF" />
            </button>

            {/* Cart Icon Button */}
            <button
              type="button"
              onClick={() => setCartOpen(!cartOpen)}
              style={{
                position: 'relative',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1.5px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#FFFFFF',
                transition: 'all 0.2s ease',
              }}
              title="View Cart"
            >
              <ShoppingBag size={19} color="#FFFFFF" />
              {cartCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    backgroundColor: 'var(--color-wine)',
                    color: '#FFFFFF',
                    fontSize: '0.7rem',
                    fontWeight: '700',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(155, 58, 68, 0.5)'
                  }}
                >
                  {cartCount}
                </span>
              )}
            </button>

            {/* Desktop Subscribe Button */}
            <button
              type="button"
              className="btn btn-gold nav-subscribe-btn"
              onClick={(e) => handleLinkClick(e, '/subscription')}
              style={{
                padding: '0.55rem 1.15rem',
                fontSize: '0.85rem',
              }}
            >
              Subscribe Milk
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1.5px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#FFFFFF',
              }}
              title="Open menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Search Bar Dropdown */}
        {searchOpen && (
          <div
            style={{
              backgroundColor: 'var(--color-navy-dark)',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '0.75rem 0',
              animation: 'slideDownFade 0.2s ease'
            }}
          >
            <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Search size={18} color="var(--color-gold)" />
              <input
                type="text"
                placeholder="Search Doodh, Dahi, Paneer, Desi Ghee..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onNavigate('/products');
                    setSearchOpen(false);
                  }
                }}
                style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#FFFFFF',
                  fontSize: '0.95rem',
                  fontFamily: 'var(--font-body)'
                }}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Mobile Navigation Dropdown Menu */}
        {mobileMenuOpen && (
          <div
            style={{
              backgroundColor: 'var(--color-navy-dark)',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '1.25rem 1.5rem',
              animation: 'slideDownFade 0.25s ease',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem'
            }}
          >
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <a
                  key={link.path}
                  href={link.path}
                  onClick={(e) => handleLinkClick(e, link.path)}
                  style={{
                    color: isActive ? 'var(--color-gold)' : '#FFFFFF',
                    fontWeight: isActive ? '700' : '500',
                    fontSize: '1rem',
                    textDecoration: 'none',
                    padding: '0.4rem 0',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>{link.name}</span>
                  {isActive && <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-gold)' }} />}
                </a>
              );
            })}

            {/* Mobile Categories Links Sub-List */}
            <div style={{ paddingTop: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-gold)', fontWeight: '700', textTransform: 'uppercase' }}>Categories</span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.5rem' }}>
                {categories.map((cat) => (
                  <a
                    key={cat.id}
                    href={`/products?category=${cat.slug}`}
                    onClick={(e) => handleCategoryClick(e, cat.slug)}
                    style={{
                      color: '#CBD5E1',
                      fontSize: '0.85rem',
                      textDecoration: 'none',
                      padding: '0.35rem 0.5rem',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      borderRadius: '6px'
                    }}
                  >
                    Taaza {cat.name}
                  </a>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="btn btn-gold"
              onClick={(e) => handleLinkClick(e, '/subscription')}
              style={{
                width: '100%',
                padding: '0.75rem',
                marginTop: '0.5rem'
              }}
            >
              Subscribe Milk
            </button>
          </div>
        )}
      </header>

      {/* Slide-Over Cart Drawer */}
      {cartOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            display: 'flex',
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(18, 29, 51, 0.6)',
            backdropFilter: 'blur(4px)'
          }}
          onClick={() => setCartOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '380px',
              height: '100%',
              backgroundColor: 'var(--color-cream-card)',
              boxShadow: 'var(--shadow-strong)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '1.5rem',
              animation: 'slideUpFade 0.3s ease'
            }}
          >
            <div>
              {/* Drawer Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '0.85rem', borderBottom: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShoppingBag size={20} color="var(--color-navy)" />
                  <h3 className="font-display" style={{ fontSize: '1.2rem', color: 'var(--color-navy)', fontWeight: '700' }}>
                    Your Cart ({cartCount})
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setCartOpen(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Cart Items List */}
              {cartItems.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '55vh', overflowY: 'auto', paddingRight: '0.35rem' }}>
                  {cartItems.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem',
                        backgroundColor: 'var(--color-cream)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--color-border)'
                      }}
                    >
                      <div>
                        <h4 className="font-display" style={{ fontSize: '0.925rem', color: 'var(--color-navy)', fontWeight: '700' }}>
                          {item.name}
                        </h4>
                        <span style={{ fontSize: '0.775rem', color: 'var(--color-text-muted)' }}>{item.unit}</span>
                      </div>
                      <span style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--color-navy)' }}>₹{item.price}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                  <div style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>🛒</div>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Your cart is empty.</p>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            {cartItems.length > 0 && (
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--color-text-muted)' }}>Total Amount</span>
                  <span style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--color-navy)' }}>₹{calculateTotal()}</span>
                </div>
                <button
                  type="button"
                  className="btn btn-wine"
                  style={{ width: '100%', padding: '0.85rem' }}
                  onClick={() => {
                    alert('Cart & Checkout UI will be built in Phase 4!');
                    setCartOpen(false);
                  }}
                >
                  Proceed to Checkout <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
