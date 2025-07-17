"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Calendar, 
  Clock,
  Download,
  Filter,
  Eye,
  EyeOff,
  RefreshCw,
  Target,
  Award,
  Activity
} from "lucide-react";

interface AnalyticsData {
  // Revenue metrics
  totalRevenue: number;
  monthlyRevenue: number;
  revenueGrowth: number;
  averageTicketPrice: number;
  
  // Sales metrics
  totalTickets: number;
  monthlyTickets: number;
  ticketGrowth: number;
  conversionRate: number;
  
  // Check-in metrics
  totalCheckIns: number;
  checkInRate: number;
  averageCheckInTime: string;
  noShowRate: number;
  
  // Event metrics
  totalEvents: number;
  activeEvents: number;
  averageEventRating: number;
  repeatCustomerRate: number;
  
  // Time-based data
  dailySales: Array<{ date: string; revenue: number; tickets: number }>;
  monthlySales: Array<{ month: string; revenue: number; tickets: number }>;
  topEvents: Array<{ name: string; revenue: number; tickets: number; rating: number }>;
  customerSegments: Array<{ segment: string; count: number; revenue: number }>;
}

interface AnalyticsDashboardProps {
  businessId?: string;
  eventId?: string;
  dateRange?: "7d" | "30d" | "90d" | "1y";
}

