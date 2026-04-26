import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AudioPlayer } from '@/components/molecules/AudioPlayer';
import { AUDIO_TRACKS } from '@/data/audioTracks';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export const AudioPreviewSection: React.FC = () => {
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const shouldAnimate = !prefersReducedMotion;

  const handlePlay = (id: string) => setActiveTrackId(id);
  const handlePause = () => setActiveTrackId(null);

  return (
    <section id="music" className="py-20 px-4 bg-surface/30" aria-labelledby="music-heading">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          id="music-heading"
          className="font-display text-4xl md:text-5xl font-bold text-center mb-4 text-primary"
          initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-accent">Poslušaj</span> Hite
        </motion.h2>
        <p className="font-body text-secondary text-center mb-12 max-w-2xl mx-auto">
          30-sekundni previewi kultnih pesmi The Drinkers. Doživi drink'n'roll zvok.
        </p>

        <div className="grid gap-4">
          {AUDIO_TRACKS.map((track, index) => (
            <motion.div
              key={track.id}
              initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <AudioPlayer
                track={track}
                isActive={activeTrackId === track.id}
                onPlay={() => handlePlay(track.id)}
                onPause={handlePause}
              />
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div 
          className="mt-10 text-center"
          initial={shouldAnimate ? { opacity: 0 } : { opacity: 1 }}
          animate={shouldAnimate ? { opacity: 1, transition: { delay: 0.3 } } : { opacity: 1 }}
        >
          <p className="font-body text-secondary mb-4">
            Želiš slišati več? Celotna diskografija je na voljo na streaming platformah.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="https://open.spotify.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#1DB954] hover:bg-[#1ed760] text-white font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1DB954]"
            >
              <span>Spotify</span>
            </a>
            <a
              href="https://music.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#FF0000] hover:bg-[#ff1a1a] text-white font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF0000]"
            >
              <span>YouTube Music</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
