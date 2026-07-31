import React from 'react';
import { products } from '../data/products';
import { categories } from '../data/categories';
import ProductCard from '../components/ProductCard';
import SectionHeading from '../components/SectionHeading';
import { ArrowLeft, ArrowRight } from '../../../components/Icons';

export const Category = ({ slug, onNavigate }) => {
  const category = categories.find((c) => c.slug === slug);
  const categoryProducts = products.filter((p) => p.categorySlug === slug);

  const handleBackClick = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else if (onNavigate) {
      onNavigate('/products');
    }
  };

  return (
    <div style={{ paddingTop: '1.25rem', paddingBottom: '3.5rem' }}>
      <div className="container">
        
        {/* Top Back Navigation Button */}
        <div style={{ marginBottom: '1rem' }}>
          <button
            type="button"
            onClick={handleBackClick}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'none',
              border: 'none',
              color: 'var(--color-navy)',
              fontWeight: '700',
              fontSize: '0.875rem',
              cursor: 'pointer',
              padding: '0.35rem 0'
            }}
          >
            <ArrowLeft size={18} color="var(--color-navy)" />
            <span>Back</span>
          </button>
        </div>

        <SectionHeading
          eyebrow="Category View"
          title={category ? `Taaza ${category.name}` : `Taaza ${slug}`}
          description={category ? category.tagline : "Farm fresh organic dairy items"}
        />

        {categoryProducts.length > 0 ? (
          <div className="grid-3">
            {categoryProducts.map((p) => (
              <ProductCard key={p.id} product={p} onNavigate={onNavigate} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>Is category me filhaal koi product available nahi hai.</p>
            <button type="button" className="btn btn-primary" onClick={() => onNavigate && onNavigate('/products')}>
              All Products Catalog <ArrowRight size={18} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Category;
