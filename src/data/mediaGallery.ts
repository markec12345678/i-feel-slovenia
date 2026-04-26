import { MediaItem } from '@/types/media';

export const MEDIA_GALLERY: MediaItem[] = [
  {
    id: 'video-jagri',
    type: 'video',
    title: 'Deset majhnih jagrov',
    description: 'Uradni videospot (1997) – kultni hit The Drinkers',
    src: 'https://www.youtube.com/embed/VIDEO_ID', // Zamenjaj z dejanskim ID-jem
    thumbnail: '/hero-band.jpg', // Placeholder - zamenjaj z dejanskim thumbnail
    alt: 'The Drinkers - Deset majhnih jagrov videospot',
    year: 1997
  },
  {
    id: 'video-zija',
    type: 'video',
    title: 'Žeja (Live Trbovlje 2003)',
    description: 'Legendarni nastop ob 10-letnici',
    src: 'https://www.youtube.com/embed/VIDEO_ID',
    thumbnail: '/hero-band.jpg',
    alt: 'The Drinkers live v Trbovljah 2003',
    year: 2003
  },
  {
    id: 'img-koli',
    type: 'image',
    title: 'Sandi Kolenc-Koli',
    description: 'Legendarni frontman (1965–2017)',
    src: '/hero-band.jpg',
    thumbnail: '/hero-band.jpg',
    alt: 'Sandi Kolenc-Koli na odru',
    year: 2000
  },
  {
    id: 'img-2026',
    type: 'image',
    title: 'Nova generacija 2026',
    description: 'Domen Kolenc z originalnimi člani',
    src: '/hero-band.jpg',
    thumbnail: '/hero-band.jpg',
    alt: 'The Drinkers nova zasedba 2026',
    year: 2026
  }
];
