import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, MapPin, Calendar } from 'lucide-react';
import { TourFilter } from '@/components/molecules/TourFilter';
import { TourStatusBadge } from '@/components/molecules/TourStatusBadge';
import { MOCK_TOUR_DATES } from '@/data/mockTourDates';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export const TourDatesSection: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const prefersReducedMotion = usePrefersReducedMotion();

  // Optimizirano filtriranje/sortiranje (prepreči nepotrebne re-rendere)
  const filteredDates = useMemo(() => {
    let data = [...MOCK_TOUR_DATES].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (search.trim()) {
      const lower = search.toLowerCase();
      data = data.filter(d => d.city.toLowerCase().includes(lower) || d.venue.toLowerCase().includes(lower));
    }

    if (filterStatus !== 'all') {
      data = data.filter(d => d.status === filterStatus);
    }

    return data;
  }, [search, filterStatus]);

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('sl-SI', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <section id="tour" className="py-20 px-4" aria-labelledby="tour-heading">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          id="tour-heading"
          className="font-display text-4xl md:text-5xl font-bold text-center mb-4 text-primary"
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Turnejski <span className="text-accent">Datumi</span>
        </motion.h2>
        <p className="text-secondary text-center mb-10 max-w-xl mx-auto">Ujemi nas v živo. Preveri razpoložljivost in si zagotovi vstopnice.</p>

        <TourFilter search={search} setSearch={setSearch} filterStatus={filterStatus} setFilterStatus={setFilterStatus} />

        {/* Screen reader announcement za filtriranje */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          Prikazanih {filteredDates.length} dogodkov.
        </div>

        {/* Desktop Table (lg+) */}
        <div className="hidden lg:block w-full overflow-hidden rounded-xl border border-white/10 bg-surface/50">
          <table className="w-full text-left border-collapse">
            <caption className="sr-only">Seznam prihajajočih koncertov z datumi, lokacijami in statusom vstopnic</caption>
            <thead className="bg-surface/80 text-secondary uppercase text-xs tracking-wider border-b border-white/10">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold">Datum</th>
                <th scope="col" className="px-6 py-4 font-semibold">Prizorišče</th>
                <th scope="col" className="px-6 py-4 font-semibold">Mesto</th>
                <th scope="col" className="px-6 py-4 font-semibold">Status</th>
                <th scope="col" className="px-6 py-4 font-semibold text-right">Vstopnice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredDates.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-secondary">Ni najdenih dogodkov za izbrane filtre.</td></tr>
              ) : (
                filteredDates.map((tour) => (
                  <motion.tr
                    key={tour.id}
                    className="hover:bg-white/5 transition-colors"
                    initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-primary font-medium">{formatDate(tour.date)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-secondary">{tour.venue}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-secondary flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-accent/70" aria-hidden="true" />
                      {tour.city}, {tour.country}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap"><TourStatusBadge status={tour.status} /></td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <a
                        href={tour.ticketUrl}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                          tour.status === 'sold-out'
                            ? 'bg-white/5 text-secondary/50 cursor-not-allowed'
                            : 'bg-accent hover:bg-accent-hover text-white hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent'
                        }`}
                        aria-disabled={tour.status === 'sold-out' ? 'true' : 'false'}
                        tabIndex={tour.status === 'sold-out' ? -1 : 0}
                      >
                        {tour.status === 'sold-out' ? 'Razprodano' : 'Kupi vstopnico'}
                        {tour.status !== 'sold-out' && <ExternalLink className="w-4 h-4" aria-hidden="true" />}
                      </a>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile/Tablet Cards (<lg) */}
        <div className="lg:hidden grid gap-4 sm:grid-cols-2">
          {filteredDates.length === 0 ? (
            <div className="col-span-full text-center py-12 text-secondary">Ni najdenih dogodkov.</div>
          ) : (
            filteredDates.map((tour) => (
              <motion.div
                key={tour.id}
                className="p-5 rounded-xl bg-surface/50 border border-white/10 hover:border-accent/30 transition-colors"
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2 text-sm text-secondary">
                    <Calendar className="w-4 h-4 text-accent" aria-hidden="true" />
                    <time dateTime={tour.date}>{formatDate(tour.date)}</time>
                  </div>
                  <TourStatusBadge status={tour.status} />
                </div>
                <h3 className="text-lg font-semibold text-primary mb-1">{tour.venue}</h3>
                <p className="text-secondary text-sm mb-4 flex items-center gap-1">
                  <MapPin className="w-4 h-4" aria-hidden="true" />
                  {tour.city}, {tour.country}
                </p>
                <a
                  href={tour.ticketUrl}
                  className={`w-full inline-flex justify-center items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    tour.status === 'sold-out'
                      ? 'bg-white/5 text-secondary/50 cursor-not-allowed'
                      : 'bg-accent hover:bg-accent-hover text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent'
                  }`}
                  aria-disabled={tour.status === 'sold-out' ? 'true' : 'false'}
                  tabIndex={tour.status === 'sold-out' ? -1 : 0}
                >
                  {tour.status === 'sold-out' ? 'Razprodano' : 'Kupi vstopnico'}
                  {tour.status !== 'sold-out' && <ExternalLink className="w-4 h-4" aria-hidden="true" />}
                </a>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
