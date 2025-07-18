import { createClient } from '@supabase/supabase-js'
import { writeFileSync } from 'fs'

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

async function cleanupTestData() {
  try {
    console.log('Starting cleanup of test data...')

    // Delete test events (events with test titles or created recently for testing)
    const { data: testEvents, error: eventsError } = await supabase
      .from('events')
      .select('id, title')
      .or('title.ilike.%test%,title.ilike.%demo%,title.ilike.%mock%')

    if (eventsError) {
      console.error('Error fetching test events:', eventsError)
    } else {
      console.log(`Found ${testEvents?.length || 0} test events to delete`)
      
      if (testEvents && testEvents.length > 0) {
        const eventIds = testEvents.map(event => event.id)
        
        // Delete related bookings first
        const { error: bookingsError } = await supabase
          .from('bookings')
          .delete()
          .in('event_id', eventIds)

        if (bookingsError) {
          console.error('Error deleting test bookings:', bookingsError)
        } else {
          console.log('Deleted test bookings')
        }

        // Delete related check-ins
        const { error: checkInsError } = await supabase
          .from('check_ins')
          .delete()
          .in('booking_id', eventIds)

        if (checkInsError) {
          console.error('Error deleting test check-ins:', checkInsError)
        } else {
          console.log('Deleted test check-ins')
        }

        // Delete related favorites
        const { error: favoritesError } = await supabase
          .from('favorites')
          .delete()
          .in('event_id', eventIds)

        if (favoritesError) {
          console.error('Error deleting test favorites:', favoritesError)
        } else {
          console.log('Deleted test favorites')
        }

        // Delete the events
        const { error: deleteEventsError } = await supabase
          .from('events')
          .delete()
          .in('id', eventIds)

        if (deleteEventsError) {
          console.error('Error deleting test events:', deleteEventsError)
        } else {
          console.log('Deleted test events')
        }
      }
    }

    // Delete test venues (venues with test names)
    const { data: testVenues, error: venuesError } = await supabase
      .from('venues')
      .select('id, name')
      .or('name.ilike.%test%,name.ilike.%demo%,name.ilike.%mock%')

    if (venuesError) {
      console.error('Error fetching test venues:', venuesError)
    } else {
      console.log(`Found ${testVenues?.length || 0} test venues to delete`)
      
      if (testVenues && testVenues.length > 0) {
        const venueIds = testVenues.map(venue => venue.id)
        
        const { error: deleteVenuesError } = await supabase
          .from('venues')
          .delete()
          .in('id', venueIds)

        if (deleteVenuesError) {
          console.error('Error deleting test venues:', deleteVenuesError)
        } else {
          console.log('Deleted test venues')
        }
      }
    }

    // Delete test businesses (businesses with test names)
    const { data: testBusinesses, error: businessesError } = await supabase
      .from('businesses')
      .select('id, name')
      .or('name.ilike.%test%,name.ilike.%demo%,name.ilike.%mock%')

    if (businessesError) {
      console.error('Error fetching test businesses:', businessesError)
    } else {
      console.log(`Found ${testBusinesses?.length || 0} test businesses to delete`)
      
      if (testBusinesses && testBusinesses.length > 0) {
        const businessIds = testBusinesses.map(business => business.id)
        
        const { error: deleteBusinessesError } = await supabase
          .from('businesses')
          .delete()
          .in('id', businessIds)

        if (deleteBusinessesError) {
          console.error('Error deleting test businesses:', deleteBusinessesError)
        } else {
          console.log('Deleted test businesses')
        }
      }
    }

    console.log('Cleanup completed successfully!')
  } catch (error) {
    console.error('Error during cleanup:', error)
    process.exit(1)
  }
}

cleanupTestData() 