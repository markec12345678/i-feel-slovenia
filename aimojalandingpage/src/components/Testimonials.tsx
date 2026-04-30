import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { testimonials } from '../data/sloveniaData';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  const t = testimonials[current];
  if (!t) return null;

  return (
    <section id="testimonials" className="py-24 relative" aria-label="Mnenja obiskovalcev">
      <div className="absolute inset-0 bg-mesh opacity-30" aria-hidden="true" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 30 }}
          animate={titleVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-slovenia-gold tracking-widest uppercase">
            Mnenja
          </span>
          <h2 className="text-4xl sm:text-5xl font-black mt-3 mb-4">
            <span className="text-white">Kaj pravijo </span>
            <span className="text-gradient-gold">obiskovalci</span>
          </h2>
        </motion.div>

        <div className="relative glass rounded-3xl p-8 sm:p-12 min-h-[280px] flex flex-col justify-center">
          <Quote className="absolute top-6 left-6 text-slovenia-green/20" size={48} aria-hidden="true" />

          <AnimatePresence mode="wait">
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <div className="flex justify-center gap-1 mb-6" aria-label={`Ocena ${t.rating} od 5 zvezdic`}>
                {Array.from({ length: t.rating }, (_, i) => (
                  <Star key={i} size={18} className="fill-slovenia-gold text-slovenia-gold" aria-hidden="true" />
                ))}
              </div>

              <blockquote className="text-lg sm:text-xl text-white/80 leading-relaxed mb-8 italic">
                &ldquo;{t.text}&rdquo;
              </blockquote>

              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slovenia-green to-slovenia-lake flex items-center justify-center text-white font-bold text-sm">
                  {t.avatar}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-white">{t.name}</div>
                  <div className="text-sm text-white/40">{t.country} • {t.destination}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="p-2 glass rounded-full hover:bg-white/10 transition-colors"
              aria-label="Prejšnje mnenje"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === current ? 'bg-slovenia-green w-6' : 'bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Mnenje ${i + 1}`}
                  aria-current={i === current ? 'true' : undefined}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="p-2 glass rounded-full hover:bg-white/10 transition-colors"
              aria-label="Naslednje mnenje"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
