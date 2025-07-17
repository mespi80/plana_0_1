"use client";

import { useState, useCallback } from "react";
import { Heart, MapPin, ArrowLeft } from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { SwipeableCardStack } from "@/components/events/swipeable-card-stack";
import { EventDetailModal } from "@/components/events/event-detail-modal";
import { Event } from "@/types/event";
import Link from "next/link";

// Mock event data for discovery
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
    description: "Experience the best jazz music in NYC with live performances from top artists. Perfect for a romantic evening or night out with friends.",
    availableTickets: 15,
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop"
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
    description: "Laugh your night away with the city's funniest comedians. A perfect way to unwind and have a great time with friends.",
    availableTickets: 8,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop"
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
    description: "Discover new contemporary artists and their latest works. Wine and cheese reception included. A sophisticated evening for art lovers.",
    availableTickets: 25,
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop"
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
    description: "Taste the best food and wine from local restaurants and wineries. Live music, cooking demonstrations, and exclusive tastings.",
    availableTickets: 50,
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop"
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
    description: "Start your day with a refreshing yoga session in the heart of the city. All levels welcome. Bring your own mat.",
    availableTickets: 30,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop"
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
    description: "Rock out with the hottest bands in town. Outdoor venue with amazing acoustics. Food and drinks available.",
    availableTickets: 12,
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop"
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
    description: "Learn to cook authentic Italian cuisine from expert chefs. Take home your creations and recipes. Wine pairing included.",
    availableTickets: 20,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop"
  }
];

export default function DiscoverPage() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [likedEvents, setLikedEvents] = useState<Event[]>([]);
  const [passedEvents, setPassedEvents] = useState<Event[]>([]);
  const [currentEvents, setCurrentEvents] = useState<Event[]>(mockEvents);

  const handleLike = useCallback((event: Event) => {
    console.log("Liked event:", event);
    setLikedEvents(prev => [...prev, event]);
    
    // Save to favorites in localStorage
    const savedFavorites = localStorage.getItem('plana-favorites');
    const favorites = savedFavorites ? JSON.parse(savedFavorites) : [];
    const updatedFavorites = [...favorites, event];
    localStorage.setItem('plana-favorites', JSON.stringify(updatedFavorites));
  }, []);

  const handlePass = useCallback((event: Event) => {
    console.log("Passed event:", event);
    setPassedEvents(prev => [...prev, event]);
  }, []);

  const handleBook = useCallback((event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  }, []);

  const handleEmpty = useCallback(() => {
    console.log("No more events to show");
    // In a real app, you might load more events or show a different view
  }, []);

  const handleFavoriteEvent = useCallback((event: Event) => {
    console.log("Favorited event:", event);
    // In a real app, this would save to favorites
  }, []);

  return (
    <AppLayout>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/" className="p-2 rounded-full hover:bg-gray-100">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Discover Events</h1>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {likedEvents.length} liked
            </span>
            <Heart className="w-5 h-5 text-red-500" />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 p-4 bg-gray-50">
        <div className="max-w-md mx-auto">
          {/* Instructions */}
          <div className="text-center mb-6">
            <p className="text-gray-600 mb-2">
              Swipe right to like, left to pass
            </p>
            <p className="text-sm text-gray-500">
              {currentEvents.length} events remaining
            </p>
          </div>

          {/* Card Stack */}
          <SwipeableCardStack
            events={currentEvents}
            onLike={handleLike}
            onPass={handlePass}
            onBook={handleBook}
            onEmpty={handleEmpty}
          />

          {/* Stats */}
          <div className="mt-8 text-center">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl font-bold text-red-500">{likedEvents.length}</div>
                <div className="text-sm text-gray-600">Liked</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl font-bold text-gray-500">{passedEvents.length}</div>
                <div className="text-sm text-gray-600">Passed</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Detail Modal */}
      <EventDetailModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBook={handleBook}
        onFavorite={handleFavoriteEvent}
      />
    </AppLayout>
  );
} 