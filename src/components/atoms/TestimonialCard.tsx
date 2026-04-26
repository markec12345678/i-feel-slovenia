import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { Testimonial } from '@/types/testimonial';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface TestimonialCardProps {
  testimonial: Testimonial;
  isActive: boolean;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({ 
  testimonial, 
  isActive 
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const shouldAnimate = !prefersReducedMotion;

  return (
    <motion.article
      className={`p-6 rounded-2xl bg-surface/50 border transition-all ${
        isActive 
          ? 'border-accent shadow-lg shadow-accent/10 scale-[1.02]' 
          : 'border-white/10 opacity-70 scale-100'
      }`}
      initial={shouldAnimate ? { opacity: 0, x: 20 } : { opacity: 1, x: 0 }}
      animate={shouldAnimate ? { 
        opacity: isActive ? 1 : 0.7, 
        x: 0,
        transition: { duration: 0.3 }
      } : { opacity: isActive ? 1 : 0.7, x: 0 }}
      aria-hidden={!isActive}
      tabIndex={isActive ? 0 : -1}
    >
      {/* Quote Icon */}
      <Quote className="w-8 h-8 text-accent/30 mb-4" aria-hidden="true" />
      
      {/* Quote Text */}
      <blockquote className="font-body text-primary text-lg leading-relaxed mb-6">
        "{testimonial.quote}"
      </blockquote>
      
      {/* Rating (if available) */}
      {testimonial.rating && (
        <div className="flex gap-1 mb-4" aria-label={`Ocena: ${testimonial.rating} od 5 zvezdic`}>
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < testimonial.rating! 
                  ? 'text-accent fill-accent' 
                  : 'text-secondary/30'
              }`}
              aria-hidden="true"
            />
          ))}
        </div>
      )}
      
      {/* Author */}
      <footer className="flex items-center gap-3">
        {testimonial.avatar ? (
          <img
            src={testimonial.avatar}
            alt={`Avatar za ${testimonial.author}`}
            className="w-10 h-10 rounded-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
            {testimonial.author.charAt(0)}
          </div>
        )}
        <div>
          <p className="font-body text-primary font-semibold">{testimonial.author}</p>
          {(testimonial.location || testimonial.year) && (
            <p className="font-body text-secondary text-sm">
              {testimonial.location}{testimonial.location && testimonial.year && ' • '}{testimonial.year}
            </p>
          )}
        </div>
      </footer>
    </motion.article>
  );
};
