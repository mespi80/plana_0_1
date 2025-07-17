"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X } from "lucide-react";

export interface Interest {
  id: string;
  label: string;
  icon: string;
  category?: string;
}

const DEFAULT_INTERESTS: Interest[] = [
  { id: "live-music", label: "Live Music", icon: "🎵", category: "entertainment" },
  { id: "comedy", label: "Comedy", icon: "🎭", category: "entertainment" },
  { id: "food-dining", label: "Food & Dining", icon: "🍽️", category: "lifestyle" },
  { id: "art-culture", label: "Art & Culture", icon: "🎨", category: "culture" },
  { id: "sports", label: "Sports", icon: "⚽", category: "sports" },
  { id: "nightlife", label: "Nightlife", icon: "🍸", category: "entertainment" },
  { id: "wellness", label: "Wellness", icon: "🧘", category: "health" },
  { id: "technology", label: "Technology", icon: "💻", category: "business" },
  { id: "networking", label: "Networking", icon: "🤝", category: "business" },
  { id: "education", label: "Education", icon: "📚", category: "learning" },
  { id: "family", label: "Family", icon: "👨‍👩‍👧‍👦", category: "lifestyle" },
  { id: "outdoor", label: "Outdoor", icon: "🌲", category: "lifestyle" },
  { id: "fitness", label: "Fitness", icon: "💪", category: "health" },
  { id: "photography", label: "Photography", icon: "📸", category: "creative" },
  { id: "cooking", label: "Cooking", icon: "👨‍🍳", category: "lifestyle" },
  { id: "gaming", label: "Gaming", icon: "🎮", category: "entertainment" },
];

interface InterestSelectorProps {
  selectedInterests: string[];
  onInterestsChange: (interests: string[]) => void;
  maxSelections?: number;
  showCategories?: boolean;
  className?: string;
}

export function InterestSelector({
  selectedInterests,
  onInterestsChange,
  maxSelections = 8,
  showCategories = false,
  className = "",
}: InterestSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const toggleInterest = (interestId: string) => {
    if (selectedInterests.includes(interestId)) {
      onInterestsChange(selectedInterests.filter(id => id !== interestId));
    } else if (selectedInterests.length < maxSelections) {
      onInterestsChange([...selectedInterests, interestId]);
    }
  };

  const removeInterest = (interestId: string) => {
    onInterestsChange(selectedInterests.filter(id => id !== interestId));
  };

  const filteredInterests = DEFAULT_INTERESTS.filter(interest =>
    interest.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedInterests = showCategories
    ? filteredInterests.reduce((groups, interest) => {
        const category = interest.category || "other";
        if (!groups[category]) {
          groups[category] = [];
        }
        groups[category].push(interest);
        return groups;
      }, {} as Record<string, Interest[]>)
    : { all: filteredInterests };

  const getInterestById = (id: string) => DEFAULT_INTERESTS.find(i => i.id === id);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Selected Interests Display */}
      {selectedInterests.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            Selected Interests ({selectedInterests.length}/{maxSelections})
          </h3>
          <div className="flex flex-wrap gap-2">
            {selectedInterests.map(interestId => {
              const interest = getInterestById(interestId);
              if (!interest) return null;
              
              return (
                <Badge
                  key={interestId}
                  variant="secondary"
                  className="flex items-center gap-1 px-3 py-1"
                >
                  <span>{interest.icon}</span>
                  {interest.label}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => removeInterest(interestId)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search interests..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Interest Categories */}
      {Object.entries(groupedInterests).map(([category, interests]) => (
        <div key={category} className="space-y-3">
          {showCategories && category !== "all" && (
            <h3 className="text-sm font-medium text-muted-foreground capitalize">
              {category}
            </h3>
          )}
          <div className="grid grid-cols-2 gap-2">
            {interests.map((interest) => {
              const isSelected = selectedInterests.includes(interest.id);
              const isDisabled = !isSelected && selectedInterests.length >= maxSelections;
              
              return (
                <Button
                  key={interest.id}
                  variant={isSelected ? "default" : "outline"}
                  className={`justify-start h-auto p-3 transition-all ${
                    isSelected ? "bg-purple-600 hover:bg-purple-700" : ""
                  } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() => !isDisabled && toggleInterest(interest.id)}
                  disabled={isDisabled}
                >
                  <span className="mr-2 text-lg">{interest.icon}</span>
                  <span className="text-sm">{interest.label}</span>
                  {isSelected && (
                    <Check className="ml-auto w-4 h-4" />
                  )}
                </Button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Selection Limit Warning */}
      {selectedInterests.length >= maxSelections && (
        <div className="p-3 text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-md">
          You've reached the maximum number of interests ({maxSelections}). 
          Remove some to add new ones.
        </div>
      )}
    </div>
  );
} 