import React, { useState } from 'react';
import { categories } from '../data/categories';
import { products } from '../data/products';
import ProductCard from '../components/common/ProductCard';
import SectionHeading from '../components/common/SectionHeading';
import { ArrowRight, ChevronRight, Search } from '../components/common/Icons';

export const Category = ({ slug, onNavigate, onAddToCart }) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Find current category details
  const currentCategory = categories.find((cat) => cat.slug === slug);

  // Filter products
  const categoryProducts = products.filter((prod) => prod.categorySlug === slug);
  const filteredProducts = categoryProducts.filter((prod) => {
    const matchesSearch = prod.name.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesStock = inStockOnly ? prod.inStock !== false : true;
    return matchesSearch && matchesStock;
  });

  const handleNavigateAll = () => {
    if (onNavigate) {
      onNavigate('/products');
    }
  };

  return (
    <div style={{ paddingTop: '2rem', minHeight: '65vh' }}>
      <div className="container">
        
        {/* Breadcrumb Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('/'); }}
            style={{ color: 'var(--color-navy)', textDecoration: 'none', fontWeight: '500' }}
          >
            Home
          </a>
          <ChevronRight size={14} color="var(--color-text-muted)" />
          <a
            href="/products"
            onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('/products'); }}
            style={{ color: 'var(--color-navy)', textDecoration: 'none', fontWeight: '500' }}
          >
            Categories
          </a>
          <ChevronRight size={14} color="var(--color-text-muted)" />
          <span style={{ color: 'var(--color-wine)', fontWeight: '700', textTransform: 'capitalize' }}>
            {currentCategory ? currentCategory.name : slug}
          </span>
        </div>

        {/* Category Header Banner */}
        <div
          style={{
            backgroundColor: 'var(--color-cream-card)',
            padding: '3rem 2.5rem',
            borderRadius: 'var(--radius-lg)',
            border: '1.5px solid var(--color-border)',
            marginBottom: '2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '2rem',
            boxShadow: 'var(--shadow-sm)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div>
            <span className="badge-wine" style={{ marginBottom: '0.85rem', display: 'inline-flex' }}>
              Fresh Dairy Category
            </span>
            <h1 className="font-display" style={{ fontSize: '2.6rem', color: 'var(--color-navy)', fontWeight: '700' }}>
              {currentCategory ? currentCategory.name : slug}
            </h1>
            <p className="text-muted" style={{ fontSize: '1.05rem', marginTop: '0.6rem', maxWidth: '600px' }}>
              Taaza aur shuddh {currentCategory ? currentCategory.name.toLowerCase() : slug} products — direct farm fresh daily delivery.
            </p>
          </div>

          <div style={{
            width: '96px',
            height: '96px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-gold-soft)',
            border: '2px solid var(--color-gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: 'var(--shadow-sm)'
          }}>
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="var(--color-navy)" strokeWidth="1.5">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            backgroundColor: 'var(--color-cream-card)',
            padding: '1.1rem 1.5rem',
            borderRadius: 'var(--radius-md)',
            border: '1.5px solid var(--color-border)',
            marginBottom: '2.5rem'
          }}
        >
          {/* Search Box */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: '240px', backgroundColor: 'var(--color-cream)', padding: '0.55rem 1rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-border)' }}>
            <Search size={18} color="var(--color-text-muted)" />
            <input
              type="text"
              placeholder={`Search in ${currentCategory ? currentCategory.name : slug}...`}
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.925rem', fontFamily: 'var(--font-body)' }}
            />
          </div>

          {/* In Stock Only Checkbox */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--color-navy)', fontWeight: '600', cursor: 'pointer', userSelect: 'none' }}>
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              style={{ accentColor: 'var(--color-wine)', width: '16px', height: '16px', cursor: 'pointer' }}
            />
            In Stock Only
          </label>
        </div>

        {/* Filtered Products Section */}
        {filteredProducts.length > 0 ? (
          <div>
            <SectionHeading
              eyebrow={`${filteredProducts.length} Items Available`}
              title={`Taaza ${currentCategory ? currentCategory.name : slug} Collection`}
            />

            <div className="grid-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Empty State */
          <div
            style={{
              backgroundColor: 'var(--color-cream-card)',
              borderRadius: 'var(--radius-md)',
              border: '1.5px dashed var(--color-border)',
              padding: '4rem 2rem',
              textAlign: 'center',
              maxWidth: '580px',
              margin: '0 auto'
            }}
          >
            <div style={{ fontSize: '3.25rem', marginBottom: '1rem' }}>🥛</div>
            <h3 className="font-display" style={{ fontSize: '1.5rem', color: 'var(--color-navy)', fontWeight: '700', marginBottom: '0.5rem' }}>
              Is category me abhi koi product available nahi hai
            </h3>
            <p className="text-muted" style={{ fontSize: '0.975rem', marginBottom: '2rem' }}>
              Hum jald hi is category me naye taaza dairy products add karenge. Baaki products dekhne ke liye neeche click karein.
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleNavigateAll}
            >
              Sabhi Products Dekhein <ArrowRight size={18} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Category;
