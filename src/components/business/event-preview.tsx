"use client";

import { useState } from "react";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  DollarSign, 
  Users, 
  Eye, 
  EyeOff,
  Smartphone,
  Monitor,
  Tablet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface EventPreviewData {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  duration: string;
  venue: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  price: number;
  capacity: number;
  images: string[];
  tags: string[];
  isActive: boolean;
}

interface EventPreviewProps {
  eventData: EventPreviewData;
  onClose: () => void;
  onEdit: () => void;
  onPublish: () => void;
}

type PreviewMode = "desktop" | "tablet" | "mobile";

export function EventPreview({
  eventData,
  onClose,
  onEdit,
  onPublish
}: EventPreviewProps) {
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getPreviewWidth = () => {
    switch (previewMode) {
      case "mobile":
        return "max-w-sm";
      case "tablet":
        return "max-w-md";
      case "desktop":
        return "max-w-2xl";
      default:
        return "max-w-2xl";
    }
  };

  const renderEventCard = () => (
    <Card className="overflow-hidden">
      {/* Event Image */}
      <div className="aspect-video bg-gradient-to-br from-purple-500 to-blue-600 relative">
        {eventData.images.length > 0 ? (
          <img
            src={eventData.images[0]}
            alt={eventData.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-white">
              <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm opacity-75">Event Image</p>
            </div>
          </div>
        )}
        
        {/* Price Badge */}
        <div className="absolute top-4 right-4">
          <Badge className="bg-white text-gray-900 font-semibold">
            {formatCurrency(eventData.price)}
          </Badge>
        </div>

        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <Badge variant="secondary" className="bg-black/50 text-white">
            {eventData.category}
          </Badge>
        </div>
      </div>

      <CardContent className="p-6">
        {/* Event Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{eventData.title}</h2>
        
        {/* Event Description */}
        <p className="text-gray-600 mb-4 line-clamp-3">{eventData.description}</p>

        {/* Event Details */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Date & Time</p>
              <p className="font-medium text-gray-900">
                {formatDate(eventData.date)} at {formatTime(eventData.time)}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Location</p>
              <p className="font-medium text-gray-900">{eventData.venue}</p>
              <p className="text-sm text-gray-500">
                {eventData.address}, {eventData.city}, {eventData.state} {eventData.zipCode}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Users className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Capacity</p>
              <p className="font-medium text-gray-900">{eventData.capacity} people</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Duration</p>
              <p className="font-medium text-gray-900">{eventData.duration} hours</p>
            </div>
          </div>
        </div>

        {/* Tags */}
        {eventData.tags.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Tags</p>
            <div className="flex flex-wrap gap-2">
              {eventData.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button className="flex-1">
            Book Now
          </Button>
          <Button variant="outline" className="flex-1">
            Share Event
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-lg shadow-xl ${getPreviewWidth()} w-full max-h-[90vh] overflow-y-auto`}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Event Preview</h2>
              <p className="text-sm text-gray-600">How your event will appear to customers</p>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Preview Mode Toggle */}
              <div className="flex border border-gray-300 rounded-lg p-1">
                <button
                  onClick={() => setPreviewMode("desktop")}
                  className={`p-2 rounded ${
                    previewMode === "desktop" 
                      ? "bg-purple-100 text-purple-600" 
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewMode("tablet")}
                  className={`p-2 rounded ${
                    previewMode === "tablet" 
                      ? "bg-purple-100 text-purple-600" 
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewMode("mobile")}
                  className={`p-2 rounded ${
                    previewMode === "mobile" 
                      ? "bg-purple-100 text-purple-600" 
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>
              
              <Button variant="outline" size="sm" onClick={onClose}>
                <EyeOff className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Preview Content */}
        <div className="p-6">
          <div className="flex justify-center">
            {renderEventCard()}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <p>Preview mode: {previewMode}</p>
              <p>Status: {eventData.isActive ? "Active" : "Draft"}</p>
            </div>
            
            <div className="flex space-x-3">
              <Button variant="outline" onClick={onEdit}>
                Edit Event
              </Button>
              <Button onClick={onPublish}>
                {eventData.isActive ? "Update Event" : "Publish Event"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 