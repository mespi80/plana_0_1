"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { AnalyticsDashboard } from "@/components/business/analytics-dashboard";
import { SalesTracking } from "@/components/business/sales-tracking";
import { CheckInHistory } from "@/components/business/check-in-history";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Calendar,
  Clock,
  Target,
  Award,
  Download,
  Filter,
  RefreshCw
} from "lucide-react";

export default function BusinessAnalyticsPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d" | "1y">("30d");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock business data
  const businessId = "business_demo_123";

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const exportAllReports = () => {
    // In a real app, this would export all analytics data
    console.log("Exporting all reports...");
  };

  return (
    <AppLayout>
      <div className="flex-1 p-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Business Analytics</h1>
                <p className="text-gray-600">Comprehensive insights into your business performance</p>
              </div>
              <div className="flex items-center space-x-3">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
                
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
                
                <button
                  onClick={exportAllReports}
                  className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Export All</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">$15,420</p>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-3 h-3 text-green-500" />
                      <span className="text-xs text-green-600">+12.5%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tickets Sold</p>
                    <p className="text-2xl font-bold text-gray-900">342</p>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-3 h-3 text-green-500" />
                      <span className="text-xs text-green-600">+8.3%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Check-in Rate</p>
                    <p className="text-2xl font-bold text-gray-900">87.1%</p>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-3 h-3 text-green-500" />
                      <span className="text-xs text-green-600">+2.1%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Avg. Rating</p>
                    <p className="text-2xl font-bold text-gray-900">4.6/5</p>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-3 h-3 text-green-500" />
                      <span className="text-xs text-green-600">+0.2</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Analytics Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="sales" className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4" />
                <span>Sales</span>
              </TabsTrigger>
              <TabsTrigger value="checkins" className="flex items-center space-x-2">
                <Target className="w-4 h-4" />
                <span>Check-ins</span>
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Reports</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <AnalyticsDashboard
                businessId={businessId}
                dateRange={dateRange}
              />
            </TabsContent>

            <TabsContent value="sales" className="space-y-6">
              <SalesTracking
                businessId={businessId}
                dateRange={dateRange}
              />
            </TabsContent>

            <TabsContent value="checkins" className="space-y-6">
              <CheckInHistory
                businessId={businessId}
              />
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Revenue Report */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <span>Revenue Report</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Detailed revenue analysis with growth trends and projections
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Revenue</span>
                        <span className="font-medium">$15,420.50</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Growth Rate</span>
                        <span className="font-medium text-green-600">+12.5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Avg. Ticket Price</span>
                        <span className="font-medium">$45.20</span>
                      </div>
                    </div>
                    <button className="w-full mt-4 px-3 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700">
                      <Download className="w-4 h-4 inline mr-2" />
                      Download Report
                    </button>
                  </CardContent>
                </Card>

                {/* Sales Report */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      <span>Sales Report</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Ticket sales analysis with conversion rates and customer insights
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Tickets Sold</span>
                        <span className="font-medium">342</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Conversion Rate</span>
                        <span className="font-medium">23.4%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Repeat Customers</span>
                        <span className="font-medium">34.2%</span>
                      </div>
                    </div>
                    <button className="w-full mt-4 px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
                      <Download className="w-4 h-4 inline mr-2" />
                      Download Report
                    </button>
                  </CardContent>
                </Card>

                {/* Check-in Report */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="w-5 h-5 text-purple-600" />
                      <span>Check-in Report</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Check-in performance and attendance analytics
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Check-in Rate</span>
                        <span className="font-medium">87.1%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">No-Show Rate</span>
                        <span className="font-medium">12.9%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Avg. Check-in Time</span>
                        <span className="font-medium">2.3 min</span>
                      </div>
                    </div>
                    <button className="w-full mt-4 px-3 py-2 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700">
                      <Download className="w-4 h-4 inline mr-2" />
                      Download Report
                    </button>
                  </CardContent>
                </Card>

                {/* Event Performance Report */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-orange-600" />
                      <span>Event Performance</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Individual event performance and ratings analysis
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Events</span>
                        <span className="font-medium">12</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Active Events</span>
                        <span className="font-medium">8</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Avg. Rating</span>
                        <span className="font-medium">4.6/5</span>
                      </div>
                    </div>
                    <button className="w-full mt-4 px-3 py-2 bg-orange-600 text-white rounded-md text-sm hover:bg-orange-700">
                      <Download className="w-4 h-4 inline mr-2" />
                      Download Report
                    </button>
                  </CardContent>
                </Card>

                {/* Customer Insights Report */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="w-5 h-5 text-indigo-600" />
                      <span>Customer Insights</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Customer behavior and segmentation analysis
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">New Customers</span>
                        <span className="font-medium">156</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Returning Customers</span>
                        <span className="font-medium">98</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">VIP Customers</span>
                        <span className="font-medium">45</span>
                      </div>
                    </div>
                    <button className="w-full mt-4 px-3 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700">
                      <Download className="w-4 h-4 inline mr-2" />
                      Download Report
                    </button>
                  </CardContent>
                </Card>

                {/* Custom Report */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Filter className="w-5 h-5 text-gray-600" />
                      <span>Custom Report</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Create custom reports with specific metrics and date ranges
                    </p>
                    <div className="space-y-3">
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                        <option>Select metrics...</option>
                        <option>Revenue Analysis</option>
                        <option>Customer Behavior</option>
                        <option>Event Performance</option>
                        <option>Check-in Analytics</option>
                      </select>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                        <option>Select date range...</option>
                        <option>Last 7 days</option>
                        <option>Last 30 days</option>
                        <option>Last 90 days</option>
                        <option>Custom range</option>
                      </select>
                    </div>
                    <button className="w-full mt-4 px-3 py-2 bg-gray-600 text-white rounded-md text-sm hover:bg-gray-700">
                      <Download className="w-4 h-4 inline mr-2" />
                      Generate Report
                    </button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
} 