"use client";

import { useState, useEffect } from "react";
import { Heart, MapPin, Calendar, Clock, DollarSign, Trash2 } from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { EventDetailModal } from "@/components/events/event-detail-modal";
import { Event } from "@/types/event";
import Link from "next/link";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load favorites from localStorage (in a real app, this would come from the database)
  useEffect(() => {
    const savedFavorites = localStorage.getItem('plana-favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    }
  }, []);

  const handleRemoveFavorite = (eventId: string) => {
    const updatedFavorites = favorites.filter(event => event.id !== eventId);
    setFavorites(updatedFavorites);
    localStorage.setItem('plana-favorites', JSON.stringify(updatedFavorites));
  };

  const handleBook = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleFavorite = (event: Event) => {
    // This would toggle the favorite status in a real app
    console.log('Toggle favorite:', event);
  };

  if (favorites.length === 0) {
    return (
      <AppLayout>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No favorites yet</h2>
            <p className="text-gray-500 mb-6">
              Start discovering events and swipe right to add them to your favorites!
            </p>
            <a
              href="/discover"
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Start Discovering
            </a>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">My Favorites</h1>
          <div className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-red-500" />
            <span className="text-sm text-gray-500">{favorites.length} events</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 p-4 bg-gray-50">
        <div className="max-w-2xl mx-auto space-y-4">
          {favorites.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="flex">
                {/* Event Image */}
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-600 flex-shrink-0">
                  {event.image ? (
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold text-center px-2">
                        {event.category}
                      </span>
                    </div>
                  )}
                </div>

                {/* Event Details */}
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <Link href={`/events/${event.id}`}>
                      <h3 className="font-semibold text-gray-900 line-clamp-1 hover:text-purple-600 transition-colors cursor-pointer">
                        {event.title}
                      </h3>
                    </Link>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-purple-600">
                        ${event.price}
                      </span>
                      <button
                        onClick={() => handleRemoveFavorite(event.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1 mb-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-3 h-3 mr-2 flex-shrink-0" />
                      <span className="truncate">{event.venue}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-3 h-3 mr-2 flex-shrink-0" />
                      <span>{event.startTime}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-3 h-3 mr-2 flex-shrink-0" />
                      <span>{event.endTime}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleBook(event)}
                      className="flex-1 bg-purple-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center justify-center"
                    >
                      <DollarSign className="w-3 h-3 mr-1" />
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Event Detail Modal */}
      <EventDetailModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBook={handleBook}
        onFavorite={handleFavorite}
      />
    </AppLayout>
  );
} 