import React, { useState, useMemo } from 'react';
import { ShoppingBag, Search, X, Menu, ChevronRight, User, LogOut, Sparkles, Home, Package, Milk } from '../../../components/Icons';
import { categories } from '../data/categories';
import { products } from '../data/products';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';

export const Navbar = ({ currentPath, onNavigate }) => {
  const { totalCount } = useCart();
  const { customer, isAuthenticated, logout } = useAuth();

  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [catDropdownOpen, setCatDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navLinks = [
    { name: 'Home', path: '/', iconKey: 'Home' },
    { name: 'Products', path: '/products', iconKey: 'Package' },
    { name: 'Milk Subscription', path: '/subscription', iconKey: 'Milk' },
  ];

  const handleLinkClick = (e, path) => {
    e.preventDefault();
    setSearchOpen(false);
    setMobileMenuOpen(false);
    setCatDropdownOpen(false);
    setUserDropdownOpen(false);
    if (onNavigate) {
      onNavigate(path);
    }
  };

  const handleCategoryClick = (e, slug) => {
    e.preventDefault();
    setSearchOpen(false);
    setMobileMenuOpen(false);
    setCatDropdownOpen(false);
    setUserDropdownOpen(false);
    if (onNavigate) {
      onNavigate(`/products?category=${slug}`);
    }
  };

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase().trim();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.categorySlug.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <>
      <header
        className="glass-nav site-header"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div
          className="container nav-container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Brand Logo */}
          <a
            href="/"
            onClick={(e) => handleLinkClick(e, '/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              textDecoration: 'none',
            }}
          >
            <div
              className="brand-badge-circle"
              style={{
                borderRadius: '50%',
                backgroundColor: 'var(--color-wine)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                boxShadow: 'var(--shadow-wine)',
                flexShrink: 0
              }}
            >
              <span className="font-display brand-badge-text" style={{ fontWeight: '900', lineHeight: 1 }}>R</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="font-display brand-title-text" style={{ fontWeight: '800', color: '#FFFFFF', lineHeight: '1.1', whiteSpace: 'nowrap' }}>
                Rasamrat <span style={{ color: 'var(--color-gold)' }}>Dairy</span>
              </span>
              <span className="brand-tagline-text" style={{ color: '#CBD5E1', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                100% Pure • Shuddh Doodh
              </span>
            </div>
          </a>

          {/* Desktop Navigation Menu */}
          <nav className="desktop-nav">
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
                    fontSize: '0.925rem',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    padding: '0.4rem 0.6rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                  }}
                >
                  {link.name}
                </a>
              );
            })}

            {/* Category Dropdown Navigation */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setCatDropdownOpen(!catDropdownOpen)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#FFFFFF',
                  fontWeight: '500',
                  fontSize: '0.925rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  padding: '0.4rem 0.6rem',
                }}
              >
                Categories <ChevronRight size={14} style={{ transform: catDropdownOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
              </button>

              {catDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    marginTop: '0.5rem',
                    width: '200px',
                    backgroundColor: 'var(--color-navy-dark)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
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
                      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-gold)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'; }}
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

          {/* Actions: Search, Cart, User Auth CTA & Mobile Hamburger */}
          <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            
            {/* Search Trigger Button */}
            <button
              type="button"
              className="nav-action-btn"
              onClick={() => setSearchOpen(!searchOpen)}
              style={{
                backgroundColor: searchOpen ? 'var(--color-gold)' : 'rgba(255, 255, 255, 0.08)',
                border: '1.5px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: searchOpen ? 'var(--color-navy)' : '#FFFFFF',
                transition: 'all 0.2s ease',
              }}
              title="Search products"
            >
              <Search color={searchOpen ? 'var(--color-navy)' : '#FFFFFF'} className="nav-icon" />
            </button>

            {/* Cart Direct Link Button */}
            <a
              href="/cart"
              onClick={(e) => handleLinkClick(e, '/cart')}
              className="nav-action-btn"
              style={{
                position: 'relative',
                backgroundColor: currentPath === '/cart' ? 'var(--color-wine)' : 'rgba(255, 255, 255, 0.08)',
                border: '1.5px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#FFFFFF',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
              title="Shopping Cart"
            >
              <ShoppingBag className="nav-icon" />
              {totalCount > 0 && (
                <span
                  className="cart-badge-pill"
                  style={{
                    position: 'absolute',
                    backgroundColor: 'var(--color-wine)',
                    color: '#FFFFFF',
                    fontWeight: '800',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
                    border: '1.5px solid #FFFFFF'
                  }}
                >
                  {totalCount}
                </span>
              )}
            </a>

            {/* Customer Auth Button or Logged-in Dropdown */}
            {isAuthenticated ? (
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  style={{
                    padding: '0.4rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    border: '1.5px solid var(--color-gold)',
                    backgroundColor: 'rgba(212, 165, 66, 0.15)',
                    color: '#FFFFFF',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    whiteSpace: 'nowrap',
                    flexShrink: 0
                  }}
                >
                  <User size={16} color="var(--color-gold)" />
                  <span className="mobile-hide-username" style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {customer?.name || 'Account'}
                  </span>
                </button>

                {userDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: '0.5rem',
                      width: '180px',
                      backgroundColor: 'var(--color-navy-dark)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      boxShadow: 'var(--shadow-strong)',
                      padding: '0.5rem 0',
                      zIndex: 110,
                      animation: 'slideDownFade 0.2s ease'
                    }}
                  >
                    <a
                      href="/profile"
                      onClick={(e) => handleLinkClick(e, '/profile')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.55rem 1rem',
                        color: '#CBD5E1',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        textDecoration: 'none'
                      }}
                    >
                      <User size={15} color="var(--color-gold)" />
                      <span>Meri Profile</span>
                    </a>
                    <a
                      href="/my-orders"
                      onClick={(e) => handleLinkClick(e, '/my-orders')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.55rem 1rem',
                        color: '#CBD5E1',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        textDecoration: 'none'
                      }}
                    >
                      <ShoppingBag size={15} color="var(--color-gold)" />
                      <span>Mere Orders</span>
                    </a>
                    <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', margin: '0.35rem 0' }} />
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                        if (onNavigate) onNavigate('/login');
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '0.55rem 1rem',
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-accent)',
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <LogOut size={15} color="var(--color-accent)" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <a
                href="/login"
                onClick={(e) => handleLinkClick(e, '/login')}
                className="btn btn-outline"
                style={{
                  padding: '0.4rem 0.85rem',
                  fontSize: '0.825rem',
                  borderColor: 'var(--color-gold)',
                  color: 'var(--color-gold)'
                }}
              >
                Login
              </a>
            )}

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              className="mobile-menu-btn nav-action-btn"
              onClick={() => setMobileMenuOpen(true)}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1.5px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '50%',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#FFFFFF',
              }}
              title="Open Navigation Menu"
            >
              <Menu className="nav-icon" />
            </button>
          </div>
        </div>

        {/* Glassmorphism Search Overlay */}
        {searchOpen && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              width: '100%',
              backgroundColor: 'transparent',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              padding: '1rem 0',
              boxShadow: 'var(--shadow-strong)',
              animation: 'fadeIn 0.2s ease',
              zIndex: 90
            }}
          >
            <div className="container" style={{ maxWidth: '640px', position: 'relative' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  backgroundColor: 'rgba(28, 43, 74, 0.75)',
                  border: '2px solid var(--color-gold)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.6rem 1.25rem',
                  boxShadow: 'var(--shadow-gold)'
                }}
              >
                <Search size={20} color="var(--color-gold)" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Doodh, Dahi, Paneer, Desi Ghee search karein..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    color: '#FFFFFF',
                    fontSize: '0.95rem',
                    fontWeight: '500'
                  }}
                />
                <button
                  type="button"
                  onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                  style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Live Search Results Dropdown */}
              {searchQuery.trim() && (
                <div
                  style={{
                    marginTop: '0.75rem',
                    backgroundColor: 'var(--color-navy-dark)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    boxShadow: 'var(--shadow-strong)',
                    overflow: 'hidden',
                    maxHeight: '300px',
                    overflowY: 'auto'
                  }}
                >
                  {searchResults.length > 0 ? (
                    searchResults.map((p) => (
                      <a
                        key={p.id}
                        href={`/products/${p.id}`}
                        onClick={(e) => handleLinkClick(e, `/products/${p.id}`)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.75rem 1rem',
                          borderBottom: '1px solid rgba(255,255,255,0.08)',
                          textDecoration: 'none',
                          color: '#FFFFFF'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img src={p.image} alt={p.name} style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover' }} />
                          <div>
                            <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#FFFFFF' }}>{p.name}</div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-gold)' }}>₹{p.price} / {p.unit}</span>
                          </div>
                        </div>
                        <ChevronRight size={16} color="var(--color-gold)" />
                      </a>
                    ))
                  ) : (
                    <div style={{ padding: '1rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.875rem' }}>
                      Koi matching product nahi mila.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Premium Off-Canvas Slide-In Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="customer-mobile-backdrop" onClick={() => setMobileMenuOpen(false)} />
      )}

      <aside className={`customer-mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        {/* Drawer Header */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', marginBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: 'var(--color-wine)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="font-display" style={{ color: 'var(--color-gold)', fontWeight: '900', fontSize: '1.15rem' }}>R</span>
              </div>
              <div>
                <span className="font-display" style={{ fontSize: '1.05rem', fontWeight: '800', color: '#FFFFFF', display: 'block', lineHeight: 1.1 }}>Rasamrat Dairy</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Shuddh Doodh & Dairy</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: 'none',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Items */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <a
                  key={link.path}
                  href={link.path}
                  onClick={(e) => handleLinkClick(e, link.path)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 0.95rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: isActive ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.03)',
                    color: isActive ? 'var(--color-gold)' : '#FFFFFF',
                    fontWeight: isActive ? '800' : '600',
                    fontSize: '0.925rem',
                    textDecoration: 'none',
                    borderLeft: isActive ? '3px solid var(--color-gold)' : '3px solid transparent',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    {link.iconKey === 'Home' ? (
                      <Home size={18} color={isActive ? 'var(--color-gold)' : '#FFFFFF'} />
                    ) : link.iconKey === 'Package' ? (
                      <Package size={18} color={isActive ? 'var(--color-gold)' : '#FFFFFF'} />
                    ) : (
                      <Milk size={18} color={isActive ? 'var(--color-gold)' : '#FFFFFF'} />
                    )}
                    <span>{link.name}</span>
                  </div>
                  <ChevronRight size={14} color={isActive ? 'var(--color-gold)' : 'rgba(255,255,255,0.3)'} />
                </a>
              );
            })}

            {/* My Orders Direct Link */}
            {isAuthenticated && (
              <a
                href="/my-orders"
                onClick={(e) => handleLinkClick(e, '/my-orders')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 0.95rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: currentPath === '/my-orders' ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.03)',
                  color: currentPath === '/my-orders' ? 'var(--color-gold)' : '#FFFFFF',
                  fontWeight: currentPath === '/my-orders' ? '800' : '600',
                  fontSize: '0.925rem',
                  textDecoration: 'none',
                  borderLeft: currentPath === '/my-orders' ? '3px solid var(--color-gold)' : '3px solid transparent'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <ShoppingBag size={18} color="var(--color-gold)" />
                  <span>Mere Orders</span>
                </div>
                <ChevronRight size={14} color="var(--color-gold)" />
              </a>
            )}
          </nav>
        </div>

        {/* Drawer Bottom Customer Auth Action Card */}
        <div style={{ paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.12)' }}>
          {isAuthenticated ? (
            <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-sm)', padding: '0.85rem', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
                <User size={18} color="var(--color-gold)" />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#FFFFFF' }}>{customer?.name}</div>
                  <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>{customer?.email}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                  if (onNavigate) onNavigate('/login');
                }}
                style={{
                  width: '100%',
                  padding: '0.55rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-error-bg)',
                  border: '1px solid var(--color-error-border)',
                  color: 'var(--color-error)',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem'
                }}
              >
                <LogOut size={14} color="var(--color-error)" /> Logout Account
              </button>
            </div>
          ) : (
            <a
              href="/login"
              onClick={(e) => handleLinkClick(e, '/login')}
              className="btn btn-gold"
              style={{ width: '100%', textAlign: 'center', padding: '0.65rem', fontSize: '0.875rem' }}
            >
              Login / Sign Up
            </a>
          )}
        </div>
      </aside>
    </>
  );
};

export default Navbar;
