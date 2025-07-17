"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Camera, CheckCircle, XCircle, AlertCircle, RefreshCw, Settings, Wifi, WifiOff, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { QRCodeService, QRCodeData, CheckInData } from "@/lib/qr-code";

interface QRCodeScannerProps {
  businessId: string;
  eventId: string;
  onCheckIn?: (checkInData: CheckInData) => void;
  onError?: (error: string) => void;
}

type ScanStatus = "idle" | "scanning" | "processing" | "success" | "error" | "offline";

export function QRCodeScanner({
  businessId,
  eventId,
  onCheckIn,
  onError
}: QRCodeScannerProps) {
  const [status, setStatus] = useState<ScanStatus>("idle");
  const [scannedData, setScannedData] = useState<QRCodeData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [checkInHistory, setCheckInHistory] = useState<CheckInData[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualQRData, setManualQRData] = useState("");
  const [scanningInterval, setScanningInterval] = useState<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
        setStatus("scanning");
        
        // Start continuous scanning
        startContinuousScanning();
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setError("Camera access denied. Please enable camera permissions.");
      setStatus("error");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
    
    if (scanningInterval) {
      clearInterval(scanningInterval);
      setScanningInterval(null);
    }
  };

  const startContinuousScanning = () => {
    // In a real implementation, this would use a QR code scanning library
    // For demo purposes, we'll simulate scanning every 2 seconds
    const interval = setInterval(() => {
      if (status === "scanning" && Math.random() < 0.1) { // 10% chance to "find" a QR code
        handleScan();
      }
    }, 2000);
    
    setScanningInterval(interval);
  };

  const captureFrame = (): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return null;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    return canvas.toDataURL('image/png');
  };

  const processQRCode = useCallback(async (qrData: string) => {
    setStatus("processing");

    try {
      // Validate QR code
      const validatedData = QRCodeService.validateQRCode(qrData);
      
      if (!validatedData) {
        throw new Error("Invalid or expired QR code");
      }

      // Check if this booking is for the current event
      if (validatedData.eventId !== eventId) {
        throw new Error("QR code is for a different event");
      }

      // Check if already checked in
      const alreadyCheckedIn = checkInHistory.some(
        checkIn => checkIn.bookingId === validatedData.bookingId
      );

      if (alreadyCheckedIn) {
        throw new Error("This ticket has already been used");
      }

      setScannedData(validatedData);
      setStatus("success");

      // Create check-in data
      const checkInData = QRCodeService.createCheckInData(validatedData);
      setCheckInHistory(prev => [...prev, checkInData]);
      
      onCheckIn?.(checkInData);

      // Auto-reset after 3 seconds
      setTimeout(() => {
        setStatus("scanning");
        setScannedData(null);
        setError(null);
      }, 3000);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to process QR code";
      setError(errorMessage);
      setStatus("error");
      onError?.(errorMessage);

      // Auto-reset after 3 seconds
      setTimeout(() => {
        setStatus("scanning");
        setError(null);
      }, 3000);
    }
  }, [eventId, checkInHistory, onCheckIn, onError]);

  const handleScan = () => {
    // In a real implementation, this would use a QR code scanning library
    // For demo purposes, we'll simulate scanning
    const mockQRData = JSON.stringify({
      bookingId: `booking_${Date.now()}`,
      userId: `user_${Math.floor(Math.random() * 1000)}`,
      eventId: eventId,
      eventTitle: "Demo Event",
      ticketQuantity: Math.floor(Math.random() * 4) + 1,
      timestamp: new Date().toISOString(),
      signature: "demo_signature"
    });

    processQRCode(mockQRData);
  };

  const handleManualEntry = () => {
    setShowManualEntry(true);
  };

  const handleManualSubmit = () => {
    if (manualQRData.trim()) {
      processQRCode(manualQRData.trim());
      setShowManualEntry(false);
      setManualQRData("");
    }
  };

  const resetScanner = () => {
    setStatus("scanning");
    setScannedData(null);
    setError(null);
  };

  const exportCheckInHistory = () => {
    const csvContent = [
      "Booking ID,User ID,Event ID,Check-in Time,Location",
      ...checkInHistory.map(checkIn => 
        `${checkIn.bookingId},${checkIn.userId},${checkIn.eventId},${checkIn.checkInTime},${checkIn.location ? `${checkIn.location.latitude},${checkIn.location.longitude}` : 'N/A'}`
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

  useEffect(() => {
    if (status === "scanning" && !isCameraActive) {
      startCamera();
    }

    return () => {
      stopCamera();
    };
  }, [status, isCameraActive]);

  const getStatusIcon = () => {
    switch (status) {
      case "scanning":
        return <Camera className="w-8 h-8 text-blue-500 animate-pulse" />;
      case "success":
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case "error":
        return <XCircle className="w-8 h-8 text-red-500" />;
      case "processing":
        return <RefreshCw className="w-8 h-8 text-purple-500 animate-spin" />;
      case "offline":
        return <WifiOff className="w-8 h-8 text-orange-500" />;
      default:
        return <Camera className="w-8 h-8 text-gray-400" />;
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case "idle":
        return "Ready to scan tickets";
      case "scanning":
        return isOnline ? "Point camera at QR code" : "Offline mode - scanning available";
      case "success":
        return "Check-in successful!";
      case "error":
        return error || "Scan failed";
      case "processing":
        return "Processing ticket...";
      case "offline":
        return "Working offline - some features limited";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-4">
      {/* Status Display */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            {getStatusIcon()}
            <div className="flex-1">
              <p className="font-medium">{getStatusMessage()}</p>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                {isOnline ? (
                  <Wifi className="w-4 h-4 text-green-500" />
                ) : (
                  <WifiOff className="w-4 h-4 text-orange-500" />
                )}
                <span>{isOnline ? "Online" : "Offline"}</span>
                <span>•</span>
                <span>{checkInHistory.length} check-ins today</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Camera View */}
      {isCameraActive && (
        <Card>
          <CardHeader>
            <CardTitle>Camera View</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-64 object-cover rounded-lg border"
              />
              <canvas
                ref={canvasRef}
                className="hidden"
              />
              {/* Scanning overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 border-2 border-blue-500 rounded-lg relative">
                  <div className="absolute inset-0 border-2 border-blue-500 rounded-lg animate-pulse"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Button
          onClick={handleScan}
          className="w-full"
          disabled={status === "processing"}
        >
          <Camera className="w-4 h-4 mr-2" />
          Demo: Scan Test QR Code
        </Button>

        <Dialog open={showManualEntry} onOpenChange={setShowManualEntry}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <Upload className="w-4 h-4 mr-2" />
              Manual Entry
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Manual QR Code Entry</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="qr-data">QR Code Data</Label>
                <Input
                  id="qr-data"
                  value={manualQRData}
                  onChange={(e) => setManualQRData(e.target.value)}
                  placeholder="Paste QR code data here..."
                  className="font-mono text-sm"
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleManualSubmit} className="flex-1">
                  Process
                </Button>
                <Button variant="outline" onClick={() => setShowManualEntry(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Button
          onClick={exportCheckInHistory}
          variant="outline"
          className="w-full"
          disabled={checkInHistory.length === 0}
        >
          <Upload className="w-4 h-4 mr-2" />
          Export History
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-800">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scanned Data Display */}
      {scannedData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Ticket Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Event:</span>
                <p className="font-medium">{scannedData.eventTitle}</p>
              </div>
              <div>
                <span className="text-gray-600">Tickets:</span>
                <p className="font-medium">{scannedData.ticketQuantity}</p>
              </div>
              <div>
                <span className="text-gray-600">Booking ID:</span>
                <p className="font-mono text-xs">{scannedData.bookingId}</p>
              </div>
              <div>
                <span className="text-gray-600">User ID:</span>
                <p className="font-mono text-xs">{scannedData.userId}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Check-in History */}
      {checkInHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Check-ins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {checkInHistory.slice(-5).reverse().map((checkIn, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <p className="text-sm font-medium">{checkIn.bookingId.slice(-8)}</p>
                    <p className="text-xs text-gray-600">
                      {new Date(checkIn.checkInTime).toLocaleTimeString()}
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