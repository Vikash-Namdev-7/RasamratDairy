import React, { useState } from 'react';
import { Star, Plus, Check, Heart } from './Icons';

export const ProductCard = ({ product, onAddToCart, onNavigate }) => {
  const { id, name, price, unit, image, fallbackImage, rating, reviewCount, inStock, badge, categorySlug } = product;
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [imgSrc, setImgSrc] = useState(image);
  const [imgError, setImgError] = useState(false);

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
    if (onAddToCart) onAddToCart(product);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const toggleWishlist = (e) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleImageError = () => {
    if (!imgError && fallbackImage) {
      setImgSrc(fallbackImage);
      setImgError(true);
    }
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
        height: '100%'
      }}
    >
      <div
        style={{
          height: '185px',
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
            top: '10px',
            right: '10px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            zIndex: 2,
            transition: 'transform 0.2s ease'
          }}
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            size={16}
            color={isWishlisted ? "var(--color-wine)" : "var(--color-text-muted)"}
            fill={isWishlisted ? "var(--color-wine)" : "none"}
          />
        </button>

        {badge && inStock !== false && (
          <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 2 }}>
            <span className="badge-gold">{badge}</span>
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
            display: 'block'
          }}
        />

        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            backgroundColor: 'rgba(28, 43, 74, 0.85)',
            backdropFilter: 'blur(4px)',
            color: '#FFFFFF',
            fontSize: '0.725rem',
            fontWeight: '600',
            padding: '0.2rem 0.6rem',
            borderRadius: '12px',
            zIndex: 2
          }}
        >
          {unit} Pack
        </div>

        {inStock === false && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.88)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(3px)',
              zIndex: 3
            }}
          >
            <span className="badge-out-of-stock">Out of Stock</span>
          </div>
        )}
      </div>

      <div style={{ padding: '1rem 0.9rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.35rem' }}>
            <Star size={14} color="var(--color-gold)" fill="var(--color-gold)" />
            <span style={{ fontSize: '0.825rem', fontWeight: '700', color: 'var(--color-navy)' }}>{rating}</span>
            <span style={{ fontSize: '0.725rem', color: 'var(--color-text-light)' }}>({reviewCount || 120})</span>
          </div>

          <h3
            className="font-display"
            style={{
              fontSize: '1.05rem',
              color: 'var(--color-navy)',
              fontWeight: '700',
              lineHeight: '1.3',
              marginBottom: '0.5rem'
            }}
          >
            {name}
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed var(--color-border)' }}>
          <div>
            <span style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--color-navy)' }}>₹{price}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginLeft: '0.2rem' }}>/ {unit}</span>
          </div>

          <button
            type="button"
            disabled={inStock === false}
            onClick={handleAddClick}
            style={{
              height: '36px',
              padding: isAdded ? '0 0.85rem' : '0 0.75rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: inStock === false ? '#E2E8F0' : isAdded ? 'var(--color-wine)' : 'var(--color-navy)',
              color: inStock === false ? '#94A3B8' : '#FFFFFF',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              cursor: inStock === false ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '0.825rem',
              boxShadow: inStock === false ? 'none' : 'var(--shadow-sm)'
            }}
            title={inStock === false ? "Out of stock" : "Add to cart"}
          >
            {isAdded ? (
              <>
                <Check size={14} color="#FFFFFF" /> Added
              </>
            ) : (
              <>
                <Plus size={16} color="currentColor" /> Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
