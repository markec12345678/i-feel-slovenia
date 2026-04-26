import { AudioTrack } from '@/types/audio';

export const AUDIO_TRACKS: AudioTrack[] = [
  {
    id: 'jagri',
    title: 'Deset majhnih jagrov',
    album: 'Žeja',
    year: 1997,
    duration: 213, // 3:33
    src: '/audio/jagri-preview.mp3', // 30s preview
    coverArt: '/hero-band.jpg', // Placeholder - zamenjaj z dejanskim cover art
    previewStart: 0
  },
  {
    id: 'zea',
    title: 'Žeja',
    album: 'Žeja',
    year: 1997,
    duration: 198,
    src: '/audio/zea-preview.mp3',
    coverArt: '/hero-band.jpg',
    previewStart: 15
  },
  {
    id: 'pivolucija',
    title: 'Pivolucija',
    album: 'Pivolucija',
    year: 1999,
    duration: 205,
    src: '/audio/pivolucija-preview.mp3',
    coverArt: '/hero-band.jpg',
    previewStart: 0
  }
];
