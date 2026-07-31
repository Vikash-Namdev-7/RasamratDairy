import React, { useState } from 'react';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import SectionHeading from '../components/SectionHeading';
import { Star, Plus, Minus, ShieldCheck, Sparkles, Clock, ArrowRight, ArrowLeft, Check } from '../../../components/Icons';
import { useCart } from '../../../context/CartContext';

const DEFAULT_FALLBACK = "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80";

export const ProductDetail = ({ productId, onNavigate }) => {
  const product = products.find((p) => p.id === productId);
  const { addToCart } = useCart();

  const handleBackClick = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else if (onNavigate) {
      onNavigate('/products');
    }
  };

  if (!product) {
    return (
      <div style={{ paddingTop: '3rem', paddingBottom: '4rem', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '440px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🥛</div>
          <h2 className="font-display" style={{ fontSize: '1.5rem', color: 'var(--color-navy)', fontWeight: '700', marginBottom: '0.4rem' }}>
            Product Nahi Mila
          </h2>
          <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Aapne jis product ko dhoondha hai wo filhal available nahi hai ya link galat hai.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onNavigate && onNavigate('/products')}
          >
            Back to Products <ArrowRight size={15} />
          </button>
        </div>
      </div>
    );
  }

  const { id, name, price, unit, image, gallery = [image], rating, reviewCount = 150, inStock, badge, description, nutrition, categorySlug } = product;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [imgSrc, setImgSrc] = useState(gallery[activeImageIndex] || image || DEFAULT_FALLBACK);

  const handleThumbnailClick = (idx) => {
    setActiveImageIndex(idx);
    setImgSrc(gallery[idx] || image || DEFAULT_FALLBACK);
  };

  const handleImageError = () => {
    setImgSrc(DEFAULT_FALLBACK);
  };

  const handleAddToCart = () => {
    if (inStock === false) return;
    setIsAdded(true);
    addToCart(product, quantity);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const relatedProducts = products
    .filter((p) => p.categorySlug === categorySlug && p.id !== id)
    .slice(0, 4);

  return (
    <div style={{ paddingTop: '1rem', paddingBottom: '2.5rem' }}>
      <div className="container">
        
        {/* Top Back Navigation Button */}
        <div style={{ marginBottom: '0.85rem' }}>
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

        {/* Product Main Container */}
        <div
          style={{
            backgroundColor: 'var(--color-cream-card)',
            borderRadius: 'var(--radius-md)',
            border: '1.5px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
            overflow: 'hidden',
            marginBottom: '2rem'
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
              padding: '1.15rem',
              alignItems: 'start'
            }}
            className="product-detail-grid"
          >
            
            {/* Left Column: Compact Main Image Gallery */}
            <div>
              <div
                style={{
                  width: '100%',
                  aspectRatio: '4 / 3',
                  maxHeight: '270px',
                  borderRadius: '12px',
                  backgroundColor: '#FAF5EE',
                  overflow: 'hidden',
                  position: 'relative',
                  marginBottom: '0.65rem',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <img
                  src={imgSrc}
                  onError={handleImageError}
                  alt={name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center center',
                    filter: inStock === false ? 'grayscale(0.6)' : 'none',
                    transition: 'opacity 0.3s ease'
                  }}
                />

                {badge && inStock !== false && (
                  <div style={{ position: 'absolute', top: '8px', left: '8px', zIndex: 3 }}>
                    <span className="badge-gold" style={{ fontSize: '0.65rem', padding: '0.18rem 0.5rem' }}>{badge}</span>
                  </div>
                )}

                {inStock === false && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: 'rgba(28, 43, 74, 0.35)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backdropFilter: 'blur(2px)',
                      zIndex: 3
                    }}
                  >
                    <span className="badge-out-of-stock" style={{ backgroundColor: 'rgba(239, 68, 68, 0.9)', color: '#FFFFFF', border: 'none', padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}>
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              {/* Compact Thumbnails Row */}
              {gallery.length > 1 && (
                <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.2rem' }} className="hide-scrollbar">
                  {gallery.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleThumbnailClick(idx)}
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: activeImageIndex === idx ? '2px solid var(--color-gold)' : '1px solid var(--color-border)',
                        boxShadow: activeImageIndex === idx ? '0 0 0 2px rgba(212, 165, 66, 0.3)' : 'none',
                        backgroundColor: '#FAF5EE',
                        cursor: 'pointer',
                        padding: 0,
                        flexShrink: 0,
                        opacity: activeImageIndex === idx ? 1 : 0.7,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <img
                        src={imgUrl}
                        onError={(e) => { e.target.src = DEFAULT_FALLBACK; }}
                        alt={`Thumbnail ${idx}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Details & Compact Actions */}
            <div>
              <a
                href={`/products?category=${categorySlug}`}
                onClick={(e) => { e.preventDefault(); onNavigate && onNavigate(`/products?category=${categorySlug}`); }}
                className="badge-wine"
                style={{ textDecoration: 'none', marginBottom: '0.35rem', display: 'inline-block', fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}
              >
                Taaza {categorySlug}
              </a>

              <h1 className="font-display" style={{ fontSize: '1.4rem', color: 'var(--color-navy)', fontWeight: '700', lineHeight: '1.25', marginBottom: '0.35rem' }}>
                {name}
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '0.1rem' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} color="var(--color-gold)" fill="var(--color-gold)" />
                  ))}
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--color-navy)' }}>{rating}</span>
                <span style={{ fontSize: '0.725rem', color: 'var(--color-text-muted)' }}>({reviewCount} reviews)</span>
              </div>

              <div style={{ marginBottom: '0.85rem', display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--color-navy)' }}>₹{price}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>/ {unit} Pack</span>
              </div>

              <p style={{ fontSize: '0.825rem', color: 'var(--color-text-muted)', lineHeight: '1.5', marginBottom: '1.15rem' }}>
                {description}
              </p>

              {/* Quantity Stepper & Add to Cart */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    border: '1.5px solid var(--color-border)',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--color-cream)',
                    padding: '0.15rem 0.35rem'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    style={{ width: '28px', height: '28px', borderRadius: '50%', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Minus size={13} color="var(--color-navy)" />
                  </button>
                  <span style={{ width: '28px', textAlign: 'center', fontWeight: '800', fontSize: '0.875rem', color: 'var(--color-navy)' }}>
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    style={{ width: '28px', height: '28px', borderRadius: '50%', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Plus size={13} color="var(--color-navy)" />
                  </button>
                </div>

                {inStock !== false ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleAddToCart}
                    style={{ flex: 1, minWidth: '150px', padding: '0.65rem 1rem', fontSize: '0.85rem' }}
                  >
                    {isAdded ? (
                      <>
                        <Check size={14} color="#FFFFFF" /> Item Added
                      </>
                    ) : (
                      <>
                        <Plus size={16} color="#FFFFFF" /> Add to Cart (₹{price * quantity})
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => alert('Hum aapko is product ke stock aate hi notify kar denge!')}
                    style={{ flex: 1, minWidth: '150px', padding: '0.65rem 1rem', fontSize: '0.8rem' }}
                  >
                    Notify When Available
                  </button>
                )}
              </div>

              {/* Compact Nutritional Specs */}
              {nutrition && (
                <div
                  style={{
                    backgroundColor: 'var(--color-cream)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem 0.85rem',
                    marginBottom: '1.15rem',
                    border: '1px solid var(--color-border)'
                  }}
                >
                  <h4 style={{ fontSize: '0.725rem', fontWeight: '700', color: 'var(--color-navy)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                    Nutritional Value (Per 100ml)
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
                    <div style={{ backgroundColor: 'var(--color-cream-card)', padding: '0.35rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}>
                      <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>Fat</div>
                      <div style={{ fontSize: '0.825rem', fontWeight: '800', color: 'var(--color-navy)' }}>{nutrition.fat}</div>
                    </div>
                    <div style={{ backgroundColor: 'var(--color-cream-card)', padding: '0.35rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}>
                      <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>Protein</div>
                      <div style={{ fontSize: '0.825rem', fontWeight: '800', color: 'var(--color-navy)' }}>{nutrition.protein}</div>
                    </div>
                    <div style={{ backgroundColor: 'var(--color-cream-card)', padding: '0.35rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}>
                      <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>Calories</div>
                      <div style={{ fontSize: '0.825rem', fontWeight: '800', color: 'var(--color-navy)' }}>{nutrition.calories}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Guarantee Icons Strip */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', paddingTop: '0.75rem', borderTop: '1px dashed var(--color-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-navy)' }}>
                  <ShieldCheck size={14} color="var(--color-wine)" />
                  <span>100% Pure</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-navy)' }}>
                  <Sparkles size={14} color="var(--color-gold-hover)" />
                  <span>Hygienic Sealed</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-navy)' }}>
                  <Clock size={14} color="var(--color-navy)" />
                  <span>Fresh Daily Batch</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Recommended Related Products */}
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
