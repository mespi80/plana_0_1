"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, Users, DollarSign, Heart, Eye, Share2, Building2, Star, Filter, Settings } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { EventHistory } from "@/components/user/event-history";

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
    id: string;
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

interface FollowedVenue {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  category: string;
  images: string[];
  rating: number;
  review_count: number;
  upcoming_events: number;
  is_following: boolean;
  followed_at: string;
}

interface UserPreferences {
  interests: string[];
  price_range: {
    min: number;
    max: number;
  };
  preferred_categories: string[];
  notification_settings: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  location_radius: number;
}

export default function FavoritesPage() {
  const [activeTab, setActiveTab] = useState("events");
  const [likedEvents, setLikedEvents] = useState<LikedEvent[]>([]);
  const [followedVenues, setFollowedVenues] = useState<FollowedVenue[]>([]);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<LikedEvent | null>(null);
  const [selectedVenue, setSelectedVenue] = useState<FollowedVenue | null>(null);
  const router = useRouter();

  // Load favorites data
  useEffect(() => {
    const loadFavoritesData = async () => {
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

        // Mock data for demonstration
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
              id: "venue_1",
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
              id: "venue_2",
              name: "Laugh Factory",
              address: "456 Comedy Ave",
              city: "Los Angeles",
              state: "CA"
            },
            images: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"],
            tags: ["comedy", "stand-up", "entertainment"],
            is_liked: true,
            liked_at: "2024-01-10T14:20:00Z"
          }
        ];

        const mockFollowedVenues: FollowedVenue[] = [
          {
            id: "venue_1",
            name: "Blue Note Jazz Club",
            description: "Iconic jazz venue featuring world-class musicians",
            address: "123 Jazz Street",
            city: "New York",
            state: "NY",
            category: "Music Venue",
            images: ["https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400"],
            rating: 4.8,
            review_count: 1247,
            upcoming_events: 12,
            is_following: true,
            followed_at: "2024-01-15T10:30:00Z"
          },
          {
            id: "venue_2",
            name: "Modern Art Museum",
            description: "Contemporary art exhibitions and cultural events",
            address: "789 Art Boulevard",
            city: "San Francisco",
            state: "CA",
            category: "Museum",
            images: ["https://images.unsplash.com/photo-1541961017774-a3eb161ffa5f?w=400"],
            rating: 4.6,
            review_count: 892,
            upcoming_events: 8,
            is_following: true,
            followed_at: "2024-01-05T09:15:00Z"
          }
        ];

        const mockUserPreferences: UserPreferences = {
          interests: ["music", "art", "comedy", "food", "sports"],
          price_range: {
            min: 0,
            max: 100
          },
          preferred_categories: ["Music", "Entertainment", "Art & Culture"],
          notification_settings: {
            email: true,
            push: true,
            sms: false
          },
          location_radius: 25
        };

        setLikedEvents(mockLikedEvents);
        setFollowedVenues(mockFollowedVenues);
        setUserPreferences(mockUserPreferences);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading favorites data:', error);
        setIsLoading(false);
      }
    };

    loadFavoritesData();
  }, [router]);

  const handleViewEvent = (eventId: string) => {
    router.push(`/events/${eventId}`);
  };

  const handleViewVenue = (venueId: string) => {
    router.push(`/venues/${venueId}`);
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
      navigator.clipboard.writeText(`${shareData.title} - ${shareData.url}`);
      alert('Event link copied to clipboard!');
    }
  };

  const handleShareVenue = (venue: FollowedVenue) => {
    const shareData = {
      title: venue.name,
      text: `Check out this venue: ${venue.name}`,
      url: `${window.location.origin}/venues/${venue.id}`
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(`${shareData.title} - ${shareData.url}`);
      alert('Venue link copied to clipboard!');
    }
  };

  const handleUnlikeEvent = async (eventId: string) => {
    setLikedEvents(prev => prev.filter(event => event.id !== eventId));
  };

  const handleUnfollowVenue = async (venueId: string) => {
    setFollowedVenues(prev => prev.filter(venue => venue.id !== venueId));
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

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading favorites...</p>
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
              <span>My Favorites</span>
            </h1>
            <p className="text-gray-600">Your liked events and followed venues</p>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="events" className="flex items-center space-x-2">
                <Heart className="w-4 h-4" />
                <span>Liked Events ({likedEvents.length})</span>
              </TabsTrigger>
              <TabsTrigger value="venues" className="flex items-center space-x-2">
                <Building2 className="w-4 h-4" />
                <span>Followed Venues ({followedVenues.length})</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Event History</span>
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Preferences</span>
              </TabsTrigger>
            </TabsList>

            {/* Liked Events Tab */}
            <TabsContent value="events" className="space-y-6">
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
                  {/* Events List */}
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
            </TabsContent>

            {/* Followed Venues Tab */}
            <TabsContent value="venues" className="space-y-6">
              {followedVenues.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No followed venues yet</h3>
                    <p className="text-gray-600 mb-6">
                      Start following venues to get updates on their events!
                    </p>
                    <div className="space-x-4">
                      <Button onClick={() => router.push("/discover")}>
                        Discover Venues
                      </Button>
                      <Button variant="outline" onClick={() => router.push("/")}>
                        Browse Events
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Venues List */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900">Your Followed Venues</h2>
                    {followedVenues.map((venue) => (
                      <Card
                        key={venue.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedVenue?.id === venue.id ? 'ring-2 ring-purple-500' : ''
                        }`}
                        onClick={() => setSelectedVenue(venue)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-4">
                            {/* Venue Image */}
                            <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                              {venue.images && venue.images.length > 0 ? (
                                <img
                                  src={venue.images[0]}
                                  alt={venue.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                  <Building2 className="w-6 h-6 text-gray-500" />
                                </div>
                              )}
                            </div>

                            {/* Venue Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="font-semibold text-gray-900 truncate">{venue.name}</h3>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUnfollowVenue(venue.id);
                                  }}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Heart className="w-4 h-4 fill-current" />
                                </Button>
                              </div>
                              
                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                {venue.description}
                              </p>

                              <div className="space-y-1 text-sm text-gray-600">
                                <div className="flex items-center space-x-2">
                                  <MapPin className="w-4 h-4" />
                                  <span className="truncate">{venue.address}, {venue.city}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Star className="w-4 h-4 text-yellow-500" />
                                  <span>{venue.rating} ({venue.review_count} reviews)</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Calendar className="w-4 h-4" />
                                  <span>{venue.upcoming_events} upcoming events</span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between mt-3">
                                <Badge variant="secondary" className="text-xs">
                                  {venue.category}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  Following since {formatDate(venue.followed_at)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Venue Details */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900">Venue Details</h2>
                    {selectedVenue ? (
                      <Card>
                        <CardContent className="p-6">
                          {/* Venue Image */}
                          <div className="w-full h-48 bg-gray-200 rounded-lg overflow-hidden mb-4">
                            {selectedVenue.images && selectedVenue.images.length > 0 ? (
                              <img
                                src={selectedVenue.images[0]}
                                alt={selectedVenue.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                <Building2 className="w-12 h-12 text-gray-500" />
                              </div>
                            )}
                          </div>

                          {/* Venue Info */}
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedVenue.name}</h3>
                              <p className="text-gray-600">{selectedVenue.description}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-gray-500">Rating</p>
                                <p className="font-medium flex items-center">
                                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                                  {selectedVenue.rating}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-500">Reviews</p>
                                <p className="font-medium">{selectedVenue.review_count}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Upcoming Events</p>
                                <p className="font-medium">{selectedVenue.upcoming_events}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Category</p>
                                <p className="font-medium">{selectedVenue.category}</p>
                              </div>
                            </div>

                            <div>
                              <p className="text-gray-500 text-sm mb-1">Address</p>
                              <p className="font-medium">{selectedVenue.address}</p>
                              <p className="text-sm text-gray-600">
                                {selectedVenue.city}, {selectedVenue.state}
                              </p>
                            </div>

                            <div className="flex space-x-2 pt-4">
                              <Button
                                onClick={() => handleViewVenue(selectedVenue.id)}
                                className="flex-1"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Venue
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => handleShareVenue(selectedVenue)}
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
                          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">Select a venue</h3>
                          <p className="text-gray-600">
                            Choose a venue from the list to view its details
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Event History Tab */}
            <TabsContent value="history" className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Event History</h2>
                <EventHistory />
              </div>
            </TabsContent>

            {/* User Preferences Tab */}
            <TabsContent value="preferences" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="w-5 h-5" />
                    <span>User Preferences</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {userPreferences ? (
                    <>
                      {/* Interests */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Interests</h3>
                        <div className="flex flex-wrap gap-2">
                          {userPreferences.interests.map((interest) => (
                            <Badge key={interest} variant="secondary">
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Price Range */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Price Range</h3>
                        <p className="text-gray-600">
                          ${userPreferences.price_range.min} - ${userPreferences.price_range.max}
                        </p>
                      </div>

                      {/* Preferred Categories */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Preferred Categories</h3>
                        <div className="flex flex-wrap gap-2">
                          {userPreferences.preferred_categories.map((category) => (
                            <Badge key={category} variant="outline">
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Notification Settings */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Notification Settings</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Email Notifications</span>
                            <Badge variant={userPreferences.notification_settings.email ? "default" : "secondary"}>
                              {userPreferences.notification_settings.email ? "On" : "Off"}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Push Notifications</span>
                            <Badge variant={userPreferences.notification_settings.push ? "default" : "secondary"}>
                              {userPreferences.notification_settings.push ? "On" : "Off"}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">SMS Notifications</span>
                            <Badge variant={userPreferences.notification_settings.sms ? "default" : "secondary"}>
                              {userPreferences.notification_settings.sms ? "On" : "Off"}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Location Radius */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Location Radius</h3>
                        <p className="text-gray-600">
                          {userPreferences.location_radius} miles
                        </p>
                      </div>

                      <div className="pt-4">
                        <Button onClick={() => router.push("/profile")}>
                          Edit Preferences
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No preferences set</h3>
                      <p className="text-gray-600 mb-4">
                        Set your preferences to get personalized recommendations
                      </p>
                      <Button onClick={() => router.push("/profile")}>
                        Set Preferences
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Quick Actions */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                    <Filter className="w-4 h-4" />
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

                  <Button
                    variant="outline"
                    className="flex items-center space-x-2"
                    onClick={() => router.push("/profile")}
                  >
                    <Settings className="w-4 h-4" />
                    <span>Profile Settings</span>
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