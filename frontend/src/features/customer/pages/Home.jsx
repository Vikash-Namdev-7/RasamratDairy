import React, { useState } from 'react';
import { products } from '../data/products';
import { categories } from '../data/categories';
import { testimonials } from '../data/testimonials';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import SectionHeading from '../components/SectionHeading';
import TestimonialSlider from '../components/TestimonialSlider';
import { ArrowRight, ShieldCheck, Clock, Sparkles } from '../../../components/Icons';

export const Home = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('all');

  const filteredProducts = activeTab === 'all'
    ? products
    : products.filter((p) => p.categorySlug === activeTab);

  return (
    <div>
      
      {/* 1. Modern Premium Hero Banner */}
      <section
        style={{
          background: 'linear-gradient(135deg, #1C2B4A 0%, #0F172A 100%)',
          color: '#FFFFFF',
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
              <span className="badge-gold" style={{ marginBottom: '0.85rem' }}>
                ✨ 100% Pure Organic Dairy
              </span>
              <h1 className="font-display hero-title" style={{ fontWeight: '800', lineHeight: '1.2', marginBottom: '0.85rem', color: '#FFFFFF' }}>
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
                  Explore Products
                </button>
              </div>
            </div>

            {/* Right Side: Seamless Borderless Showcase Banner */}
            <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
              <div
                style={{
                  width: '100%',
                  maxWidth: '380px',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  position: 'relative',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.45)',
                  border: '1px solid rgba(212, 165, 66, 0.35)',
                  backgroundColor: '#0F172A'
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?auto=format&fit=crop&w=800&q=80"
                  onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80"; }}
                  alt="Farm Fresh Pure Milk Showcase"
                  style={{
                    width: '100%',
                    height: '280px',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    display: 'block'
                  }}
                />

                {/* Floating Overlay Pill Badge */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '12px',
                    right: '12px',
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: '14px',
                    padding: '0.65rem 0.85rem',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <ShieldCheck size={18} color="var(--color-gold)" />
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#FFFFFF' }}>Farm Fresh Packed</div>
                      <div style={{ fontSize: '0.675rem', color: '#CBD5E1' }}>Lab Tested • Zero Additives</div>
                    </div>
                  </div>
                  <span className="badge-gold" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>6-9 AM</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Trust Stats Bar */}
      <section style={{ backgroundColor: 'var(--color-cream-card)', borderBottom: '1px solid var(--color-border)', padding: '1.25rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', textAlign: 'center' }} className="stats-grid">
            <div className="stat-card">
              <div className="stat-number" style={{ color: 'var(--color-navy)' }}>100%</div>
              <div className="stat-label">Pure & Lab Tested</div>
            </div>
            <div className="stat-card">
              <div className="stat-number" style={{ color: 'var(--color-wine)' }}>6 - 9 AM</div>
              <div className="stat-label">Morning Slot</div>
            </div>
            <div className="stat-card">
              <div className="stat-number" style={{ color: 'var(--color-gold-hover)' }}>5000+</div>
              <div className="stat-label">Happy Families</div>
            </div>
            <div className="stat-card">
              <div className="stat-number" style={{ color: 'var(--color-navy)' }}>0 Additives</div>
              <div className="stat-label">Preservative Free</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Shop By Category */}
      <section style={{ padding: '3rem 0' }}>
        <div className="container">
          <SectionHeading
            eyebrow="Dairy Fresh"
            title="Shop By Category"
            description="Hamare taaza aur shuddh products me se chunav karein"
          />

          <div className="category-grid">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Featured Products Section with Filter Tabs */}
      <section style={{ padding: '3rem 0', backgroundColor: '#F5EFE6' }}>
        <div className="container">
          <SectionHeading
            eyebrow="Popular Items"
            title="Popular Products"
            description="Sabse zyada pasand kiye jaane wale farm-fresh items"
          />

          {/* Filter Tabs - Single Line Horizontal Swipe Bar on Mobile */}
          <div className="category-tabs-bar hide-scrollbar" style={{ marginBottom: '2rem' }}>
            {[{ label: 'Sabhi Products', slug: 'all' }, ...categories.map(c => ({ label: `Taaza ${c.name}`, slug: c.slug }))].map((tab) => (
              <button
                key={tab.slug}
                type="button"
                onClick={() => setActiveTab(tab.slug)}
                className={`category-tab-btn ${activeTab === tab.slug ? 'active' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => onNavigate && onNavigate('/products')}
            >
              View Full Products Catalog <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* 5. Customer Testimonials Interactive Slider */}
      <section style={{ padding: '3rem 0', backgroundColor: 'var(--color-cream)' }}>
        <div className="container">
          <SectionHeading
            eyebrow="Real Reviews"
            title="Sunte Hain Apne Grahako Ki Zubaani"
            description="5,000+ Indore families ka bharosa"
          />

          <TestimonialSlider testimonials={testimonials} />
        </div>
      </section>

    </div>
  );
};

export default Home;
