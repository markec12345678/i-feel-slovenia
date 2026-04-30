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
      {/* 🎯 SPLIT SCREEN: Tekst levo, Slika desno */}
      <div className="container mx-auto grid lg:grid-cols-2 gap-12 lg:gap-8 items-center relative z-10">

        {/* LEVA STRAN: Vsebina / Tekst */}
        <motion.div
          className="text-center lg:text-left order-2 lg:order-1"
          initial={shouldAnimate ? { opacity: 0, x: -50 } : { opacity: 1 }}
          animate={shouldAnimate ? { opacity: 1, x: 0, transition: { staggerChildren: 0.1, delayChildren: 0.2 } } : { opacity: 1 }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-accent/30 mb-6 mx-auto lg:mx-0"
            initial={shouldAnimate ? { opacity: 0, y: -10 } : { opacity: 1, y: 0 }}
            animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          >
            <Beer className="w-4 h-4 text-accent" aria-hidden="true" />
            <span className="text-sm font-medium text-secondary">Drink'n'Roll Lives On • Est. 1993</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-primary leading-[1.05] mb-6 tracking-tight"
            initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
            animate={shouldAnimate ? { opacity: 1, y: 0, transition: { duration: 0.5 } } : { opacity: 1, y: 0 }}
          >
            Nova Generacija,<br />
            <span className="text-accent">Isti Duh</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="font-body text-lg text-secondary mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
            animate={shouldAnimate ? { opacity: 1, y: 0, transition: { delay: 0.2 } } : { opacity: 1, y: 0 }}
          >
            The Drinkers so nazaj! <span className="text-primary font-semibold">Domen Kolenc</span> nadaljuje očetovo zapuščino
            z originalnima članoma Robertom Likarjem in Primožem Trebcem.
            Drink'n'Roll živi naprej. 🍺
          </motion.p>

          {/* CTA + Waitlist */}
          <motion.div className="mb-8">
            <WaitlistForm
              placeholder="tvoj@email.com"
              buttonText="Pridruži se Pivoluciji"
              successMessage="Na zdravje! 🍺 Prejel boš novice."
            />
          </motion.div>

          {/* Stats */}
          <motion.div
            className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-secondary"
            initial={shouldAnimate ? { opacity: 0 } : { opacity: 1 }}
            animate={shouldAnimate ? { opacity: 1, transition: { delay: 0.4 } } : { opacity: 1 }}
          >
            <div className="flex items-center gap-2">
              <Disc className="w-5 h-5 text-accent" />
              <span className="text-sm"><strong className="text-primary">10+</strong> albumov</span>
            </div>
            <div className="flex items-center gap-2">
              <Music className="w-5 h-5 text-accent" />
              <span className="text-sm"><strong className="text-primary">Nova</strong> generacija</span>
            </div>
          </motion.div>
        </motion.div>

        {/* DESNA STRAN: Slika Benda */}
        <motion.div
          className="relative order-1 lg:order-2 flex justify-center"
          initial={shouldAnimate ? { opacity: 0, scale: 0.9, x: 50 } : { opacity: 1, scale: 1, x: 0 }}
          animate={shouldAnimate ? { opacity: 1, scale: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } } : { opacity: 1, scale: 1, x: 0 }}
        >
          {/* Dekorativni element zadaj (Glow) */}
          <div className="absolute inset-0 bg-accent/20 blur-[100px] rounded-full -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

          {/* Slika - rotate-2 za rock občutek */}
          <img
            src="/hero.jpeg"
            alt="The Drinkers - Nova Zasedba"
            className="w-full max-w-[500px] lg:max-w-[600px] rounded-2xl shadow-2xl shadow-black/50 border border-white/5 object-cover rotate-2"
            loading="eager"
            fetchpriority="high"
          />

          {/* Floating Badge na sliki */}
          <div className="absolute -bottom-6 -left-6 bg-surface border border-accent/30 p-4 rounded-xl shadow-xl hidden lg:block">
            <p className="text-accent font-bold text-lg">Prvi Koncert</p>
            <p className="text-sm text-secondary">7. Marec 2026</p>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
