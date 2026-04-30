import { motion } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { stats } from '../data/sloveniaData';

function StatItem({ stat, index }: { stat: typeof stats[0]; index: number }) {
  const { ref, isVisible } = useScrollAnimation(0.2);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="text-center p-6"
    >
      <span className="text-3xl block mb-2" aria-hidden="true">{stat.icon}</span>
      <div className="text-3xl sm:text-4xl font-black text-gradient-green mb-1">{stat.value}</div>
      <div className="text-sm text-white/50">{stat.label}</div>
    </motion.div>
  );
}

export default function Stats() {
  return (
    <section id="stats" className="py-20 relative" aria-label="Statistike">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slovenia-green/5 to-transparent" aria-hidden="true" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass rounded-3xl p-8">
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-white mb-2">
            Slovenija v <span className="text-gradient-green">številkah</span>
          </h2>
          <p className="text-center text-white/40 text-sm mb-8">Podatki, ki govorijo zase</p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {stats.map((stat, i) => (
              <StatItem key={stat.label} stat={stat} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
