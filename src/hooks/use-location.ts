'use client'

import { useState, useEffect } from 'react'

interface Location {
  lat: number
  lng: number
}

interface UseLocationReturn {
  location: Location | null
  loading: boolean
  error: string | null
  requestLocation: () => Promise<void>
  updateLocation: (lat: number, lng: number) => void
}

export function useLocation(): UseLocationReturn {
  const [location, setLocation] = useState<Location | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const requestLocation = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        })
      })

      const newLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }

      setLocation(newLocation)
      
      // Store in localStorage for persistence
      localStorage.setItem('userLocation', JSON.stringify(newLocation))
    } catch (err) {
      const errorMessage = err instanceof GeolocationPositionError
        ? getGeolocationErrorMessage(err.code)
        : 'Failed to get location'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const updateLocation = (lat: number, lng: number) => {
    const newLocation = { lat, lng }
    setLocation(newLocation)
    localStorage.setItem('userLocation', JSON.stringify(newLocation))
  }

  useEffect(() => {
    // Try to get location from localStorage on mount
    const storedLocation = localStorage.getItem('userLocation')
    if (storedLocation) {
      try {
        const parsedLocation = JSON.parse(storedLocation)
        setLocation(parsedLocation)
      } catch {
        // Invalid stored location, ignore
      }
    }
  }, [])

  return {
    location,
    loading,
    error,
    requestLocation,
    updateLocation
  }
}

function getGeolocationErrorMessage(code: number): string {
  switch (code) {
    case GeolocationPositionError.PERMISSION_DENIED:
      return 'Location permission denied. Please enable location access in your browser settings.'
    case GeolocationPositionError.POSITION_UNAVAILABLE:
      return 'Location information is unavailable.'
    case GeolocationPositionError.TIMEOUT:
      return 'Location request timed out. Please try again.'
    default:
      return 'An unknown error occurred while getting location.'
  }
} 