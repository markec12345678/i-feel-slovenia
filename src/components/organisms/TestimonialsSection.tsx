import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TestimonialCard } from '@/components/atoms/TestimonialCard';
import { TESTIMONIALS } from '@/data/testimonials';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const timerRef = useRef<NodeJS.Timeout>();
  const carouselRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const shouldAnimate = !prefersReducedMotion;

  // Auto-rotate testimonials (pauses on hover/focus)
  useEffect(() => {
    if (!isAutoPlaying || prefersReducedMotion) return;
    
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    
    return () => clearInterval(timerRef.current);
  }, [isAutoPlaying, prefersReducedMotion]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    setIsAutoPlaying(false);
  }, []);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
    setIsAutoPlaying(false);
  }, []);

  const goToIndex = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  }, []);

  // Pause on hover/focus for accessibility
  const handleInteractionStart = () => setIsAutoPlaying(false);
  const handleInteractionEnd = () => {
    if (!prefersReducedMotion) setIsAutoPlaying(true);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrev();
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

        {/* Carousel Container */}
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
          {/* Testimonial Cards */}
          <div className="overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentIndex}
                className="px-2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                role="group"
                aria-roledescription="slide"
                aria-label={`Cit ${currentIndex + 1} od ${TESTIMONIALS.length}`}
              >
                <TestimonialCard 
                  testimonial={TESTIMONIALS[currentIndex]} 
                  isActive={true} 
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={goToPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 p-3 rounded-full bg-surface/80 border border-white/10 hover:border-accent/50 text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Prejšnji citat"
          >
            <ChevronLeft className="w-6 h-6" aria-hidden="true" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 p-3 rounded-full bg-surface/80 border border-white/10 hover:border-accent/50 text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Naslednji citat"
          >
            <ChevronRight className="w-6 h-6" aria-hidden="true" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8" role="tablist" aria-label="Navigacija po citatih">
            {TESTIMONIALS.map((_, index) => (
              <button
                key={index}
                onClick={() => goToIndex(index)}
                className={`w-3 h-3 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  index === currentIndex 
                    ? 'bg-accent w-8' 
                    : 'bg-white/20 hover:bg-white/40'
                }`}
                role="tab"
                aria-selected={index === currentIndex ? 'true' : 'false'}
                aria-label={`Pojdi na cit ${index + 1}`}
              />
            ))}
          </div>

          {/* Auto-play indicator (decorative) */}
          {!prefersReducedMotion && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 mb-12 flex items-center gap-2 text-secondary/60 text-xs">
              <div className={`w-2 h-2 rounded-full ${isAutoPlaying ? 'bg-accent animate-pulse' : 'bg-white/20'}`} aria-hidden="true" />
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
