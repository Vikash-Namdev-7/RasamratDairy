import React, { useState } from 'react';

export const CategoryCard = ({ category, onNavigate }) => {
  const { name, slug, image, fallbackImage, productCount, tagline } = category;
  const [imgSrc, setImgSrc] = useState(image);

  const handleClick = (e) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(`/products?category=${slug}`);
    }
  };

  return (
    <a
      href={`/products?category=${slug}`}
      onClick={handleClick}
      className="card-hover"
      style={{
        backgroundColor: 'var(--color-cream-card)',
        borderRadius: 'var(--radius-md)',
        border: '1.5px solid var(--color-border)',
        padding: '1.25rem 1rem',
        textDecoration: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-cream-alt)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '0.85rem',
          border: '2px solid var(--color-gold-soft)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <img
          src={imgSrc}
          onError={() => fallbackImage && setImgSrc(fallbackImage)}
          alt={name}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      <h3
        className="font-display"
        style={{
          fontSize: '1.1rem',
          color: 'var(--color-navy)',
          fontWeight: '700',
          marginBottom: '0.2rem'
        }}
      >
        Taaza {name}
      </h3>

      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem', lineHeight: '1.3' }}>
        {tagline}
      </p>

      <span
        style={{
          fontSize: '0.7rem',
          fontWeight: '700',
          color: 'var(--color-wine)',
          backgroundColor: 'var(--color-wine-soft)',
          padding: '0.15rem 0.5rem',
          borderRadius: 'var(--radius-full)'
        }}
      >
        {productCount} Items →
      </span>
    </a>
  );
};

export default CategoryCard;
