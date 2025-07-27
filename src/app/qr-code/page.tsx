"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, DollarSign, Heart, Eye, Share2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface LikedEvent {
  id: string;
  title: string;
  description: string;
  category: string;
  start_time: string;
  end_time: string;
  price: number;
  capacity: number;
  available_tickets: number;
  venue: {
    name: string;
    address: string;
    city: string;
    state: string;
  };
  images: string[];
  tags: string[];
  is_liked: boolean;
  liked_at: string;
}

export default function LikedEventsPage() {
  const [likedEvents, setLikedEvents] = useState<LikedEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<LikedEvent | null>(null);
  const router = useRouter();

  // Load liked events from database
  useEffect(() => {
    const loadLikedEvents = async () => {
      if (!supabase) {
        setIsLoading(false);
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          router.push("/auth/login");
          return;
        }

        // In a real implementation, you would have a likes table
        // For now, we'll use mock data that simulates liked events
        const mockLikedEvents: LikedEvent[] = [
          {
            id: "event_1",
            title: "Jazz Night at Blue Note",
            description: "An evening of smooth jazz featuring local artists",
            category: "Music",
            start_time: "2024-02-15T20:00:00Z",
            end_time: "2024-02-15T23:00:00Z",
            price: 45.00,
            capacity: 200,
            available_tickets: 45,
            venue: {
              name: "Blue Note Jazz Club",
              address: "123 Jazz Street",
              city: "New York",
              state: "NY"
            },
            images: ["https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400"],
            tags: ["jazz", "live music", "nightlife"],
            is_liked: true,
            liked_at: "2024-01-15T10:30:00Z"
          },
          {
            id: "event_2",
            title: "Comedy Show at Laugh Factory",
            description: "Stand-up comedy night with top comedians",
            category: "Entertainment",
            start_time: "2024-02-20T19:30:00Z",
            end_time: "2024-02-20T21:30:00Z",
            price: 35.00,
            capacity: 150,
            available_tickets: 23,
            venue: {
              name: "Laugh Factory",
              address: "456 Comedy Ave",
              city: "Los Angeles",
              state: "CA"
            },
            images: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"],
            tags: ["comedy", "stand-up", "entertainment"],
            is_liked: true,
            liked_at: "2024-01-10T14:20:00Z"
          },
          {
            id: "event_3",
            title: "Art Gallery Opening",
            description: "Contemporary art exhibition featuring local artists",
            category: "Art & Culture",
            start_time: "2024-02-25T18:00:00Z",
            end_time: "2024-02-25T22:00:00Z",
            price: 25.00,
            capacity: 100,
            available_tickets: 67,
            venue: {
              name: "Modern Art Museum",
              address: "789 Art Boulevard",
              city: "San Francisco",
              state: "CA"
            },
            images: ["https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400"],
            tags: ["art", "exhibition", "culture"],
            is_liked: true,
            liked_at: "2024-01-05T09:15:00Z"
          }
        ];

        setLikedEvents(mockLikedEvents);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading liked events:', error);
        setIsLoading(false);
      }
    };

    loadLikedEvents();
  }, [router]);

  const handleViewEvent = (eventId: string) => {
    router.push(`/events/${eventId}`);
  };

  const handleShareEvent = (event: LikedEvent) => {
    const shareData = {
      title: event.title,
      text: `Check out this event: ${event.title}`,
      url: `${window.location.origin}/events/${event.id}`
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${shareData.title} - ${shareData.url}`);
      alert('Event link copied to clipboard!');
    }
  };

  const handleUnlikeEvent = async (eventId: string) => {
    // In a real implementation, this would update the database
    setLikedEvents(prev => prev.filter(event => event.id !== eventId));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getTimeUntilEvent = (startTime: string) => {
    const now = new Date();
    const eventTime = new Date(startTime);
    const diffTime = eventTime.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "Past";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays < 7) return `${diffDays} days`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks`;
    return `${Math.ceil(diffDays / 30)} months`;
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading liked events...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex-1 p-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <Heart className="w-6 h-6 text-red-500" />
              <span>Liked Events</span>
            </h1>
            <p className="text-gray-600">Your favorite events and activities</p>
          </div>

          {likedEvents.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No liked events yet</h3>
                <p className="text-gray-600 mb-6">
                  Start exploring events and like the ones you're interested in!
                </p>
                <div className="space-x-4">
                  <Button onClick={() => router.push("/")}>
                    Browse Events
                  </Button>
                  <Button variant="outline" onClick={() => router.push("/discover")}>
                    Discover More
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Liked Events List */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Your Liked Events</h2>
                {likedEvents.map((event) => (
                  <Card
                    key={event.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedEvent?.id === event.id ? 'ring-2 ring-purple-500' : ''
                    }`}
                    onClick={() => setSelectedEvent(event)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        {/* Event Image */}
                        <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                          {event.images && event.images.length > 0 ? (
                            <img
                              src={event.images[0]}
                              alt={event.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                              <Calendar className="w-6 h-6 text-gray-500" />
                            </div>
                          )}
                        </div>

                        {/* Event Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-gray-900 truncate">{event.title}</h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUnlikeEvent(event.id);
                              }}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Heart className="w-4 h-4 fill-current" />
                            </Button>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {event.description}
                          </p>

                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(event.start_time)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4" />
                              <span>{formatTime(event.start_time)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4" />
                              <span className="truncate">{event.venue.name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <DollarSign className="w-4 h-4" />
                              <span>{formatCurrency(event.price)}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            <Badge variant="secondary" className="text-xs">
                              {event.category}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              Liked {formatDate(event.liked_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Event Details */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Event Details</h2>
                {selectedEvent ? (
                  <Card>
                    <CardContent className="p-6">
                      {/* Event Image */}
                      <div className="w-full h-48 bg-gray-200 rounded-lg overflow-hidden mb-4">
                        {selectedEvent.images && selectedEvent.images.length > 0 ? (
                          <img
                            src={selectedEvent.images[0]}
                            alt={selectedEvent.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                            <Calendar className="w-12 h-12 text-gray-500" />
                          </div>
                        )}
                      </div>

                      {/* Event Info */}
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedEvent.title}</h3>
                          <p className="text-gray-600">{selectedEvent.description}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Date</p>
                            <p className="font-medium">{formatDate(selectedEvent.start_time)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Time</p>
                            <p className="font-medium">{formatTime(selectedEvent.start_time)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Price</p>
                            <p className="font-medium">{formatCurrency(selectedEvent.price)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Available</p>
                            <p className="font-medium">{selectedEvent.available_tickets} tickets</p>
                          </div>
                        </div>

                        <div>
                          <p className="text-gray-500 text-sm mb-1">Venue</p>
                          <p className="font-medium">{selectedEvent.venue.name}</p>
                          <p className="text-sm text-gray-600">
                            {selectedEvent.venue.address}, {selectedEvent.venue.city}, {selectedEvent.venue.state}
                          </p>
                        </div>

                        <div>
                          <p className="text-gray-500 text-sm mb-2">Tags</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedEvent.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex space-x-2 pt-4">
                          <Button
                            onClick={() => handleViewEvent(selectedEvent.id)}
                            className="flex-1"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Event
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleShareEvent(selectedEvent)}
                          >
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Select an event</h3>
                      <p className="text-gray-600">
                        Choose an event from the list to view its details
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2"
                    onClick={() => router.push("/")}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Browse Events</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2"
                    onClick={() => router.push("/discover")}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Discover More</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2"
                    onClick={() => router.push("/bookings")}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>My Bookings</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
} 