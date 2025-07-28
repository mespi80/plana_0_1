"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, DollarSign, Eye, Share2, Star, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface EventHistoryItem {
  id: string;
  event_id: string;
  event: {
    id: string;
    title: string;
    description: string;
    category: string;
    start_time: string;
    end_time: string;
    price: number;
    venue: {
      id: string;
      name: string;
      address: string;
      city: string;
      state: string;
    };
    images: string[];
  };
  booking_date: string;
  ticket_quantity: number;
  total_amount: number;
  status: "confirmed" | "cancelled" | "completed" | "no_show";
  check_in_status: "checked_in" | "not_checked_in" | "expired";
  check_in_time?: string;
  rating?: number;
  review?: string;
}

export function EventHistory() {
  const [eventHistory, setEventHistory] = useState<EventHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "upcoming" | "past" | "cancelled">("all");

  useEffect(() => {
    const loadEventHistory = async () => {
      if (!supabase) {
        setIsLoading(false);
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          setIsLoading(false);
          return;
        }

        // Mock data for demonstration
        const mockEventHistory: EventHistoryItem[] = [
          {
            id: "booking_1",
            event_id: "event_1",
            event: {
              id: "event_1",
              title: "Jazz Night at Blue Note",
              description: "An evening of smooth jazz featuring local artists",
              category: "Music",
              start_time: "2024-01-15T20:00:00Z",
              end_time: "2024-01-15T23:00:00Z",
              price: 45.00,
              venue: {
                id: "venue_1",
                name: "Blue Note Jazz Club",
                address: "123 Jazz Street",
                city: "New York",
                state: "NY"
              },
              images: ["https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400"]
            },
            booking_date: "2024-01-10T14:30:00Z",
            ticket_quantity: 2,
            total_amount: 90.00,
            status: "completed",
            check_in_status: "checked_in",
            check_in_time: "2024-01-15T19:45:00Z",
            rating: 5,
            review: "Amazing jazz performance! The atmosphere was perfect."
          },
          {
            id: "booking_2",
            event_id: "event_2",
            event: {
              id: "event_2",
              title: "Comedy Show at Laugh Factory",
              description: "Stand-up comedy night with top comedians",
              category: "Entertainment",
              start_time: "2024-02-20T19:30:00Z",
              end_time: "2024-02-20T21:30:00Z",
              price: 35.00,
              venue: {
                id: "venue_2",
                name: "Laugh Factory",
                address: "456 Comedy Ave",
                city: "Los Angeles",
                state: "CA"
              },
              images: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"]
            },
            booking_date: "2024-01-15T10:20:00Z",
            ticket_quantity: 1,
            total_amount: 35.00,
            status: "confirmed",
            check_in_status: "not_checked_in"
          },
          {
            id: "booking_3",
            event_id: "event_3",
            event: {
              id: "event_3",
              title: "Art Gallery Opening",
              description: "Contemporary art exhibition featuring local artists",
              category: "Art & Culture",
              start_time: "2024-01-20T18:00:00Z",
              end_time: "2024-01-20T22:00:00Z",
              price: 25.00,
              venue: {
                id: "venue_3",
                name: "Modern Art Museum",
                address: "789 Art Boulevard",
                city: "San Francisco",
                state: "CA"
              },
              images: ["https://images.unsplash.com/photo-1541961017774-a3eb161ffa5f?w=400"]
            },
            booking_date: "2024-01-12T09:15:00Z",
            ticket_quantity: 2,
            total_amount: 50.00,
            status: "cancelled",
            check_in_status: "expired"
          }
        ];

        setEventHistory(mockEventHistory);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading event history:', error);
        setIsLoading(false);
      }
    };

    loadEventHistory();
  }, []);

  const filteredHistory = eventHistory.filter(item => {
    const eventDate = new Date(item.event.start_time);
    const now = new Date();
    
    switch (filter) {
      case "upcoming":
        return eventDate > now && item.status === "confirmed";
      case "past":
        return eventDate < now && item.status === "completed";
      case "cancelled":
        return item.status === "cancelled";
      default:
        return true;
    }
  });

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "no_show":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Calendar className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      case "no_show":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getCheckInStatusColor = (status: string) => {
    switch (status) {
      case "checked_in":
        return "bg-green-100 text-green-800";
      case "not_checked_in":
        return "bg-yellow-100 text-yellow-800";
      case "expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading event history...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex space-x-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          All ({eventHistory.length})
        </Button>
        <Button
          variant={filter === "upcoming" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("upcoming")}
        >
          Upcoming ({eventHistory.filter(item => new Date(item.event.start_time) > new Date() && item.status === "confirmed").length})
        </Button>
        <Button
          variant={filter === "past" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("past")}
        >
          Past ({eventHistory.filter(item => new Date(item.event.start_time) < new Date() && item.status === "completed").length})
        </Button>
        <Button
          variant={filter === "cancelled" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("cancelled")}
        >
          Cancelled ({eventHistory.filter(item => item.status === "cancelled").length})
        </Button>
      </div>

      {/* Event History List */}
      {filteredHistory.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600">
              {filter === "all" && "You haven't booked any events yet."}
              {filter === "upcoming" && "No upcoming events found."}
              {filter === "past" && "No past events found."}
              {filter === "cancelled" && "No cancelled events found."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredHistory.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  {/* Event Image */}
                  <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    {item.event.images && item.event.images.length > 0 ? (
                      <img
                        src={item.event.images[0]}
                        alt={item.event.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                        <Calendar className="w-8 h-8 text-gray-500" />
                      </div>
                    )}
                  </div>

                  {/* Event Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{item.event.title}</h3>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(item.status)}>
                          {getStatusIcon(item.status)}
                          <span className="ml-1">{item.status}</span>
                        </Badge>
                        <Badge className={getCheckInStatusColor(item.check_in_status)}>
                          {item.check_in_status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-3">{item.event.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Event Date</p>
                        <p className="font-medium">{formatDate(item.event.start_time)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Time</p>
                        <p className="font-medium">{formatTime(item.event.start_time)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Venue</p>
                        <p className="font-medium truncate">{item.event.venue.name}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Tickets</p>
                        <p className="font-medium">{item.ticket_quantity}</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">Total Paid</p>
                            <p className="font-semibold text-lg">{formatCurrency(item.total_amount)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Booked On</p>
                            <p className="font-medium">{formatDate(item.booking_date)}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          {item.rating && (
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="text-sm font-medium">{item.rating}/5</span>
                            </div>
                          )}
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </div>

                      {item.review && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700 italic">"{item.review}"</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 