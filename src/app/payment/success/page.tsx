"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Download, QrCode, Mail, ArrowLeft, XCircle } from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState<string>("processing");
  const [bookingDetails, setBookingDetails] = useState<any>(null);

  useEffect(() => {
    const paymentIntentId = searchParams.get("payment_intent");
    const paymentIntentClientSecret = searchParams.get("payment_intent_client_secret");

    if (paymentIntentId) {
      // In a real app, you would verify the payment with your backend
      // and fetch booking details
      setPaymentStatus("success");
      setBookingDetails({
        id: "booking_123",
        eventTitle: "Jazz Night at Blue Note",
        eventDate: "Tonight, 8:00 PM",
        venue: "Blue Note Jazz Club",
        tickets: 2,
        total: 50.00,
        qrCode: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
      });
    }
  }, [searchParams]);

  if (paymentStatus === "processing") {
    return (
      <AppLayout>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Processing your payment...</h2>
            <p className="text-gray-600">Please wait while we confirm your booking.</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (paymentStatus === "success" && bookingDetails) {
    return (
      <AppLayout>
        <div className="flex-1 p-4 bg-gray-50">
          <div className="max-w-md mx-auto">
            {/* Success Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
              <p className="text-gray-600">Your booking has been confirmed.</p>
            </div>

            {/* Booking Details */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Event</span>
                  <span className="font-medium">{bookingDetails.eventTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date & Time</span>
                  <span className="font-medium">{bookingDetails.eventDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Venue</span>
                  <span className="font-medium">{bookingDetails.venue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tickets</span>
                  <span className="font-medium">{bookingDetails.tickets}</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="text-gray-900 font-semibold">Total Paid</span>
                  <span className="text-gray-900 font-semibold">${bookingDetails.total}</span>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Your QR Code</h2>
              <div className="text-center">
                <div className="w-48 h-48 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <QrCode className="w-32 h-32 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Show this QR code at the venue for entry
                </p>
                <button className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  <Download className="w-4 h-4 mr-2" />
                  Download QR Code
                </button>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">What's Next?</h2>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-purple-600">1</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Check your email</p>
                    <p className="text-xs text-gray-600">We've sent you a confirmation email with all the details.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-purple-600">2</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Save your QR code</p>
                    <p className="text-xs text-gray-600">Download or screenshot the QR code for easy access.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-purple-600">3</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Arrive on time</p>
                    <p className="text-xs text-gray-600">Please arrive 15 minutes before the event starts.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                <Mail className="w-4 h-4 mr-2" />
                Resend Confirmation Email
              </button>
              
              <Link href="/" className="block">
                <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </button>
              </Link>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Payment Failed</h2>
          <p className="text-gray-600 mb-4">There was an issue processing your payment.</p>
          <Link href="/">
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Try Again
            </button>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
} 