import { NextRequest, NextResponse } from "next/server";
import { QRCodeService } from "@/lib/qr-code";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case "generate":
        const { bookingId, userId, eventId, eventTitle, ticketQuantity } = data;
        
        if (!bookingId || !userId || !eventId || !eventTitle || !ticketQuantity) {
          return NextResponse.json(
            { error: "Missing required fields" },
            { status: 400 }
          );
        }

        const qrCodeData = {
          bookingId,
          userId,
          eventId,
          eventTitle,
          ticketQuantity,
          timestamp: new Date().toISOString()
        };

        const qrCodeUrl = await QRCodeService.generateBookingQR(qrCodeData);
        
        return NextResponse.json({
          success: true,
          qrCodeUrl,
          data: qrCodeData
        });

      case "validate":
        const { qrData } = data;
        
        if (!qrData) {
          return NextResponse.json(
            { error: "QR data is required" },
            { status: 400 }
          );
        }

        const validatedData = QRCodeService.validateQRCode(qrData);
        
        if (!validatedData) {
          return NextResponse.json({
            success: false,
            error: "Invalid or expired QR code"
          });
        }

        return NextResponse.json({
          success: true,
          data: validatedData
        });

      case "check-in":
        const { bookingId: checkInBookingId, userId: checkInUserId, eventId: checkInEventId } = data;
        
        if (!checkInBookingId || !checkInUserId || !checkInEventId) {
          return NextResponse.json(
            { error: "Missing required fields for check-in" },
            { status: 400 }
          );
        }

        const checkInData = QRCodeService.createCheckInData({
          bookingId: checkInBookingId,
          userId: checkInUserId,
          eventId: checkInEventId,
          eventTitle: data.eventTitle || "Unknown Event",
          ticketQuantity: data.ticketQuantity || 1,
          timestamp: data.timestamp || new Date().toISOString(),
          signature: "demo_signature"
        });

        // In a real app, you would save this to the database
        console.log("Check-in recorded:", checkInData);

        return NextResponse.json({
          success: true,
          checkInData
        });

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("QR code API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get("bookingId");
    const action = searchParams.get("action");

    if (action === "validate" && bookingId) {
      // This would typically validate against a database
      // For demo purposes, we'll return a mock validation
      return NextResponse.json({
        success: true,
        isValid: true,
        bookingId,
        message: "Booking is valid"
      });
    }

    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  } catch (error) {
    console.error("QR code API GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 