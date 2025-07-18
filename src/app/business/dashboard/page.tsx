"use client";

import { useState } from "react";
import { BusinessGuard } from "@/components/auth/role-guard";
import { BusinessDashboardLayout } from "@/components/business/business-dashboard-layout";
import { EventCreationForm } from "@/components/business/event-creation-form";
import { EventManagement } from "@/components/business/event-management";
import { EventPreview } from "@/components/business/event-preview";
import { QRCodeScanner } from "@/components/qr-code/qr-code-scanner";
import { CheckInHistory } from "@/components/business/check-in-history";
// AnalyticsDashboard component removed - will be implemented separately
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Users, 
  DollarSign, 
  BarChart3,
  Settings
} from "lucide-react";

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

export default function BusinessDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showEventForm, setShowEventForm] = useState(false);
  const [showEventPreview, setShowEventPreview] = useState(false);
  const [previewEventData, setPreviewEventData] = useState<EventPreviewData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock business stats
  const businessStats: BusinessStats = {
    totalEvents: 12,
    activeEvents: 8,
    totalRevenue: 15420.50,
    totalBookings: 342
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setShowEventForm(false);
    setShowEventPreview(false);
  };

  const handleCreateEvent = () => {
    setShowEventForm(true);
    setActiveTab("events");
  };

  const handleEventFormSubmit = async (data: any) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log("Creating event:", data);
    
    // Set preview data and show preview
    setPreviewEventData({
      id: "new_event",
      ...data,
      images: data.images.map((file: File) => URL.createObjectURL(file))
    });
    
    setShowEventForm(false);
    setShowEventPreview(true);
    setIsLoading(false);
  };

  const handleEventFormCancel = () => {
    setShowEventForm(false);
  };

  const handleEditEvent = (eventId: string) => {
    console.log("Editing event:", eventId);
  };

  const handleViewEvent = (eventId: string) => {
    console.log("Viewing event:", eventId);
  };

  const handleDeleteEvent = (eventId: string) => {
    console.log("Deleting event:", eventId);
  };

  const handleToggleEventStatus = (eventId: string, status: string) => {
    console.log("Toggling event status:", eventId, status);
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
            
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <BarChart3 className="w-6 h-6 mb-2" />
              <span>View Analytics</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Settings className="w-6 h-6 mb-2" />
              <span>Business Settings</span>
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
        />
      ) : (
        <EventManagement
          onEditEvent={handleEditEvent}
          onViewEvent={handleViewEvent}
          onDeleteEvent={handleDeleteEvent}
          onToggleStatus={handleToggleEventStatus}
          onCreateEvent={handleCreateEvent}
        />
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
            businessId="business_demo_123"
            eventId="event_demo_456"
            onCheckIn={(checkInData) => console.log("Check-in:", checkInData)}
            onError={(error) => console.error("Scanner error:", error)}
          />
        </div>
        
        <div>
          <CheckInHistory
            eventId="event_demo_456"
            businessId="business_demo_123"
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