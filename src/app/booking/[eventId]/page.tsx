"use client";

import { useParams, useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/app-layout";
import { BookingFlow } from "@/components/booking/booking-flow";

export default function EventBookingPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.eventId as string;

  // Mock event data - in a real app, this would come from an API
  const mockEvent = {
    id: eventId,
    title: "Jazz Night at Blue Note",
    date: "Tonight, 8:00 PM",
    time: "8:00 PM",
    venue: "Blue Note Jazz Club",
    address: "131 W 3rd St, New York, NY 10012",
    price: 50.00,
    availableTickets: 25,
    image: "/api/placeholder/300/200",
    description: "Experience the finest jazz music in an intimate setting."
  };

  const handleComplete = (bookingId: string) => {
    console.log("Booking completed:", bookingId);
    // Navigate to booking confirmation page
    router.push(`/booking/confirmation/${bookingId}`);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <AppLayout>
      <div className="flex-1 p-4 bg-gray-50">
        <BookingFlow
          event={mockEvent}
          onComplete={handleComplete}
          onCancel={handleCancel}
        />
      </div>
    </AppLayout>
  );
} 