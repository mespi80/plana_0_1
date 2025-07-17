"use client";

import { useState, useEffect } from "react";
import { Download, Share2, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QRCodeService, QRCodeData } from "@/lib/qr-code";

interface QRCodeDisplayProps {
  bookingId: string;
  userId: string;
  eventId: string;
  eventTitle: string;
  ticketQuantity: number;
  onDownload?: (qrCodeUrl: string) => void;
  onShare?: (qrCodeUrl: string) => void;
  showExpiryInfo?: boolean;
  size?: "small" | "medium" | "large";
}

export function QRCodeDisplay({
  bookingId,
  userId,
  eventId,
  eventTitle,
  ticketQuantity,
  onDownload,
  onShare,
  showExpiryInfo = true,
  size = "medium"
}: QRCodeDisplayProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const sizeClasses = {
    small: "w-32 h-32",
    medium: "w-48 h-48",
    large: "w-64 h-64"
  };

  const generateQRCode = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const bookingData = {
        bookingId,
        userId,
        eventId,
        eventTitle,
        ticketQuantity,
        timestamp: new Date().toISOString()
      };

      const qrCode = await QRCodeService.generateBookingQR(bookingData);
      setQrCodeUrl(qrCode);
    } catch (err) {
      setError("Failed to generate QR code");
      console.error("QR code generation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!qrCodeUrl) return;

    setIsDownloading(true);
    try {
      const bookingData = {
        bookingId,
        userId,
        eventId,
        eventTitle,
        ticketQuantity,
        timestamp: new Date().toISOString()
      };

      const downloadableQR = await QRCodeService.generateDownloadableQR(bookingData);
      
      // Create download link
      const link = document.createElement('a');
      link.href = downloadableQR;
      link.download = `plana-ticket-${bookingId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      onDownload?.(downloadableQR);
    } catch (err) {
      console.error("Download error:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = () => {
    if (!qrCodeUrl) return;

    if (navigator.share) {
      navigator.share({
        title: `My ticket for ${eventTitle}`,
        text: `I'm going to ${eventTitle}!`,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // In a real app, show a toast notification
    }

    onShare?.(qrCodeUrl);
  };

  const handleRefresh = () => {
    generateQRCode();
  };

  useEffect(() => {
    generateQRCode();
  }, [bookingId, userId, eventId, eventTitle, ticketQuantity]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Generating QR code...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={handleRefresh} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span>Entry QR Code</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* QR Code Display */}
        <div className="flex justify-center">
          <div className={`${sizeClasses[size]} bg-white p-4 rounded-lg border shadow-sm`}>
            <img 
              src={qrCodeUrl} 
              alt="Entry QR Code" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Event Info */}
        <div className="text-center space-y-1">
          <h4 className="font-medium text-gray-900">{eventTitle}</h4>
          <p className="text-sm text-gray-600">
            {ticketQuantity} ticket{ticketQuantity > 1 ? 's' : ''} • Booking ID: {bookingId.slice(-8)}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            variant="outline"
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-2" />
            {isDownloading ? "Downloading..." : "Download"}
          </Button>
          
          <Button
            onClick={handleShare}
            variant="outline"
            className="flex-1"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>

        {/* Expiry Information */}
        {showExpiryInfo && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Valid for 24 hours</strong> from generation time
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Show this QR code at the venue for entry
            </p>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-gray-50 rounded-lg p-3">
          <h5 className="text-sm font-medium text-gray-900 mb-2">How to use:</h5>
          <ol className="text-xs text-gray-600 space-y-1">
            <li>1. Save or screenshot this QR code</li>
            <li>2. Arrive 15 minutes before the event</li>
            <li>3. Show the QR code to venue staff</li>
            <li>4. Enjoy your event!</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
} 