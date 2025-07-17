"use client";

import { useState, useCallback } from "react";
import { MapPin } from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { GoogleMaps } from "@/components/maps/google-maps";
import { EventSearch } from "@/components/search/event-search";
import { EventDetailModal } from "@/components/events/event-detail-modal";

// Mock event data
const mockEvents = [
  {
    id: "1",
    title: "Jazz Night at Blue Note",
    price: 25,
    location: { lat: 40.7308, lng: -74.0027 },
    venue: "Blue Note Jazz Club",
    startTime: "Tonight, 8:00 PM",
    endTime: "11:00 PM",
    category: "Music",
    description: "Experience the best jazz music in NYC with live performances from top artists.",
    availableTickets: 15
  },
  {
    id: "2",
    title: "Comedy Show at Laugh Factory",
    price: 18,
    location: { lat: 40.7589, lng: -73.9851 },
    venue: "Laugh Factory",
    startTime: "Tonight, 7:30 PM",
    endTime: "9:30 PM",
    category: "Comedy",
    description: "Laugh your night away with the city's funniest comedians.",
    availableTickets: 8
  },
  {
    id: "3",
    title: "Art Gallery Opening",
    price: 12,
    location: { lat: 40.7505, lng: -73.9934 },
    venue: "Modern Art Museum",
    startTime: "Tonight, 6:00 PM",
    endTime: "9:00 PM",
    category: "Art & Culture",
    description: "Discover new contemporary artists and their latest works.",
    availableTickets: 25
  },
  {
    id: "4",
    title: "Food & Wine Festival",
    price: 45,
    location: { lat: 40.7614, lng: -73.9776 },
    venue: "Central Park",
    startTime: "Tomorrow, 2:00 PM",
    endTime: "8:00 PM",
    category: "Food & Drink",
    description: "Taste the best food and wine from local restaurants and wineries.",
    availableTickets: 50
  },
  {
    id: "5",
    title: "Yoga in the Park",
    price: 10,
    location: { lat: 40.7829, lng: -73.9654 },
    venue: "Bryant Park",
    startTime: "Tomorrow, 9:00 AM",
    endTime: "10:30 AM",
    category: "Outdoor",
    description: "Start your day with a refreshing yoga session in the heart of the city.",
    availableTickets: 30
  },
  {
    id: "6",
    title: "Rock Concert",
    price: 35,
    location: { lat: 40.7569, lng: -73.8455 },
    venue: "Forest Hills Stadium",
    startTime: "Friday, 7:00 PM",
    endTime: "11:00 PM",
    category: "Music",
    description: "Rock out with the hottest bands in town.",
    availableTickets: 12
  },
  {
    id: "7",
    title: "Cooking Workshop",
    price: 28,
    location: { lat: 40.7421, lng: -73.9911 },
    venue: "Culinary Institute",
    startTime: "Saturday, 3:00 PM",
    endTime: "6:00 PM",
    category: "Workshop",
    description: "Learn to cook authentic Italian cuisine from expert chefs.",
    availableTickets: 20
  }
];

export default function HomePage() {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredEvents, setFilteredEvents] = useState(mockEvents);

  const handleEventClick = useCallback((event: any) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  }, []);

  const handleSearch = useCallback((filters: any) => {
    let filtered = mockEvents;

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
  }, []);

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

  const handleBookEvent = useCallback((event: any) => {
    console.log("Booking event:", event);
    // In a real app, this would navigate to booking page
    setIsModalOpen(false);
  }, []);

  const handleFavoriteEvent = useCallback((event: any) => {
    console.log("Favorited event:", event);
    // In a real app, this would save to favorites
  }, []);

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
        <GoogleMaps
          events={filteredEvents}
          onEventClick={handleEventClick}
          onMapClick={(lat, lng) => {
            console.log("Map clicked at:", lat, lng);
          }}
        />
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
