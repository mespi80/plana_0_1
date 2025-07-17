"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { QRCodeScanner } from "@/components/qr-code/qr-code-scanner";
import { CheckInValidation } from "@/components/qr-code/check-in-validation";
import { CheckInHistory } from "@/components/business/check-in-history";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Users, 
  Clock, 
  TrendingUp, 
  Wifi, 
  WifiOff,
  Camera,
  Download,
  Settings,
  AlertTriangle
} from "lucide-react";
import { QRCodeData, CheckInData } from "@/lib/qr-code";

export default function BusinessScannerPage() {
  const [scannedData, setScannedData] = useState<QRCodeData | null>(null);
  const [showValidation, setShowValidation] = useState(false);
  const [activeTab, setActiveTab] = useState("scanner");
  const [isOnline, setIsOnline] = useState(true);
  const [checkInStats, setCheckInStats] = useState({
    totalCheckedIn: 0,
    todayCheckedIn: 0,
    averageCheckInTime: "2.3 min",
    successRate: "98.5%"
  });

  // Mock business and event data
  const businessId = "business_demo_123";
  const eventId = "event_demo_456";

  // Check online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleCheckIn = (checkInData: CheckInData) => {
    console.log("Check-in successful:", checkInData);
    
    // Update stats
    setCheckInStats(prev => ({
      ...prev,
      totalCheckedIn: prev.totalCheckedIn + 1,
      todayCheckedIn: prev.todayCheckedIn + 1
    }));

    // In a real app, this would send data to the server
    // and update the database
  };

  const handleError = (error: string) => {
    console.error("Scanner error:", error);
    // In a real app, this would show a toast notification
  };

  const handleValidate = (isValid: boolean, reason?: string) => {
    console.log("Validation result:", { isValid, reason });
    
    if (isValid) {
      // Auto-check in if valid
      if (scannedData) {
        const checkInData = {
          bookingId: scannedData.bookingId,
          userId: scannedData.userId,
          eventId: scannedData.eventId,
          checkInTime: new Date().toISOString()
        };
        handleCheckIn(checkInData);
      }
    }
  };

  const handleScan = (data: QRCodeData) => {
    setScannedData(data);
    setShowValidation(true);
  };

  const resetScanner = () => {
    setScannedData(null);
    setShowValidation(false);
  };

  return (
    <AppLayout>
      <div className="flex-1 p-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Event Check-in Scanner</h1>
                <p className="text-gray-600">Scan customer QR codes to validate tickets and check them in</p>
              </div>
              <div className="flex items-center space-x-2">
                {isOnline ? (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <Wifi className="w-3 h-3 mr-1" />
                    Online
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                    <WifiOff className="w-3 h-3 mr-1" />
                    Offline
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Check-ins</p>
                    <p className="text-2xl font-bold text-gray-900">{checkInStats.totalCheckedIn}</p>
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
                    <p className="text-sm text-gray-600">Today's Check-ins</p>
                    <p className="text-2xl font-bold text-gray-900">{checkInStats.todayCheckedIn}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Avg. Check-in Time</p>
                    <p className="text-2xl font-bold text-gray-900">{checkInStats.averageCheckInTime}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Success Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{checkInStats.successRate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="scanner" className="flex items-center space-x-2">
                <Camera className="w-4 h-4" />
                <span>Scanner</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>History</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="scanner" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Scanner */}
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>QR Code Scanner</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={resetScanner}
                        >
                          Reset
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <QRCodeScanner
                        businessId={businessId}
                        eventId={eventId}
                        onCheckIn={handleCheckIn}
                        onError={handleError}
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* Validation */}
                <div className="space-y-4">
                  {showValidation && scannedData ? (
                    <CheckInValidation
                      scannedData={scannedData}
                      eventId={eventId}
                      onValidate={handleValidate}
                      onCheckIn={handleCheckIn}
                    />
                  ) : (
                    <Card>
                      <CardContent className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Camera className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to scan</h3>
                        <p className="text-gray-600">
                          Scan a customer's QR code to begin the check-in process
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>

              {/* Instructions */}
              <Card>
                <CardHeader>
                  <CardTitle>Scanner Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">For Staff</h4>
                      <ol className="text-sm text-gray-600 space-y-2">
                        <li>1. Ask customer to show their QR code</li>
                        <li>2. Point camera at the QR code</li>
                        <li>3. Wait for validation to complete</li>
                        <li>4. Confirm check-in if valid</li>
                        <li>5. Welcome customer to the event</li>
                      </ol>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Troubleshooting</h4>
                      <ul className="text-sm text-gray-600 space-y-2">
                        <li>• If QR code doesn't scan, ask customer to refresh</li>
                        <li>• For expired codes, direct to customer service</li>
                        <li>• For wrong event codes, verify event details</li>
                        <li>• For technical issues, use manual entry</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <CheckInHistory
                eventId={eventId}
                businessId={businessId}
              />
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Scanner Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle>Scanner Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Camera Quality</label>
                      <select className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                        <option value="high">High Quality</option>
                        <option value="medium">Medium Quality</option>
                        <option value="low">Low Quality</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700">Auto-scan Interval</label>
                      <select className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                        <option value="1">1 second</option>
                        <option value="2">2 seconds</option>
                        <option value="3">3 seconds</option>
                      </select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="sound" className="rounded" />
                      <label htmlFor="sound" className="text-sm text-gray-700">Enable sound notifications</label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="vibration" className="rounded" />
                      <label htmlFor="vibration" className="text-sm text-gray-700">Enable vibration feedback</label>
                    </div>
                  </CardContent>
                </Card>

                {/* Check-in Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle>Check-in Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Auto-check-in</label>
                      <select className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                        <option value="manual">Manual confirmation required</option>
                        <option value="auto">Automatic for valid tickets</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Check-in Window</label>
                      <select className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                        <option value="1">1 hour before event</option>
                        <option value="2">2 hours before event</option>
                        <option value="3">3 hours before event</option>
                      </select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="location" className="rounded" />
                      <label htmlFor="location" className="text-sm text-gray-700">Capture location data</label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="offline" className="rounded" />
                      <label htmlFor="offline" className="text-sm text-gray-700">Enable offline mode</label>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Export Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Data Export</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Export Check-in Data</p>
                        <p className="text-sm text-gray-600">Download all check-in records as CSV</p>
                      </div>
                      <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Backup Scanner Data</p>
                        <p className="text-sm text-gray-600">Create a backup of all scanner settings and data</p>
                      </div>
                      <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Backup
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
} 