"use client";

import { useState, useEffect } from "react";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Download, 
  Edit, 
  Trash2, 
  Eye,
  Search,
  Filter,
  ArrowUpDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Booking {
  id: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  venueAddress: string;
  ticketQuantity: number;
  totalAmount: number;
  status: "confirmed" | "cancelled" | "completed" | "upcoming";
  bookingDate: string;
  qrCodeUrl?: string;
  canCancel: boolean;
  canModify: boolean;
}

interface BookingManagementProps {
  onViewDetails?: (booking: Booking) => void;
  onModify?: (booking: Booking) => void;
  onCancel?: (booking: Booking) => void;
  onDownloadTicket?: (booking: Booking) => void;
}

export function BookingManagement({
  onViewDetails,
  onModify,
  onCancel,
  onDownloadTicket
}: BookingManagementProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    const mockBookings: Booking[] = [
      {
        id: "booking_1",
        eventTitle: "Jazz Night at Blue Note",
        eventDate: "Tonight, 8:00 PM",
        eventTime: "8:00 PM",
        venue: "Blue Note Jazz Club",
        venueAddress: "131 W 3rd St, New York, NY",
        ticketQuantity: 2,
        totalAmount: 100.00,
        status: "upcoming",
        bookingDate: "2024-01-15T20:30:00Z",
        qrCodeUrl: "/api/qr/booking_1",
        canCancel: true,
        canModify: true
      },
      {
        id: "booking_2",
        eventTitle: "Comedy Show at Laugh Factory",
        eventDate: "Tomorrow, 7:30 PM",
        eventTime: "7:30 PM",
        venue: "Laugh Factory",
        venueAddress: "303 W 42nd St, New York, NY",
        ticketQuantity: 2,
        totalAmount: 72.00,
        status: "upcoming",
        bookingDate: "2024-01-14T18:45:00Z",
        qrCodeUrl: "/api/qr/booking_2",
        canCancel: true,
        canModify: true
      },
      {
        id: "booking_3",
        eventTitle: "Art Gallery Opening",
        eventDate: "Friday, 6:00 PM",
        eventTime: "6:00 PM",
        venue: "Modern Art Museum",
        venueAddress: "11 W 53rd St, New York, NY",
        ticketQuantity: 2,
        totalAmount: 48.00,
        status: "cancelled",
        bookingDate: "2024-01-13T15:20:00Z",
        canCancel: false,
        canModify: false
      },
      {
        id: "booking_4",
        eventTitle: "Food & Wine Festival",
        eventDate: "Saturday, 2:00 PM",
        eventTime: "2:00 PM",
        venue: "Central Park",
        venueAddress: "Central Park, New York, NY",
        ticketQuantity: 2,
        totalAmount: 180.00,
        status: "confirmed",
        bookingDate: "2024-01-12T10:15:00Z",
        qrCodeUrl: "/api/qr/booking_4",
        canCancel: true,
        canModify: true
      }
    ];

    setBookings(mockBookings);
    setFilteredBookings(mockBookings);
    setIsLoading(false);
  }, []);

  // Filter and sort bookings
  useEffect(() => {
    let filtered = bookings;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.eventTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.venue.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === "date") {
        comparison = new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime();
      } else if (sortBy === "amount") {
        comparison = a.totalAmount - b.totalAmount;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    setFilteredBookings(filtered);
  }, [bookings, searchTerm, statusFilter, sortBy, sortOrder]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return "✓";
      case "upcoming":
        return "⏳";
      case "cancelled":
        return "✗";
      case "completed":
        return "✓";
      default:
        return "•";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const handleCancelBooking = async (booking: Booking) => {
    if (confirm(`Are you sure you want to cancel your booking for "${booking.eventTitle}"?`)) {
      // In a real app, call API to cancel
      setBookings(prev => 
        prev.map(b => 
          b.id === booking.id 
            ? { ...b, status: "cancelled" as const, canCancel: false, canModify: false }
            : b
        )
      );
      onCancel?.(booking);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
          <span className="ml-2">Loading bookings...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">My Bookings</h2>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export All
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "date" | "amount")}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
            </select>

            {/* Sort Order */}
            <Button
              variant="outline"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="flex items-center space-x-2"
            >
              <ArrowUpDown className="w-4 h-4" />
              <span>{sortOrder === "asc" ? "Ascending" : "Descending"}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== "all" 
                  ? "Try adjusting your filters" 
                  : "You haven't made any bookings yet"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredBookings.map((booking) => (
            <Card key={booking.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{booking.eventTitle}</h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)} {booking.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{booking.eventDate}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{booking.venue}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span>{booking.ticketQuantity} tickets</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 text-sm">
                      <span className="text-gray-600">
                        Booked on {formatDate(booking.bookingDate)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2 ml-4">
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        ${booking.totalAmount.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Booking ID: {booking.id.slice(-8)}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDetails?.(booking)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      
                      {booking.qrCodeUrl && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDownloadTicket?.(booking)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      )}
                      
                      {booking.canModify && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onModify?.(booking)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                      
                      {booking.canCancel && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCancelBooking(booking)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Summary */}
      {filteredBookings.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">
                Showing {filteredBookings.length} of {bookings.length} bookings
              </span>
              <span className="font-medium text-gray-900">
                Total Spent: ${filteredBookings.reduce((sum, booking) => sum + booking.totalAmount, 0).toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 