"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { QRCodeDisplay } from "@/components/qr-code/qr-code-display";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users, Download, Share2 } from "lucide-react";

interface UserQRCode {
  id: string;
  bookingId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  ticketQuantity: number;
  status: "upcoming" | "active" | "expired" | "used";
  qrCodeUrl?: string;
}

export default function QRCodePage() {
  const [qrCodes, setQrCodes] = useState<UserQRCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQRCode, setSelectedQRCode] = useState<UserQRCode | null>(null);

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    const mockQRCodes: UserQRCode[] = [
      {
        id: "qr_1",
        bookingId: "booking_123456789",
        eventTitle: "Jazz Night at Blue Note",
        eventDate: "Tonight, 8:00 PM",
        eventTime: "8:00 PM",
        venue: "Blue Note Jazz Club",
        ticketQuantity: 2,
        status: "active"
      },
      {
        id: "qr_2",
        bookingId: "booking_987654321",
        eventTitle: "Comedy Show at Laugh Factory",
        eventDate: "Tomorrow, 7:30 PM",
        eventTime: "7:30 PM",
        venue: "Laugh Factory",
        ticketQuantity: 2,
        status: "upcoming"
      },
      {
        id: "qr_3",
        bookingId: "booking_456789123",
        eventTitle: "Art Gallery Opening",
        eventDate: "Friday, 6:00 PM",
        eventTime: "6:00 PM",
        venue: "Modern Art Museum",
        ticketQuantity: 2,
        status: "used"
      }
    ];

    setQrCodes(mockQRCodes);
    setIsLoading(false);
  }, []);

  const handleDownload = (qrCodeUrl: string) => {
    console.log("Downloading QR code:", qrCodeUrl);
    // In a real app, this would trigger download
  };

  const handleShare = (qrCodeUrl: string) => {
    console.log("Sharing QR code:", qrCodeUrl);
    // In a real app, this would open share dialog
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "used":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return "✓";
      case "upcoming":
        return "⏳";
      case "expired":
        return "✗";
      case "used":
        return "✓";
      default:
        return "•";
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading QR codes...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex-1 p-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">My QR Codes</h1>
            <p className="text-gray-600">Access your entry QR codes for upcoming events</p>
          </div>

          {qrCodes.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No QR codes available</h3>
                <p className="text-gray-600 mb-4">
                  You don't have any active QR codes. Book an event to get started.
                </p>
                <Button onClick={() => window.location.href = "/"}>
                  Browse Events
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* QR Code List */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Your Tickets</h2>
                {qrCodes.map((qrCode) => (
                  <Card
                    key={qrCode.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedQRCode?.id === qrCode.id ? 'ring-2 ring-purple-500' : ''
                    }`}
                    onClick={() => setSelectedQRCode(qrCode)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-900">{qrCode.eventTitle}</h3>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(qrCode.status)}`}>
                              {getStatusIcon(qrCode.status)} {qrCode.status}
                            </span>
                          </div>
                          
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4" />
                              <span>{qrCode.eventDate}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4" />
                              <span>{qrCode.venue}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Users className="w-4 h-4" />
                              <span>{qrCode.ticketQuantity} ticket{qrCode.ticketQuantity > 1 ? 's' : ''}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* QR Code Display */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">QR Code</h2>
                {selectedQRCode ? (
                  <QRCodeDisplay
                    bookingId={selectedQRCode.bookingId}
                    userId="user_demo_123"
                    eventId="event_demo_456"
                    eventTitle={selectedQRCode.eventTitle}
                    ticketQuantity={selectedQRCode.ticketQuantity}
                    onDownload={handleDownload}
                    onShare={handleShare}
                    showExpiryInfo={true}
                    size="large"
                  />
                ) : (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Select a ticket</h3>
                      <p className="text-gray-600">
                        Choose a ticket from the list to view its QR code
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
                    onClick={() => window.location.href = "/bookings"}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>View All Bookings</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2"
                    onClick={() => window.location.href = "/"}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Browse Events</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2"
                    onClick={() => window.location.href = "/profile"}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Account Settings</span>
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