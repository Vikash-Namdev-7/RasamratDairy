import React, { useState } from 'react';
import { categories } from '../data/categories';
import { products } from '../data/products';
import { testimonials } from '../data/testimonials';
import SectionHeading from '../components/common/SectionHeading';
import ProductCard from '../components/common/ProductCard';
import CategoryCard from '../components/common/CategoryCard';
import TestimonialCard from '../components/common/TestimonialCard';
import { ShieldCheck, Star, Truck, Heart, Sparkles, Clock, Smartphone, ArrowRight } from '../components/common/Icons';

export const Home = ({ onNavigate, onAddToCart }) => {
  const [activeFilter, setActiveFilter] = useState('all');

  const handleBtnClick = (path) => {
    if (onNavigate) {
      onNavigate(path);
    }
  };

  const filteredProducts = activeFilter === 'all'
    ? products
    : products.filter(p => p.categorySlug === activeFilter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
      
      {/* 1. HERO SECTION */}
      <section style={{ paddingTop: '1.5rem', paddingBottom: '0.5rem' }}>
        <div className="container">
          <div
            className="hero-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2.5rem',
              alignItems: 'center',
              backgroundColor: 'var(--color-cream-card)',
              borderRadius: 'var(--radius-lg)',
              padding: '3rem 2.25rem',
              border: '1.5px solid var(--color-border)',
              boxShadow: 'var(--shadow-md)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Left Content */}
            <div style={{ position: 'relative', zIndex: 2 }}>
              {/* Eyebrow Pill */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: 'var(--color-gold-soft)',
                  padding: '0.35rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  marginBottom: '1.25rem',
                  border: '1px solid rgba(212, 165, 66, 0.35)'
                }}
              >
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: 'var(--color-gold)' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--color-navy)', letterSpacing: '0.4px' }}>
                  100% Farm Fresh • Daily Delivery
                </span>
              </div>

              {/* Main Heading */}
              <h1
                className="font-display"
                style={{
                  fontSize: 'clamp(2rem, 4.2vw, 3.4rem)',
                  fontWeight: '700',
                  color: 'var(--color-navy)',
                  lineHeight: '1.15',
                  marginBottom: '1rem'
                }}
              >
                Taaza Doodh, <span className="text-accent" style={{ fontStyle: 'italic', fontWeight: '600' }}>Seedha Aapke Dwar</span> Tak
              </h1>

              {/* Subcopy */}
              <p
                style={{
                  fontSize: '1rem',
                  color: 'var(--color-text-muted)',
                  lineHeight: '1.65',
                  marginBottom: '1.85rem',
                  maxWidth: '520px'
                }}
              >
                Shuddh desi doodh, dahi, paneer aur ghee ka taaza swaad roz subah aapke ghar tak bataye hue samay par delivery guarantee ke saath.
              </p>

              {/* CTA Buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', marginBottom: '2.25rem' }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleBtnClick('/products')}
                >
                  Products Dekhein <ArrowRight size={18} />
                </button>

                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => handleBtnClick('/subscription')}
                >
                  Doodh Subscribe Karein
                </button>
              </div>

              {/* Trust Row */}
              <div
                className="hero-trust-row"
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '1.25rem',
                  paddingTop: '1.25rem',
                  borderTop: '1px dashed var(--color-border)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ShieldCheck size={20} color="var(--color-wine)" />
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-navy)' }}>Milawat-Rahit</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Star size={20} color="var(--color-gold)" fill="var(--color-gold)" />
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-navy)' }}>4.9/5 Rated</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Truck size={20} color="var(--color-navy)" />
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-navy)' }}>45-Min Delivery</span>
                </div>
              </div>
            </div>

            {/* Right Side Card Illustration */}
            <div
              style={{
                position: 'relative',
                minHeight: '300px',
                borderRadius: 'var(--radius-lg)',
                background: 'linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy-dark) 100%)',
                padding: '1.85rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                color: '#FFFFFF',
                boxShadow: 'var(--shadow-strong)',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              <div style={{ position: 'relative', zIndex: 2 }}>
                <span className="badge-gold" style={{ backgroundColor: 'var(--color-gold)', color: 'var(--color-navy)', fontWeight: '800' }}>
                  Indore's Trusted Dairy
                </span>
                <h3 className="font-display" style={{ fontSize: '1.6rem', marginTop: '0.85rem', color: '#FFFFFF', fontWeight: '700', lineHeight: '1.2' }}>
                  Rasamrat Quality Guarantee
                </h3>
              </div>

              {/* Graphic Icon */}
              <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', margin: '1.25rem 0' }}>
                <div style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '2px dashed var(--color-gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  boxShadow: '0 0 20px rgba(212, 165, 66, 0.2)'
                }}>
                  <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.5">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
              </div>

              <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: '#CBD5E1' }}>Fresh Morning Harvest</span>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--color-gold)' }}>Indore Region</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div
            className="stats-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '1.25rem',
              marginTop: '1.5rem',
              padding: '1.5rem',
              backgroundColor: 'var(--color-cream-card)',
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid var(--color-border)',
              textAlign: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div>
              <div className="font-display" style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--color-navy)' }}>10,000+</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>Happy Families</div>
            </div>
            <div>
              <div className="font-display" style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--color-wine)' }}>100% Pure</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>Lab Tested Milk</div>
            </div>
            <div>
              <div className="font-display" style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--color-gold-hover)' }}>4.9 ★</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>Customer Rating</div>
            </div>
            <div>
              <div className="font-display" style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--color-navy)' }}>6-9 AM</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>Delivery Slot</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY STRIP */}
      <section>
        <div className="container">
          <SectionHeading
            eyebrow="Har Din Ka Bharosa"
            title="Category Se Chunein"
            description="Aapki zaroorat ke hisaab se taaza dairy products chuniein"
          />

          <div className="category-grid">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS */}
      <section>
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.75rem' }}>
            <SectionHeading
              eyebrow="Bestsellers"
              title="Sabse Zyada Pasand Kiye Jaane Wale"
              description="Rozana hazaron Indori parivaron dwara bharosa kiye gaye top products"
            />

            {/* Filter Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
              {[
                { label: 'All', value: 'all' },
                { label: 'Doodh', value: 'doodh' },
                { label: 'Dahi', value: 'dahi' },
                { label: 'Paneer', value: 'paneer' },
                { label: 'Ghee', value: 'ghee' },
                { label: 'Makhan', value: 'makhan' },
              ].map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setActiveFilter(tab.value)}
                  style={{
                    padding: '0.35rem 0.9rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.825rem',
                    fontWeight: '600',
                    border: '1.5px solid',
                    borderColor: activeFilter === tab.value ? 'var(--color-navy)' : 'var(--color-border)',
                    backgroundColor: activeFilter === tab.value ? 'var(--color-navy)' : '#FFFFFF',
                    color: activeFilter === tab.value ? '#FFFFFF' : 'var(--color-navy)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US */}
      <section>
        <div className="container">
          <SectionHeading
            eyebrow="Kyun Chunein Rasamrat"
            title="Khaas Baatein Jo Banayein Humey Behtar"
            center={true}
          />

          <div className="grid-4">
            {[
              {
                icon: <Heart size={26} color="var(--color-wine)" />,
                title: "Made with Love",
                desc: "Shuddh desi gaay aur bhains ke doodh se bane swadishth products."
              },
              {
                icon: <Sparkles size={26} color="var(--color-gold-hover)" />,
                title: "Hygienic Packaging",
                desc: "Safai aur cold-chain temperature balance ke saath sealed packaging."
              },
              {
                icon: <Clock size={26} color="var(--color-navy)" />,
                title: "Samay Par Delivery",
                desc: "Roz subah 6 se 9 ke beech aapke dwaar par guaranteed delivery."
              },
              {
                icon: <Smartphone size={26} color="var(--color-wine)" />,
                title: "Aasaan Ordering",
                desc: "Chahiaye ek baar mangao ya daily subscription chalu karo."
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className="card-hover"
                style={{
                  backgroundColor: 'var(--color-cream-card)',
                  padding: '1.75rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1.5px solid var(--color-border)',
                  textAlign: 'center'
                }}
              >
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-cream)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem auto',
                    border: '1px solid var(--color-border)'
                  }}
                >
                  {item.icon}
                </div>
                <h3 className="font-display" style={{ fontSize: '1.1rem', color: 'var(--color-navy)', fontWeight: '700', marginBottom: '0.4rem' }}>
                  {item.title}
                </h3>
                <p className="text-muted" style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      <section>
        <div className="container">
          <SectionHeading
            eyebrow="Grahak Ki Aawaz"
            title="Log Hamare Baare Me Kya Kehte Hain"
            description="Humare regular customers ka anubhav inke hi shabdon me"
          />

          <div className="grid-3">
            {testimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 6. CTA BAND */}
      <section>
        <div className="container">
          <div
            className="cta-band"
            style={{
              backgroundColor: 'var(--color-navy)',
              borderRadius: 'var(--radius-lg)',
              padding: '3.5rem 1.75rem',
              textAlign: 'center',
              color: '#FFFFFF',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-strong)'
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', backgroundColor: 'var(--color-gold)' }} />
            
            <span className="badge-gold" style={{ backgroundColor: 'var(--color-wine)', color: '#FFFFFF', marginBottom: '1rem', display: 'inline-block' }}>
              Special Daily Offer
            </span>

            <h2
              className="font-display"
              style={{
                fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '1rem'
              }}
            >
              Aaj Hi Shuru Karein Apni Dairy Order
            </h2>

            <p
              style={{
                fontSize: '1rem',
                color: '#CBD5E1',
                maxWidth: '600px',
                margin: '0 auto 2rem auto',
                lineHeight: '1.65'
              }}
            >
              Rasamrat Dairy ke taaza doodh aur dairy products order karein ya daily subah delivery ke liye milk subscription activate karein.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <button
                type="button"
                className="btn btn-gold"
                onClick={() => handleBtnClick('/products')}
                style={{ padding: '0.85rem 2rem' }}
              >
                Order Karein
              </button>

              <button
                type="button"
                className="btn btn-outline-light"
                onClick={() => handleBtnClick('/subscription')}
                style={{ padding: '0.85rem 2rem' }}
              >
                Subscription Dekhein
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
