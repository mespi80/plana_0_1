"use client";

import { useState } from "react";
import { Calendar, Clock, MapPin, Users, CreditCard, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentForm } from "@/components/payment/payment-form";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  price: number;
  availableTickets: number;
  image: string;
  description: string;
}

interface BookingFlowProps {
  event: Event;
  onComplete: (bookingId: string) => void;
  onCancel: () => void;
}

type BookingStep = "tickets" | "payment" | "confirmation";

export function BookingFlow({ event, onComplete, onCancel }: BookingFlowProps) {
  const [currentStep, setCurrentStep] = useState<BookingStep>("tickets");
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const steps = [
    { id: "tickets", label: "Select Tickets", icon: Users },
    { id: "payment", label: "Payment", icon: CreditCard },
    { id: "confirmation", label: "Confirmation", icon: CheckCircle }
  ];

  const handleTicketQuantityChange = (quantity: number) => {
    if (quantity >= 1 && quantity <= event.availableTickets) {
      setTicketQuantity(quantity);
    }
  };

  const handleProceedToPayment = () => {
    setCurrentStep("payment");
  };

  const handlePaymentSuccess = (paymentIntentId: string) => {
    // Generate a booking ID
    const newBookingId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setBookingId(newBookingId);
    setCurrentStep("confirmation");
  };

  const handlePaymentError = (error: string) => {
    console.error("Payment error:", error);
    // In a real app, show error message
  };

  const handleComplete = () => {
    if (bookingId) {
      onComplete(bookingId);
    }
  };

  const totalPrice = event.price * ticketQuantity;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = steps.findIndex(s => s.id === currentStep) > index;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  isActive 
                    ? "border-purple-500 bg-purple-500 text-white"
                    : isCompleted
                    ? "border-green-500 bg-green-500 text-white"
                    : "border-gray-300 bg-white text-gray-400"
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  isActive ? "text-purple-600" : isCompleted ? "text-green-600" : "text-gray-500"
                }`}>
                  {step.label}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    isCompleted ? "bg-green-500" : "bg-gray-300"
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {currentStep === "tickets" && (
            <Card>
              <CardHeader>
                <CardTitle>Select Tickets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Event Details */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">{event.title}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{event.venue}</span>
                    </div>
                  </div>
                </div>

                {/* Ticket Selection */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Number of Tickets</h4>
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTicketQuantityChange(ticketQuantity - 1)}
                      disabled={ticketQuantity <= 1}
                    >
                      -
                    </Button>
                    <span className="text-lg font-semibold w-8 text-center">{ticketQuantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTicketQuantityChange(ticketQuantity + 1)}
                      disabled={ticketQuantity >= event.availableTickets}
                    >
                      +
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {event.availableTickets - ticketQuantity} tickets remaining
                  </p>
                </div>

                {/* Date/Time Selection (if applicable) */}
                {event.date === "Multiple dates available" && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Select Date & Time</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date
                        </label>
                        <select
                          value={selectedDate || ""}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="">Select a date</option>
                          <option value="2024-01-20">January 20, 2024</option>
                          <option value="2024-01-21">January 21, 2024</option>
                          <option value="2024-01-22">January 22, 2024</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Time
                        </label>
                        <select
                          value={selectedTime || ""}
                          onChange={(e) => setSelectedTime(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="">Select a time</option>
                          <option value="18:00">6:00 PM</option>
                          <option value="19:00">7:00 PM</option>
                          <option value="20:00">8:00 PM</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <Button variant="outline" onClick={onCancel}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleProceedToPayment}
                    disabled={event.date === "Multiple dates available" && (!selectedDate || !selectedTime)}
                    className="flex-1"
                  >
                    Continue to Payment
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === "payment" && (
            <PaymentForm
              amount={event.price}
              eventId={event.id}
              eventTitle={event.title}
              ticketQuantity={ticketQuantity}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          )}

          {currentStep === "confirmation" && (
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
                  <p className="text-gray-600 mb-6">
                    Your tickets have been booked successfully. You'll receive a confirmation email shortly.
                  </p>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="text-sm">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Booking ID:</span>
                        <span className="font-medium">{bookingId}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Event:</span>
                        <span className="font-medium">{event.title}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Tickets:</span>
                        <span className="font-medium">{ticketQuantity}</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>Total Paid:</span>
                        <span>${totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button variant="outline" onClick={onCancel}>
                      Back to Events
                    </Button>
                    <Button onClick={handleComplete}>
                      View Booking Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">{event.title}</h4>
                  <p className="text-sm text-gray-600">{event.venue}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tickets ({ticketQuantity})</span>
                  <span>${event.price.toFixed(2)} each</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service fee</span>
                  <span>$2.00</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${(totalPrice + 2).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {currentStep === "tickets" && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Free cancellation</strong> up to 24 hours before the event
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 