"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Clock, Users, MapPin, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QRCodeService, QRCodeData, CheckInData } from "@/lib/qr-code";

interface CheckInValidationProps {
  scannedData: QRCodeData;
  eventId: string;
  onValidate: (isValid: boolean, reason?: string) => void;
  onCheckIn: (checkInData: CheckInData) => void;
}

interface ValidationResult {
  isValid: boolean;
  reason?: string;
  warnings?: string[];
}

export function CheckInValidation({
  scannedData,
  eventId,
  onValidate,
  onCheckIn
}: CheckInValidationProps) {
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkInHistory, setCheckInHistory] = useState<CheckInData[]>([]);

  // Mock check-in history - in a real app, this would come from an API
  useEffect(() => {
    const mockHistory: CheckInData[] = [
      {
        bookingId: "booking_123",
        userId: "user_456",
        eventId: eventId,
        checkInTime: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        location: { latitude: 40.7128, longitude: -74.0060 }
      }
    ];
    setCheckInHistory(mockHistory);
  }, [eventId]);

  const validateTicket = (): ValidationResult => {
    const warnings: string[] = [];
    let reason: string | undefined;

    // Check if QR code is for the correct event
    if (scannedData.eventId !== eventId) {
      return {
        isValid: false,
        reason: "QR code is for a different event"
      };
    }

    // Check if ticket has already been used
    const alreadyCheckedIn = checkInHistory.some(
      checkIn => checkIn.bookingId === scannedData.bookingId
    );

    if (alreadyCheckedIn) {
      return {
        isValid: false,
        reason: "This ticket has already been used"
      };
    }

    // Check if QR code is expired (24 hours)
    const qrTimestamp = new Date(scannedData.timestamp);
    const now = new Date();
    const hoursDiff = (now.getTime() - qrTimestamp.getTime()) / (1000 * 60 * 60);
    
    if (hoursDiff > 24) {
      return {
        isValid: false,
        reason: "QR code has expired"
      };
    }

    // Check if event time is appropriate (within 2 hours before or after event time)
    // This is a simplified check - in a real app, you'd check against actual event time
    const eventTime = new Date(); // Mock event time
    const timeDiff = Math.abs(now.getTime() - eventTime.getTime()) / (1000 * 60 * 60);
    
    if (timeDiff > 2) {
      warnings.push("Event time check-in window may be outside normal hours");
    }

    // Check ticket quantity
    if (scannedData.ticketQuantity > 10) {
      warnings.push("Large group booking - please verify with customer");
    }

    return {
      isValid: true,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  };

  const handleValidate = async () => {
    setIsProcessing(true);

    try {
      const result = validateTicket();
      setValidationResult(result);
      onValidate(result.isValid, result.reason);

      if (result.isValid) {
        // Create check-in data
        const checkInData = QRCodeService.createCheckInData(scannedData);
        setCheckInHistory(prev => [...prev, checkInData]);
        onCheckIn(checkInData);
      }
    } catch (error) {
      console.error("Validation error:", error);
      setValidationResult({
        isValid: false,
        reason: "Validation failed"
      });
      onValidate(false, "Validation failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = () => {
    onValidate(false, "Manually rejected");
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getValidationIcon = () => {
    if (!validationResult) return null;
    
    if (validationResult.isValid) {
      return <CheckCircle className="w-6 h-6 text-green-500" />;
    } else {
      return <XCircle className="w-6 h-6 text-red-500" />;
    }
  };

  const getValidationColor = () => {
    if (!validationResult) return "text-gray-600";
    
    if (validationResult.isValid) {
      return "text-green-600";
    } else {
      return "text-red-600";
    }
  };

  return (
    <div className="space-y-4">
      {/* Ticket Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Ticket Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-600">Event:</span>
                <span className="text-sm">{scannedData.eventTitle}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {scannedData.ticketQuantity} ticket{scannedData.ticketQuantity > 1 ? 's' : ''}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-600">Booking ID:</span>
                <span className="text-sm font-mono">{scannedData.bookingId.slice(-8)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-600">Generated:</span>
                <span className="text-sm">{formatTime(scannedData.timestamp)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Validation Result */}
      {validationResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {getValidationIcon()}
              <span className={getValidationColor()}>
                {validationResult.isValid ? "Valid Ticket" : "Invalid Ticket"}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {validationResult.reason && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{validationResult.reason}</p>
              </div>
            )}
            
            {validationResult.warnings && validationResult.warnings.length > 0 && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800 mb-1">Warnings:</p>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      {validationResult.warnings.map((warning, index) => (
                        <li key={index}>• {warning}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {validationResult.isValid && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  Ticket is valid and ready for check-in
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <Button
          onClick={handleValidate}
          disabled={isProcessing}
          className="flex-1"
          variant={validationResult?.isValid ? "default" : "outline"}
        >
          {isProcessing ? "Validating..." : "Validate & Check In"}
        </Button>
        
        <Button
          onClick={handleReject}
          disabled={isProcessing}
          variant="outline"
          className="flex-1"
        >
          Reject
        </Button>
      </div>

      {/* Recent Check-ins */}
      {checkInHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Check-ins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {checkInHistory.slice(-3).map((checkIn, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <p className="text-sm font-medium">{checkIn.bookingId.slice(-8)}</p>
                    <p className="text-xs text-gray-600">
                      {formatTime(checkIn.checkInTime)}
                    </p>
                  </div>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 