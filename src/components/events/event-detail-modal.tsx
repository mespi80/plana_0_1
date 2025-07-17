"use client";

import { useState } from "react";
import { X, MapPin, Calendar, Clock, DollarSign, Heart, Users, Star, Share2 } from "lucide-react";
import { Event } from "@/types/event";

interface EventDetailModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  onBook: (event: Event) => void;
  onFavorite: (event: Event) => void;
}

export function EventDetailModal({
  event,
  isOpen,
  onClose,
  onBook,
  onFavorite
}: EventDetailModalProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [ticketQuantity, setTicketQuantity] = useState(1);

  if (!event || !isOpen) return null;

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    onFavorite(event);
  };

  const handleBook = () => {
    onBook(event);
    onClose();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Check out this event: ${event.title}`,
        url: window.location.href
      });
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(`${event.title} - ${window.location.href}`);
    }
  };

  const totalPrice = event.price * ticketQuantity;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="relative h-48 bg-gradient-to-br from-purple-500 to-blue-600">
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
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className="inline-block bg-white/90 backdrop-blur-sm text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
              {event.category}
            </span>
          </div>
          
          {/* Price Badge */}
          <div className="absolute bottom-4 right-4 bg-white rounded-full px-3 py-1 shadow-lg">
            <span className="text-lg font-bold text-purple-600">${event.price}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-12rem)]">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{event.title}</h2>
          
          {/* Event Details */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center text-gray-600">
              <MapPin className="w-5 h-5 mr-3 flex-shrink-0" />
              <span>{event.venue}</span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <Calendar className="w-5 h-5 mr-3 flex-shrink-0" />
              <span>{event.startTime}</span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <Clock className="w-5 h-5 mr-3 flex-shrink-0" />
              <span>{event.endTime}</span>
            </div>

            {event.availableTickets && (
              <div className="flex items-center text-gray-600">
                <Users className="w-5 h-5 mr-3 flex-shrink-0" />
                <span>{event.availableTickets} tickets available</span>
              </div>
            )}
          </div>

          {/* Description */}
          {event.description && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">About this event</h3>
              <p className="text-gray-700 leading-relaxed">{event.description}</p>
            </div>
          )}

          {/* Reviews/Ratings (Mock) */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex items-center mr-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= 4 ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">4.2 (128 reviews)</span>
              </div>
            </div>
          </div>

          {/* Ticket Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Select Tickets</h3>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">General Admission</p>
                <p className="text-sm text-gray-600">${event.price} per ticket</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                  className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  <span className="text-gray-600">-</span>
                </button>
                <span className="w-8 text-center font-medium">{ticketQuantity}</span>
                <button
                  onClick={() => setTicketQuantity(Math.min(event.availableTickets || 10, ticketQuantity + 1))}
                  className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  <span className="text-gray-600">+</span>
                </button>
              </div>
            </div>
          </div>

          {/* Total Price */}
          <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg mb-6">
            <span className="text-lg font-semibold text-gray-900">Total</span>
            <span className="text-2xl font-bold text-purple-600">${totalPrice}</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-200 bg-white">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleFavorite}
              className={`flex-1 py-3 px-4 rounded-xl border-2 transition-colors ${
                isFavorited
                  ? "border-red-500 bg-red-50 text-red-600"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Heart className={`w-5 h-5 mx-auto ${isFavorited ? "fill-current" : ""}`} />
            </button>
            
            <button
              onClick={handleShare}
              className="flex-1 py-3 px-4 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Share2 className="w-5 h-5 mx-auto" />
            </button>
            
            <button
              onClick={handleBook}
              className="flex-1 bg-purple-600 text-white py-3 px-4 rounded-xl hover:bg-purple-700 transition-colors font-medium"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 