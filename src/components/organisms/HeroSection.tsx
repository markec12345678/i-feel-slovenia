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
      {/* 🖼️ NOVO OZADJE: Slika benda + Temen preliv za berljivost */}
      <div className="absolute inset-0 z-0">
        {/* Slika: object-[center_20%] zagotovi, da so obrazi vidni tudi na mobilnih */}
        <img 
          src="/hero-band.jpg" 
          alt="The Drinkers - Nova Zasedba"
          className="w-full h-full object-cover object-[center_20%]"
          loading="eager" // Nujno za LCP optimizacijo
          fetchPriority="high" // Pove brskalniku, da je to najpomembnejša slika
        />
        {/* Temen gradient, da tekst ostane berljiv (od zgoraj navzdol) */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/85 to-background" />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-5xl mx-auto text-center"
        initial={shouldAnimate ? { opacity: 0 } : { opacity: 1 }}
        animate={shouldAnimate ? { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.15 } } : { opacity: 1 }}
      >
        {/* Badge */}
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface/80 border border-accent/30 mb-6 backdrop-blur-sm"
          initial={shouldAnimate ? { opacity: 0, y: -10 } : { opacity: 1, y: 0 }}
          animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
        >
          <Beer className="w-4 h-4 text-accent" aria-hidden="true" />
          <span className="text-sm font-medium text-secondary">Drink'n'Roll Lives On • Est. 1993</span>
        </motion.div>

        {/* Headline – Bebas Neue */}
        <motion.h1
          className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-primary leading-[1.05] mb-6 tracking-tight drop-shadow-lg"
          initial={shouldAnimate ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
          animate={shouldAnimate ? { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } : { opacity: 1, y: 0 }}
        >
          Nova Generacija,<br />
          <span className="text-accent">Isti Duh</span>
        </motion.h1>

        {/* Subheadline – Inter */}
        <motion.p
          className="font-body text-lg md:text-xl text-secondary mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow-md"
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
            buttonText="Pridruži se Pivoluciji" 
            successMessage="Na zdravje! 🍺 Prejel boš novice o tribute dogodkih."
          />
        </motion.div>

        {/* Pivolucija Social Proof */}
        <motion.div 
          className="flex flex-wrap items-center justify-center gap-6 text-secondary/90 bg-surface/40 p-4 rounded-xl backdrop-blur-sm border border-white/5"
          initial={shouldAnimate ? { opacity: 0 } : { opacity: 1 }}
          animate={shouldAnimate ? { opacity: 1, transition: { delay: 0.45 } } : { opacity: 1 }}
          aria-label="The Drinkers zapuščina v številkah"
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
