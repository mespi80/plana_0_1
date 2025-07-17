"use client";

import { Star, Users, Award, Shield, Clock, TrendingUp } from "lucide-react";

interface SocialProofProps {
  reviewCount: number;
  averageRating: number;
  totalAttendees?: number;
  eventCount?: number;
  trustIndicators?: {
    verifiedVenue?: boolean;
    instantBooking?: boolean;
    securePayment?: boolean;
    moneyBackGuarantee?: boolean;
  };
}

export function SocialProof({
  reviewCount,
  averageRating,
  totalAttendees = 0,
  eventCount = 0,
  trustIndicators = {}
}: SocialProofProps) {
  const {
    verifiedVenue = true,
    instantBooking = true,
    securePayment = true,
    moneyBackGuarantee = true
  } = trustIndicators;

  return (
    <div className="bg-purple-50 p-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Why people love this event
      </h2>
      
      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{reviewCount}+</div>
          <div className="text-sm text-gray-600">Happy attendees</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{averageRating}</div>
          <div className="text-sm text-gray-600">Average rating</div>
        </div>
        {totalAttendees > 0 && (
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{totalAttendees}+</div>
            <div className="text-sm text-gray-600">Total attendees</div>
          </div>
        )}
        {eventCount > 0 && (
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{eventCount}</div>
            <div className="text-sm text-gray-600">Events hosted</div>
          </div>
        )}
      </div>

      {/* Trust Indicators */}
      <div className="space-y-3">
        {verifiedVenue && (
          <div className="flex items-center text-sm text-gray-700">
            <Award className="w-4 h-4 mr-2 text-green-500" />
            <span>Verified venue with proven track record</span>
          </div>
        )}
        
        {instantBooking && (
          <div className="flex items-center text-sm text-gray-700">
            <Clock className="w-4 h-4 mr-2 text-blue-500" />
            <span>Instant booking confirmation</span>
          </div>
        )}
        
        {securePayment && (
          <div className="flex items-center text-sm text-gray-700">
            <Shield className="w-4 h-4 mr-2 text-purple-500" />
            <span>Secure payment processing</span>
          </div>
        )}
        
        {moneyBackGuarantee && (
          <div className="flex items-center text-sm text-gray-700">
            <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
            <span>Money-back guarantee if not satisfied</span>
          </div>
        )}
      </div>

      {/* Testimonial */}
      <div className="mt-6 bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <div className="flex items-center mb-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="w-3 h-3 text-yellow-400 fill-current"
                />
              ))}
            </div>
            <p className="text-sm text-gray-700 italic">
              "Amazing experience! The venue was perfect and the event exceeded all expectations. 
              Highly recommend for anyone looking for a great night out."
            </p>
            <p className="text-xs text-gray-500 mt-2">- Recent attendee</p>
          </div>
        </div>
      </div>
    </div>
  );
} 