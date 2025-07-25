"use client";

import { useState, useEffect } from "react";
import { 
  Calendar, 
  MapPin, 
  DollarSign, 
  Users, 
  Clock,
  X,
  Edit,
  Save,
  Trash2,
  Power,
  PowerOff,
  Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";

interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  start_time: string;
  end_time: string;
  price: number;
  capacity: number;
  available_tickets: number;
  is_active: boolean;
  venue_id: string;
  created_at: string;
  updated_at: string;
  venue?: {
    name: string;
    address: string;
    city: string;
    state: string;
  };
}

interface EventDetailModalProps {
  eventId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (eventId: string) => void;
  onDelete: (eventId: string) => void;
  onToggleStatus: (eventId: string, status: string) => void;
}

export function EventDetailModal({
  eventId,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onToggleStatus
}: EventDetailModalProps) {
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Event>>({});

  useEffect(() => {
    if (isOpen && eventId) {
      loadEvent();
    }
  }, [isOpen, eventId]);

  const loadEvent = async () => {
    if (!eventId) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          venue:venues(name, address, city, state)
        `)
        .eq('id', eventId)
        .single();

      if (error) {
        console.error('Error loading event:', error);
        return;
      }

      setEvent(data);
      setEditData(data);
    } catch (error) {
      console.error('Error loading event:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!event || !eventId) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('events')
        .update(editData)
        .eq('id', eventId);

      if (error) {
        console.error('Error updating event:', error);
        return;
      }

      // Reload event data
      await loadEvent();
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating event:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditData(event || {});
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (!event) return;
    
    if (confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      onDelete(event.id);
      onClose();
    }
  };

  const handleToggleStatus = () => {
    if (!event) return;
    
    const newStatus = event.is_active ? 'inactive' : 'active';
    onToggleStatus(event.id, newStatus);
    onClose();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <Badge className={isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
        {isActive ? 'Active' : 'Inactive'}
      </Badge>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <Calendar className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-900">
              {isEditing ? 'Edit Event' : 'Event Details'}
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            {!isEditing && event && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleToggleStatus}
                  className={event.is_active ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                >
                  {event.is_active ? (
                    <>
                      <PowerOff className="w-4 h-4 mr-2" />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <Power className="w-4 h-4 mr-2" />
                      Activate
                    </>
                  )}
                </Button>
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
              <p className="text-gray-600">Loading event...</p>
            </div>
          ) : event ? (
            <div className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Event Title</Label>
                    {isEditing ? (
                      <Input
                        id="title"
                        value={editData.title || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter event title"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">{event.title}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    {isEditing ? (
                      <Textarea
                        id="description"
                        value={editData.description || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Enter event description"
                        rows={3}
                      />
                    ) : (
                      <p className="text-gray-600">{event.description || 'No description provided'}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    {isEditing ? (
                      <select
                        id="category"
                        value={editData.category || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Select category</option>
                        <option value="Music">Music</option>
                        <option value="Comedy">Comedy</option>
                        <option value="Sports">Sports</option>
                        <option value="Technology">Technology</option>
                        <option value="Food & Drink">Food & Drink</option>
                        <option value="Art & Culture">Art & Culture</option>
                        <option value="Education">Education</option>
                        <option value="Health & Wellness">Health & Wellness</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      <Badge variant="secondary">{event.category}</Badge>
                    )}
                  </div>

                  <div>
                    <Label>Status</Label>
                    <div className="mt-1">
                      {getStatusBadge(event.is_active)}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Date and Time */}
              <Card>
                <CardHeader>
                  <CardTitle>Date & Time</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="start_time">Start Time</Label>
                      {isEditing ? (
                        <Input
                          id="start_time"
                          type="datetime-local"
                          value={editData.start_time ? editData.start_time.slice(0, 16) : ''}
                          onChange={(e) => setEditData(prev => ({ ...prev, start_time: e.target.value }))}
                        />
                      ) : (
                        <div className="flex items-center space-x-2 mt-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">
                            {formatDate(event.start_time)} at {formatTime(event.start_time)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="end_time">End Time</Label>
                      {isEditing ? (
                        <Input
                          id="end_time"
                          type="datetime-local"
                          value={editData.end_time ? editData.end_time.slice(0, 16) : ''}
                          onChange={(e) => setEditData(prev => ({ ...prev, end_time: e.target.value }))}
                        />
                      ) : (
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">
                            {formatDate(event.end_time)} at {formatTime(event.end_time)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pricing and Capacity */}
              <Card>
                <CardHeader>
                  <CardTitle>Pricing & Capacity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Price</Label>
                      {isEditing ? (
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={editData.price || ''}
                          onChange={(e) => setEditData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                          placeholder="0.00"
                        />
                      ) : (
                        <div className="flex items-center space-x-2 mt-1">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900 font-medium">{formatCurrency(event.price)}</span>
                        </div>
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
                        <div className="flex items-center space-x-2 mt-1">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">{event.capacity} people</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label>Available Tickets</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">
                        {event.available_tickets} of {event.capacity} available
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Venue Information */}
              {event.venue && (
                <Card>
                  <CardHeader>
                    <CardTitle>Venue</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900 font-medium">{event.venue.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        {event.venue.address}, {event.venue.city}, {event.venue.state}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Metadata */}
              <Card>
                <CardHeader>
                  <CardTitle>Event Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Created</span>
                    <span className="text-sm text-gray-900">{formatDate(event.created_at)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Last Updated</span>
                    <span className="text-sm text-gray-900">{formatDate(event.updated_at)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Event Not Found</h3>
              <p className="text-gray-600">The requested event could not be found.</p>
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