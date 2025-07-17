"use client";

import { useState } from "react";
import { CheckCircle, Calendar, Clock, MapPin, Users, Download, Share2, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QRCodeDisplay } from "@/components/qr-code/qr-code-display";

interface BookingConfirmationProps {
  bookingId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  venueAddress: string;
  ticketQuantity: number;
  totalAmount: number;
  qrCodeUrl?: string;
  onDownloadTicket?: () => void;
  onShare?: () => void;
  onContact?: () => void;
}

export function BookingConfirmation({
  bookingId,
  eventTitle,
  eventDate,
  eventTime,
  venue,
  venueAddress,
  ticketQuantity,
  totalAmount,
  qrCodeUrl,
  onDownloadTicket,
  onShare,
  onContact
}: BookingConfirmationProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    // Simulate download
    await new Promise(resolve => setTimeout(resolve, 2000));
    onDownloadTicket?.();
    setIsDownloading(false);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `I'm going to ${eventTitle}!`,
        text: `Join me at ${eventTitle} on ${eventDate} at ${eventTime}`,
        url: window.location.href
      });
    } else {
      onShare?.();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
        <p className="text-gray-600">
          Your tickets have been booked successfully. Check your email for confirmation details.
        </p>
      </div>

      {/* Booking Details */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Booking Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-medium text-gray-900">{eventDate}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Time</p>
                  <p className="font-medium text-gray-900">{eventTime}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Venue</p>
                  <p className="font-medium text-gray-900">{venue}</p>
                  <p className="text-sm text-gray-500">{venueAddress}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Tickets</p>
                  <p className="font-medium text-gray-900">{ticketQuantity}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Booking ID</span>
              <span className="font-mono text-sm font-medium text-gray-900">{bookingId}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-600">Total Paid</span>
              <span className="font-semibold text-gray-900">${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* QR Code */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Entry QR Code</CardTitle>
        </CardHeader>
        <CardContent>
          <QRCodeDisplay
            bookingId={bookingId}
            userId="user_demo_123"
            eventId="event_demo_456"
            eventTitle={eventTitle}
            ticketQuantity={ticketQuantity}
            onDownload={onDownloadTicket}
            onShare={onShare}
            showExpiryInfo={true}
            size="medium"
          />
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <Button
          onClick={handleDownload}
          disabled={isDownloading}
          variant="outline"
          className="flex items-center justify-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>{isDownloading ? "Downloading..." : "Download Ticket"}</span>
        </Button>
        
        <Button
          onClick={handleShare}
          variant="outline"
          className="flex items-center justify-center space-x-2"
        >
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </Button>
        
        <Button
          onClick={onContact}
          variant="outline"
          className="flex items-center justify-center space-x-2"
        >
          <Phone className="w-4 h-4" />
          <span>Contact</span>
        </Button>
      </div>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>What's Next?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-purple-600">1</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Check your email</p>
                <p className="text-xs text-gray-600">
                  We've sent you a confirmation email with all the details and your tickets.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-purple-600">2</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Save your QR code</p>
                <p className="text-xs text-gray-600">
                  Download or screenshot the QR code for easy entry at the venue.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-purple-600">3</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Arrive early</p>
                <p className="text-xs text-gray-600">
                  Please arrive 15 minutes before the event starts for check-in.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-purple-600">4</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Enjoy your event!</p>
                <p className="text-xs text-gray-600">
                  Have a great time and don't forget to share your experience.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Information */}
      <Card className="mt-6">
        <CardContent className="p-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">Important Information</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Free cancellation available up to 24 hours before the event</li>
              <li>• Please bring a valid ID for entry</li>
              <li>• No refunds for no-shows</li>
              <li>• Contact support if you need to modify your booking</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex space-x-3 mt-6">
        <Button variant="outline" className="flex-1" onClick={() => window.location.href = "/"}>
          Back to Events
        </Button>
        <Button className="flex-1" onClick={() => window.location.href = "/bookings"}>
          View My Bookings
        </Button>
      </div>
    </div>
  );
} 