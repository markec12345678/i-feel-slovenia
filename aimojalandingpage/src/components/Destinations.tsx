import { motion } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { destinations } from '../data/sloveniaData';
import { MapPin, ArrowRight, Leaf } from 'lucide-react';

function DestinationCard({ dest, index }: { dest: typeof destinations[0]; index: number }) {
  const { ref, isVisible } = useScrollAnimation(0.15);

  const getBadgeColor = (level?: string) => {
    switch (level) {
      case 'gold': return 'from-yellow-500 to-amber-600';
      case 'silver': return 'from-gray-400 to-gray-500';
      case 'bronze': return 'from-orange-400 to-orange-600';
      default: return 'from-green-500 to-emerald-600';
    }
  };

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative overflow-hidden rounded-2xl glass hover-lift cursor-pointer"
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={dest.image}
          alt={dest.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <span className="absolute top-4 left-4 text-3xl" aria-hidden="true">{dest.icon}</span>
        {dest.greenScheme && (
          <div className={`absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r ${getBadgeColor(dest.sustainabilityLevel)} text-white text-xs font-semibold`}>
            <Leaf size={12} />
            <span>{dest.sustainabilityLevel?.toUpperCase()}</span>
          </div>
        )}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-white mb-1">{dest.name}</h3>
          <p className="text-sm text-white/70 flex items-center gap-1">
            <MapPin size={12} aria-hidden="true" /> {dest.tagline}
          </p>
        </div>
      </div>

      <div className="p-5">
        <p className="text-sm text-white/60 leading-relaxed mb-4">{dest.description}</p>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {dest.stats.map((stat) => (
            <div key={stat.label} className="text-center p-2 rounded-lg bg-white/5">
              <div className="text-sm font-bold text-gradient-green">{stat.value}</div>
              <div className="text-[10px] text-white/40 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
        <span className="inline-flex items-center gap-2 text-sm font-medium text-slovenia-green group-hover:gap-3 transition-all duration-300">
          Razišči več <ArrowRight size={14} aria-hidden="true" />
        </span>
      </div>
    </motion.article>
  );
}

export default function Destinations() {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();

  return (
    <section id="destinations" className="py-24 relative" aria-label="Destinacije">
      <div className="absolute inset-0 bg-mesh opacity-50" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 30 }}
          animate={titleVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-slovenia-green tracking-widest uppercase">
            Destinacije
          </span>
          <h2 className="text-4xl sm:text-5xl font-black mt-3 mb-4">
            <span className="text-white">Odkrijte </span>
            <span className="text-gradient-green">čudeže narave</span>
          </h2>
          <p className="max-w-xl mx-auto text-white/50">
            Od alpskih vrhov do jadranske obale — vsak kotiček Slovenije diši po avanturi.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest, i) => (
            <DestinationCard key={dest.id} dest={dest} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
