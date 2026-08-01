import React, { useState, useEffect } from 'react';
import { products as fallbackProducts } from '../data/products';
import { categories as fallbackCategories } from '../data/categories';
import { testimonials } from '../data/testimonials';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import SectionHeading from '../components/SectionHeading';
import TestimonialSlider from '../components/TestimonialSlider';
import { ArrowRight, ShieldCheck, Clock, Sparkles } from '../../../components/Icons';
import productsApi from '../../../api/products.api';

export const Home = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [productList, setProductList] = useState(fallbackProducts);
  const [categoryList, setCategoryList] = useState(fallbackCategories);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          productsApi.getProducts(),
          productsApi.getCategories()
        ]);

        if (isMounted) {
          if (prodRes.data && Array.isArray(prodRes.data.data) && prodRes.data.data.length > 0) {
            setProductList(prodRes.data.data);
          }
          if (catRes.data && Array.isArray(catRes.data.data) && catRes.data.data.length > 0) {
            setCategoryList(catRes.data.data);
          }
        }
      } catch (err) {
        console.warn('Real API offline, falling back to local dataset in Home page');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchData();
    return () => { isMounted = false; };
  }, []);

  const filteredProducts = activeTab === 'all'
    ? productList
    : productList.filter((p) => p.categorySlug === activeTab);

  return (
    <div>
      
      {/* 1. Modern Premium Hero Banner */}
      <section
        style={{
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
          color: 'var(--color-cream)',
          paddingTop: '2.5rem',
          paddingBottom: '3.5rem',
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '3px solid var(--color-gold)'
        }}
      >
        {/* Soft Background Glow Effects */}
        <div style={{ position: 'absolute', top: '-10%', right: '10%', width: '320px', height: '320px', background: 'radial-gradient(circle, rgba(212, 165, 66, 0.15) 0%, rgba(0,0,0,0) 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-20%', left: '-5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(155, 58, 68, 0.2) 0%, rgba(0,0,0,0) 70%)', pointerEvents: 'none' }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
            
            {/* Left Content */}
            <div>
              <span className="badge-gold" style={{ marginBottom: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <Sparkles size={14} color="var(--color-gold)" /> 100% Pure Organic Dairy
              </span>
              <h1 className="font-display hero-title" style={{ fontWeight: '800', lineHeight: '1.2', marginBottom: '0.85rem', color: 'var(--color-cream)' }}>
                Roz Subah Shuddh <span style={{ color: 'var(--color-gold)' }}>Doodh</span>, Seedha Farm Se.
              </h1>
              <p style={{ fontSize: '0.95rem', color: '#CBD5E1', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                Bina kisi milawat ke taaza full cream doodh, dahi, paneer aur desi ghee. Apne parivar ki sehat ke liye rozana morning delivery.
              </p>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem' }}>
                <button
                  type="button"
                  className="btn btn-gold"
                  onClick={() => onNavigate && onNavigate('/subscription')}
                  style={{ padding: '0.75rem 1.4rem', fontSize: '0.9rem' }}
                >
                  Start Daily Subscription <ArrowRight size={16} />
                </button>
                
                <button
                  type="button"
                  className="btn btn-outline-light"
                  onClick={() => onNavigate && onNavigate('/products')}
                  style={{ padding: '0.75rem 1.4rem', fontSize: '0.9rem' }}
                >
                  Browse Products
                </button>
              </div>

              {/* Trust Indicators Strip */}
              <div className="hero-trust-row" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.12)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={18} color="var(--color-gold)" />
                  <span style={{ fontSize: '0.8rem', color: '#E2E8F0', fontWeight: '600' }}>Lab Tested 0% Adulteration</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={18} color="var(--color-gold)" />
                  <span style={{ fontSize: '0.8rem', color: '#E2E8F0', fontWeight: '600' }}>Subah 7 Baje Tak Delivery</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ position: 'relative', width: '100%', maxWidth: '420px' }}>
                <img
                  src="https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=700&q=80"
                  alt="Farm Fresh Dairy Products"
                  style={{
                    width: '100%',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                    border: '2px solid rgba(212, 165, 66, 0.4)'
                  }}
                />
                
                {/* Floating Micro Badge */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-12px',
                    left: '20px',
                    backgroundColor: 'var(--color-cream-card)',
                    color: 'var(--color-navy)',
                    padding: '0.6rem 1.1rem',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    border: '1.5px solid var(--color-gold)'
                  }}
                >
                  <Sparkles size={18} color="var(--color-gold)" />
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: '800', lineHeight: '1.1' }}>Fresh Batch</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>Packed Today Morning</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Categories Grid Section */}
      <section style={{ padding: '3.5rem 0', backgroundColor: 'var(--color-cream)' }}>
        <div className="container">
          <SectionHeading
            title="Hamare Dairy Products"
            subtitle="Shuddh aur Taaza dairy items — seedha hamare farm se aapke ghar tak"
          />

          <div className="category-grid" style={{ marginTop: '2rem' }}>
            {categoryList.map((cat) => (
              <CategoryCard key={cat.id || cat._id || cat.slug} category={cat} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured Bestsellers Section */}
      <section style={{ padding: '3.5rem 0', backgroundColor: 'var(--color-cream-card)', borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <h2 className="font-display" style={{ fontSize: '1.75rem', color: 'var(--color-navy)', fontWeight: '800' }}>
                Bestseller Dairy Items
              </h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                Grahakon ke sabse pasandida fresh products
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="category-tabs-bar">
              <button
                type="button"
                className={`category-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                Sabhi Products
              </button>
              {categoryList.map((cat) => (
                <button
                  key={cat.id || cat._id || cat.slug}
                  type="button"
                  className={`category-tab-btn ${activeTab === cat.slug ? 'active' : ''}`}
                  onClick={() => setActiveTab(cat.slug)}
                >
                  Taaza {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id || product._id} product={product} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Testimonials & Grahakon Ka Vishwas */}
      <section style={{ padding: '3.5rem 0', backgroundColor: 'var(--color-cream)', borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <SectionHeading
            title="Grahakon Ka Vishwas"
            subtitle="Suniyen hamare niyamit subscription grahakon ka kya kehna hai"
          />

          <div style={{ marginTop: '2rem' }}>
            <TestimonialSlider testimonials={testimonials} />
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
