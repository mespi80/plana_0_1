"use client";

import { useState, useEffect } from "react";
import { 
  Building2, 
  MapPin, 
  Users, 
  Calendar,
  X,
  Edit,
  Save,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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

interface VenueDetailModalProps {
  venueId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (venueId: string) => void;
  onDelete: (venueId: string) => void;
}

export function VenueDetailModal({
  venueId,
  isOpen,
  onClose,
  onEdit,
  onDelete
}: VenueDetailModalProps) {
  const [venue, setVenue] = useState<Venue | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Venue>>({});

  useEffect(() => {
    if (isOpen && venueId) {
      loadVenue();
    }
  }, [isOpen, venueId]);

  const loadVenue = async () => {
    if (!venueId) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('venues')
        .select('*')
        .eq('id', venueId)
        .single();

      if (error) {
        console.error('Error loading venue:', error);
        return;
      }

      setVenue(data);
      setEditData(data);
    } catch (error) {
      console.error('Error loading venue:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!venue || !venueId) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('venues')
        .update(editData)
        .eq('id', venueId);

      if (error) {
        console.error('Error updating venue:', error);
        return;
      }

      // Reload venue data
      await loadVenue();
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating venue:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditData(venue || {});
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (!venue) return;
    
    if (confirm('Are you sure you want to delete this venue? This action cannot be undone.')) {
      onDelete(venue.id);
      onClose();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <Building2 className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-900">
              {isEditing ? 'Edit Venue' : 'Venue Details'}
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            {!isEditing && venue && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDelete}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading venue...</p>
            </div>
          ) : venue ? (
            <div className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Venue Name</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={editData.name || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter venue name"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">{venue.name}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    {isEditing ? (
                      <Textarea
                        id="description"
                        value={editData.description || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Enter venue description"
                        rows={3}
                      />
                    ) : (
                      <p className="text-gray-600">{venue.description || 'No description provided'}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="capacity">Capacity</Label>
                    {isEditing ? (
                      <Input
                        id="capacity"
                        type="number"
                        value={editData.capacity || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, capacity: parseInt(e.target.value) || 0 }))}
                        placeholder="Enter capacity"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">{venue.capacity} people</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Location Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Location</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="address">Address</Label>
                    {isEditing ? (
                      <Input
                        id="address"
                        value={editData.address || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="Enter full address"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">{venue.address}</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      {isEditing ? (
                        <Input
                          id="city"
                          value={editData.city || ''}
                          onChange={(e) => setEditData(prev => ({ ...prev, city: e.target.value }))}
                          placeholder="City"
                        />
                      ) : (
                        <p className="text-gray-900">{venue.city}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="state">State</Label>
                      {isEditing ? (
                        <Input
                          id="state"
                          value={editData.state || ''}
                          onChange={(e) => setEditData(prev => ({ ...prev, state: e.target.value }))}
                          placeholder="State"
                        />
                      ) : (
                        <p className="text-gray-900">{venue.state}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="zip_code">ZIP Code</Label>
                      {isEditing ? (
                        <Input
                          id="zip_code"
                          value={editData.zip_code || ''}
                          onChange={(e) => setEditData(prev => ({ ...prev, zip_code: e.target.value }))}
                          placeholder="ZIP Code"
                        />
                      ) : (
                        <p className="text-gray-900">{venue.zip_code}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="lat">Latitude</Label>
                      {isEditing ? (
                        <Input
                          id="lat"
                          type="number"
                          step="any"
                          value={editData.lat || ''}
                          onChange={(e) => setEditData(prev => ({ ...prev, lat: parseFloat(e.target.value) || 0 }))}
                          placeholder="Latitude"
                        />
                      ) : (
                        <p className="text-gray-900">{venue.lat}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="lng">Longitude</Label>
                      {isEditing ? (
                        <Input
                          id="lng"
                          type="number"
                          step="any"
                          value={editData.lng || ''}
                          onChange={(e) => setEditData(prev => ({ ...prev, lng: parseFloat(e.target.value) || 0 }))}
                          placeholder="Longitude"
                        />
                      ) : (
                        <p className="text-gray-900">{venue.lng}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Images */}
              {venue.images && venue.images.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Venue Images</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {venue.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Venue image ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Metadata */}
              <Card>
                <CardHeader>
                  <CardTitle>Venue Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Created</span>
                    <span className="text-sm text-gray-900">{formatDate(venue.created_at)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Last Updated</span>
                    <span className="text-sm text-gray-900">{formatDate(venue.updated_at)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-8">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Venue Not Found</h3>
              <p className="text-gray-600">The requested venue could not be found.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {isEditing && (
          <div className="flex items-center justify-end space-x-3 p-6 border-t">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 