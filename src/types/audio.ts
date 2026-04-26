export interface AudioTrack {
  id: string;
  title: string;
  album: string;
  year: number;
  duration: number; // v sekundah
  src: string; // URL do MP3/WebM
  coverArt: string; // WebP thumbnail
  previewStart?: number; // Začni na tem timestampu (za 30s preview)
}
