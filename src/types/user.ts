export interface User {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  interests: string[] | null
  location_lat: number | null
  location_lng: number | null
  created_at: string
  updated_at: string
}

export interface UserProfile extends User {
  // Additional profile-specific fields
  phone?: string
  date_of_birth?: string
  preferences?: UserPreferences
}

export interface UserPreferences {
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
  }
  privacy: {
    profile_visible: boolean
    location_sharing: boolean
  }
  interests: string[]
}

export interface Business {
  id: string
  owner_id: string
  name: string
  description: string | null
  business_type: string
  created_at: string
}

export interface Booking {
  id: string
  user_id: string
  event_id: string
  quantity: number
  total_amount: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  stripe_payment_intent_id: string | null
  qr_code: string
  created_at: string
  event?: Event
}

export interface CheckIn {
  id: string
  booking_id: string
  checked_in_at: string
  checked_in_by: string
} 