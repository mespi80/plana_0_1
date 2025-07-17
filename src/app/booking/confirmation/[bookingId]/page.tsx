"use client";

import { useParams } from "next/navigation";
import { AppLayout } from "@/components/layout/app-layout";
import { BookingConfirmation } from "@/components/booking/booking-confirmation";

export default function BookingConfirmationPage() {
  const params = useParams();
  const bookingId = params.bookingId as string;

  // Mock booking data - in a real app, this would come from an API
  const mockBooking = {
    bookingId,
    eventTitle: "Jazz Night at Blue Note",
    eventDate: "Tonight, 8:00 PM",
    eventTime: "8:00 PM",
    venue: "Blue Note Jazz Club",
    venueAddress: "131 W 3rd St, New York, NY 10012",
    ticketQuantity: 2,
    totalAmount: 100.00,
    qrCodeUrl: "/api/qr/placeholder"
  };

  const handleDownloadTicket = () => {
    console.log("Downloading ticket for booking:", bookingId);
    // In a real app, generate and download PDF ticket
  };

  const handleShare = () => {
    console.log("Sharing booking:", bookingId);
    // In a real app, open share dialog
  };

  const handleContact = () => {
    console.log("Contacting support for booking:", bookingId);
    // In a real app, open contact form or redirect to support
  };

  return (
    <AppLayout>
      <div className="flex-1 p-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <BookingConfirmation
            bookingId={mockBooking.bookingId}
            eventTitle={mockBooking.eventTitle}
            eventDate={mockBooking.eventDate}
            eventTime={mockBooking.eventTime}
            venue={mockBooking.venue}
            venueAddress={mockBooking.venueAddress}
            ticketQuantity={mockBooking.ticketQuantity}
            totalAmount={mockBooking.totalAmount}
            qrCodeUrl={mockBooking.qrCodeUrl}
            onDownloadTicket={handleDownloadTicket}
            onShare={handleShare}
            onContact={handleContact}
          />
        </div>
      </div>
    </AppLayout>
  );
} 