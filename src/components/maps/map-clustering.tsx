"use client";

import { useEffect, useRef, useCallback } from "react";

interface ClusterMarker {
  position: google.maps.LatLng;
  events: any[];
  marker: google.maps.marker.AdvancedMarkerElement;
}

interface MapClusteringProps {
  map: google.maps.Map | null;
  events: any[];
  onClusterClick?: (events: any[]) => void;
  onEventClick?: (event: any) => void;
  maxZoom?: number;
  gridSize?: number;
}

export function useMapClustering({
  map,
  events,
  onClusterClick,
  onEventClick,
  maxZoom = 15,
  gridSize = 50
}: MapClusteringProps) {
  const clustersRef = useRef<ClusterMarker[]>([]);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);

  // Create cluster marker
  const createClusterMarker = useCallback((position: google.maps.LatLng, events: any[]) => {
    const clusterElement = document.createElement('div');
    clusterElement.innerHTML = `
      <div style="
        width: 60px;
        height: 60px;
        background: #6366f1;
        border: 2px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 14px;
        font-family: Arial, sans-serif;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      ">
        ${events.length}
      </div>
    `;

    const marker = new google.maps.marker.AdvancedMarkerElement({
      position,
      map,
      content: clusterElement,
      title: `${events.length} events`
    });

    // Add click listener
    marker.addListener("click", () => {
      if (onClusterClick) {
        onClusterClick(events);
      }
    });

    return marker;
  }, [map, onClusterClick]);

  // Create individual event marker
  const createEventMarker = useCallback((event: any) => {
    if (!map) return null;

    const markerElement = document.createElement('div');
    markerElement.innerHTML = `
      <div style="
        width: 60px;
        height: 60px;
        background: white;
        border: 2px solid #6366f1;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #374151;
        font-weight: bold;
        font-size: 12px;
        font-family: Arial, sans-serif;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        cursor: pointer;
      ">
        $${event.price}
      </div>
    `;

    const marker = new google.maps.marker.AdvancedMarkerElement({
      position: new google.maps.LatLng(event.location.lat, event.location.lng),
      map,
      content: markerElement,
      title: event.title
    });

    // Add click listener
    marker.addListener("click", () => {
      if (onEventClick) {
        onEventClick(event);
      }
    });

    return marker;
  }, [map, onEventClick]);

  // Calculate distance between two points
  const calculateDistance = useCallback((pos1: google.maps.LatLng, pos2: google.maps.LatLng) => {
    const R = 6371; // Earth's radius in km
    const dLat = (pos2.lat() - pos1.lat()) * Math.PI / 180;
    const dLon = (pos2.lng() - pos1.lng()) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(pos1.lat() * Math.PI / 180) * Math.cos(pos2.lat() * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }, []);

  // Update clusters
  const updateClusters = useCallback(() => {
    if (!map) return;

    const zoom = map.getZoom() || 0;
    
    // Clear existing clusters and markers
    clustersRef.current.forEach(cluster => cluster.marker.map = null);
    markersRef.current.forEach(marker => marker.map = null);
    clustersRef.current = [];
    markersRef.current = [];

    // If zoom level is high enough, show individual markers
    if (zoom >= maxZoom) {
      events.forEach(event => {
        const marker = createEventMarker(event);
        if (marker) {
          markersRef.current.push(marker);
        }
      });
      return;
    }

    // Create clusters
    const clusters: ClusterMarker[] = [];
    const processedEvents = new Set();

    events.forEach((event, index) => {
      if (processedEvents.has(index)) return;

      const eventPos = new google.maps.LatLng(event.location.lat, event.location.lng);
      const clusterEvents = [event];
      processedEvents.add(index);

      // Find nearby events
      events.forEach((otherEvent, otherIndex) => {
        if (otherIndex === index || processedEvents.has(otherIndex)) return;

        const otherPos = new google.maps.LatLng(otherEvent.location.lat, otherEvent.location.lng);
        const distance = calculateDistance(eventPos, otherPos);

        // Convert distance to pixels based on zoom level
        const pixelDistance = distance * (2 ** zoom) * 0.1; // Approximate conversion

        if (pixelDistance < gridSize) {
          clusterEvents.push(otherEvent);
          processedEvents.add(otherIndex);
        }
      });

      // Calculate cluster center
      const totalLat = clusterEvents.reduce((sum, e) => sum + e.location.lat, 0);
      const totalLng = clusterEvents.reduce((sum, e) => sum + e.location.lng, 0);
      const centerLat = totalLat / clusterEvents.length;
      const centerLng = totalLng / clusterEvents.length;
      const centerPos = new google.maps.LatLng(centerLat, centerLng);

      // Create cluster marker
      const clusterMarker = createClusterMarker(centerPos, clusterEvents);
      
      clusters.push({
        position: centerPos,
        events: clusterEvents,
        marker: clusterMarker
      });
    });

    clustersRef.current = clusters;
  }, [map, events, maxZoom, gridSize, calculateDistance, createClusterMarker, createEventMarker]);

  // Update clusters when map changes
  useEffect(() => {
    if (!map) return;

    const listener = map.addListener("bounds_changed", updateClusters);
    updateClusters();

    return () => {
      google.maps.event.removeListener(listener);
    };
  }, [map, updateClusters]);

  // Update clusters when events change
  useEffect(() => {
    updateClusters();
  }, [events, updateClusters]);

  return {
    clusters: clustersRef.current,
    markers: markersRef.current
  };
} 