"use client";

import { useState, useEffect } from "react";
import { BusinessGuard } from "@/components/auth/role-guard";
import { BusinessDashboardLayout } from "@/components/business/business-dashboard-layout";
import { EventCreationForm } from "@/components/business/event-creation-form";
import { VenueCreationForm } from "@/components/business/venue-creation-form";
import { EventManagement } from "@/components/business/event-management";
import { EventPreview } from "@/components/business/event-preview";
import { QRCodeScanner } from "@/components/qr-code/qr-code-scanner";
import { CheckInHistory } from "@/components/business/check-in-history";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Users, 
  DollarSign, 
  BarChart3,
  Settings,
  Building2,
  Plus
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface BusinessStats {
  totalEvents: number;
  activeEvents: number;
  totalRevenue: number;
  totalBookings: number;
}

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

interface Business {
  id: string;
  name: string;
  description: string;
  business_type: string;
}

export default function BusinessDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showEventForm, setShowEventForm] = useState(false);
  const [showVenueForm, setShowVenueForm] = useState(false);
  const [showEventPreview, setShowEventPreview] = useState(false);
  const [previewEventData, setPreviewEventData] = useState<EventPreviewData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [business, setBusiness] = useState<Business | null>(null);
  const [businessStats, setBusinessStats] = useState<BusinessStats>({
    totalEvents: 0,
    activeEvents: 0,
    totalRevenue: 0,
    totalBookings: 0
  });

  // Load business data
  useEffect(() => {
    const loadBusiness = async () => {
      if (!supabase) {
        console.error('Supabase client not available');
        return;
      }

      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          return;
        }
        
        if (!session?.user) {
          console.log('No user session found');
          return;
        }

        const { data: businessData, error } = await supabase
          .from('businesses')
          .select('*')
          .eq('owner_id', session.user.id)
          .single();

        if (error) {
          console.error('Error loading business:', error);
          // If no business found, create one
          if (error.code === 'PGRST116') {
            const { data: newBusiness, error: createError } = await supabase
              .from('businesses')
              .insert({
                owner_id: session.user.id,
                name: `${session.user.user_metadata?.full_name || 'User'}'s Business`,
                business_type: 'general',
              })
              .select()
              .single();

            if (createError) {
              console.error('Error creating business:', createError);
            } else {
              setBusiness(newBusiness);
              await loadBusinessStats(newBusiness.id);
            }
          }
        } else {
          setBusiness(businessData);
          await loadBusinessStats(businessData.id);
        }
      } catch (error) {
        console.error('Error loading business:', error);
      }
    };

    loadBusiness();
  }, []);

  const loadBusinessStats = async (businessId: string) => {
    if (!supabase) {
      console.error('Supabase client not available');
      return;
    }

    try {
      // Get events count
      const { count: totalEvents, error: eventsError } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('venue.business_id', businessId);

      if (eventsError) {
        console.error('Error loading total events:', eventsError);
      }

      const { count: activeEvents, error: activeEventsError } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('venue.business_id', businessId)
        .eq('is_active', true);

      if (activeEventsError) {
        console.error('Error loading active events:', activeEventsError);
      }

      // Get bookings count and revenue
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('total_amount')
        .eq('event.venue.business_id', businessId);

      if (bookingsError) {
        console.error('Error loading bookings:', bookingsError);
      }

      const totalBookings = bookings?.length || 0;
      const totalRevenue = bookings?.reduce((sum, booking) => sum + booking.total_amount, 0) || 0;

      setBusinessStats({
        totalEvents: totalEvents || 0,
        activeEvents: activeEvents || 0,
        totalRevenue,
        totalBookings
      });
    } catch (error) {
      console.error('Error loading business stats:', error);
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setShowEventForm(false);
    setShowVenueForm(false);
    setShowEventPreview(false);
  };

  const handleCreateEvent = () => {
    setShowEventForm(true);
    setActiveTab("events");
  };

  const handleCreateVenue = () => {
    setShowVenueForm(true);
    setActiveTab("venues");
  };

  const handleEventFormSubmit = async (data: any) => {
    if (!business) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          venueId: data.venueId
        }),
      });

      if (response.ok) {
        const eventData = await response.json();
        
        // Set preview data and show preview
        setPreviewEventData({
          id: eventData.id,
          title: eventData.title,
          description: eventData.description,
          category: eventData.category,
          date: data.date,
          time: data.time,
          duration: data.duration,
          venue: "Selected Venue", // This will be updated with actual venue name
          address: "Venue Address",
          city: "City",
          state: "State",
          zipCode: "ZIP",
          price: eventData.price,
          capacity: eventData.capacity,
          images: data.images.map((file: File) => URL.createObjectURL(file)),
          tags: data.tags,
          isActive: eventData.is_active
        });
        
        setShowEventForm(false);
        setShowEventPreview(true);
        
        // Refresh stats
        await loadBusinessStats(business.id);
      } else {
        const errorData = await response.json();
        console.error('Error creating event:', errorData);
        alert('Failed to create event: ' + errorData.error);
      }
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVenueFormSubmit = async (data: any) => {
    if (!business) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/venues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          businessId: business.id
        }),
      });

      if (response.ok) {
        setShowVenueForm(false);
        alert('Venue created successfully!');
      } else {
        const errorData = await response.json();
        console.error('Error creating venue:', errorData);
        alert('Failed to create venue: ' + errorData.error);
      }
    } catch (error) {
      console.error('Error creating venue:', error);
      alert('Failed to create venue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEventFormCancel = () => {
    setShowEventForm(false);
  };

  const handleVenueFormCancel = () => {
    setShowVenueForm(false);
  };

  const handleEditEvent = (eventId: string) => {
    console.log("Editing event:", eventId);
  };

  const handleViewEvent = (eventId: string) => {
    console.log("Viewing event:", eventId);
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Event deleted successfully!');
        if (business) {
          await loadBusinessStats(business.id);
        }
      } else {
        const errorData = await response.json();
        alert('Failed to delete event: ' + errorData.error);
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event');
    }
  };

  const handleToggleEventStatus = async (eventId: string, status: string) => {
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: status === 'active'
        }),
      });

      if (response.ok) {
        alert('Event status updated successfully!');
        if (business) {
          await loadBusinessStats(business.id);
        }
      } else {
        const errorData = await response.json();
        alert('Failed to update event status: ' + errorData.error);
      }
    } catch (error) {
      console.error('Error updating event status:', error);
      alert('Failed to update event status');
    }
  };

  const handlePreviewClose = () => {
    setShowEventPreview(false);
    setPreviewEventData(null);
  };

  const handlePreviewEdit = () => {
    setShowEventPreview(false);
    setShowEventForm(true);
  };

  const handlePreviewPublish = () => {
    console.log("Publishing event:", previewEventData);
    setShowEventPreview(false);
    setPreviewEventData(null);
  };

  const renderOverviewContent = () => (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back!</h2>
        <p className="text-gray-600">Here&apos;s what&apos;s happening with your business today.</p>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button onClick={handleCreateEvent} className="h-20 flex flex-col items-center justify-center">
              <Calendar className="w-6 h-6 mb-2" />
              <span>Create New Event</span>
            </Button>
            
            <Button onClick={handleCreateVenue} className="h-20 flex flex-col items-center justify-center">
              <Building2 className="w-6 h-6 mb-2" />
              <span>Create New Venue</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <BarChart3 className="w-6 h-6 mb-2" />
              <span>View Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">New booking received</p>
                <p className="text-xs text-gray-600">Jazz Night at Blue Note - 2 tickets</p>
              </div>
              <span className="text-xs text-gray-500 ml-auto">2 min ago</span>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Payment received</p>
                <p className="text-xs text-gray-600">$100.00 from Comedy Show booking</p>
              </div>
              <span className="text-xs text-gray-500 ml-auto">15 min ago</span>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Calendar className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Event published</p>
                <p className="text-xs text-gray-600">Tech Startup Meetup is now live</p>
              </div>
              <span className="text-xs text-gray-500 ml-auto">1 hour ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderEventsContent = () => (
    <div className="p-6">
      {showEventForm ? (
        <EventCreationForm
          onSubmit={handleEventFormSubmit}
          onCancel={handleEventFormCancel}
          isLoading={isLoading}
          businessId={business?.id}
        />
      ) : (
        <EventManagement
          onEditEvent={handleEditEvent}
          onViewEvent={handleViewEvent}
          onDeleteEvent={handleDeleteEvent}
          onToggleStatus={handleToggleEventStatus}
          onCreateEvent={handleCreateEvent}
          businessId={business?.id}
        />
      )}
    </div>
  );

  const renderVenuesContent = () => (
    <div className="p-6">
      {showVenueForm ? (
        <VenueCreationForm
          onSubmit={handleVenueFormSubmit}
          onCancel={handleVenueFormCancel}
          isLoading={isLoading}
        />
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Venue Management</h2>
              <p className="text-gray-600">Manage your venues and locations</p>
            </div>
            <Button onClick={handleCreateVenue}>
              <Plus className="w-4 h-4 mr-2" />
              Create Venue
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Venues Yet</h3>
                <p className="text-gray-600 mb-4">
                  Create your first venue to start hosting events
                </p>
                <Button onClick={handleCreateVenue}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Venue
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  const renderScannerContent = () => (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">QR Code Scanner</h2>
        <p className="text-gray-600">Scan customer QR codes to validate tickets and check them in</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <QRCodeScanner
            businessId={business?.id || "business_demo_123"}
            eventId="event_demo_456"
            onCheckIn={(checkInData) => console.log("Check-in:", checkInData)}
            onError={(error) => console.error("Scanner error:", error)}
          />
        </div>
        
        <div>
          <CheckInHistory
            eventId="event_demo_456"
            businessId={business?.id || "business_demo_123"}
          />
        </div>
      </div>
    </div>
  );

  const renderAnalyticsContent = () => (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics Dashboard</h2>
        <p className="text-gray-600">View detailed analytics and insights for your business</p>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Coming Soon</h3>
            <p className="text-gray-600">
              Detailed analytics and insights will be available in the next update.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSettingsContent = () => (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Business Settings</h2>
        <p className="text-gray-600">Manage your business profile and preferences</p>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Settings Coming Soon</h3>
            <p className="text-gray-600">
              Business profile management and settings will be available in the next update.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverviewContent();
      case "events":
        return renderEventsContent();
      case "venues":
        return renderVenuesContent();
      case "scanner":
        return renderScannerContent();
      case "analytics":
        return renderAnalyticsContent();
      case "settings":
        return renderSettingsContent();
      default:
        return renderOverviewContent();
    }
  };

  return (
    <BusinessGuard>
      <BusinessDashboardLayout
        activeTab={activeTab}
        onTabChange={handleTabChange}
        businessStats={businessStats}
      >
        {renderContent()}
        
        {/* Event Preview Modal */}
        {showEventPreview && previewEventData && (
          <EventPreview
            eventData={previewEventData}
            onClose={handlePreviewClose}
            onEdit={handlePreviewEdit}
            onPublish={handlePreviewPublish}
          />
        )}
      </BusinessDashboardLayout>
    </BusinessGuard>
  );
} 