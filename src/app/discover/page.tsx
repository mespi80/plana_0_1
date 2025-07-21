"use client";

import { useState, useCallback, useEffect } from "react";
import { Heart, MapPin, ArrowLeft } from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { SwipeableCardStack } from "@/components/events/swipeable-card-stack";
import { EventDetailModal } from "@/components/events/event-detail-modal";
import { Event } from "@/types/event";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function DiscoverPage() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [likedEvents, setLikedEvents] = useState<Event[]>([]);
  const [passedEvents, setPassedEvents] = useState<Event[]>([]);
  const [currentEvents, setCurrentEvents] = useState<Event[]>([]);
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
          setCurrentEvents([]);
        } else {
          // Transform database events to the format expected by the swipeable cards
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
            image: event.venue?.images?.[0] || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop"
          }));

          setCurrentEvents(transformedEvents);
        }
      } catch (error) {
        console.error('Error loading events:', error);
        setCurrentEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, []);

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
          {currentEvents.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Events Available</h3>
              <p className="text-gray-600 mb-6">
                There are no upcoming events to discover at the moment.
              </p>
              <Link 
                href="/" 
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Browse Map View
              </Link>
            </div>
          ) : (
            <>
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
            </>
          )}
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