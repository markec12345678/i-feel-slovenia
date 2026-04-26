import React from 'react';
import { motion } from 'framer-motion';
import { WaitlistForm } from '@/components/molecules/WaitlistForm';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { Beer, Music, Disc } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const shouldAnimate = !prefersReducedMotion;

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 pt-20 pb-12" 
      aria-label="The Drinkers – Drink'n'Roll Legacy"
    >
      {/* Background – Dark gradient + subtle beer pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-surface to-background z-0" />
      
      {/* Subtle grain texture (SVG inline – <1KB, lazy loaded) */}
      <div 
        className="absolute inset-0 opacity-[0.03] z-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` 
        }}
        aria-hidden="true"
      />
      
      {/* Decorative beer glass pattern (low-opacity, decorative only) */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(196,30,58,0.08),transparent_70%)] z-0 pointer-events-none"
        aria-hidden="true"
      />

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-5xl mx-auto text-center"
        initial={shouldAnimate ? { opacity: 0 } : { opacity: 1 }}
        animate={shouldAnimate ? { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.15 } } : { opacity: 1 }}
      >
        {/* Badge */}
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface/80 border border-accent/30 mb-6"
          initial={shouldAnimate ? { opacity: 0, y: -10 } : { opacity: 1, y: 0 }}
          animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
        >
          <Beer className="w-4 h-4 text-accent" aria-hidden="true" />
          <span className="text-sm font-medium text-secondary">Drink'n'Roll Lives On • Est. 1993</span>
        </motion.div>

        {/* Headline – Bebas Neue */}
        <motion.h1
          className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-primary leading-[1.05] mb-6 tracking-tight"
          initial={shouldAnimate ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
          animate={shouldAnimate ? { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } : { opacity: 1, y: 0 }}
        >
          Nova Generacija,<br />
          <span className="text-accent">Isti Duh</span>
        </motion.h1>

        {/* Subheadline – Inter */}
        <motion.p
          className="font-body text-lg md:text-xl text-secondary mb-8 max-w-2xl mx-auto leading-relaxed"
          initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
          animate={shouldAnimate ? { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.4 } } : { opacity: 1, y: 0 }}
        >
          The Drinkers so nazaj! <span className="text-primary font-semibold">Domen Kolenc</span> nadaljuje očetovo zapuščino 
          z originalnima članoma Robertom Likarjem in Primožem Trebcem. 
          Drink'n'Roll živi naprej. 🍺
        </motion.p>

        {/* CTA + Waitlist */}
        <motion.div
          className="mb-10"
          initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
          animate={shouldAnimate ? { opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.4 } } : { opacity: 1, y: 0 }}
        >
          <WaitlistForm 
            placeholder="tvoj@email.com" 
            buttonText="Pridruži se" 
            successMessage="Na zdravje! 🍺 Prejel boš novice o koncertih."
          />
        </motion.div>

        {/* Social Proof */}
        <motion.div 
          className="flex flex-wrap items-center justify-center gap-6 text-secondary/80"
          initial={shouldAnimate ? { opacity: 0 } : { opacity: 1 }}
          animate={shouldAnimate ? { opacity: 1, transition: { delay: 0.45 } } : { opacity: 1 }}
          aria-label="The Drinkers statistika"
        >
          <div className="flex items-center gap-2">
            <Disc className="w-5 h-5 text-accent" aria-hidden="true" />
            <span className="text-sm"><strong className="text-primary">10+</strong> albumov</span>
          </div>
          <div className="flex items-center gap-2">
            <Music className="w-5 h-5 text-accent" aria-hidden="true" />
            <span className="text-sm"><strong className="text-primary">Nova</strong> generacija</span>
          </div>
          <div className="flex items-center gap-2">
            <Beer className="w-5 h-5 text-accent" aria-hidden="true" />
            <span className="text-sm"><strong className="text-primary">∞</strong> piva</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};