export function AnalyticsDashboard({ 
  businessId, 
  eventId, 
  dateRange = "30d" 
}: AnalyticsDashboardProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDateRange, setSelectedDateRange] = useState(dateRange);
  const [showDetailedMetrics, setShowDetailedMetrics] = useState(false);

  // Mock analytics data - in a real app, this would come from an API
  useEffect(() => {
    const mockData: AnalyticsData = {
      totalRevenue: 15420.50,
      monthlyRevenue: 8234.75,
      revenueGrowth: 12.5,
      averageTicketPrice: 45.20,
      
      totalTickets: 342,
      monthlyTickets: 182,
      ticketGrowth: 8.3,
      conversionRate: 23.4,
      
      totalCheckIns: 298,
      checkInRate: 87.1,
      averageCheckInTime: "2.3 min",
      noShowRate: 12.9,
      
      totalEvents: 12,
      activeEvents: 8,
      averageEventRating: 4.6,
      repeatCustomerRate: 34.2,
      
      dailySales: [
        { date: "2024-01-01", revenue: 450.00, tickets: 10 },
        { date: "2024-01-02", revenue: 320.00, tickets: 7 },
        { date: "2024-01-03", revenue: 680.00, tickets: 15 },
        { date: "2024-01-04", revenue: 540.00, tickets: 12 },
        { date: "2024-01-05", revenue: 890.00, tickets: 20 },
        { date: "2024-01-06", revenue: 1200.00, tickets: 28 },
        { date: "2024-01-07", revenue: 980.00, tickets: 22 },
      ],
      
      monthlySales: [
        { month: "Jan", revenue: 15420.50, tickets: 342 },
        { month: "Dec", revenue: 13720.30, tickets: 304 },
        { month: "Nov", revenue: 12890.75, tickets: 286 },
        { month: "Oct", revenue: 14230.20, tickets: 315 },
      ],
      
      topEvents: [
        { name: "Jazz Night at Blue Note", revenue: 3200.00, tickets: 64, rating: 4.8 },
        { name: "Comedy Show", revenue: 2800.00, tickets: 56, rating: 4.6 },
        { name: "Wine Tasting", revenue: 2400.00, tickets: 48, rating: 4.7 },
        { name: "Art Exhibition", revenue: 1800.00, tickets: 36, rating: 4.5 },
      ],
      
      customerSegments: [
        { segment: "New Customers", count: 156, revenue: 7020.00 },
        { segment: "Returning Customers", count: 98, revenue: 4410.00 },
        { segment: "VIP Customers", count: 45, revenue: 2700.00 },
        { segment: "Group Bookings", count: 43, revenue: 1290.00 },
      ]
    };

    setAnalyticsData(mockData);
    setIsLoading(false);
  }, [businessId, eventId, selectedDateRange]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const getGrowthIcon = (value: number) => {
    if (value > 0) {
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    } else if (value < 0) {
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    }
    return <Activity className="w-4 h-4 text-gray-500" />;
  };

  const getGrowthColor = (value: number) => {
    if (value > 0) return "text-green-600";
    if (value < 0) return "text-red-600";
    return "text-gray-600";
  };

  const exportAnalytics = () => {
    if (!analyticsData) return;

    const csvContent = [
      "Metric,Value,Change",
      `Total Revenue,${formatCurrency(analyticsData.totalRevenue)},${formatPercentage(analyticsData.revenueGrowth)}`,
      `Monthly Revenue,${formatCurrency(analyticsData.monthlyRevenue)},`,
      `Total Tickets,${analyticsData.totalTickets},${formatPercentage(analyticsData.ticketGrowth)}`,
      `Conversion Rate,${analyticsData.conversionRate}%,`,
      `Check-in Rate,${analyticsData.checkInRate}%,`,
      `Average Event Rating,${analyticsData.averageEventRating}/5,`,
      `Repeat Customer Rate,${analyticsData.repeatCustomerRate}%,`
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-8">
        <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600">Track your business performance and insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedDateRange}
            onChange={(e) => setSelectedDateRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDetailedMetrics(!showDetailedMetrics)}
          >
            {showDetailedMetrics ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {showDetailedMetrics ? "Hide Details" : "Show Details"}
          </Button>
          
          <Button variant="outline" size="sm" onClick={exportAnalytics}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(analyticsData.totalRevenue)}</p>
                <div className="flex items-center space-x-1 mt-1">
                  {getGrowthIcon(analyticsData.revenueGrowth)}
                  <span className={`text-sm ${getGrowthColor(analyticsData.revenueGrowth)}`}>
                    {formatPercentage(analyticsData.revenueGrowth)}
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tickets Sold</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.totalTickets}</p>
                <div className="flex items-center space-x-1 mt-1">
                  {getGrowthIcon(analyticsData.ticketGrowth)}
                  <span className={`text-sm ${getGrowthColor(analyticsData.ticketGrowth)}`}>
                    {formatPercentage(analyticsData.ticketGrowth)}
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Check-in Rate</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.checkInRate}%</p>
                <p className="text-sm text-gray-600 mt-1">
                  {analyticsData.totalCheckIns} of {analyticsData.totalTickets} tickets
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Rating</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.averageEventRating}/5</p>
                <p className="text-sm text-gray-600 mt-1">
                  {analyticsData.totalEvents} events
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      {showDetailedMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Revenue Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Revenue</span>
                <span className="font-medium">{formatCurrency(analyticsData.monthlyRevenue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg. Ticket Price</span>
                <span className="font-medium">{formatCurrency(analyticsData.averageTicketPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Conversion Rate</span>
                <span className="font-medium">{analyticsData.conversionRate}%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Customer Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Repeat Customers</span>
                <span className="font-medium">{analyticsData.repeatCustomerRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">No-Show Rate</span>
                <span className="font-medium">{analyticsData.noShowRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg. Check-in Time</span>
                <span className="font-medium">{analyticsData.averageCheckInTime}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Event Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Active Events</span>
                <span className="font-medium">{analyticsData.activeEvents}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Events</span>
                <span className="font-medium">{analyticsData.totalEvents}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Success Rate</span>
                <span className="font-medium">87.5%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Top Performing Events */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.topEvents.map((event, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{event.name}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{event.tickets} tickets</span>
                      <span>•</span>
                      <span>{event.rating}/5 rating</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{formatCurrency(event.revenue)}</p>
                  <p className="text-sm text-gray-600">Revenue</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Customer Segments */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Segments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {analyticsData.customerSegments.map((segment, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{segment.segment}</h4>
                  <Badge variant="secondary">{segment.count}</Badge>
                </div>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(segment.revenue)}</p>
                <p className="text-sm text-gray-600">Total Revenue</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Sales Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Sales Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.monthlySales.map((month, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 text-sm font-medium text-gray-600">{month.month}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ 
                        width: `${(month.revenue / Math.max(...analyticsData.monthlySales.map(m => m.revenue))) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{formatCurrency(month.revenue)}</p>
                  <p className="text-sm text-gray-600">{month.tickets} tickets</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 