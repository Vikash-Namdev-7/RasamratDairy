import React, { useState, useEffect, useMemo } from 'react';
import { products as fallbackProducts } from '../data/products';
import { categories as fallbackCategories } from '../data/categories';
import ProductCard from '../components/ProductCard';
import { Search, X, ArrowLeft, SlidersHorizontal } from '../../../components/Icons';
import productsApi from '../../../api/products.api';

export const Products = ({ onNavigate }) => {
  const getInitialCategory = () => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('category');
    return cat ? [cat] : [];
  };

  const [selectedCategories, setSelectedCategories] = useState(getInitialCategory);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('popularity');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [productsList, setProductsList] = useState(fallbackProducts);
  const [categoriesList, setCategoriesList] = useState(fallbackCategories);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          productsApi.getProducts(),
          productsApi.getCategories()
        ]);

        if (isMounted) {
          if (prodRes.data && Array.isArray(prodRes.data.data) && prodRes.data.data.length > 0) {
            setProductsList(prodRes.data.data);
          }
          if (catRes.data && Array.isArray(catRes.data.data) && catRes.data.data.length > 0) {
            setCategoriesList(catRes.data.data);
          }
        }
      } catch (err) {
        console.warn('Real API offline, using fallback dataset in Products page');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchData();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('category');
    if (cat) {
      setSelectedCategories([cat]);
    }
  }, [window.location.search]);

  const handleCategoryToggle = (slug) => {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setMinPrice(0);
    setMaxPrice(1000);
    setInStockOnly(false);
    setSortBy('popularity');
    if (window.location.search) {
      window.history.pushState({}, '', '/products');
    }
  };

  const handleBackClick = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else if (onNavigate) {
      onNavigate('/');
    }
  };

  const activeCategoryObj = useMemo(() => {
    if (selectedCategories.length === 1) {
      return categoriesList.find((c) => c.slug === selectedCategories[0]);
    }
    return null;
  }, [selectedCategories, categoriesList]);

  // Dynamic Filtering Logic
  const filteredProducts = useMemo(() => {
    let result = [...productsList];

    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.categorySlug));
    }

    result = result.filter((p) => p.price >= minPrice && p.price <= maxPrice);

    if (inStockOnly) {
      result = result.filter((p) => p.inStock);
    }

    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [productsList, selectedCategories, minPrice, maxPrice, inStockOnly, sortBy]);

  return (
    <div style={{ padding: '2rem 0', backgroundColor: 'var(--color-cream)' }}>
      <div className="container">
        
        {/* Back Button Bar */}
        <div style={{ marginBottom: '1.25rem' }}>
          <button
            type="button"
            onClick={handleBackClick}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-navy)',
              fontWeight: '700',
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <ArrowLeft size={16} color="var(--color-navy)" /> Back
          </button>
        </div>

        {/* Dynamic Category Header Banner */}
        {activeCategoryObj ? (
          <div
            style={{
              backgroundColor: 'var(--color-navy)',
              color: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              padding: '1.75rem',
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              boxShadow: 'var(--shadow-md)',
              borderBottom: '3px solid var(--color-gold)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <img
              src={activeCategoryObj.image}
              alt={activeCategoryObj.name}
              style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-gold)' }}
            />
            <div>
              <span className="badge-gold" style={{ fontSize: '0.675rem', marginBottom: '0.3rem' }}>
                Category Catalogue
              </span>
              <h1 className="font-display" style={{ fontSize: '1.75rem', fontWeight: '800', margin: 0 }}>
                Taaza {activeCategoryObj.name}
              </h1>
              <p style={{ color: '#CBD5E1', fontSize: '0.875rem', marginTop: '0.2rem' }}>
                {activeCategoryObj.tagline || '100% Shuddh & Pure Daily Products'}
              </p>
            </div>
          </div>
        ) : (
          <div style={{ marginBottom: '2rem' }}>
            <h1 className="font-display" style={{ fontSize: '2rem', color: 'var(--color-navy)', fontWeight: '800' }}>
              Hamare Sabhi Dairy Products
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.925rem' }}>
              Farm fresh full cream doodh, dahi, paneer aur desi ghee order karein
            </p>
          </div>
        )}

        {/* Mobile Filter Toggle Bar */}
        <div className="mobile-filter-bar" style={{ display: 'none', marginBottom: '1rem' }}>
          <button
            type="button"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-navy)',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: '700',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              cursor: 'pointer'
            }}
          >
            <SlidersHorizontal size={18} color="var(--color-gold)" />
            {mobileFilterOpen ? 'Filters Chhupayein' : 'Filter Products (Category, Price)'}
          </button>
        </div>

        {/* Layout Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem', alignItems: 'start' }} className="products-listing-layout">
          
          {/* Left Sidebar Filter Panel */}
          <aside className={`filter-sidebar ${mobileFilterOpen ? 'mobile-show' : ''}`} style={{ backgroundColor: 'var(--color-cream-card)', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-border)', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--color-border)' }}>
              <h3 className="font-display" style={{ fontSize: '1.1rem', color: 'var(--color-navy)', fontWeight: '700' }}>
                Filter Products
              </h3>
              {(selectedCategories.length > 0 || inStockOnly || sortBy !== 'popularity') && (
                <button
                  type="button"
                  onClick={clearFilters}
                  style={{ background: 'none', border: 'none', color: 'var(--color-wine)', fontSize: '0.775rem', fontWeight: '700', cursor: 'pointer' }}
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Filter Group: Category Checkboxes */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--color-navy)', fontWeight: '700', marginBottom: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Categories
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                {categoriesList.map((cat) => (
                  <label
                    key={cat.id || cat._id || cat.slug}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-main)', cursor: 'pointer' }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.slug)}
                      onChange={() => handleCategoryToggle(cat.slug)}
                      style={{ width: '16px', height: '16px', accentColor: 'var(--color-navy)', cursor: 'pointer' }}
                    />
                    <span>Taaza {cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filter Group: In Stock Only */}
            <div style={{ marginBottom: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-navy)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--color-navy)', cursor: 'pointer' }}
                />
                <span>Sirf In-Stock Items Dikhayein</span>
              </label>
            </div>

          </aside>

          {/* Right Main Product Listing Area */}
          <main>
            {/* Top Toolbar */}
            <div className="desktop-sort-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--color-cream-card)', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-border)', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: '600' }}>
                Total <strong>{filteredProducts.length}</strong> items mile
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.825rem', color: 'var(--color-text-muted)', fontWeight: '600' }}>Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: 'var(--radius-full)',
                    border: '1.5px solid var(--color-border)',
                    backgroundColor: 'var(--color-cream)',
                    fontSize: '0.825rem',
                    fontWeight: '700',
                    color: 'var(--color-navy)',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="popularity">Sabse Popular</option>
                  <option value="price-low">Price: Kam Se Zyada</option>
                  <option value="price-high">Price: Zyada Se Kam</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid-3">
                {filteredProducts.map((p) => (
                  <ProductCard key={p.id || p._id} product={p} onNavigate={onNavigate} />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', backgroundColor: 'var(--color-cream-card)', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-border)' }}>
                <h3 className="font-display" style={{ fontSize: '1.25rem', color: 'var(--color-navy)', marginBottom: '0.5rem' }}>
                  Koi matching product nahi mila.
                </h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                  Kripya filters reset karein ya doosri category select karein.
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="btn btn-primary"
                  style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem' }}
                >
                  Reset Filters
                </button>
              </div>
            )}
          </main>

        </div>

      </div>
    </div>
  );
};

export default Products;
