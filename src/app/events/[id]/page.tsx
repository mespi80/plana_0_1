"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  DollarSign, 
  Heart, 
  Share2, 
  Star, 
  Users, 
  Phone, 
  Globe, 
  ArrowLeft,
  Camera,
  MessageCircle,
  ThumbsUp
} from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { Event } from "@/types/event";
import { PhotoGallery } from "@/components/events/photo-gallery";
import { ReviewSection } from "@/components/events/review-section";
import { SocialProof } from "@/components/events/social-proof";
import Link from "next/link";

// Mock event data - in a real app, this would come from an API
const mockEvent: Event = {
  id: "1",
  title: "Jazz Night at Blue Note",
  price: 25,
  location: { lat: 40.7308, lng: -74.0027 },
  venue: "Blue Note Jazz Club",
  startTime: "Tonight, 8:00 PM",
  endTime: "11:00 PM",
  category: "Music",
  description: "Experience the best jazz music in NYC with live performances from top artists. Perfect for a romantic evening or night out with friends. The Blue Note has been a jazz institution since 1981, hosting legendary musicians and providing an intimate setting for unforgettable performances.",
  availableTickets: 15,
  capacity: 200,
  organizer: "Blue Note Entertainment Group",
  tags: ["Jazz", "Live Music", "Nightlife", "Romantic"],
  rating: 4.8,
  reviewCount: 342,
  image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop"
};

// Mock venue photos
const venuePhotos = [
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop"
];

// Mock reviews
const reviews = [
  {
    id: 1,
    user: "Sarah M.",
    rating: 5,
    date: "2 days ago",
    comment: "Amazing atmosphere and incredible music! The venue is intimate and the sound quality is perfect. Highly recommend!",
    helpful: 12,
    verified: true
  },
  {
    id: 2,
    user: "Michael R.",
    rating: 4,
    date: "1 week ago",
    comment: "Great jazz night! The performers were talented and the drinks were reasonably priced. Will definitely come back.",
    helpful: 8
  },
  {
    id: 3,
    user: "Jennifer L.",
    rating: 5,
    date: "2 weeks ago",
    comment: "Perfect date night spot. The music was soulful and the service was excellent. Can't wait to return!",
    helpful: 15,
    verified: true
  }
];

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(0);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  useEffect(() => {
    // In a real app, fetch event data based on params.id
    setEvent(mockEvent);
  }, [params.id]);

  if (!event) {
    return (
      <AppLayout>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading event...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    // In a real app, this would save to favorites
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Check out this event: ${event.title}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(`${event.title} - ${window.location.href}`);
    }
  };

  const handleBook = () => {
    // In a real app, this would navigate to booking flow
    console.log("Book event:", event);
  };

  const totalPrice = event.price * ticketQuantity;

  return (
    <AppLayout>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/" className="p-2 rounded-full hover:bg-gray-100">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <h1 className="text-lg font-semibold text-gray-900">Event Details</h1>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={handleFavorite}
              className={`p-2 rounded-full hover:bg-gray-100 ${
                isFavorited ? "text-red-500" : "text-gray-600"
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorited ? "fill-current" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        {/* Hero Image */}
        <div className="relative h-64 bg-gradient-to-br from-purple-500 to-blue-600">
          {event.image && (
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/20"></div>
          
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
        </div>

        {/* Event Info */}
        <div className="p-4 bg-white">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{event.title}</h1>
          
          {/* Rating */}
          <div className="flex items-center mb-4">
            <div className="flex items-center mr-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.floor(event.rating || 0) 
                      ? "text-yellow-400 fill-current" 
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {event.rating} ({event.reviewCount} reviews)
            </span>
          </div>

          {/* Event Details */}
          <div className="space-y-3 mb-6">
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

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="p-4 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">About this event</h2>
          <p className="text-gray-700 leading-relaxed">{event.description}</p>
        </div>

        {/* Venue Photos */}
        <div className="p-4 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Venue Photos</h2>
            <Camera className="w-5 h-5 text-gray-400" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {venuePhotos.map((photo, index) => (
              <div
                key={index}
                className={`aspect-video rounded-lg overflow-hidden cursor-pointer ${
                  selectedPhoto === index ? "ring-2 ring-purple-500" : ""
                }`}
                onClick={() => {
                  setSelectedPhoto(index);
                  setIsGalleryOpen(true);
                }}
              >
                <img
                  src={photo}
                  alt={`Venue photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Venue Details */}
        <div className="p-4 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Venue Information</h2>
          <div className="space-y-3">
            <div className="flex items-center text-gray-600">
              <MapPin className="w-5 h-5 mr-3 flex-shrink-0" />
              <span>131 W 3rd St, New York, NY 10012</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Phone className="w-5 h-5 mr-3 flex-shrink-0" />
              <span>(212) 475-8592</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Globe className="w-5 h-5 mr-3 flex-shrink-0" />
              <span>bluenote.com</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Users className="w-5 h-5 mr-3 flex-shrink-0" />
              <span>Capacity: {event.capacity} people</span>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <ReviewSection
          reviews={reviews}
          averageRating={event.rating || 0}
          totalReviews={event.reviewCount || 0}
        />

        {/* Social Proof */}
        <SocialProof
          reviewCount={event.reviewCount || 0}
          averageRating={event.rating || 0}
          totalAttendees={1500}
          eventCount={25}
          trustIndicators={{
            verifiedVenue: true,
            instantBooking: true,
            securePayment: true,
            moneyBackGuarantee: true
          }}
        />

        {/* Booking Section */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="bg-purple-50 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium text-gray-900">Select Tickets</span>
              <span className="text-sm text-gray-600">${event.price} each</span>
            </div>
            <div className="flex items-center justify-between">
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
              <span className="text-lg font-bold text-purple-600">${totalPrice}</span>
            </div>
          </div>
          
          <button
            onClick={handleBook}
            className="w-full bg-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center"
          >
            <DollarSign className="w-5 h-5 mr-2" />
            Book Now - ${totalPrice}
          </button>
        </div>
      </div>

      {/* Photo Gallery Modal */}
      <PhotoGallery
        photos={venuePhotos}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        initialIndex={selectedPhoto}
      />
    </AppLayout>
  );
} 