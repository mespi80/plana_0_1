"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Calendar,
  Clock,
  Filter,
  Download,
  Eye,
  BarChart3,
  Target,
  Award
} from "lucide-react";

interface SalesData {
  // Sales overview
  totalSales: number;
  totalTickets: number;
  averageTicketPrice: number;
  conversionRate: number;
  
  // Growth metrics
  salesGrowth: number;
  ticketGrowth: number;
  revenueGrowth: number;
  
  // Time-based data
  dailySales: Array<{ date: string; sales: number; tickets: number; events: number }>;
  weeklySales: Array<{ week: string; sales: number; tickets: number; growth: number }>;
  monthlySales: Array<{ month: string; sales: number; tickets: number; growth: number }>;
  
  // Event performance
  topSellingEvents: Array<{ name: string; sales: number; tickets: number; conversion: number }>;
  eventCategories: Array<{ category: string; sales: number; tickets: number; percentage: number }>;
  
  // Customer insights
  customerTypes: Array<{ type: string; count: number; sales: number; average: number }>;
  salesChannels: Array<{ channel: string; sales: number; tickets: number; percentage: number }>;
}

interface SalesTrackingProps {
  businessId?: string;
  dateRange?: "7d" | "30d" | "90d" | "1y";
}

export function SalesTracking({ businessId, dateRange = "30d" }: SalesTrackingProps) {
  const [salesData, setSalesData] = useState<SalesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDateRange, setSelectedDateRange] = useState(dateRange);
  const [showDetails, setShowDetails] = useState(false);

  // Mock sales data - in a real app, this would come from an API
  useEffect(() => {
    const mockData: SalesData = {
      totalSales: 15420.50,
      totalTickets: 342,
      averageTicketPrice: 45.20,
      conversionRate: 23.4,
      
      salesGrowth: 12.5,
      ticketGrowth: 8.3,
      revenueGrowth: 15.2,
      
      dailySales: [
        { date: "2024-01-01", sales: 450.00, tickets: 10, events: 2 },
        { date: "2024-01-02", sales: 320.00, tickets: 7, events: 1 },
        { date: "2024-01-03", sales: 680.00, tickets: 15, events: 3 },
        { date: "2024-01-04", sales: 540.00, tickets: 12, events: 2 },
        { date: "2024-01-05", sales: 890.00, tickets: 20, events: 4 },
        { date: "2024-01-06", sales: 1200.00, tickets: 28, events: 5 },
        { date: "2024-01-07", sales: 980.00, tickets: 22, events: 3 },
      ],
      
      weeklySales: [
        { week: "Week 1", sales: 8234.75, tickets: 182, growth: 12.5 },
        { week: "Week 2", sales: 7185.75, tickets: 160, growth: 8.3 },
        { week: "Week 3", sales: 6540.50, tickets: 145, growth: 5.2 },
        { week: "Week 4", sales: 5890.25, tickets: 131, growth: 2.1 },
      ],
      
      monthlySales: [
        { month: "Jan", sales: 15420.50, tickets: 342, growth: 12.5 },
        { month: "Dec", sales: 13720.30, tickets: 304, growth: 8.3 },
        { month: "Nov", sales: 12890.75, tickets: 286, growth: 5.2 },
        { month: "Oct", sales: 14230.20, tickets: 315, growth: 15.2 },
      ],
      
      topSellingEvents: [
        { name: "Jazz Night at Blue Note", sales: 3200.00, tickets: 64, conversion: 28.5 },
        { name: "Comedy Show", sales: 2800.00, tickets: 56, conversion: 25.2 },
        { name: "Wine Tasting", sales: 2400.00, tickets: 48, conversion: 22.1 },
        { name: "Art Exhibition", sales: 1800.00, tickets: 36, conversion: 18.7 },
        { name: "Live Music", sales: 1600.00, tickets: 32, conversion: 16.3 },
      ],
      
      eventCategories: [
        { category: "Music & Entertainment", sales: 5600.00, tickets: 120, percentage: 36.3 },
        { category: "Food & Dining", sales: 4200.00, tickets: 84, percentage: 27.2 },
        { category: "Arts & Culture", sales: 3200.00, tickets: 64, percentage: 20.8 },
        { category: "Sports & Recreation", sales: 1800.00, tickets: 36, percentage: 11.7 },
        { category: "Other", sales: 620.50, tickets: 12, percentage: 4.0 },
      ],
      
      customerTypes: [
        { type: "New Customers", count: 156, sales: 7020.00, average: 45.00 },
        { type: "Returning Customers", count: 98, sales: 4410.00, average: 45.00 },
        { type: "VIP Customers", count: 45, sales: 2700.00, average: 60.00 },
        { type: "Group Bookings", count: 43, sales: 1290.00, average: 30.00 },
      ],
      
      salesChannels: [
        { channel: "Mobile App", sales: 9252.30, tickets: 205, percentage: 60.0 },
        { channel: "Website", sales: 4626.15, tickets: 102, percentage: 30.0 },
        { channel: "Social Media", sales: 1542.05, tickets: 34, percentage: 10.0 },
      ]
    };

    setSalesData(mockData);
    setIsLoading(false);
  }, [businessId, selectedDateRange]);

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
    return <BarChart3 className="w-4 h-4 text-gray-500" />;
  };

  const getGrowthColor = (value: number) => {
    if (value > 0) return "text-green-600";
    if (value < 0) return "text-red-600";
    return "text-gray-600";
  };

  const exportSalesReport = () => {
    if (!salesData) return;

    const csvContent = [
      "Metric,Value,Growth",
      `Total Sales,${formatCurrency(salesData.totalSales)},${formatPercentage(salesData.salesGrowth)}`,
      `Total Tickets,${salesData.totalTickets},${formatPercentage(salesData.ticketGrowth)}`,
      `Average Ticket Price,${formatCurrency(salesData.averageTicketPrice)},`,
      `Conversion Rate,${salesData.conversionRate}%,`,
      `Revenue Growth,${formatPercentage(salesData.revenueGrowth)},`
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!salesData) {
    return (
      <div className="text-center py-8">
        <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No sales data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sales Tracking</h2>
          <p className="text-gray-600">Monitor ticket sales and revenue performance</p>
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
            onClick={() => setShowDetails(!showDetails)}
          >
            <Eye className="w-4 h-4 mr-2" />
            {showDetails ? "Hide Details" : "Show Details"}
          </Button>
          
          <Button variant="outline" size="sm" onClick={exportSalesReport}>
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
                <p className="text-sm font-medium text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(salesData.totalSales)}</p>
                <div className="flex items-center space-x-1 mt-1">
                  {getGrowthIcon(salesData.salesGrowth)}
                  <span className={`text-sm ${getGrowthColor(salesData.salesGrowth)}`}>
                    {formatPercentage(salesData.salesGrowth)}
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
                <p className="text-2xl font-bold text-gray-900">{salesData.totalTickets}</p>
                <div className="flex items-center space-x-1 mt-1">
                  {getGrowthIcon(salesData.ticketGrowth)}
                  <span className={`text-sm ${getGrowthColor(salesData.ticketGrowth)}`}>
                    {formatPercentage(salesData.ticketGrowth)}
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
                <p className="text-sm font-medium text-gray-600">Avg. Ticket Price</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(salesData.averageTicketPrice)}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {formatPercentage(salesData.revenueGrowth)} growth
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
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{salesData.conversionRate}%</p>
                <p className="text-sm text-gray-600 mt-1">
                  View to purchase
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Selling Events */}
      <Card>
        <CardHeader>
          <CardTitle>Top Selling Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {salesData.topSellingEvents.map((event, index) => (
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
                      <span>{event.conversion}% conversion</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{formatCurrency(event.sales)}</p>
                  <p className="text-sm text-gray-600">Revenue</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sales by Category */}
      <Card>
        <CardHeader>
          <CardTitle>Sales by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {salesData.eventCategories.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <div>
                    <p className="font-medium text-gray-900">{category.category}</p>
                    <p className="text-sm text-gray-600">{category.tickets} tickets</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{formatCurrency(category.sales)}</p>
                  <p className="text-sm text-gray-600">{category.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sales Channels */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Channels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {salesData.salesChannels.map((channel, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{channel.channel}</h4>
                  <Badge variant="secondary">{channel.percentage}%</Badge>
                </div>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(channel.sales)}</p>
                <p className="text-sm text-gray-600">{channel.tickets} tickets</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Customer Types */}
      {showDetails && (
        <Card>
          <CardHeader>
            <CardTitle>Customer Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {salesData.customerTypes.map((customer, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{customer.type}</h4>
                    <Badge variant="secondary">{customer.count}</Badge>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(customer.sales)}</p>
                  <p className="text-sm text-gray-600">Avg: {formatCurrency(customer.average)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weekly Sales Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Sales Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {salesData.weeklySales.map((week, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 text-sm font-medium text-gray-600">{week.week}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ 
                        width: `${(week.sales / Math.max(...salesData.weeklySales.map(w => w.sales))) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{formatCurrency(week.sales)}</p>
                  <div className="flex items-center space-x-1">
                    {getGrowthIcon(week.growth)}
                    <span className={`text-sm ${getGrowthColor(week.growth)}`}>
                      {formatPercentage(week.growth)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 