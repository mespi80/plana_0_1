import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Database types will be generated from Supabase
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
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
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          interests?: string[] | null
          location_lat?: number | null
          location_lng?: number | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          interests?: string[] | null
          location_lat?: number | null
          location_lng?: number | null
        }
      }
      venues: {
        Row: {
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
        Insert: {
          id?: string
          business_id?: string | null
          name: string
          description?: string | null
          address: string
          lat: number
          lng: number
          category: string
          images?: string[] | null
        }
        Update: {
          id?: string
          business_id?: string | null
          name?: string
          description?: string | null
          address?: string
          lat?: number
          lng?: number
          category?: string
          images?: string[] | null
        }
      }
      events: {
        Row: {
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
        }
        Insert: {
          id?: string
          venue_id: string
          title: string
          description?: string | null
          start_time: string
          end_time: string
          price: number
          capacity: number
          available_tickets: number
          category: string
          is_active?: boolean
        }
        Update: {
          id?: string
          venue_id?: string
          title?: string
          description?: string | null
          start_time?: string
          end_time?: string
          price?: number
          capacity?: number
          available_tickets?: number
          category?: string
          is_active?: boolean
        }
      }
      bookings: {
        Row: {
          id: string
          user_id: string
          event_id: string
          quantity: number
          total_amount: number
          status: string
          stripe_payment_intent_id: string | null
          qr_code: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          event_id: string
          quantity: number
          total_amount: number
          status?: string
          stripe_payment_intent_id?: string | null
          qr_code: string
        }
        Update: {
          id?: string
          user_id?: string
          event_id?: string
          quantity?: number
          total_amount?: number
          status?: string
          stripe_payment_intent_id?: string | null
          qr_code?: string
        }
      }
      businesses: {
        Row: {
          id: string
          owner_id: string
          name: string
          description: string | null
          business_type: string
          created_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          description?: string | null
          business_type: string
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          description?: string | null
          business_type?: string
        }
      }
    }
  }
} 