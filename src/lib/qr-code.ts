import QRCode from 'qrcode';

export interface QRCodeData {
  bookingId: string;
  userId: string;
  eventId: string;
  eventTitle: string;
  ticketQuantity: number;
  timestamp: string;
  signature: string;
}

export interface CheckInData {
  bookingId: string;
  userId: string;
  eventId: string;
  checkInTime: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export class QRCodeService {
  private static readonly SECRET_KEY = process.env.QR_SECRET_KEY || 'plana-qr-secret-key';

  /**
   * Generate a unique QR code for a booking
   */
  static async generateBookingQR(bookingData: Omit<QRCodeData, 'signature'>): Promise<string> {
    const data: QRCodeData = {
      ...bookingData,
      signature: this.generateSignature(bookingData)
    };

    const qrData = JSON.stringify(data);
    
    try {
      const qrCodeDataURL = await QRCode.toDataURL(qrData, {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        width: 256
      });

      return qrCodeDataURL;
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw new Error('Failed to generate QR code');
    }
  }

  /**
   * Generate a QR code for business check-in scanner
   */
  static async generateBusinessQR(businessId: string, eventId: string): Promise<string> {
    const data = {
      type: 'business-checkin',
      businessId,
      eventId,
      timestamp: new Date().toISOString(),
      signature: this.generateSignature({ businessId, eventId })
    };

    const qrData = JSON.stringify(data);
    
    try {
      const qrCodeDataURL = await QRCode.toDataURL(qrData, {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        margin: 1,
        color: {
          dark: '#7c3aed', // Purple theme
          light: '#FFFFFF'
        },
        width: 256
      });

      return qrCodeDataURL;
    } catch (error) {
      console.error('Error generating business QR code:', error);
      throw new Error('Failed to generate business QR code');
    }
  }

  /**
   * Validate QR code data and signature
   */
  static validateQRCode(qrData: string): QRCodeData | null {
    try {
      const data: QRCodeData = JSON.parse(qrData);
      
      // Check if all required fields are present
      if (!data.bookingId || !data.userId || !data.eventId || !data.signature) {
        return null;
      }

      // Validate signature
      const expectedSignature = this.generateSignature({
        bookingId: data.bookingId,
        userId: data.userId,
        eventId: data.eventId,
        eventTitle: data.eventTitle,
        ticketQuantity: data.ticketQuantity,
        timestamp: data.timestamp
      });

      if (data.signature !== expectedSignature) {
        return null;
      }

      // Check if QR code is not expired (24 hours)
      const qrTimestamp = new Date(data.timestamp);
      const now = new Date();
      const hoursDiff = (now.getTime() - qrTimestamp.getTime()) / (1000 * 60 * 60);
      
      if (hoursDiff > 24) {
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error validating QR code:', error);
      return null;
    }
  }

  /**
   * Generate a unique signature for QR code validation
   */
  private static generateSignature(data: any): string {
    const dataString = JSON.stringify(data);
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(dataString + this.SECRET_KEY);
    
    // Simple hash function (in production, use crypto.subtle.digest)
    let hash = 0;
    for (let i = 0; i < dataBuffer.length; i++) {
      const char = dataBuffer[i];
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return hash.toString(16);
  }

  /**
   * Generate a unique booking ID
   */
  static generateBookingId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 9);
    return `booking_${timestamp}_${random}`;
  }

  /**
   * Create check-in data from QR code
   */
  static createCheckInData(qrData: QRCodeData, location?: { latitude: number; longitude: number }): CheckInData {
    return {
      bookingId: qrData.bookingId,
      userId: qrData.userId,
      eventId: qrData.eventId,
      checkInTime: new Date().toISOString(),
      location
    };
  }

  /**
   * Generate QR code for download (higher quality)
   */
  static async generateDownloadableQR(bookingData: Omit<QRCodeData, 'signature'>): Promise<string> {
    const data: QRCodeData = {
      ...bookingData,
      signature: this.generateSignature(bookingData)
    };

    const qrData = JSON.stringify(data);
    
    try {
      const qrCodeDataURL = await QRCode.toDataURL(qrData, {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        width: 512
      });

      return qrCodeDataURL;
    } catch (error) {
      console.error('Error generating downloadable QR code:', error);
      throw new Error('Failed to generate downloadable QR code');
    }
  }
} 