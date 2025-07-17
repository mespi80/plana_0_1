"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Download, 
  Calendar, 
  Users, 
  Clock, 
  MapPin,
  CheckCircle,
  XCircle,
  AlertTriangle
} from "lucide-react";
import { CheckInData } from "@/lib/qr-code";

interface CheckInHistoryProps {
  eventId?: string;
  businessId?: string;
}

interface CheckInWithDetails extends CheckInData {
  eventTitle?: string;
  userName?: string;
  userEmail?: string;
  ticketQuantity?: number;
  totalAmount?: number;
}

export function CheckInHistory({ eventId, businessId }: CheckInHistoryProps) {
  const [checkIns, setCheckIns] = useState<CheckInWithDetails[]>([]);
  const [filteredCheckIns, setFilteredCheckIns] = useState<CheckInWithDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("today");
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    const mockCheckIns: CheckInWithDetails[] = [
      {
        bookingId: "booking_123456",
        userId: "user_789",
        eventId: eventId || "event_demo_456",
        eventTitle: "Jazz Night at Blue Note",
        userName: "John Doe",
        userEmail: "john@example.com",
        ticketQuantity: 2,
        totalAmount: 120.00,
        checkInTime: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        location: { latitude: 40.7128, longitude: -74.0060 }
      },
      {
        bookingId: "booking_123457",
        userId: "user_790",
        eventId: eventId || "event_demo_456",
        eventTitle: "Jazz Night at Blue Note",
        userName: "Jane Smith",
        userEmail: "jane@example.com",
        ticketQuantity: 1,
        totalAmount: 60.00,
        checkInTime: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
        location: { latitude: 40.7128, longitude: -74.0060 }
      },
      {
        bookingId: "booking_123458",
        userId: "user_791",
        eventId: eventId || "event_demo_456",
        eventTitle: "Jazz Night at Blue Note",
        userName: "Mike Johnson",
        userEmail: "mike@example.com",
        ticketQuantity: 4,
        totalAmount: 240.00,
        checkInTime: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 1.5 hours ago
        location: { latitude: 40.7128, longitude: -74.0060 }
      }
    ];

    setCheckIns(mockCheckIns);
    setFilteredCheckIns(mockCheckIns);
  }, [eventId]);

  // Filter check-ins based on search and filters
  useEffect(() => {
    let filtered = checkIns;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(checkIn =>
        checkIn.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        checkIn.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        checkIn.userEmail?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      // In a real app, you'd have status field in the data
      // For now, we'll filter by ticket quantity
      if (statusFilter === "single") {
        filtered = filtered.filter(checkIn => checkIn.ticketQuantity === 1);
      } else if (statusFilter === "group") {
        filtered = filtered.filter(checkIn => (checkIn.ticketQuantity || 0) > 1);
      }
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(checkIn => {
        const checkInDate = new Date(checkIn.checkInTime);
        
        switch (dateFilter) {
          case "today":
            return checkInDate >= today;
          case "yesterday":
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            return checkInDate >= yesterday && checkInDate < today;
          case "week":
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return checkInDate >= weekAgo;
          default:
            return true;
        }
      });
    }

    setFilteredCheckIns(filtered);
  }, [checkIns, searchTerm, statusFilter, dateFilter]);

  const exportToCSV = () => {
    const csvContent = [
      "Booking ID,User Name,User Email,Event Title,Tickets,Amount,Check-in Time,Location",
      ...filteredCheckIns.map(checkIn => 
        `${checkIn.bookingId},${checkIn.userName || 'N/A'},${checkIn.userEmail || 'N/A'},${checkIn.eventTitle || 'N/A'},${checkIn.ticketQuantity || 1},${checkIn.totalAmount || 0},${checkIn.checkInTime},${checkIn.location ? `${checkIn.location.latitude},${checkIn.location.longitude}` : 'N/A'}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `check-in-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusIcon = (ticketQuantity: number) => {
    if (ticketQuantity === 1) {
      return <Users className="w-4 h-4 text-blue-500" />;
    } else if (ticketQuantity <= 4) {
      return <Users className="w-4 h-4 text-green-500" />;
    } else {
      return <AlertTriangle className="w-4 h-4 text-orange-500" />;
    }
  };

  const getStatusBadge = (ticketQuantity: number) => {
    if (ticketQuantity === 1) {
      return <Badge variant="secondary">Single</Badge>;
    } else if (ticketQuantity <= 4) {
      return <Badge variant="default">Group</Badge>;
    } else {
      return <Badge variant="destructive">Large Group</Badge>;
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const getStats = () => {
    const total = filteredCheckIns.length;
    const totalTickets = filteredCheckIns.reduce((sum, checkIn) => sum + (checkIn.ticketQuantity || 1), 0);
    const totalRevenue = filteredCheckIns.reduce((sum, checkIn) => sum + (checkIn.totalAmount || 0), 0);
    
    return { total, totalTickets, totalRevenue };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Check-ins</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Tickets</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalTickets}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Today</p>
                <p className="text-2xl font-bold text-gray-900">
                  {checkIns.filter(checkIn => {
                    const today = new Date();
                    const checkInDate = new Date(checkIn.checkInTime);
                    return checkInDate.toDateString() === today.toDateString();
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg. Time</p>
                <p className="text-2xl font-bold text-gray-900">2.3 min</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Check-in History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by booking ID, name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Types</option>
                <option value="single">Single Tickets</option>
                <option value="group">Group Tickets</option>
              </select>
              
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="week">This Week</option>
              </select>
              
              <Button onClick={exportToCSV} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Check-in List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredCheckIns.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No check-ins found</p>
              </div>
            ) : (
              filteredCheckIns.map((checkIn, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(checkIn.ticketQuantity || 1)}
                      {getStatusBadge(checkIn.ticketQuantity || 1)}
                    </div>
                    
                    <div>
                      <p className="font-medium text-gray-900">
                        {checkIn.userName || `User ${checkIn.userId.slice(-4)}`}
                      </p>
                      <p className="text-sm text-gray-600">
                        {checkIn.bookingId.slice(-8)} • {checkIn.ticketQuantity || 1} ticket{(checkIn.ticketQuantity || 1) > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      ${checkIn.totalAmount?.toFixed(2) || '0.00'}
                    </p>
                    <p className="text-xs text-gray-600">
                      {formatTime(checkIn.checkInTime)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 