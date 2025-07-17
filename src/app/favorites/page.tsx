"use client";

import { Heart, MapPin, Calendar, DollarSign } from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";

export default function FavoritesPage() {
  // Mock favorites data
  const favorites = [
    {
      id: 1,
      title: "Jazz Night at Blue Note",
      location: "Blue Note Jazz Club",
      date: "Tonight, 8:00 PM",
      price: 25,
      image: "https://via.placeholder.com/80x80/6366f1/ffffff?text=Jazz"
    },
    {
      id: 2,
      title: "Comedy Show",
      location: "Laugh Factory",
      date: "Tomorrow, 7:30 PM",
      price: 18,
      image: "https://via.placeholder.com/80x80/ec4899/ffffff?text=Comedy"
    },
    {
      id: 3,
      title: "Art Gallery Opening",
      location: "Modern Art Museum",
      date: "Friday, 6:00 PM",
      price: 12,
      image: "https://via.placeholder.com/80x80/10b981/ffffff?text=Art"
    }
  ];

  return (
    <AppLayout>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <h1 className="text-xl font-bold text-gray-900">Favorites</h1>
      </header>

      {/* Content */}
      <div className="flex-1 p-4">
        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
            <p className="text-gray-500">Start exploring events and save your favorites here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {favorites.map((favorite) => (
              <div
                key={favorite.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center space-x-4"
              >
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0">
                  <img
                    src={favorite.image}
                    alt={favorite.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{favorite.title}</h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="truncate">{favorite.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{favorite.date}</span>
                  </div>
                </div>
                <div className="flex items-center text-lg font-semibold text-purple-600">
                  <DollarSign className="w-4 h-4 mr-1" />
                  {favorite.price}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
} 