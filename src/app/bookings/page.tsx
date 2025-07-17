"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { BookingManagement } from "@/components/booking/booking-management";

export default function BookingsPage() {
  const handleViewDetails = (booking: any) => {
    console.log("View booking details:", booking);
    // In a real app, navigate to booking details page
  };

  const handleModify = (booking: any) => {
    console.log("Modify booking:", booking);
    // In a real app, open modification modal or navigate to edit page
  };

  const handleCancel = (booking: any) => {
    console.log("Cancel booking:", booking);
    // In a real app, show cancellation confirmation
  };

  const handleDownloadTicket = (booking: any) => {
    console.log("Download ticket:", booking);
    // In a real app, generate and download ticket PDF
  };

  return (
    <AppLayout>
      <div className="flex-1 p-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <BookingManagement
            onViewDetails={handleViewDetails}
            onModify={handleModify}
            onCancel={handleCancel}
            onDownloadTicket={handleDownloadTicket}
          />
        </div>
      </div>
    </AppLayout>
  );
} 