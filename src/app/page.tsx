"use client";

import { useState, useCallback, useEffect } from "react";
import { MapPin } from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { GoogleMaps } from "@/components/maps/google-maps";
import { EventSearch } from "@/components/search/event-search";
import { EventDetailModal } from "@/components/events/event-detail-modal";
import { supabase } from "@/lib/supabase";
import { Event } from "@/types/event";

export default function HomePage() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real events from database
  useEffect(() => {
    const loadEvents = async () => {
      if (!supabase) {
        console.error('Supabase client not available');
        setIsLoading(false);
        return;
      }

      try {
        // Get upcoming active events with venue information
        const { data, error } = await supabase
          .from('events')
          .select(`
            *,
            venue:venues(*)
          `)
          .eq('is_active', true)
          .gte('start_time', new Date().toISOString())
          .order('start_time', { ascending: true });

        if (error) {
          console.error('Error loading events:', error);
          setEvents([]);
        } else {
          // Transform database events to the format expected by the map
          const transformedEvents: Event[] = (data || []).map(event => ({
            id: event.id,
            title: event.title,
            price: event.price || 0,
            location: {
              lat: event.venue?.lat || 0,
              lng: event.venue?.lng || 0
            },
            venue: event.venue?.name || 'Unknown Venue',
            startTime: new Date(event.start_time).toLocaleString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            }),
            endTime: new Date(event.end_time).toLocaleString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            }),
            category: event.category,
            description: event.description || '',
            availableTickets: event.available_tickets,
            capacity: event.capacity,
            image: event.venue?.images?.[0] || undefined
          }));

          setEvents(transformedEvents);
          setFilteredEvents(transformedEvents);
        }
      } catch (error) {
        console.error('Error loading events:', error);
        setEvents([]);
        setFilteredEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, []);

  const handleEventClick = useCallback((event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  }, []);

  const handleSearch = useCallback((filters: any) => {
    let filtered = events;

    // Filter by query
    if (filters.query) {
      const query = filters.query.toLowerCase();
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(query) ||
        event.venue.toLowerCase().includes(query) ||
        event.category.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (filters.category && filters.category !== "All") {
      filtered = filtered.filter(event => event.category === filters.category);
    }

    // Filter by price range
    if (filters.priceRange && filters.priceRange !== "Any Price") {
      const priceRanges: { [key: string]: (price: number) => boolean } = {
        "Under $10": (price) => price < 10,
        "$10 - $25": (price) => price >= 10 && price <= 25,
        "$25 - $50": (price) => price > 25 && price <= 50,
        "$50 - $100": (price) => price > 50 && price <= 100,
        "Over $100": (price) => price > 100
      };
      
      if (priceRanges[filters.priceRange]) {
        filtered = filtered.filter(event => priceRanges[filters.priceRange](event.price));
      }
    }

    setFilteredEvents(filtered);
  }, [events]);

  const handleLocationRequest = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Location requested:", position.coords);
          // In a real app, you would update the map center here
        },
        (error) => {
          console.warn("Error getting location:", error);
        }
      );
    }
  }, []);

  const handleBookEvent = useCallback((event: Event) => {
    console.log("Booking event:", event);
    // In a real app, this would navigate to booking page
    setIsModalOpen(false);
  }, []);

  const handleFavoriteEvent = useCallback((event: Event) => {
    console.log("Favorited event:", event);
    // In a real app, this would save to favorites
  }, []);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading events...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">PLANA</h1>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <MapPin className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </header>

      {/* Search Bar */}
      <EventSearch
        onSearch={handleSearch}
        onLocationRequest={handleLocationRequest}
      />

      {/* Map Container */}
      <div className="h-[calc(100vh-200px)] relative bg-gray-100">
        {filteredEvents.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Events Found</h3>
              <p className="text-gray-600">
                {events.length === 0 
                  ? "No upcoming events available at the moment."
                  : "Try adjusting your search filters."
                }
              </p>
            </div>
          </div>
        ) : (
          <GoogleMaps
            events={filteredEvents}
            onEventClick={handleEventClick}
            onMapClick={(lat, lng) => {
              console.log("Map clicked at:", lat, lng);
            }}
          />
        )}
      </div>

      {/* Event Detail Modal */}
      <EventDetailModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBook={handleBookEvent}
        onFavorite={handleFavoriteEvent}
      />
    </AppLayout>
  );
}
