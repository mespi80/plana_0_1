"use client";

import { useState } from "react";
import { 
  Calendar, 
  BarChart3, 
  QrCode, 
  Settings, 
  Plus, 
  Users, 
  DollarSign,
  TrendingUp,
  Activity,
  Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BusinessDashboardLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  businessStats?: {
    totalEvents: number;
    activeEvents: number;
    totalRevenue: number;
    totalBookings: number;
  };
}

const dashboardTabs = [
  {
    id: "overview",
    label: "Overview",
    icon: Activity,
    description: "Dashboard overview and key metrics"
  },
  {
    id: "events",
    label: "Events",
    icon: Calendar,
    description: "Manage your events and bookings"
  },
  {
    id: "scanner",
    label: "QR Scanner",
    icon: QrCode,
    description: "Scan customer QR codes for check-ins"
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
    description: "View detailed analytics and reports"
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    description: "Business profile and preferences"
  }
];

export function BusinessDashboardLayout({
  children,
  activeTab = "overview",
  onTabChange,
  businessStats
}: BusinessDashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleTabChange = (tabId: string) => {
    onTabChange?.(tabId);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Building2 className="w-8 h-8 text-purple-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Business Dashboard</h1>
              <p className="text-sm text-gray-600">Manage your events and track performance</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <span className="sr-only">Toggle sidebar</span>
              <div className="w-4 h-4 flex flex-col justify-center items-center">
                <div className={`w-4 h-0.5 bg-gray-600 transition-all ${sidebarOpen ? 'rotate-45 translate-y-0.5' : ''}`}></div>
                <div className={`w-4 h-0.5 bg-gray-600 my-0.5 transition-all ${sidebarOpen ? 'opacity-0' : ''}`}></div>
                <div className={`w-4 h-0.5 bg-gray-600 transition-all ${sidebarOpen ? '-rotate-45 -translate-y-0.5' : ''}`}></div>
              </div>
            </Button>
            
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New Event
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`bg-white border-r border-gray-200 transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-16'
        }`}>
          <nav className="p-4 space-y-2">
            {dashboardTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-purple-100 text-purple-700 border border-purple-200'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && (
                    <div className="flex-1 text-left">
                      <div className="font-medium">{tab.label}</div>
                      <div className="text-xs opacity-75">{tab.description}</div>
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Stats Cards */}
          {activeTab === "overview" && businessStats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Events</p>
                      <p className="text-2xl font-bold text-gray-900">{businessStats.totalEvents}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Activity className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Active Events</p>
                      <p className="text-2xl font-bold text-gray-900">{businessStats.activeEvents}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Bookings</p>
                      <p className="text-2xl font-bold text-gray-900">{businessStats.totalBookings}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">{formatCurrency(businessStats.totalRevenue)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Page Content */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 