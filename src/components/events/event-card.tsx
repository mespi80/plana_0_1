"use client";

import { useState } from "react";
import { MapPin, Calendar, Clock, DollarSign, Heart, X, Users } from "lucide-react";
import { Event } from "@/types/event";
import Link from "next/link";

interface EventCardProps {
  event: Event;
  onLike?: (event: Event) => void;
  onPass?: (event: Event) => void;
  onBook?: (event: Event) => void;
  className?: string;
}

export function EventCard({
  event,
  onLike,
  onPass,
  onBook,
  className = ""
}: EventCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isPassed, setIsPassed] = useState(false);

  const handleLike = () => {
    setIsLiked(true);
    if (onLike) {
      onLike(event);
    }
  };

  const handlePass = () => {
    setIsPassed(true);
    if (onPass) {
      onPass(event);
    }
  };

  const handleBook = () => {
    if (onBook) {
      onBook(event);
    }
  };

  return (
    <div className={`relative bg-white rounded-2xl shadow-lg overflow-hidden ${className}`}>
      {/* Event Image */}
      <div className="relative h-64 bg-gradient-to-br from-purple-500 to-blue-600">
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-white text-2xl font-bold">{event.category}</span>
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="inline-block bg-white/90 backdrop-blur-sm text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
            {event.category}
          </span>
        </div>

        {/* Price Badge */}
        <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 shadow-lg">
          <span className="text-lg font-bold text-purple-600">${event.price}</span>
        </div>

        {/* Like/Pass Overlay */}
        {isLiked && (
          <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
            <div className="bg-white rounded-full p-4 shadow-lg">
              <Heart className="w-12 h-12 text-green-500 fill-current" />
            </div>
          </div>
        )}
        
        {isPassed && (
          <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
            <div className="bg-white rounded-full p-4 shadow-lg">
              <X className="w-12 h-12 text-red-500" />
            </div>
          </div>
        )}
      </div>

              {/* Event Details */}
        <div className="p-6">
          <Link href={`/events/${event.id}`}>
            <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-purple-600 transition-colors cursor-pointer">
              {event.title}
            </h3>
          </Link>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-3 flex-shrink-0" />
            <span className="text-sm">{event.venue}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-3 flex-shrink-0" />
            <span className="text-sm">{event.startTime}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-3 flex-shrink-0" />
            <span className="text-sm">{event.endTime}</span>
          </div>

          {event.availableTickets && (
            <div className="flex items-center text-gray-600">
              <Users className="w-4 h-4 mr-3 flex-shrink-0" />
              <span className="text-sm">
                {event.availableTickets} tickets available
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        {event.description && (
          <p className="text-gray-700 text-sm leading-relaxed mb-6">
            {event.description}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={handlePass}
            className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center"
          >
            <X className="w-5 h-5 mr-2" />
            Pass
          </button>
          
          <button
            onClick={handleBook}
            className="flex-1 bg-purple-600 text-white py-3 px-4 rounded-xl hover:bg-purple-700 transition-colors flex items-center justify-center"
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Book Now
          </button>
          
          <button
            onClick={handleLike}
            className="flex-1 bg-red-500 text-white py-3 px-4 rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center"
          >
            <Heart className="w-5 h-5 mr-2" />
            Like
          </button>
        </div>
      </div>
    </div>
  );
} 