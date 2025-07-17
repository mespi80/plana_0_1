import { createClient } from '@supabase/supabase-js'
import { writeFileSync } from 'fs'
import { join } from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function generateTypes() {
  try {
    const { data, error } = await supabase.rpc('get_schema')
    
    if (error) {
      console.error('Error fetching schema:', error)
      process.exit(1)
    }

    const typesContent = `// This file is auto-generated. Do not edit manually.
// Runnpmrun generate-types to regenerate.

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
          price: number | null
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
          price?: number | null
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
          price?: number | null
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
      check_ins: {
        Row: {
          id: string
          booking_id: string
          checked_in_at: string
          checked_in_by: string
        }
        Insert: {
          id?: string
          booking_id: string
          checked_in_at?: string
          checked_in_by: string
        }
        Update: {
          id?: string
          booking_id?: string
          checked_in_at?: string
          checked_in_by?: string
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          event_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          event_id: string
        }
        Update: {
          id?: string
          user_id?: string
          event_id?: string
        }
      }
    }
    Views: {
      [key: string]: never
    }
    Functions: {
      [key: string]: never
    }
    Enums: {
      [key: string]: never
    }
  }
}
`

    const outputPath = join(__dirname, '..', 'src', 'types', 'database.ts')
    writeFileSync(outputPath, typesContent)
    
    console.log('✅ Database types generated successfully!')
    console.log(`📁 Output: ${outputPath}`)
  } catch (error) {
    console.error('❌ Error generating types:', error)
    process.exit(1)
  }
}

generateTypes() 