export interface Event {
  id: string
  venue_id: string
  title: string
  description: string | null
  start_time: string
  end_time: string
  price: number
  capacity: number
  available_tickets: number
  category: string
  is_active: boolean
  created_at: string
  venue: Venue
}

export interface Venue {
  id: string
  business_id: string | null
  name: string
  description: string | null
  address: string
  lat: number
  lng: number
  category: string
  images: string[] | null
  created_at: string
}

export interface EventWithVenue extends Event {
  venue: Venue
}

export interface EventFilters {
  category?: string
  priceMin?: number
  priceMax?: number
  date?: string
  location?: {
    lat: number
    lng: number
    radius: number
  }
}

export interface EventSearchParams {
  q?: string
  category?: string
  price_range?: string
  date?: string
  lat?: number
  lng?: number
  radius?: number
} 