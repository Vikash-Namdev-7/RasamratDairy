import React, { useState, useEffect, useMemo } from 'react';
import { products } from '../data/products';
import { categories } from '../data/categories';
import ProductCard from '../components/common/ProductCard';
import SectionHeading from '../components/common/SectionHeading';
import { Search, X, ChevronRight, ArrowRight } from '../components/common/Icons';

export const Products = ({ onNavigate, onAddToCart }) => {
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

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.categorySlug));
    }

    result = result.filter((p) => p.price >= minPrice && p.price <= maxPrice);

    if (inStockOnly) {
      result = result.filter((p) => p.inStock !== false);
    }

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else {
      result.sort((a, b) => (b.rating * (b.reviewCount || 100)) - (a.rating * (a.reviewCount || 100)));
    }

    return result;
  }, [selectedCategories, minPrice, maxPrice, inStockOnly, sortBy]);

  return (
    <div style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <div className="container">
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('/'); }}
            style={{ color: 'var(--color-navy)', textDecoration: 'none', fontWeight: '500' }}
          >
            Home
          </a>
          <ChevronRight size={13} color="var(--color-text-muted)" />
          <span style={{ color: 'var(--color-wine)', fontWeight: '700' }}>
            All Dairy Products
          </span>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <SectionHeading
            eyebrow="Complete Collection"
            title="Sabhi Taaza Dairy Products"
            description="Rozana packing, 100% milawat-rahit shuddh doodh, dahi, paneer, ghee aur makhan."
          />
        </div>

        <div style={{ display: 'none', marginBottom: '1.25rem' }} className="mobile-filter-bar">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            style={{ width: '100%', justifyContent: 'space-between', padding: '0.65rem 1rem' }}
          >
            <span>Filter & Sort ({filteredProducts.length} Products)</span>
            <span style={{ fontSize: '0.85rem' }}>{mobileFilterOpen ? '▲ Close' : '▼ Filter'}</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem', alignItems: 'start' }} className="products-listing-layout">
          
          <aside
            style={{
              backgroundColor: 'var(--color-cream-card)',
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid var(--color-border)',
              padding: '1.5rem',
              position: 'sticky',
              top: '90px',
              boxShadow: 'var(--shadow-sm)'
            }}
            className={`filter-sidebar ${mobileFilterOpen ? 'mobile-show' : ''}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--color-border)' }}>
              <h3 className="font-display" style={{ fontSize: '1.15rem', color: 'var(--color-navy)', fontWeight: '700' }}>
                Filters
              </h3>
              {(selectedCategories.length > 0 || minPrice > 0 || maxPrice < 1000 || inStockOnly) && (
                <button
                  type="button"
                  onClick={clearFilters}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-wine)',
                    fontWeight: '700',
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  Clear All
                </button>
              )}
            </div>

            <div style={{ marginBottom: '1.75rem' }}>
              <h4 style={{ fontSize: '0.875rem', color: 'var(--color-navy)', fontWeight: '700', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Categories
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {categories.map((cat) => {
                  const isChecked = selectedCategories.includes(cat.slug);
                  return (
                    <label
                      key={cat.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.9rem',
                        color: isChecked ? 'var(--color-navy)' : 'var(--color-text-muted)',
                        fontWeight: isChecked ? '700' : '500',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleCategoryToggle(cat.slug)}
                          style={{ accentColor: 'var(--color-wine)', width: '16px', height: '16px', cursor: 'pointer' }}
                        />
                        <span>Taaza {cat.name}</span>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>({cat.productCount})</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div style={{ marginBottom: '1.75rem' }}>
              <h4 style={{ fontSize: '0.875rem', color: 'var(--color-navy)', fontWeight: '700', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Price Range (₹)
              </h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice || ''}
                  onChange={(e) => setMinPrice(Number(e.target.value) || 0)}
                  style={{ width: '100%', padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.85rem' }}
                />
                <span style={{ color: 'var(--color-text-muted)' }}>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice || ''}
                  onChange={(e) => setMaxPrice(Number(e.target.value) || 1000)}
                  style={{ width: '100%', padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.85rem' }}
                />
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                ₹{minPrice} — ₹{maxPrice}
              </div>
            </div>

            <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.9rem',
                  color: 'var(--color-navy)',
                  fontWeight: '600',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
              >
                <span>In Stock Only</span>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  style={{ accentColor: 'var(--color-wine)', width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </label>
            </div>
          </aside>

          <div>
            <div
              style={{
                backgroundColor: 'var(--color-cream-card)',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--color-border)',
                padding: '0.85rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '1.5rem',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ fontSize: '0.925rem', fontWeight: '700', color: 'var(--color-navy)' }}>
                {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'} Mile
                {selectedCategories.length > 0 && (
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-wine)', fontWeight: '500', marginLeft: '0.4rem' }}>
                    ({selectedCategories.join(', ')})
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    padding: '0.45rem 0.85rem',
                    borderRadius: 'var(--radius-full)',
                    border: '1.5px solid var(--color-border)',
                    backgroundColor: 'var(--color-cream)',
                    color: 'var(--color-navy)',
                    fontWeight: '600',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  <option value="popularity">Popularity</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid-3">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={onAddToCart}
                    onNavigate={onNavigate}
                  />
                ))}
              </div>
            ) : (
              <div
                style={{
                  backgroundColor: 'var(--color-cream-card)',
                  borderRadius: 'var(--radius-md)',
                  border: '1.5px dashed var(--color-border)',
                  padding: '3.5rem 1.5rem',
                  textAlign: 'center',
                  marginTop: '1rem'
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🔍</div>
                <h3 className="font-display" style={{ fontSize: '1.35rem', color: 'var(--color-navy)', fontWeight: '700', marginBottom: '0.4rem' }}>
                  Koi product nahi mila
                </h3>
                <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1.5rem', maxWidth: '400px', marginInline: 'auto' }}>
                  Aapke dwara chunie gaye filters ke anusaar koi item milan nahi hua. Filter change karke dekhein.
                </p>
                <button
                  type="button"
                  className="btn btn-wine"
                  onClick={clearFilters}
                >
                  Clear Filters <X size={16} />
                </button>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default Products;
