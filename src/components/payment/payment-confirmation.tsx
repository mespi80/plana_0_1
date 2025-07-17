"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Clock, AlertCircle, CreditCard, Calendar, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PaymentConfirmationProps {
  paymentIntentId: string;
  amount: number;
  eventTitle: string;
  eventDate: string;
  venue: string;
  ticketQuantity: number;
  onComplete?: () => void;
}

type PaymentStatus = "processing" | "succeeded" | "failed";

export function PaymentConfirmation({
  paymentIntentId,
  amount,
  eventTitle,
  eventDate,
  venue,
  ticketQuantity,
  onComplete
}: PaymentConfirmationProps) {
  const [status, setStatus] = useState<PaymentStatus>("processing");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate payment processing
    const timer = setTimeout(() => {
      setStatus("succeeded");
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const getStatusIcon = () => {
    switch (status) {
      case "processing":
        return <Clock className="w-8 h-8 text-blue-500 animate-pulse" />;
      case "succeeded":
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case "failed":
        return <AlertCircle className="w-8 h-8 text-red-500" />;
    }
  };

  const getStatusTitle = () => {
    switch (status) {
      case "processing":
        return "Processing Payment...";
      case "succeeded":
        return "Payment Successful!";
      case "failed":
        return "Payment Failed";
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case "processing":
        return "Please wait while we process your payment. This may take a few moments.";
      case "succeeded":
        return "Your payment has been processed successfully. You will receive a confirmation email shortly.";
      case "failed":
        return "There was an issue processing your payment. Please try again or contact support.";
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "processing":
        return "text-blue-600";
      case "succeeded":
        return "text-green-600";
      case "failed":
        return "text-red-600";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Processing Payment</h3>
            <p className="text-gray-600">Please wait...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Payment Status */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              {getStatusIcon()}
            </div>
            <h2 className={`text-2xl font-bold mb-2 ${getStatusColor()}`}>
              {getStatusTitle()}
            </h2>
            <p className="text-gray-600 mb-6">
              {getStatusMessage()}
            </p>
            
            {status === "succeeded" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-green-800 font-medium">
                    Payment ID: {paymentIntentId}
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Booking Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <span>Booking Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Event Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">Event:</span>
                  <span className="font-medium">{eventTitle}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{eventDate}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{venue}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Payment Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tickets:</span>
                  <span className="font-medium">{ticketQuantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price per ticket:</span>
                  <span className="font-medium">${amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-medium text-gray-900">Total:</span>
                  <span className="font-bold text-gray-900">
                    ${(amount * ticketQuantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      {status === "succeeded" && (
        <Card>
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-green-600">1</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Check your email</p>
                  <p className="text-xs text-gray-600">We've sent you a confirmation with all the details.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-green-600">2</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Save your QR code</p>
                  <p className="text-xs text-gray-600">Download the QR code for easy entry at the venue.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-green-600">3</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Enjoy your event!</p>
                  <p className="text-xs text-gray-600">Arrive 15 minutes before the event starts.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3">
        {status === "succeeded" && (
          <Button
            onClick={onComplete}
            className="flex-1"
          >
            View Booking Details
          </Button>
        )}
        
        {status === "failed" && (
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        )}
        
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => window.location.href = "/"}
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
} 