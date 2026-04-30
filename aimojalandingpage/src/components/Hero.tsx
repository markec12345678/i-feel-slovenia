import { motion } from 'framer-motion';
import { useParallax, useMousePosition } from '../hooks/useScrollAnimation';
import { ChevronDown, MapPin, Star } from 'lucide-react';
import VideoBackground from './VideoBackground';

export default function Hero() {
  const scrollY = useParallax();
  const mouse = useMousePosition();

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label="Hero - Odkrijte Slovenijo"
    >
      <VideoBackground />
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 bg-mesh" />

      <div
        className="absolute top-1/4 -left-32 w-96 h-96 bg-slovenia-green/20 rounded-full blur-3xl animate-float"
        style={{ transform: `translateY(${scrollY * 0.1}px) translate(${mouse.x * 15}px, ${mouse.y * 15}px)` }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/4 -right-32 w-96 h-96 bg-slovenia-lake/15 rounded-full blur-3xl animate-float-slow"
        style={{ transform: `translateY(${scrollY * -0.15}px) translate(${mouse.x * -10}px, ${mouse.y * -10}px)` }}
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-slovenia-gold/5 rounded-full blur-3xl animate-pulse-glow"
        aria-hidden="true"
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm text-white/80 mb-8">
            <MapPin size={14} className="text-slovenia-green" aria-hidden="true" />
            Srce Evrope • Zelena • Varna • Avtentična
          </span>
        </motion.div>

        <motion.h1
          className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight leading-[0.9] mb-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <span className="block text-white">I FEEL</span>
          <span className="block text-gradient-green">SLOVENIJA</span>
        </motion.h1>

        <motion.p
          className="max-w-2xl mx-auto text-lg sm:text-xl text-white/60 mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Dežela čudovitih jezer, alpskih vrhov in skritih jam.
          <br className="hidden sm:block" />
          <span className="text-gradient-gold font-semibold"> Vaša naslednja nepozabna avantura.</span>
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <a
            href="#destinations"
            className="group px-8 py-4 bg-slovenia-green hover:bg-green-600 text-white font-bold rounded-full text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/30 hover:scale-105 flex items-center gap-2"
          >
            Razišči destinacije
            <ChevronDown size={20} className="group-hover:translate-y-1 transition-transform" aria-hidden="true" />
          </a>
          <a
            href="#plan"
            className="px-8 py-4 glass hover:bg-white/10 text-white font-semibold rounded-full text-lg transition-all duration-300 hover:scale-105"
          >
            Načrtuj potovanje ✨
          </a>
        </motion.div>

        {/* Floating badges */}
        <motion.div
          className="mt-16 flex flex-wrap items-center justify-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          {['🏔️ Julijske Alpe', '🌊 Soča', '🏰 Ljubljana', '🦎 Postojna', '🌅 Piran'].map((badge) => (
            <span
              key={badge}
              className="px-4 py-2 glass rounded-full text-sm text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300 cursor-default"
            >
              {badge}
            </span>
          ))}
        </motion.div>

        {/* Rating */}
        <motion.div
          className="mt-8 flex items-center justify-center gap-2 text-white/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <div className="flex gap-0.5" aria-label="Ocena 5 od 5 zvezdic">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} size={14} className="fill-slovenia-gold text-slovenia-gold" aria-hidden="true" />
            ))}
          </div>
          <span className="text-sm">5.2M+ obiskovalcev letno</span>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        aria-hidden="true"
      >
        <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2">
          <div className="w-1 h-3 bg-white/40 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}
