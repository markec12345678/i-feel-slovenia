import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { AudioTrack } from '@/types/audio';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface AudioPlayerProps {
  track: AudioTrack;
  isActive: boolean;
  onPlay: () => void;
  onPause: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  track, 
  isActive, 
  onPlay, 
  onPause 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(track.duration);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Format time: seconds → MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle play/pause
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (isActive && isPlaying) {
      audioRef.current.play().catch(err => {
        console.error('Playback failed:', err);
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isActive, isPlaying]);

  // Handle time update
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration || track.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      onPause();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [onPause]);

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      onPause();
    } else {
      setIsPlaying(true);
      onPlay();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
      setIsMuted(vol === 0);
    }
  };

  const progress = (currentTime / duration) * 100;

  return (
    <div className="w-full p-4 rounded-xl bg-surface/50 border border-white/10 hover:border-accent/30 transition-colors">
      <audio
        ref={audioRef}
        src={track.src}
        preload="metadata"
        aria-label={`Audio player za ${track.title}`}
      />
      
      {/* Cover Art + Controls */}
      <div className="flex items-center gap-4 mb-3">
        {/* Album Cover */}
        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-background flex-shrink-0">
          <img
            src={track.coverArt}
            alt={`Album cover za ${track.album}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {isPlaying && !prefersReducedMotion && (
            <div className="absolute inset-0 bg-accent/20 animate-pulse" aria-hidden="true" />
          )}
        </div>

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-display text-primary font-semibold truncate">{track.title}</h4>
          <p className="font-body text-secondary text-sm">{track.album} • {track.year}</p>
        </div>

        {/* Play/Pause Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-accent hover:bg-accent-hover text-white flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            aria-label={isPlaying ? 'Pavziraj' : 'Predvajaj'}
            aria-pressed={isPlaying ? 'true' : 'false'}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isPlaying ? (
                <motion.div
                  key="pause"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Pause className="w-5 h-5" aria-hidden="true" />
                </motion.div>
              ) : (
                <motion.div
                  key="play"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Play className="w-5 h-5 ml-0.5" aria-hidden="true" />
                </motion.div>
              )}
            </AnimatePresence>

        {/* Audio Visualizer */}
        {isPlaying && !prefersReducedMotion && (
          <div className="flex items-end gap-[2px] h-4 ml-2" aria-hidden="true">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-accent rounded-full animate-bounce"
                style={{
                  height: '100%',
                  animationDuration: `${0.4 + i * 0.1}s`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
        )}
          </button>

          {/* Audio Visualizer */}
          {isPlaying && !prefersReducedMotion && (
            <div className="flex items-end gap-[2px] h-4" aria-hidden="true">
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-accent rounded-full"
                  animate={{
                    height: ['30%', '100%', '50%', '80%', '40%'][i % 5]
                  }}
                  transition={{
                    duration: 0.4,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: i * 0.1
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <input
          type="range"
          min={0}
          max={duration}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1.5 rounded-full bg-white/10 appearance-none cursor-pointer accent-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          style={{
            backgroundImage: `linear-gradient(to right, #c41e3a 0%, #c41e3a ${progress}%, rgba(255,255,255,0.1) ${progress}%, rgba(255,255,255,0.1) 100%)` 
          }}
          aria-label="Napredek predvajanja"
          aria-valuenow={currentTime}
          aria-valuemax={duration}
        />
        <div className="flex justify-between mt-1 text-xs text-secondary">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleMute}
          className="p-1.5 rounded hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          aria-label={isMuted ? 'Vklopi zvok' : 'Izklopi zvok'}
        >
          {isMuted || volume === 0 ? (
            <VolumeX className="w-4 h-4 text-secondary" aria-hidden="true" />
          ) : (
            <Volume2 className="w-4 h-4 text-secondary" aria-hidden="true" />
          )}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="flex-1 h-1 rounded-full bg-white/10 appearance-none cursor-pointer accent-secondary"
          style={{
            backgroundImage: `linear-gradient(to right, #a89f91 0%, #a89f91 ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.1) ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.1) 100%)` 
          }}
          aria-label="Glasnost"
        />
      </div>
    </div>
  );
};
