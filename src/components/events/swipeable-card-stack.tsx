"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { EventCard } from "./event-card";
import { Heart, X } from "lucide-react";
import { Event } from "@/types/event";

interface SwipeableCardStackProps {
  events: Event[];
  onLike?: (event: Event) => void;
  onPass?: (event: Event) => void;
  onBook?: (event: Event) => void;
  onEmpty?: () => void;
}

export function SwipeableCardStack({
  events,
  onLike,
  onPass,
  onBook,
  onEmpty
}: SwipeableCardStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  
  const cardRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const currentEvent = events[currentIndex];

  // Handle touch/mouse events
  const handleStart = useCallback((clientX: number, clientY: number) => {
    setIsDragging(true);
    isDraggingRef.current = true;
    setStartPosition({ x: clientX, y: clientY });
    setDragOffset({ x: 0, y: 0 });
  }, []);

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!isDraggingRef.current) return;
    
    const deltaX = clientX - startPosition.x;
    const deltaY = clientY - startPosition.y;
    setDragOffset({ x: deltaX, y: deltaY });
  }, [startPosition]);

  const handleEnd = useCallback(() => {
    if (!isDraggingRef.current) return;
    
    setIsDragging(false);
    isDraggingRef.current = false;
    
    const threshold = 100;
    const distance = Math.sqrt(dragOffset.x ** 2 + dragOffset.y ** 2);
    
    if (distance > threshold) {
      // Determine swipe direction
      const angle = Math.atan2(dragOffset.y, dragOffset.x) * 180 / Math.PI;
      
      if (angle > -45 && angle < 45) {
        // Right swipe - Like
        handleLike();
      } else if (angle > 135 || angle < -135) {
        // Left swipe - Pass
        handlePass();
      }
    }
    
    // Reset position
    setDragOffset({ x: 0, y: 0 });
  }, [dragOffset]);

  // Touch event handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  }, [handleStart]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  }, [handleMove]);

  const handleTouchEnd = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  // Mouse event handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    handleStart(e.clientX, e.clientY);
  }, [handleStart]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDraggingRef.current) {
      handleMove(e.clientX, e.clientY);
    }
  }, [handleMove]);

  const handleMouseUp = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  // Handle like action
  const handleLike = useCallback(() => {
    if (currentEvent && onLike) {
      onLike(currentEvent);
    }
    nextCard();
  }, [currentEvent, onLike]);

  // Handle pass action
  const handlePass = useCallback(() => {
    if (currentEvent && onPass) {
      onPass(currentEvent);
    }
    nextCard();
  }, [currentEvent, onPass]);

  // Move to next card
  const nextCard = useCallback(() => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= events.length) {
      if (onEmpty) {
        onEmpty();
      }
    } else {
      setCurrentIndex(nextIndex);
    }
  }, [currentIndex, events.length, onEmpty]);

  // Calculate card transform
  const getCardTransform = () => {
    const rotate = dragOffset.x * 0.1; // Rotation based on horizontal drag
    return `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotate}deg)`;
  };

  // Calculate card opacity for stack effect
  const getCardOpacity = (index: number) => {
    const distance = index - currentIndex;
    if (distance === 0) return 1;
    if (distance === 1) return 0.8;
    if (distance === 2) return 0.6;
    return 0;
  };

  // Calculate card scale for stack effect
  const getCardScale = (index: number) => {
    const distance = index - currentIndex;
    if (distance === 0) return 1;
    if (distance === 1) return 0.95;
    if (distance === 2) return 0.9;
    return 0.85;
  };

  // Calculate card translate for stack effect
  const getCardTranslate = (index: number) => {
    const distance = index - currentIndex;
    if (distance === 0) return 0;
    if (distance === 1) return 8;
    if (distance === 2) return 16;
    return 24;
  };

  // Add global mouse event listeners
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDraggingRef.current) {
        handleMove(e.clientX, e.clientY);
      }
    };

    const handleGlobalMouseUp = () => {
      handleEnd();
    };

    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [handleMove, handleEnd]);

  if (!currentEvent) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No more events</h3>
          <p className="text-gray-500">Check back later for new events!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Card Stack */}
      <div className="relative h-[600px]">
        {/* Background Cards */}
        {events.slice(currentIndex, currentIndex + 3).map((event, index) => {
          const actualIndex = currentIndex + index;
          const isCurrent = index === 0;
          
          return (
            <div
              key={event.id}
              className={`absolute inset-0 transition-all duration-300 ${
                isCurrent ? 'z-10' : 'z-0'
              }`}
              style={{
                opacity: getCardOpacity(actualIndex),
                transform: isCurrent 
                  ? getCardTransform()
                  : `translateY(${getCardTranslate(index)}px) scale(${getCardScale(index)})`,
                cursor: isCurrent ? (isDragging ? 'grabbing' : 'grab') : 'default'
              }}
              onTouchStart={isCurrent ? handleTouchStart : undefined}
              onTouchMove={isCurrent ? handleTouchMove : undefined}
              onTouchEnd={isCurrent ? handleTouchEnd : undefined}
              onMouseDown={isCurrent ? handleMouseDown : undefined}
              onMouseMove={isCurrent ? handleMouseMove : undefined}
              onMouseUp={isCurrent ? handleMouseUp : undefined}
            >
              <EventCard
                event={event}
                onLike={isCurrent ? handleLike : undefined}
                onPass={isCurrent ? handlePass : undefined}
                onBook={isCurrent ? onBook : undefined}
              />
            </div>
          );
        })}
      </div>

      {/* Swipe Indicators */}
      {isDragging && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Like indicator (right) */}
          {dragOffset.x > 50 && (
            <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
              <div className="bg-green-500 text-white px-4 py-2 rounded-full shadow-lg">
                <Heart className="w-6 h-6" />
              </div>
            </div>
          )}
          
          {/* Pass indicator (left) */}
          {dragOffset.x < -50 && (
            <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
              <div className="bg-red-500 text-white px-4 py-2 rounded-full shadow-lg">
                <X className="w-6 h-6" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4 mt-6">
        <button
          onClick={handlePass}
          className="w-14 h-14 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>
        
        <button
          onClick={handleLike}
          className="w-14 h-14 bg-white border-2 border-red-300 rounded-full flex items-center justify-center shadow-lg hover:bg-red-50 transition-colors"
        >
          <Heart className="w-6 h-6 text-red-500" />
        </button>
      </div>
    </div>
  );
} 