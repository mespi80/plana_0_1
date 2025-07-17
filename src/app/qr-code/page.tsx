"use client";

import { QrCode, Download, Share2 } from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";

export default function QRCodePage() {
  return (
    <AppLayout>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <h1 className="text-xl font-bold text-gray-900">QR Code</h1>
      </header>

      {/* Content */}
      <div className="flex-1 p-4">
        <div className="max-w-sm mx-auto">
          {/* QR Code Display */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="w-48 h-48 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <QrCode className="w-24 h-24 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your PLANA QR Code</h3>
            <p className="text-sm text-gray-500 mb-6">
              Share this QR code with friends to discover events together
            </p>
            
            {/* Action Buttons */}
            <div className="space-y-3">
              <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center">
                <Download className="w-4 h-4 mr-2" />
                Download QR Code
              </button>
              <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </button>
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-6 bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">How it works</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Share your QR code with friends</li>
              <li>• They can scan it to join your group</li>
              <li>• Discover and book events together</li>
              <li>• Split payments and coordinate plans</li>
            </ul>
          </div>
        </div>
      </div>
    </AppLayout>
  );
} 