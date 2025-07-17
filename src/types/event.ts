export interface Event {
  id: string;
  title: string;
  price: number;
  location: {
    lat: number;
    lng: number;
  };
  venue: string;
  startTime: string;
  endTime: string;
  category: string;
  image?: string;
  description?: string;
  availableTickets?: number;
  capacity?: number;
  organizer?: string;
  tags?: string[];
  rating?: number;
  reviewCount?: number;
} 