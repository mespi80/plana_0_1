"use client";

import { useState } from "react";
import { 
  MapPin, 
  Building2, 
  FileText,
  Upload,
  X,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { VenueImageUpload } from "@/components/ui/image-upload";
import { UploadResult } from "@/lib/storage";

interface VenueFormData {
  name: string;
  description: string;
  address: string;
  lat: number;
  lng: number;
  category: string;
  images: string[]; // Changed from File[] to string[] (URLs)
}

interface VenueCreationFormProps {
  onSubmit: (data: VenueFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const venueCategories = [
  "Restaurant",
  "Bar",
  "Club",
  "Theater",
  "Concert Hall",
  "Conference Center",
  "Outdoor Venue",
  "Sports Venue",
  "Gallery",
  "Museum",
  "Hotel",
  "Other"
];

export function VenueCreationForm({
  onSubmit,
  onCancel,
  isLoading = false
}: VenueCreationFormProps) {
  const [formData, setFormData] = useState<VenueFormData>({
    name: "",
    description: "",
    address: "",
    lat: 0,
    lng: 0,
    category: "",
    images: []
  });

  const handleInputChange = (field: keyof VenueFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUploadComplete = (results: UploadResult[]) => {
    const imageUrls = results.map(result => result.url);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...imageUrls]
    }));
  };

  const handleImageUploadError = (error: string) => {
    console.error('Image upload error:', error);
    // You could show a toast notification here
  };

  const removeImage = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img !== imageUrl)
    }));
  };

  const handleAddressChange = async (address: string) => {
    handleInputChange("address", address);
    
    // Try to geocode the address
    if (address.length > 10) {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
        );
        const data = await response.json();
        
        if (data.results?.[0]?.geometry?.location) {
          const { lat, lng } = data.results[0].geometry.location;
          handleInputChange("lat", lat);
          handleInputChange("lng", lng);
        }
      } catch (error) {
        console.error("Geocoding error:", error);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="w-5 h-5" />
            <span>Venue Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Venue Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter venue name"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="category">Category *</Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="">Select category</option>
                {venueCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe your venue..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5" />
            <span>Location</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleAddressChange(e.target.value)}
              placeholder="Enter full address"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="lat">Latitude</Label>
              <Input
                id="lat"
                type="number"
                step="any"
                value={formData.lat}
                onChange={(e) => handleInputChange("lat", parseFloat(e.target.value) || 0)}
                placeholder="0.000000"
              />
            </div>
            
            <div>
              <Label htmlFor="lng">Longitude</Label>
              <Input
                id="lng"
                type="number"
                step="any"
                value={formData.lng}
                onChange={(e) => handleInputChange("lng", parseFloat(e.target.value) || 0)}
                placeholder="0.000000"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Images */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="w-5 h-5" />
            <span>Venue Images</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <VenueImageUpload
            onUploadComplete={handleImageUploadComplete}
            onUploadError={handleImageUploadError}
          />

          {formData.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.images.map((imageUrl, index) => (
                <div key={index} className="relative">
                  <img
                    src={imageUrl}
                    alt={`Venue Image ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(imageUrl)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submit Buttons */}
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Create Venue"}
        </Button>
      </div>
    </form>
  );
} 