"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  MapPin, 
  Edit, 
  Trash2, 
  Eye,
  Plus,
  Calendar,
  Users
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Venue {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  lat: number;
  lng: number;
  capacity: number;
  images: string[];
  business_id: string;
  created_at: string;
  updated_at: string;
}

interface VenueManagementProps {
  businessId?: string;
  onEditVenue?: (venueId: string) => void;
  onViewVenue?: (venueId: string) => void;
  onDeleteVenue?: (venueId: string) => void;
  onCreateVenue?: () => void;
}

export function VenueManagement({
  businessId,
  onEditVenue,
  onViewVenue,
  onDeleteVenue,
  onCreateVenue
}: VenueManagementProps) {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (businessId) {
      loadVenues();
    }
  }, [businessId]);

  const loadVenues = async () => {
    if (!supabase || !businessId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('venues')
        .select('*')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading venues:', error);
        setError('Failed to load venues');
      } else {
        setVenues(data || []);
      }
    } catch (err) {
      console.error('Error loading venues:', err);
      setError('Failed to load venues');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteVenue = async (venueId: string) => {
    if (!confirm('Are you sure you want to delete this venue? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/venues/${venueId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove from local state
        setVenues(prevVenues => prevVenues.filter(venue => venue.id !== venueId));
      } else {
        const error = await response.json();
        alert('Error deleting venue: ' + error.message);
      }
    } catch (error) {
      alert('Error deleting venue');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Venue Management</h2>
            <p className="text-gray-600">Manage your venues and locations</p>
          </div>
          <Button onClick={onCreateVenue}>
            <Plus className="w-4 h-4 mr-2" />
            Create Venue
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading venues...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Venue Management</h2>
            <p className="text-gray-600">Manage your venues and locations</p>
          </div>
          <Button onClick={onCreateVenue}>
            <Plus className="w-4 h-4 mr-2" />
            Create Venue
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <Building2 className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Venues</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={loadVenues} variant="outline">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Venue Management</h2>
          <p className="text-gray-600">Manage your venues and locations</p>
        </div>
        <Button onClick={onCreateVenue}>
          <Plus className="w-4 h-4 mr-2" />
          Create Venue
        </Button>
      </div>

      {venues.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Venues Yet</h3>
              <p className="text-gray-600 mb-4">
                Create your first venue to start hosting events
              </p>
              <Button onClick={onCreateVenue}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Venue
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map((venue) => (
            <Card key={venue.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{venue.name}</h3>
                      <p className="text-sm text-gray-600">{venue.city}, {venue.state}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onViewVenue?.(venue.id)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEditVenue?.(venue.id)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteVenue(venue.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{venue.address}</span>
                  </div>

                  {venue.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {venue.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>Capacity: {venue.capacity}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Created {formatDate(venue.created_at)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 