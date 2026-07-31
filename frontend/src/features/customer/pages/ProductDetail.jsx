import React, { useState, useEffect } from 'react';
import { products as fallbackProducts } from '../data/products';
import ProductCard from '../components/ProductCard';
import SectionHeading from '../components/SectionHeading';
import { Star, Plus, Minus, ShieldCheck, Sparkles, Clock, ArrowRight, ArrowLeft, Check } from '../../../components/Icons';
import { useCart } from '../../../context/CartContext';
import productsApi from '../../../api/products.api';

const DEFAULT_FALLBACK = "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80";

export const ProductDetail = ({ productId, onNavigate }) => {
  const { addToCart } = useCart();
  const [product, setProduct] = useState(() => fallbackProducts.find((p) => (p.id || p._id) === productId));
  const [allProducts, setAllProducts] = useState(fallbackProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchProduct() {
      try {
        setLoading(true);
        const [res, allRes] = await Promise.all([
          productsApi.getProductById(productId),
          productsApi.getProducts()
        ]);

        if (isMounted) {
          if (res.data && res.data.data) {
            setProduct(res.data.data);
          }
          if (allRes.data && Array.isArray(allRes.data.data)) {
            setAllProducts(allRes.data.data);
          }
        }
      } catch (err) {
        console.warn('⚠️ Real API offline, using fallback product detail dataset');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (productId) {
      fetchProduct();
    }
    return () => { isMounted = false; };
  }, [productId]);

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

  const { name, price, unit, image, gallery = [image], rating = 4.8, reviewCount = 42, inStock = true, badge, description, categorySlug } = product;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [imgSrc, setImgSrc] = useState(gallery[activeImageIndex] || image || DEFAULT_FALLBACK);

  useEffect(() => {
    setImgSrc(gallery[activeImageIndex] || image || DEFAULT_FALLBACK);
  }, [activeImageIndex, gallery, image]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const relatedProducts = allProducts
    .filter((p) => p.categorySlug === categorySlug && (p.id || p._id) !== (product.id || product._id))
    .slice(0, 4);

  return (
    <div style={{ padding: '2rem 0', backgroundColor: 'var(--color-cream)' }}>
      <div className="container">
        
        {/* Back Navigation Button */}
        <div style={{ marginBottom: '1.5rem' }}>
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
            <ArrowLeft size={16} color="var(--color-navy)" /> Back to Products
          </button>
        </div>

        {/* Main Product Display Card */}
        <div
          className="product-detail-grid"
          style={{
            backgroundColor: 'var(--color-cream-card)',
            borderRadius: 'var(--radius-md)',
            border: '1.5px solid var(--color-border)',
            padding: '2rem',
            boxShadow: 'var(--shadow-md)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3.5rem'
          }}
        >
          {/* Left Column: Image Display */}
          <div>
            <div style={{ position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden', backgroundColor: '#FFFFFF', border: '1.5px solid var(--color-border)', marginBottom: '1rem' }}>
              <img
                src={imgSrc}
                alt={name}
                onError={() => setImgSrc(DEFAULT_FALLBACK)}
                style={{ width: '100%', height: '360px', objectFit: 'cover', display: 'block' }}
              />

              {badge && (
                <span
                  className="badge-gold"
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                  }}
                >
                  {badge}
                </span>
              )}
            </div>
          </div>

          {/* Right Column: Product Info & Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-gold-hover)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Taaza {categorySlug}
                </span>
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>•</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Star size={14} color="var(--color-gold)" style={{ fill: 'var(--color-gold)' }} />
                  <span style={{ fontSize: '0.825rem', fontWeight: '800', color: 'var(--color-navy)' }}>{rating}</span>
                  <span style={{ fontSize: '0.775rem', color: 'var(--color-text-muted)' }}>({reviewCount} reviews)</span>
                </div>
              </div>

              <h1 className="font-display" style={{ fontSize: '1.85rem', color: 'var(--color-navy)', fontWeight: '800', lineHeight: '1.2', marginBottom: '0.75rem' }}>
                {name}
              </h1>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '1.85rem', fontWeight: '900', color: 'var(--color-navy)' }}>
                  ₹{price}
                </span>
                <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: '600' }}>
                  / {unit}
                </span>
              </div>

              {description && (
                <p style={{ fontSize: '0.925rem', color: 'var(--color-text-main)', lineHeight: '1.65', marginBottom: '1.5rem' }}>
                  {description}
                </p>
              )}
            </div>

            {/* Actions: Quantity Stepper & Add to Cart */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'var(--color-cream)',
                    borderRadius: 'var(--radius-full)',
                    border: '1.5px solid var(--color-border)',
                    padding: '0.25rem 0.6rem'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    style={{ background: 'none', border: 'none', color: 'var(--color-navy)', cursor: 'pointer', padding: '0.25rem 0.5rem', display: 'flex', alignItems: 'center' }}
                  >
                    <Minus size={14} />
                  </button>

                  <span style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--color-navy)', padding: '0 0.6rem', minWidth: '24px', textAlign: 'center' }}>
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    style={{ background: 'none', border: 'none', color: 'var(--color-navy)', cursor: 'pointer', padding: '0.25rem 0.5rem', display: 'flex', alignItems: 'center' }}
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  className={`btn ${isAdded ? 'btn-gold' : 'btn-primary'}`}
                  style={{ flex: 1, padding: '0.75rem 1.5rem', fontSize: '0.925rem' }}
                >
                  {isAdded ? (
                    <>
                      <Check size={16} /> Cart Me Add Ho Gaya!
                    </>
                  ) : (
                    <>
                      Add to Cart (₹{price * quantity})
                    </>
                  )}
                </button>
              </div>

              {/* Direct Daily Subscription CTA */}
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('/subscription')}
                className="btn btn-gold"
                style={{ width: '100%', padding: '0.7rem', fontSize: '0.875rem' }}
              >
                🥛 Is Product Ka Daily Subscription Shuru Karein <ArrowRight size={15} />
              </button>
            </div>

          </div>
        </div>

        {/* Related Products Grid */}
        {relatedProducts.length > 0 && (
          <div>
            <SectionHeading title="Aapko Ye Bhi Pasand Aayega" subtitle="Similar fresh dairy products" />
            <div className="grid-4" style={{ marginTop: '1.5rem' }}>
              {relatedProducts.map((p) => (
                <ProductCard key={p.id || p._id} product={p} onNavigate={onNavigate} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetail;
