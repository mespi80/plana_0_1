"use client";

import { useState, useCallback } from "react";
import { Search, Filter, MapPin, Calendar, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchFilters {
  query: string;
  category: string;
  priceRange: string;
  date: string;
  location: string;
}

interface EventSearchProps {
  onSearch: (filters: SearchFilters) => void;
  onLocationRequest: () => void;
  className?: string;
}

const categories = [
  "All",
  "Music",
  "Comedy",
  "Sports",
  "Food & Drink",
  "Art & Culture",
  "Nightlife",
  "Outdoor",
  "Workshop",
  "Other"
];

const priceRanges = [
  "Any Price",
  "Under $10",
  "$10 - $25",
  "$25 - $50",
  "$50 - $100",
  "Over $100"
];

const dates = [
  "Any Time",
  "Today",
  "Tomorrow",
  "This Week",
  "This Weekend",
  "Next Week"
];

export function EventSearch({
  onSearch,
  onLocationRequest,
  className = ""
}: EventSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    category: "All",
    priceRange: "Any Price",
    date: "Any Time",
    location: ""
  });
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = useCallback(() => {
    onSearch(filters);
  }, [filters, onSearch]);

  const handleInputChange = (field: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className={`bg-white border-b border-gray-200 ${className}`}>
      {/* Main Search Bar */}
      <div className="px-4 py-3">
        <div className="flex items-center space-x-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search events, venues, or categories..."
              value={filters.query}
              onChange={(e) => handleInputChange("query", e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            size="sm"
            className="border-gray-300"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          
          <Button
            onClick={onLocationRequest}
            variant="outline"
            size="sm"
            className="border-gray-300"
          >
            <MapPin className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="px-4 pb-4 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4 pt-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range
              </label>
              <select
                value={filters.priceRange}
                onChange={(e) => handleInputChange("priceRange", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              >
                {priceRanges.map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <select
                value={filters.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              >
                {dates.map((date) => (
                  <option key={date} value={date}>
                    {date}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                placeholder="Enter location..."
                value={filters.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Apply Filters Button */}
          <div className="mt-4">
            <Button
              onClick={handleSearch}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 