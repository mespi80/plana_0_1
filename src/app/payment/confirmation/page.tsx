"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AppLayout } from "@/components/layout/app-layout";
import { PaymentConfirmation } from "@/components/payment/payment-confirmation";

function PaymentConfirmationContent() {
  const searchParams = useSearchParams();
  
  // Get payment details from URL params or use defaults for demo
  const paymentIntentId = searchParams.get("payment_intent") || "pi_demo_123456789";
  const amount = parseFloat(searchParams.get("amount") || "50.00");
  const eventTitle = searchParams.get("event_title") || "Jazz Night at Blue Note";
  const eventDate = searchParams.get("event_date") || "Tonight, 8:00 PM";
  const venue = searchParams.get("venue") || "Blue Note Jazz Club";
  const ticketQuantity = parseInt(searchParams.get("ticket_quantity") || "2");

  const handleComplete = () => {
    // Navigate to booking details or home
    window.location.href = "/";
  };

  return (
    <PaymentConfirmation
      paymentIntentId={paymentIntentId}
      amount={amount}
      eventTitle={eventTitle}
      eventDate={eventDate}
      venue={venue}
      ticketQuantity={ticketQuantity}
      onComplete={handleComplete}
    />
  );
}

export default function PaymentConfirmationPage() {
  return (
    <AppLayout>
      <div className="flex-1 p-4 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <Suspense fallback={<div className="text-center py-8">Loading payment confirmation...</div>}>
            <PaymentConfirmationContent />
          </Suspense>
        </div>
      </div>
    </AppLayout>
  );
} 