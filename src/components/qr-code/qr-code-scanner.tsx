"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, CheckCircle, XCircle, AlertCircle, RefreshCw, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QRCodeService, QRCodeData, CheckInData } from "@/lib/qr-code";

interface QRCodeScannerProps {
  businessId: string;
  eventId: string;
  onCheckIn?: (checkInData: CheckInData) => void;
  onError?: (error: string) => void;
}

type ScanStatus = "idle" | "scanning" | "success" | "error" | "processing";

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
        setStatus("scanning");
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

  const processQRCode = async (qrData: string) => {
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
  };

  const handleScan = () => {
    // In a real implementation, this would use a QR code scanning library
    // For demo purposes, we'll simulate scanning
    const mockQRData = JSON.stringify({
      bookingId: "booking_demo_123",
      userId: "user_demo_456",
      eventId: eventId,
      eventTitle: "Demo Event",
      ticketQuantity: 2,
      timestamp: new Date().toISOString(),
      signature: "demo_signature"
    });

    processQRCode(mockQRData);
  };

  const handleManualEntry = () => {
    // In a real app, this would open a manual entry modal
    console.log("Manual entry not implemented");
  };

  const resetScanner = () => {
    setStatus("scanning");
    setScannedData(null);
    setError(null);
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
      default:
        return <Camera className="w-8 h-8 text-gray-400" />;
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case "idle":
        return "Ready to scan tickets";
      case "scanning":
        return "Point camera at QR code";
      case "success":
        return "Check-in successful!";
      case "error":
        return error || "Scan failed";
      case "processing":
        return "Processing ticket...";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Scanner Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>QR Code Scanner</span>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleManualEntry}
              >
                <Settings className="w-4 h-4 mr-2" />
                Manual Entry
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={resetScanner}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              {getStatusIcon()}
            </div>
            <h3 className={`text-lg font-medium ${
              status === "success" ? "text-green-600" :
              status === "error" ? "text-red-600" :
              status === "processing" ? "text-purple-600" :
              "text-gray-900"
            }`}>
              {getStatusMessage()}
            </h3>
          </div>
        </CardContent>
      </Card>

      {/* Camera View */}
      <Card>
        <CardContent className="p-4">
          <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
            {isCameraActive ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <canvas
                  ref={canvasRef}
                  className="hidden"
                />
                {/* Scanning overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 border-2 border-purple-500 rounded-lg relative">
                    <div className="absolute -top-1 -left-1 w-4 h-4 border-l-2 border-t-2 border-purple-500"></div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 border-r-2 border-t-2 border-purple-500"></div>
                    <div className="absolute -bottom-1 -left-1 w-4 h-4 border-l-2 border-b-2 border-purple-500"></div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 border-r-2 border-b-2 border-purple-500"></div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Camera not active</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Demo Button for Testing */}
      <Card>
        <CardContent className="p-4">
          <Button
            onClick={handleScan}
            className="w-full"
            disabled={status === "processing"}
          >
            <Camera className="w-4 h-4 mr-2" />
            Demo: Scan Test QR Code
          </Button>
        </CardContent>
      </Card>

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
            <div className="space-y-2">
              {checkInHistory.slice(-5).map((checkIn, index) => (
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