import React from 'react';
import { motion } from 'framer-motion';
import { 
  Music, 
  Calendar, 
  Heart,
  Mic,
  Users,
  Ticket
} from 'lucide-react';
import { FeatureCard } from '@/components/atoms/FeatureCard';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

const NEW_ERA_HIGHLIGHTS = [
  {
    icon: Mic,
    title: 'Domen Kolenc',
    description: 'Sin legendarnega Kolija prevzema mikrofon – nova generacija, isti strastni nastop.',
    size: 'large' as const
  },
  {
    icon: Users,
    title: 'Originalna jedra',
    description: 'Robert Likar (kitara) in Primož Trebec (klaviature) ohranjata avtentičen zvok.',
    size: 'medium' as const
  },
  {
    icon: Calendar,
    title: 'Prvi koncert 2026',
    description: '7. marec, Jevnica – Jevniški retro džuboks. Vstopnice že v prodaji.',
    size: 'medium' as const
  },
  {
    icon: Music,
    title: 'Kultni hiti v živo',
    description: '"Deset majhnih jagrov", "Žeja", "Ko to tamo peva" – znova na odru.',
    size: 'small' as const
  },
  {
    icon: Heart,
    title: 'Poklon Koliju',
    description: 'Vsak koncert je tudi spomin na Sandija Kolenca-Kolija (1965–2017).',
    size: 'small' as const
  },
  {
    icon: Ticket,
    title: 'Vstopnice',
    description: 'Predprodaja: 20 € | Na dan koncerta: 25 €. Agencija 19, Bar Jevničanka.',
    size: 'medium' as const
  }
];

export const FeaturesSection: React.FC = () => {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section 
      id="features" 
      className="relative py-24 px-4 sm:px-6 lg:px-8"
      aria-labelledby="features-heading"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2
            id="features-heading"
            className="font-display text-4xl md:text-5xl font-bold text-primary mb-4"
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-accent">New Era</span> Highlights
          </motion.h2>
          <p className="text-secondary text-lg max-w-2xl mx-auto">
            Nova generacija The Drinkers – Domen Kolenc, originalna jedra in prvi koncert 2026.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {NEW_ERA_HIGHLIGHTS.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              size={feature.size}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
