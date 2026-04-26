import React from 'react';
import { motion } from 'framer-motion';
import { Mic, Guitar, Piano, Music as MusicIcon, Drum } from 'lucide-react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface BandMember {
  name: string;
  role: string;
  icon: React.ComponentType<{ className?: string }>;
  isOriginal?: boolean;
  note?: string;
}

const BAND_MEMBERS: BandMember[] = [
  {
    name: 'Domen Kolenc',
    role: 'Vokal',
    icon: Mic,
    note: 'Nova generacija'
  },
  {
    name: 'Robert Likar',
    role: 'Kitara',
    icon: Guitar,
    isOriginal: true,
    note: 'Originalni član (od 1993)'
  },
  {
    name: 'Primož Trebec',
    role: 'Klaviature',
    icon: Piano,
    isOriginal: true,
    note: 'Originalni član'
  },
  {
    name: 'Kristian Buovski',
    role: 'Bas',
    icon: MusicIcon,
    note: 'Zamenjava za Mira Mutvarja'
  },
  {
    name: 'Janez Grošelj',
    role: 'Bobni',
    icon: Drum,
    note: 'Zamenjava za Andreja Žiberta'
  }
];

export const BandMembersSection: React.FC = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const shouldAnimate = !prefersReducedMotion;

  return (
    <section 
      id="band" 
      className="py-20 px-4 bg-surface/30" 
      aria-labelledby="band-heading"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
          whileInView={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 
            id="band-heading"
            className="font-display text-4xl md:text-5xl font-bold text-primary mb-4"
          >
            <span className="text-accent">Nova</span> Zasedba
          </h2>
          <p className="text-secondary text-lg max-w-2xl mx-auto">
            Domen Kolenc nadaljuje očetovo zapuščino z originalnima članoma Robertom Likarjem in Primožem Trebcem.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {BAND_MEMBERS.map((member, index) => {
            const Icon = member.icon;
            return (
              <motion.article
                key={member.name}
                className="bg-surface border border-white/10 rounded-xl p-6 text-center hover:border-accent/30 transition-colors"
                initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
                whileInView={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="flex justify-center mb-4">
                  <div className={`p-3 rounded-full ${member.isOriginal ? 'bg-accent/20' : 'bg-white/5'}`}>
                    <Icon className={`w-6 h-6 ${member.isOriginal ? 'text-accent' : 'text-secondary'}`} aria-hidden="true" />
                  </div>
                </div>
                <h3 className="font-display text-xl font-bold text-primary mb-1">
                  {member.name}
                </h3>
                <p className="text-accent text-sm font-medium mb-2">
                  {member.role}
                </p>
                {member.isOriginal && (
                  <span className="inline-block px-2 py-1 bg-accent/10 text-accent text-xs rounded-full mb-2">
                    ✅ Original
                  </span>
                )}
                {member.note && (
                  <p className="text-secondary/60 text-xs">
                    {member.note}
                  </p>
                )}
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
