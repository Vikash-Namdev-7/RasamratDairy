import React, { useState } from 'react';
import { ChevronRight } from './Icons';

export const CategoryCard = ({ category, onNavigate }) => {
  const { name, slug, image, fallbackImage, productCount } = category;
  const [imgSrc, setImgSrc] = useState(image);
  const [imgError, setImgError] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(`/category/${slug}`);
    }
  };

  const handleImageError = () => {
    if (!imgError && fallbackImage) {
      setImgSrc(fallbackImage);
      setImgError(true);
    }
  };

  return (
    <a
      href={`/category/${slug}`}
      onClick={handleClick}
      className="card-hover"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textDecoration: 'none',
        padding: '1.25rem 1rem',
        backgroundColor: 'var(--color-cream-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1.5px solid var(--color-border)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Top Subtle Pill */}
      <div style={{ position: 'absolute', top: '8px', right: '10px' }}>
        <span style={{ fontSize: '0.675rem', fontWeight: '700', color: 'var(--color-wine)', backgroundColor: 'var(--color-wine-soft)', padding: '0.15rem 0.5rem', borderRadius: '10px' }}>
          Fresh
        </span>
      </div>

      {/* Circular Image Container */}
      <div
        style={{
          width: '92px',
          height: '92px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-cream)',
          border: '2.5px solid var(--color-gold)',
          overflow: 'hidden',
          marginBottom: '0.85rem',
          boxShadow: 'var(--shadow-md)',
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
            transition: 'transform 0.4s ease'
          }}
        />
      </div>

      {/* Category Title */}
      <h3
        className="font-display"
        style={{
          fontSize: '1.15rem',
          color: 'var(--color-navy)',
          fontWeight: '700',
          marginBottom: '0.25rem'
        }}
      >
        {name}
      </h3>

      {/* Subtext Badge */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', color: 'var(--color-text-muted)', fontSize: '0.825rem' }}>
        <span>{productCount} Products</span>
        <ChevronRight size={14} color="var(--color-wine)" />
      </div>
    </a>
  );
};

export default CategoryCard;
