import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { MEDIA_GALLERY } from '@/data/mediaGallery';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export const MediaSection: React.FC = () => {
  const [activeMedia, setActiveMedia] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  const activeItem = MEDIA_GALLERY.find(item => item.id === activeMedia);
  const shouldAnimate = !prefersReducedMotion;

  const openMedia = useCallback((id: string) => setActiveMedia(id), []);
  const closeMedia = useCallback(() => {
    setActiveMedia(null);
    // Stop YouTube video on close
    const iframe = document.querySelector('iframe');
    if (iframe) {
      const src = iframe.src;
      iframe.src = src; // Reset video
    }
  }, []);

  const navigateMedia = useCallback((direction: 'prev' | 'next') => {
    const newIndex = direction === 'next' 
      ? (currentIndex + 1) % MEDIA_GALLERY.length
      : (currentIndex - 1 + MEDIA_GALLERY.length) % MEDIA_GALLERY.length;
    setCurrentIndex(newIndex);
    setActiveMedia(MEDIA_GALLERY[newIndex].id);
  }, [currentIndex]);

  // Keyboard navigation for lightbox
  React.useEffect(() => {
    if (!activeMedia) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMedia();
      if (e.key === 'ArrowLeft') navigateMedia('prev');
      if (e.key === 'ArrowRight') navigateMedia('next');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeMedia, closeMedia, navigateMedia]);

  return (
    <section id="media" className="py-20 px-4 bg-surface/30" aria-labelledby="media-heading">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          id="media-heading"
          className="font-display text-4xl md:text-5xl font-bold text-center mb-4 text-primary"
          initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-accent">Galerija</span> & Videi
        </motion.h2>
        <p className="font-body text-secondary text-center mb-12 max-w-2xl mx-auto">
          Doživi The Drinkers skozi arhivske posnetke, koncertne fotke in glasbene videe.
        </p>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MEDIA_GALLERY.map((item, index) => (
            <motion.button
              key={item.id}
              onClick={() => { setCurrentIndex(index); openMedia(item.id); }}
              className="relative group aspect-video rounded-xl overflow-hidden bg-background border border-white/10 hover:border-accent/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              aria-label={`Odpri: ${item.title}`}
            >
              {/* Thumbnail */}
              <img
                src={item.thumbnail}
                alt=""
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                loading="lazy"
                aria-hidden="true"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <p className="font-body text-primary font-semibold text-left">{item.title}</p>
                {item.year && <p className="font-body text-secondary text-sm">{item.year}</p>}
                {item.type === 'video' && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-accent/90 flex items-center justify-center">
                    <Play className="w-6 h-6 text-white ml-1" aria-hidden="true" />
                  </div>
                )}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {activeItem && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95"
              role="dialog"
              aria-modal="true"
              aria-label={activeItem.title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMedia}
            >
              {/* Close button */}
              <button
                onClick={closeMedia}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                aria-label="Zapri galerijo"
              >
                <X className="w-6 h-6" aria-hidden="true" />
              </button>

              {/* Navigation */}
              <button
                onClick={(e) => { e.stopPropagation(); navigateMedia('prev'); }}
                className="absolute left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                aria-label="Prejšnji medij"
              >
                <ChevronLeft className="w-6 h-6" aria-hidden="true" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); navigateMedia('next'); }}
                className="absolute right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                aria-label="Naslednji medij"
              >
                <ChevronRight className="w-6 h-6" aria-hidden="true" />
              </button>

              {/* Content */}
              <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
                {activeItem.type === 'video' ? (
                  <div className="aspect-video rounded-xl overflow-hidden bg-black">
                    <iframe
                      src={`${activeItem.src}?autoplay=1&rel=0`}
                      title={activeItem.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <img
                    src={activeItem.src}
                    alt={activeItem.alt}
                    className="w-full max-h-[80vh] object-contain rounded-xl"
                    loading="eager"
                  />
                )}
                
                {/* Caption */}
                <div className="mt-4 text-center">
                  <h3 className="font-display text-xl text-primary">{activeItem.title}</h3>
                  {activeItem.description && (
                    <p className="font-body text-secondary mt-1">{activeItem.description}</p>
                  )}
                  {activeItem.year && (
                    <p className="font-body text-accent text-sm mt-1">{activeItem.year}</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
