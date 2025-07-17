"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Navigation, AlertCircle, CheckCircle, Loader2 } from "lucide-react";

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  address?: string;
}

interface LocationHandlerProps {
  onLocationUpdate?: (location: LocationData) => void;
  onPermissionChange?: (permission: PermissionState) => void;
  autoRequest?: boolean;
  className?: string;
}

export function LocationHandler({
  onLocationUpdate,
  onPermissionChange,
  autoRequest = false,
  className = "",
}: LocationHandlerProps) {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [permission, setPermission] = useState<PermissionState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isWatching, setIsWatching] = useState(false);

  useEffect(() => {
    checkPermission();
    if (autoRequest && permission === "granted") {
      getCurrentLocation();
    }
  }, [autoRequest, permission]);

  const checkPermission = async () => {
    if (!navigator.permissions) {
      setPermission("denied");
      return;
    }

    try {
      const permissionStatus = await navigator.permissions.query({ name: "geolocation" });
      setPermission(permissionStatus.state);
      
      permissionStatus.onchange = () => {
        setPermission(permissionStatus.state);
        onPermissionChange?.(permissionStatus.state);
      };
    } catch (err) {
      setPermission("denied");
    }
  };

  const requestPermission = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const position = await getCurrentPosition();
      setPermission("granted");
      onPermissionChange?.("granted");
      await getCurrentLocation();
    } catch (err) {
      setPermission("denied");
      setError("Location permission denied. Please enable location access in your browser settings.");
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  };

  const getCurrentLocation = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const position = await getCurrentPosition();
      
      const locationData: LocationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      };

      // Try to get address from coordinates
      try {
        const address = await reverseGeocode(locationData.latitude, locationData.longitude);
        locationData.address = address;
      } catch (err) {
        console.warn("Failed to get address:", err);
      }

      setLocation(locationData);
      onLocationUpdate?.(locationData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get location");
    } finally {
      setIsLoading(false);
    }
  };

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      throw new Error("Google Maps API key not configured");
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
    );
    const data = await response.json();

    if (data.status === "OK" && data.results?.[0]) {
      return data.results[0].formatted_address;
    } else {
      throw new Error("Failed to get address");
    }
  };

  const startWatching = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported");
      return;
    }

    setIsWatching(true);
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };
        setLocation(locationData);
        onLocationUpdate?.(locationData);
      },
      (err) => {
        setError(err.message);
        setIsWatching(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );

    // Store watch ID for cleanup
    return () => {
      navigator.geolocation.clearWatch(watchId);
      setIsWatching(false);
    };
  };

  const stopWatching = () => {
    setIsWatching(false);
  };

  const getPermissionStatusIcon = () => {
    switch (permission) {
      case "granted":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "denied":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case "prompt":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <MapPin className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPermissionStatusText = () => {
    switch (permission) {
      case "granted":
        return "Location access granted";
      case "denied":
        return "Location access denied";
      case "prompt":
        return "Location permission not set";
      default:
        return "Checking location permission...";
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Navigation className="w-5 h-5" />
          Location Services
        </CardTitle>
        <CardDescription>
          Manage location permissions and get your current location
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        {/* Permission Status */}
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center gap-2">
            {getPermissionStatusIcon()}
            <span className="text-sm font-medium">{getPermissionStatusText()}</span>
          </div>
        </div>

        {/* Location Data */}
        {location && (
          <div className="p-3 bg-gray-50 rounded-lg space-y-2">
            <h4 className="font-medium text-sm">Current Location</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <div>Latitude: {location.latitude.toFixed(6)}</div>
              <div>Longitude: {location.longitude.toFixed(6)}</div>
              <div>Accuracy: {location.accuracy.toFixed(0)}m</div>
              {location.address && (
                <div>Address: {location.address}</div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          {permission === "prompt" && (
            <Button
              onClick={requestPermission}
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <MapPin className="w-4 h-4 mr-2" />
              )}
              Enable Location
            </Button>
          )}

          {permission === "granted" && (
            <>
              <Button
                onClick={getCurrentLocation}
                disabled={isLoading}
                variant="outline"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <MapPin className="w-4 h-4 mr-2" />
                )}
                Get Location
              </Button>

              {!isWatching ? (
                <Button
                  onClick={startWatching}
                  variant="outline"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Start Tracking
                </Button>
              ) : (
                <Button
                  onClick={stopWatching}
                  variant="outline"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Stop Tracking
                </Button>
              )}
            </>
          )}

          {permission === "denied" && (
            <div className="text-sm text-muted-foreground">
              Please enable location access in your browser settings to use location features.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 