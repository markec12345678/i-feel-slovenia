import React, { useState, useEffect, useRef, useCallback, useTransition } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TestimonialCard } from '@/components/atoms/TestimonialCard';
import { TESTIMONIALS } from '@/data/testimonials';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isPending, startTransition] = useTransition();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const shouldAnimate = !prefersReducedMotion;

  // Use CSS transition direction state
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Auto-rotate testimonials with RAF scheduling
  useEffect(() => {
    if (!isAutoPlaying || prefersReducedMotion) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }
    
    timerRef.current = setInterval(() => {
      startTransition(() => {
        setDirection('left');
        setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
      });
    }, 6000);
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isAutoPlaying, prefersReducedMotion]);

  // Optimized navigation with useTransition
  const goToNext = useCallback(() => {
    startTransition(() => {
      setDirection('left');
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
      setIsAutoPlaying(false);
    });
  }, []);

  const goToPrev = useCallback(() => {
    startTransition(() => {
      setDirection('right');
      setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
      setIsAutoPlaying(false);
    });
  }, []);

  const goToIndex = useCallback((index: number) => {
    startTransition(() => {
      setDirection(index > currentIndex ? 'left' : 'right');
      setCurrentIndex(index);
      setIsAutoPlaying(false);
    });
  }, [currentIndex]);

  // Debounced hover/focus handlers
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const handleInteractionStart = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsAutoPlaying(false);
  }, []);
  
  const handleInteractionEnd = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      if (!prefersReducedMotion) {
        setIsAutoPlaying(true);
      }
    }, 300);
  }, [prefersReducedMotion]);

  // Keyboard navigation with RAF
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        requestAnimationFrame(goToNext);
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        requestAnimationFrame(goToPrev);
      }
    };
    
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('keydown', handleKey);
      return () => carousel.removeEventListener('keydown', handleKey);
    }
  }, [goToNext, goToPrev]);

  return (
    <section 
      id="testimonials" 
      className="py-20 px-4 bg-gradient-to-b from-background to-surface/30"
      aria-labelledby="testimonials-heading"
    >
      <div className="max-w-4xl mx-auto">
        <motion.h2
          id="testimonials-heading"
          className="font-display text-4xl md:text-5xl font-bold text-center mb-4 text-primary"
          initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Kaj pravijo <span className="text-accent">Fani</span>
        </motion.h2>
        <p className="font-body text-secondary text-center mb-12 max-w-2xl mx-auto">
          Spomini, čustva in besede ljudi, ki so doživeli The Drinkers v živo.
        </p>

        {/* Carousel Container - Optimized with CSS transitions */}
        <div
          ref={carouselRef}
          className="relative"
          onMouseEnter={handleInteractionStart}
          onMouseLeave={handleInteractionEnd}
          onFocus={handleInteractionStart}
          onBlur={handleInteractionEnd}
          tabIndex={0}
          role="region"
          aria-label="Citati fanov"
          aria-roledescription="carousel"
        >
          {/* Testimonial Cards - CSS transition instead of Framer Motion AnimatePresence */}
          <div className="overflow-hidden will-change-transform">
            <div
              className={`px-2 transition-all duration-300 ease-out ${
                isPending ? 'opacity-50' : 'opacity-100'
              } ${direction === 'left' ? 'translate-x-0' : direction === 'right' ? 'translate-x-0' : ''}`}
              style={{ 
                willChange: 'opacity, transform',
                transform: 'translateZ(0)' // Force GPU acceleration
              }}
              role="group"
              aria-roledescription="slide"
              aria-label={`Cit ${currentIndex + 1} od ${TESTIMONIALS.length}`}
            >
              <TestimonialCard 
                testimonial={TESTIMONIALS[currentIndex]} 
                isActive={true} 
              />
            </div>
          </div>

          {/* Navigation Buttons - with RAF scheduling */}
          <button
            onClick={() => requestAnimationFrame(goToPrev)}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 p-3 rounded-full bg-surface/80 border border-white/10 hover:border-accent/50 text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-95"
            aria-label="Prejšnji citat"
            style={{ willChange: 'transform' }}
          >
            <ChevronLeft className="w-6 h-6" aria-hidden="true" />
          </button>
          <button
            onClick={() => requestAnimationFrame(goToNext)}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 p-3 rounded-full bg-surface/80 border border-white/10 hover:border-accent/50 text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-95"
            aria-label="Naslednji citat"
            style={{ willChange: 'transform' }}
          >
            <ChevronRight className="w-6 h-6" aria-hidden="true" />
          </button>

          {/* Dots Indicator - Memoized */}
          <div className="flex justify-center gap-2 mt-8" role="tablist" aria-label="Navigacija po citatih">
            {TESTIMONIALS.map((_, index) => (
              <button
                key={index}
                onClick={() => requestAnimationFrame(() => goToIndex(index))}
                className={`h-3 rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  index === currentIndex 
                    ? 'bg-accent w-8' 
                    : 'w-3 bg-white/20 hover:bg-white/40'
                }`}
                role="tab"
                aria-selected={index === currentIndex ? 'true' : 'false'}
                aria-label={`Pojdi na cit ${index + 1}`}
              />
            ))}
          </div>

          {/* Auto-play indicator */}
          {!prefersReducedMotion && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 mb-12 flex items-center gap-2 text-secondary/60 text-xs">
              <div 
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${isAutoPlaying ? 'bg-accent' : 'bg-white/20'}`} 
                aria-hidden="true" 
              />
              <span>{isAutoPlaying ? 'Avtomatsko vrtenje' : 'Pavzirano'}</span>
            </div>
          )}
        </div>

        {/* CTA */}
        <motion.div 
          className="mt-12 text-center"
          initial={shouldAnimate ? { opacity: 0 } : { opacity: 1 }}
          animate={shouldAnimate ? { opacity: 1, transition: { delay: 0.3 } } : { opacity: 1 }}
        >
          <p className="font-body text-secondary mb-4">
            Tudi ti imaš spomin na The Drinkers? Deli ga z nami!
          </p>
          <a
            href="mailto:spomini@thedrinkers.si"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent hover:bg-accent-hover text-white font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Pošlji svoj citat
          </a>
        </motion.div>
      </div>
    </section>
  );
};
