export type TicketStatus = 'available' | 'sold-out' | 'limited';

export interface TourDate {
  id: string;
  date: string; // ISO 8601 format
  city: string;
  venue: string;
  country: string;
  status: TicketStatus;
  ticketUrl: string;
}
