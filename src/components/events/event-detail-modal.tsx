"use client";

import { useState } from "react";
import { X, MapPin, Calendar, Clock, DollarSign, Heart, Share2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Event {
  id: string;
  title: string;
  price: number;
  location: {
    lat: number;
    lng: number;
  };
  venue: string;
  startTime: string;
  endTime: string;
  category: string;
  image?: string;
  description?: string;
  capacity?: number;
  availableTickets?: number;
}

interface EventDetailModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  onBook?: (event: Event) => void;
  onFavorite?: (event: Event) => void;
}

export function EventDetailModal({
  event,
  isOpen,
  onClose,
  onBook,
  onFavorite
}: EventDetailModalProps) {
  const [isFavorited, setIsFavorited] = useState(false);

  if (!isOpen || !event) return null;

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    if (onFavorite) {
      onFavorite(event);
    }
  };

  const handleBook = () => {
    if (onBook) {
      onBook(event);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="relative">
          {/* Event Image */}
          <div className="w-full h-48 bg-gradient-to-br from-purple-500 to-blue-600 relative">
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
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/40 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Price Badge */}
            <div className="absolute bottom-4 left-4 bg-white rounded-full px-3 py-1 shadow-lg">
              <span className="text-lg font-bold text-purple-600">${event.price}</span>
            </div>

            {/* Favorite Button */}
            <button
              onClick={handleFavorite}
              className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
            >
              <Heart 
                className={`w-5 h-5 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
              />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title and Category */}
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h2>
            <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
              {event.category}
            </span>
          </div>

          {/* Event Details */}
          <div className="space-y-3 mb-6">
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
            <div className="mb-6">
              <p className="text-gray-700 text-sm leading-relaxed">
                {event.description}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handleBook}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Book Now - ${event.price}
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Event
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 