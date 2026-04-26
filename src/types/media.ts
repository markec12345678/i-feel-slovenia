export type MediaType = 'video' | 'image';

export interface MediaItem {
  id: string;
  type: MediaType;
  title: string;
  description?: string;
  src: string; // YouTube URL za video, /images/ za slike
  thumbnail: string; // WebP thumbnail za lazy loading
  alt: string;
  year?: number;
}
