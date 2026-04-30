import { useState } from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { Send, Calendar, Users, Heart } from 'lucide-react';

export default function PlanTrip() {
  const { ref, isVisible } = useScrollAnimation();
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [interest, setInterest] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <section id="plan" className="py-24 relative" aria-label="Načrtuj potovanje">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slovenia-lake/5 to-transparent" aria-hidden="true" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="glass rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-slovenia-green via-slovenia-lake to-slovenia-gold" aria-hidden="true" />

          <span className="text-4xl block mb-4" aria-hidden="true">🎒</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
            Pripravljeni na <span className="text-gradient-green">avanturo</span>?
          </h2>
          <p className="text-white/50 mb-8 max-w-lg mx-auto">
            Prijavite se na naš newsletter in prejmite brezplačen vodnik po Sloveniji + ekskluzivne ponudbe.
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-8"
            >
              <Heart className="mx-auto mb-4 text-slovenia-green" size={48} aria-hidden="true" />
              <h3 className="text-2xl font-bold text-white mb-2">Hvala! 🎉</h3>
              <p className="text-white/60">Vodnik po Sloveniji je na poti v vaš nabiralnik.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <label htmlFor="email" className="sr-only">E-poštni naslov</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vaš@email.si"
                  className="flex-1 px-5 py-3.5 bg-white/5 border border-white/10 rounded-full text-white placeholder-white/30 focus:outline-none focus:border-slovenia-green focus:ring-1 focus:ring-slovenia-green transition-all"
                />
                <button
                  type="submit"
                  className="px-6 py-3.5 bg-slovenia-green hover:bg-green-600 text-white font-bold rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-green-500/25 hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Send size={16} aria-hidden="true" />
                  Pošlji
                </button>
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                {['Planinjenje', 'Kolesarjenje', 'Kulinarika', 'Wellness', 'Kultura'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setInterest(tag === interest ? '' : tag)}
                    className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                      interest === tag
                        ? 'bg-slovenia-green text-white'
                        : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-center gap-6 pt-4 text-white/30 text-sm">
                <span className="flex items-center gap-1"><Calendar size={14} aria-hidden="true" /> 2025 sezona</span>
                <span className="flex items-center gap-1"><Users size={14} aria-hidden="true" /> 5.2M+ obiskovalcev</span>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
