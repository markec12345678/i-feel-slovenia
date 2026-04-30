import { motion } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { experiences } from '../data/sloveniaData';

function ExperienceCard({ exp, index }: { exp: typeof experiences[0]; index: number }) {
  const { ref, isVisible } = useScrollAnimation(0.15);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isVisible ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group relative p-6 rounded-2xl glass hover-lift overflow-hidden"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${exp.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} aria-hidden="true" />
      <div className="relative z-10">
        <span className="text-4xl block mb-4" aria-hidden="true">{exp.icon}</span>
        <h3 className="text-lg font-bold text-white mb-2">{exp.title}</h3>
        <p className="text-sm text-white/50 leading-relaxed">{exp.description}</p>
      </div>
    </motion.div>
  );
}

export default function Experiences() {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();

  return (
    <section id="experiences" className="py-24 relative" aria-label="Izkušnje">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 30 }}
          animate={titleVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-slovenia-gold tracking-widest uppercase">
            Izkušnje
          </span>
          <h2 className="text-4xl sm:text-5xl font-black mt-3 mb-4">
            <span className="text-white">Doživite </span>
            <span className="text-gradient-gold">Slovenijo</span>
          </h2>
          <p className="max-w-xl mx-auto text-white/50">
            Aktivne počitnice, kulinarične raziskave ali sprostitev — izberite svoj slog.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {experiences.map((exp, i) => (
            <ExperienceCard key={exp.id} exp={exp} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
