"use client";

import { useState, useEffect } from "react";
import { QRCodeService } from "@/lib/qr-code";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, QrCode } from "lucide-react";

interface UserQRCodeProps {
  userId: string;
  userEmail: string;
  userName: string;
}

export function UserQRCode({ userId, userEmail, userName }: UserQRCodeProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const generateQRCode = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const qrCode = await QRCodeService.generateUserQR(userId, userEmail, userName);
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

    try {
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = `user-qr-code-${userId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Download error:", err);
    }
  };

  const handleRefresh = () => {
    generateQRCode();
  };

  useEffect(() => {
    generateQRCode();
  }, [userId, userEmail, userName]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <QrCode className="w-5 h-5 text-purple-600" />
          <span>Your QR Code</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Generating QR code...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={generateQRCode} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        ) : qrCodeUrl ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                <img
                  src={qrCodeUrl}
                  alt="User QR Code"
                  className="w-48 h-48 object-contain"
                />
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                This QR code contains your unique user information
              </p>
              <p className="text-xs text-gray-500">
                User ID: {userId}
              </p>
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={handleDownload}
                className="flex-1"
                variant="outline"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="icon"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
} 