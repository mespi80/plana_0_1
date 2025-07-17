// Google Maps API Configuration (Minimal, TypeScript)

export const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export const DEFAULT_MAP_CENTER = {
  lat: 40.7128, // New York City
  lng: -74.0060,
};

// Use a proper map ID for Advanced Markers
// You can create a custom map ID in Google Cloud Console or use the default
export const GOOGLE_MAPS_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID || "8e0a97af9386fef";

export function getGoogleMapsApiKey(): string {
  if (!GOOGLE_MAPS_API_KEY) {
    console.warn('Google Maps API key is not set in NEXT_PUBLIC_GOOGLE_MAPS_API_KEY');
    return 'demo-key'; // This will show a demo map with watermarks
  }
  return GOOGLE_MAPS_API_KEY;
}

export function getGoogleMapsId(): string {
  return GOOGLE_MAPS_ID;
}

export function hasValidApiKey(): boolean {
  return !!GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY !== 'demo-key';
} 