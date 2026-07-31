import React, { useState } from 'react';
import { products } from '../data/products';
import ProductCard from '../components/common/ProductCard';
import SectionHeading from '../components/common/SectionHeading';
import { Star, Plus, Minus, ShieldCheck, Sparkles, Clock, ArrowRight, ChevronRight, Check } from '../components/common/Icons';

export const ProductDetail = ({ productId, onNavigate, onAddToCart }) => {
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return (
      <div style={{ paddingTop: '4rem', paddingBottom: '5rem', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '500px' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🥛</div>
          <h2 className="font-display" style={{ fontSize: '1.8rem', color: 'var(--color-navy)', fontWeight: '700', marginBottom: '0.5rem' }}>
            Product Nahi Mila
          </h2>
          <p className="text-muted" style={{ fontSize: '1rem', marginBottom: '2rem' }}>
            Aapne jis product ID ko dhoondha hai wo available nahi hai ya URL galat hai.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onNavigate && onNavigate('/products')}
          >
            Back to Products <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  const { id, name, price, unit, image, gallery = [image], rating, reviewCount = 150, inStock, badge, description, nutrition, categorySlug } = product;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const mainImageUrl = gallery[activeImageIndex] || image;

  const handleAddToCart = () => {
    if (inStock === false) return;
    setIsAdded(true);
    if (onAddToCart) {
      onAddToCart({ ...product, quantity });
    }
    setTimeout(() => setIsAdded(false), 1500);
  };

  const relatedProducts = products
    .filter((p) => p.categorySlug === categorySlug && p.id !== id)
    .slice(0, 4);

  return (
    <div style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div className="container">
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('/'); }}
            style={{ color: 'var(--color-navy)', textDecoration: 'none', fontWeight: '500' }}
          >
            Home
          </a>
          <ChevronRight size={13} color="var(--color-text-muted)" />
          <a
            href="/products"
            onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('/products'); }}
            style={{ color: 'var(--color-navy)', textDecoration: 'none', fontWeight: '500' }}
          >
            Products
          </a>
          <ChevronRight size={13} color="var(--color-text-muted)" />
          <a
            href={`/products?category=${categorySlug}`}
            onClick={(e) => { e.preventDefault(); onNavigate && onNavigate(`/products?category=${categorySlug}`); }}
            style={{ color: 'var(--color-navy)', textDecoration: 'none', fontWeight: '500', textTransform: 'capitalize' }}
          >
            {categorySlug}
          </a>
          <ChevronRight size={13} color="var(--color-text-muted)" />
          <span style={{ color: 'var(--color-wine)', fontWeight: '700' }}>
            {name}
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
            alignItems: 'start',
            backgroundColor: 'var(--color-cream-card)',
            borderRadius: 'var(--radius-lg)',
            border: '1.5px solid var(--color-border)',
            padding: '2.5rem 2rem',
            boxShadow: 'var(--shadow-md)',
            marginBottom: '4rem'
          }}
        >
          
          <div>
            <div
              style={{
                width: '100%',
                height: '340px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#F3ECE1',
                overflow: 'hidden',
                position: 'relative',
                marginBottom: '1rem',
                border: '1px solid var(--color-border)'
              }}
            >
              <img
                src={mainImageUrl}
                alt={name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: inStock === false ? 'grayscale(0.7)' : 'none',
                  transition: 'transform 0.4s ease'
                }}
              />

              {badge && inStock !== false && (
                <div style={{ position: 'absolute', top: '14px', left: '14px' }}>
                  <span className="badge-gold">{badge}</span>
                </div>
              )}

              {inStock === false && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.85)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(3px)'
                  }}
                >
                  <span className="badge-out-of-stock" style={{ fontSize: '0.9rem', padding: '0.4rem 1rem' }}>
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            {gallery.length > 1 && (
              <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto' }}>
                {gallery.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      border: activeImageIndex === idx ? '2.5px solid var(--color-wine)' : '1.5px solid var(--color-border)',
                      backgroundColor: '#F3ECE1',
                      cursor: 'pointer',
                      padding: 0,
                      opacity: activeImageIndex === idx ? 1 : 0.75,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <a
              href={`/products?category=${categorySlug}`}
              onClick={(e) => { e.preventDefault(); onNavigate && onNavigate(`/products?category=${categorySlug}`); }}
              className="badge-wine"
              style={{ textDecoration: 'none', marginBottom: '0.75rem', display: 'inline-block' }}
            >
              Taaza {categorySlug}
            </a>

            <h1 className="font-display" style={{ fontSize: '2.25rem', color: 'var(--color-navy)', fontWeight: '700', lineHeight: '1.2', marginBottom: '0.75rem' }}>
              {name}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '0.2rem' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} color="var(--color-gold)" fill="var(--color-gold)" />
                ))}
              </div>
              <span style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--color-navy)' }}>{rating}</span>
              <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>({reviewCount} verified reviews)</span>
            </div>

            <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <span style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--color-navy)' }}>₹{price}</span>
              <span style={{ fontSize: '1rem', color: 'var(--color-text-muted)' }}>/ {unit} Pack</span>
            </div>

            <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)', lineHeight: '1.7', marginBottom: '2rem' }}>
              {description}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  border: '1.5px solid var(--color-border)',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--color-cream)',
                  padding: '0.25rem 0.5rem'
                }}
              >
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Minus size={16} color="var(--color-navy)" />
                </button>
                <span style={{ width: '36px', textAlign: 'center', fontWeight: '800', fontSize: '1.05rem', color: 'var(--color-navy)' }}>
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Plus size={16} color="var(--color-navy)" />
                </button>
              </div>

              {inStock !== false ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAddToCart}
                  style={{ flex: 1, minWidth: '180px', padding: '0.85rem 1.5rem', fontSize: '1rem' }}
                >
                  {isAdded ? (
                    <>
                      <Check size={18} color="#FFFFFF" /> Item Added
                    </>
                  ) : (
                    <>
                      <Plus size={20} color="#FFFFFF" /> Add to Cart (₹{price * quantity})
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => alert('Hum aapko is product ke stock aate hi notify kar denge!')}
                  style={{ flex: 1, minWidth: '180px', padding: '0.85rem 1.5rem' }}
                >
                  Notify When Available
                </button>
              )}
            </div>

            {nutrition && (
              <div
                style={{
                  backgroundColor: 'var(--color-cream)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  marginBottom: '2rem',
                  border: '1px solid var(--color-border)'
                }}
              >
                <h4 style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--color-navy)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Nutritional Specs
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Fat</div>
                    <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--color-navy)' }}>{nutrition.fat}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Protein</div>
                    <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--color-navy)' }}>{nutrition.protein}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Calories</div>
                    <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--color-navy)' }}>{nutrition.calories}</div>
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', paddingTop: '1.25rem', borderTop: '1px dashed var(--color-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-navy)' }}>
                <ShieldCheck size={18} color="var(--color-wine)" />
                <span>100% Pure</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-navy)' }}>
                <Sparkles size={18} color="var(--color-gold-hover)" />
                <span>Hygienic Packaging</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-navy)' }}>
                <Clock size={18} color="var(--color-navy)" />
                <span>Fresh Daily</span>
              </div>
            </div>

          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div>
            <SectionHeading
              eyebrow="Recommended"
              title="Aapko Ye Bhi Pasand Aa Sakta Hai"
              description="Same category ke baaki taaza products"
            />

            <div className="grid-4">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onAddToCart={onAddToCart}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetail;
