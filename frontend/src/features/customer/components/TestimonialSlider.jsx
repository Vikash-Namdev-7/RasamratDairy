import React, { useRef, useState, useEffect } from 'react';
import TestimonialCard from './TestimonialCard';

export const TestimonialSlider = ({ testimonials = [] }) => {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const scrollPosition = container.scrollLeft;
    const cardWidth = container.firstElementChild?.firstElementChild?.offsetWidth || 290;
    const newIndex = Math.round(scrollPosition / (cardWidth + 16));
    setActiveIndex(Math.min(Math.max(newIndex, 0), testimonials.length - 1));
  };

  const scrollToSlide = (index) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const cardWidth = container.firstElementChild?.firstElementChild?.offsetWidth || 290;
    container.scrollTo({
      left: index * (cardWidth + 16),
      behavior: 'smooth'
    });
  };

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <div style={{ width: '100%', maxWidth: '960px', margin: '0 auto', position: 'relative' }}>
      
      {/* Touch Swipeable Horizontal Scroll Track (NO Arrow Buttons) */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="hide-scrollbar"
        style={{
          display: 'flex',
          gap: '1rem',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollBehavior: 'smooth',
          padding: '0.75rem 0.5rem 1.25rem 0.5rem',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            style={{
              flex: '0 0 290px',
              maxWidth: '290px',
              scrollSnapAlign: 'center'
            }}
          >
            <TestimonialCard testimonial={testimonial} />
          </div>
        ))}
      </div>

      {/* Sleek Pagination Dots Tracking Scroll */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', marginTop: '0.5rem' }}>
        {testimonials.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => scrollToSlide(idx)}
            style={{
              width: activeIndex === idx ? '22px' : '8px',
              height: '8px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: activeIndex === idx ? 'var(--color-gold)' : 'var(--color-border)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            title={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialSlider;
