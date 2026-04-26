import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { TestimonialCard } from '@/components/atoms/TestimonialCard';
import { TESTIMONIALS } from '@/data/testimonials';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export const TestimonialsCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();
  const shouldAnimate = !prefersReducedMotion;

  // Auto-rotation (5 seconds)
  useEffect(() => {
    if (prefersReducedMotion) return;
    
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95
    })
  };

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  }, []);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  }, []);

  const handleDragEnd = useCallback((_e: any, { offset, velocity }: PanInfo) => {
    const swipe = swipePower(offset.x, velocity.x);

    if (swipe < -10000) {
      handleNext();
    } else if (swipe > 10000) {
      handlePrev();
    }
  }, [handleNext, handlePrev]);

  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  return (
    <section id="testimonials" className="py-20 px-4 bg-surface/30" aria-labelledby="testimonials-heading">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          id="testimonials-heading"
          className="font-display text-4xl md:text-5xl font-bold text-center mb-4 text-primary"
          initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-accent">Kaj</span> Pravijo Fanovi
        </motion.h2>
        <p className="font-body text-secondary text-center mb-12 max-w-2xl mx-auto">
          Resnične izkušnje fanov The Drinkers. Od legendarnih koncertov do nove generacije.
        </p>

        {/* Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-3 rounded-full bg-surface border border-white/10 hover:border-accent/50 text-primary hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Prejšnji testimonial"
          >
            <ChevronLeft className="w-6 h-6" aria-hidden="true" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-3 rounded-full bg-surface border border-white/10 hover:border-accent/50 text-primary hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Naslednji testimonial"
          >
            <ChevronRight className="w-6 h-6" aria-hidden="true" />
          </button>

          {/* Slides */}
          <div className="overflow-hidden" role="region" aria-label="Testimonials carousel">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={shouldAnimate ? slideVariants : undefined}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                  scale: { duration: 0.2 }
                }}
                drag={shouldAnimate ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={handleDragEnd}
                className="relative"
              >
                <TestimonialCard testimonial={TESTIMONIALS[currentIndex]} isActive={true} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Quote Icon */}
          <div className="absolute top-4 right-4 text-accent/20 pointer-events-none">
            <Quote className="w-16 h-16" aria-hidden="true" />
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 mt-8" role="tablist" aria-label="Testimonial slides">
          {TESTIMONIALS.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                index === currentIndex ? 'bg-accent' : 'bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Pojdi na testimonial ${index + 1}`}
              aria-selected={index === currentIndex ? 'true' : undefined}
              role="tab"
            />
          ))}
        </div>

        {/* Keyboard Navigation Hint */}
        <p className="font-body text-secondary/60 text-sm text-center mt-4">
          Uporabi ← → tipke za navigacijo
        </p>
      </div>
    </section>
  );
};
