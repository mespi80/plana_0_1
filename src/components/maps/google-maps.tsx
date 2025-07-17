"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { getGoogleMapsApiKey, getGoogleMapsId, hasValidApiKey, DEFAULT_MAP_CENTER } from "@/lib/google-maps";
import { useMapClustering } from "./map-clustering";
import { MapPin } from "lucide-react";

interface Event {
  id: string;
  title: string;
  price: number;
  location: {
    lat: number;
    lng: number;
  };
  venue: string;
  startTime: string;
  endTime: string;
  category: string;
  image?: string;
}

interface GoogleMapsProps {
  events?: Event[];
  onEventClick?: (event: Event) => void;
  onMapClick?: (lat: number, lng: number) => void;
  center?: { lat: number; lng: number };
  zoom?: number;
}

export function GoogleMaps({
  events = [],
  onEventClick,
  onMapClick,
  center = DEFAULT_MAP_CENTER,
  zoom = 14
}: GoogleMapsProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const userLocationRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Memoize the initial center to prevent unnecessary re-initializations
  const initialCenter = useMemo(() => center, []);

  // Initialize Google Maps - only run once
  const initializeMap = useCallback(async () => {
    if (isInitialized || mapInstanceRef.current) {
      console.log("Map already initialized, skipping...");
      return;
    }

    try {
      console.log("Initializing Google Maps...");
      
      const loader = new Loader({
        apiKey: getGoogleMapsApiKey(),
        version: "weekly",
        libraries: ["places", "marker"]
      });

      const google = await loader.load();
      console.log("Google Maps loaded successfully");
      
      if (!mapRef.current) {
        console.error("Map ref is not available");
        return;
      }

      const map = new google.maps.Map(mapRef.current, {
        mapId: getGoogleMapsId(),
        center: initialCenter,
        zoom,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: true,
        mapTypeControl: true,
        fullscreenControl: true
      });

      console.log("Map created successfully");
      mapInstanceRef.current = map;
      setIsInitialized(true);

      // Force a resize event to ensure the map renders properly
      setTimeout(() => {
        if (mapInstanceRef.current) {
          google.maps.event.trigger(mapInstanceRef.current, 'resize');
          console.log("Map resize triggered");
        }
      }, 100);

      // Add click listener to map
      map.addListener("click", (e: google.maps.MapMouseEvent) => {
        if (e.latLng && onMapClick) {
          onMapClick(e.latLng.lat(), e.latLng.lng());
        }
      });

      setIsLoading(false);
    } catch (err) {
      console.error("Error initializing Google Maps:", err);
      setError("Failed to load Google Maps");
      setIsLoading(false);
    }
  }, [isInitialized, initialCenter, zoom, onMapClick]);

  // Get user location - only run once
  const getUserLocation = useCallback(() => {
    if (navigator.geolocation && !userLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const location = { lat: latitude, lng: longitude };
          setUserLocation(location);
          console.log("User location obtained:", location);
          
          // Update map center to user location only if map is initialized
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setCenter(location);
          }
        },
        (error) => {
          console.warn("Error getting location:", error);
        }
      );
    }
  }, [userLocation]);

  // Create user location marker
  const createUserLocationMarker = useCallback(() => {
    if (!mapInstanceRef.current || !userLocation) return;

    // Remove existing user location marker
    if (userLocationRef.current) {
      userLocationRef.current.map = null;
    }

    const userLocationElement = document.createElement('div');
    userLocationElement.innerHTML = `
      <div style="
        width: 20px;
        height: 20px;
        background: #6366f1;
        border: 2px solid white;
        border-radius: 50%;
        position: relative;
      ">
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 6px;
          height: 6px;
          background: white;
          border-radius: 50%;
        "></div>
      </div>
    `;

    userLocationRef.current = new google.maps.marker.AdvancedMarkerElement({
      position: userLocation,
      map: mapInstanceRef.current,
      content: userLocationElement,
      title: "Your Location"
    });
  }, [userLocation]);

  // Handle cluster click
  const handleClusterClick = useCallback((clusterEvents: Event[]) => {
    if (clusterEvents.length === 1 && onEventClick) {
      onEventClick(clusterEvents[0]);
    } else {
      console.log("Cluster clicked with events:", clusterEvents);
    }
  }, [onEventClick]);

  // Use clustering hook
  const { clusters, markers } = useMapClustering({
    map: mapInstanceRef.current,
    events,
    onClusterClick: handleClusterClick,
    onEventClick: onEventClick,
    maxZoom: 15,
    gridSize: 50
  });

  // Initialize map on mount - only once
  useEffect(() => {
    console.log("GoogleMaps component mounted");
    initializeMap();
  }, [initializeMap]);

  // Get user location on mount - only once
  useEffect(() => {
    getUserLocation();
  }, [getUserLocation]);

  // Update user location marker when location changes
  useEffect(() => {
    if (isInitialized) {
      createUserLocationMarker();
    }
  }, [createUserLocationMarker, isInitialized]);

  // Show placeholder if no valid API key
  if (!hasValidApiKey()) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <div className="text-center p-8">
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Map Not Available</h3>
          <p className="text-gray-500 mb-4">
            Google Maps API key is required to display the map.
          </p>
          <div className="bg-blue-50 rounded-lg p-4 text-left">
            <p className="text-sm text-blue-800 mb-2">
              To fix this, add your Google Maps API key to your environment variables:
            </p>
            <code className="text-xs bg-blue-100 p-2 rounded block">
              NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
            </code>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-2">Failed to load map</p>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[400px]">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
      <div 
        ref={mapRef} 
        className="w-full h-full min-h-[400px] bg-gray-200"
        style={{ minHeight: '400px', height: '100%' }}
      />
    </div>
  );
} 