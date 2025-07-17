"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { QRCodeScanner } from "@/components/qr-code/qr-code-scanner";
import { CheckInValidation } from "@/components/qr-code/check-in-validation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Users, Clock, TrendingUp } from "lucide-react";
import { QRCodeData, CheckInData } from "@/lib/qr-code";

export default function BusinessScannerPage() {
  const [scannedData, setScannedData] = useState<QRCodeData | null>(null);
  const [showValidation, setShowValidation] = useState(false);
  const [checkInStats, setCheckInStats] = useState({
    totalCheckedIn: 0,
    todayCheckedIn: 0,
    averageCheckInTime: "2.3 min"
  });

  // Mock business and event data
  const businessId = "business_demo_123";
  const eventId = "event_demo_456";

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
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Event Check-in Scanner</h1>
            <p className="text-gray-600">Scan customer QR codes to validate tickets and check them in</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
          </div>

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
                      <TrendingUp className="w-8 h-8 text-gray-400" />
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
          <div className="mt-8">
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
          </div>
        </div>
      </div>
    </AppLayout>
  );
} 