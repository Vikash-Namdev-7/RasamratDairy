import React, { useState } from 'react';
import { Star, Plus, Check, Heart } from '../../../components/Icons';
import { useCart } from '../../../context/CartContext';

const DEFAULT_FALLBACK = "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80";

export const ProductCard = ({ product, onNavigate }) => {
  const { id, name, price, unit, image, fallbackImage, rating, reviewCount, inStock, badge } = product;
  const { addToCart } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [imgSrc, setImgSrc] = useState(image || fallbackImage || DEFAULT_FALLBACK);

  const handleCardClick = (e) => {
    if (e.target.closest('button')) return;
    if (onNavigate) {
      onNavigate(`/products/${id}`);
    }
  };

  const handleAddClick = (e) => {
    e.stopPropagation();
    if (inStock === false) return;
    setIsAdded(true);
    addToCart(product, 1);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const toggleWishlist = (e) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleImageError = () => {
    setImgSrc(fallbackImage || DEFAULT_FALLBACK);
  };

  return (
    <div
      onClick={handleCardClick}
      className="card-hover"
      style={{
        backgroundColor: 'var(--color-cream-card)',
        borderRadius: 'var(--radius-md)',
        border: '1.5px solid var(--color-border)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        cursor: 'pointer',
        height: '100%',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      <div
        style={{
          height: '145px',
          width: '100%',
          backgroundColor: '#F3ECE1',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <button
          type="button"
          onClick={toggleWishlist}
          style={{
            position: 'absolute',
            top: '6px',
            right: '6px',
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
            zIndex: 4,
            transition: 'transform 0.2s ease'
          }}
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            size={14}
            color={isWishlisted ? "var(--color-wine)" : "var(--color-text-muted)"}
            fill={isWishlisted ? "var(--color-wine)" : "none"}
          />
        </button>

        {badge && inStock !== false && (
          <div style={{ position: 'absolute', top: '6px', left: '6px', zIndex: 3 }}>
            <span className="badge-gold" style={{ fontSize: '0.625rem', padding: '0.15rem 0.5rem' }}>{badge}</span>
          </div>
        )}

        <img
          src={imgSrc}
          onError={handleImageError}
          alt={name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
            display: 'block',
            filter: inStock === false ? 'grayscale(0.6)' : 'none'
          }}
        />

        <div
          style={{
            position: 'absolute',
            bottom: '6px',
            left: '6px',
            backgroundColor: 'rgba(28, 43, 74, 0.88)',
            backdropFilter: 'blur(4px)',
            color: '#FFFFFF',
            fontSize: '0.65rem',
            fontWeight: '600',
            padding: '0.15rem 0.45rem',
            borderRadius: '8px',
            zIndex: 3
          }}
        >
          {unit} Pack
        </div>

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
            <span className="badge-out-of-stock" style={{ backgroundColor: 'rgba(239, 68, 68, 0.9)', color: '#FFFFFF', border: 'none', padding: '0.2rem 0.6rem', fontSize: '0.7rem' }}>
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div style={{ padding: '0.65rem 0.7rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', marginBottom: '0.15rem' }}>
            <Star size={12} color="var(--color-gold)" fill="var(--color-gold)" />
            <span style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--color-navy)' }}>{rating}</span>
            <span style={{ fontSize: '0.675rem', color: 'var(--color-text-light)' }}>({reviewCount || 120})</span>
          </div>

          <h3
            className="font-display"
            style={{
              fontSize: '0.9rem',
              color: 'var(--color-navy)',
              fontWeight: '700',
              lineHeight: '1.2',
              marginBottom: '0.25rem'
            }}
          >
            {name}
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.3rem', paddingTop: '0.3rem', borderTop: '1px dashed var(--color-border)' }}>
          <div>
            <span style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--color-navy)' }}>₹{price}</span>
            <span style={{ fontSize: '0.675rem', color: 'var(--color-text-muted)', marginLeft: '0.1rem' }}>/ {unit}</span>
          </div>

          <button
            type="button"
            disabled={inStock === false}
            onClick={handleAddClick}
            style={{
              height: '28px',
              padding: isAdded ? '0 0.65rem' : '0 0.55rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: inStock === false ? '#CBD5E1' : isAdded ? 'var(--color-wine)' : 'var(--color-navy)',
              color: inStock === false ? '#64748B' : '#FFFFFF',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.2rem',
              cursor: inStock === false ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '0.75rem',
              boxShadow: inStock === false ? 'none' : 'var(--shadow-sm)'
            }}
            title={inStock === false ? "Out of stock" : "Add to cart"}
          >
            {isAdded ? (
              <>
                <Check size={12} color="#FFFFFF" /> Added
              </>
            ) : (
              <>
                <Plus size={14} color="currentColor" /> Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
