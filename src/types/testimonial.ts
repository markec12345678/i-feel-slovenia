export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  location?: string;
  avatar?: string; // WebP, optional
  year?: number; // Kdaj je bil koncert/dogodek
  rating?: number; // 1-5, optional
}
