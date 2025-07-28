import { supabase } from "@/lib/supabase";

export interface RecommendationEvent {
  id: string;
  title: string;
  description: string;
  category: string;
  start_time: string;
  end_time: string;
  price: number;
  capacity: number;
  available_tickets: number;
  venue: {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
  };
  images: string[];
  tags: string[];
  score: number;
  reason: string;
}

export interface UserPreferences {
  interests: string[];
  price_range: {
    min: number;
    max: number;
  };
  preferred_categories: string[];
  location_radius: number;
  user_location?: {
    latitude: number;
    longitude: number;
  };
}

export class RecommendationService {
  /**
   * Get personalized event recommendations for a user
   */
  static async getRecommendations(
    userId: string,
    limit: number = 10
  ): Promise<RecommendationEvent[]> {
    try {
      // Get user preferences
      const userPrefs = await this.getUserPreferences(userId);
      
      // Get user's liked events and booking history
      const userHistory = await this.getUserHistory(userId);
      
      // Get all upcoming events
      const { data: events, error } = await supabase
        .from('events')
        .select(`
          *,
          venue:venues(*)
        `)
        .eq('is_active', true)
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true });

      if (error) {
        console.error('Error fetching events:', error);
        return [];
      }

      if (!events) return [];

      // Score and rank events based on user preferences and history
      const scoredEvents = events.map(event => {
        const score = this.calculateEventScore(event, userPrefs, userHistory);
        return {
          ...event,
          score,
          reason: this.getRecommendationReason(event, userPrefs, userHistory)
        };
      });

      // Sort by score and return top recommendations
      return scoredEvents
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(event => ({
          id: event.id,
          title: event.title,
          description: event.description,
          category: event.category,
          start_time: event.start_time,
          end_time: event.end_time,
          price: event.price,
          capacity: event.capacity,
          available_tickets: event.available_tickets,
          venue: event.venue,
          images: event.images || [],
          tags: event.tags || [],
          score: event.score,
          reason: event.reason
        }));
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return [];
    }
  }

  /**
   * Get user preferences from database
   */
  private static async getUserPreferences(userId: string): Promise<UserPreferences> {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('interests, preferences')
        .eq('id', userId)
        .single();

      if (profile) {
        return {
          interests: profile.interests || [],
          price_range: profile.preferences?.price_range || { min: 0, max: 100 },
          preferred_categories: profile.preferences?.categories || [],
          location_radius: profile.preferences?.location_radius || 25,
          user_location: profile.preferences?.location
        };
      }

      return {
        interests: [],
        price_range: { min: 0, max: 100 },
        preferred_categories: [],
        location_radius: 25
      };
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      return {
        interests: [],
        price_range: { min: 0, max: 100 },
        preferred_categories: [],
        location_radius: 25
      };
    }
  }

  /**
   * Get user's event history (likes, bookings, views)
   */
  private static async getUserHistory(userId: string) {
    try {
      // Get liked events
      const { data: likedEvents } = await supabase
        .from('event_likes')
        .select('event_id, created_at')
        .eq('user_id', userId);

      // Get booking history
      const { data: bookings } = await supabase
        .from('bookings')
        .select('event_id, created_at')
        .eq('user_id', userId);

      // Get viewed events (if tracking is implemented)
      const { data: viewedEvents } = await supabase
        .from('event_views')
        .select('event_id, created_at')
        .eq('user_id', userId);

      return {
        likedEvents: likedEvents || [],
        bookings: bookings || [],
        viewedEvents: viewedEvents || []
      };
    } catch (error) {
      console.error('Error fetching user history:', error);
      return {
        likedEvents: [],
        bookings: [],
        viewedEvents: []
      };
    }
  }

  /**
   * Calculate recommendation score for an event
   */
  private static calculateEventScore(
    event: any,
    userPrefs: UserPreferences,
    userHistory: any
  ): number {
    let score = 0;

    // Category preference (30% weight)
    if (userPrefs.preferred_categories.includes(event.category)) {
      score += 30;
    }

    // Interest matching (25% weight)
    const eventTags = event.tags || [];
    const interestMatches = userPrefs.interests.filter(interest =>
      eventTags.some((tag: string) => 
        tag.toLowerCase().includes(interest.toLowerCase())
      )
    );
    score += (interestMatches.length / userPrefs.interests.length) * 25;

    // Price range (20% weight)
    if (event.price >= userPrefs.price_range.min && event.price <= userPrefs.price_range.max) {
      score += 20;
    } else if (event.price <= userPrefs.price_range.max * 1.2) {
      score += 10; // Slightly above range gets partial points
    }

    // Venue following (15% weight)
    const followedVenues = userHistory.likedEvents
      .map((like: any) => like.venue_id)
      .filter(Boolean);
    if (followedVenues.includes(event.venue?.id)) {
      score += 15;
    }

    // Recency (10% weight) - prefer events happening soon
    const daysUntilEvent = Math.ceil(
      (new Date(event.start_time).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysUntilEvent <= 7) {
      score += 10;
    } else if (daysUntilEvent <= 30) {
      score += 5;
    }

    // Popularity bonus (5% weight)
    const availablePercentage = event.available_tickets / event.capacity;
    if (availablePercentage < 0.3) {
      score += 5; // Almost sold out
    }

    return Math.min(score, 100); // Cap at 100
  }

  /**
   * Get human-readable reason for recommendation
   */
  private static getRecommendationReason(
    event: any,
    userPrefs: UserPreferences,
    userHistory: any
  ): string {
    const reasons = [];

    if (userPrefs.preferred_categories.includes(event.category)) {
      reasons.push(`Matches your ${event.category} preference`);
    }

    const eventTags = event.tags || [];
    const interestMatches = userPrefs.interests.filter(interest =>
      eventTags.some((tag: string) => 
        tag.toLowerCase().includes(interest.toLowerCase())
      )
    );
    if (interestMatches.length > 0) {
      reasons.push(`Matches your ${interestMatches.join(', ')} interests`);
    }

    if (event.price >= userPrefs.price_range.min && event.price <= userPrefs.price_range.max) {
      reasons.push('Within your price range');
    }

    const followedVenues = userHistory.likedEvents
      .map((like: any) => like.venue_id)
      .filter(Boolean);
    if (followedVenues.includes(event.venue?.id)) {
      reasons.push('At a venue you follow');
    }

    const daysUntilEvent = Math.ceil(
      (new Date(event.start_time).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysUntilEvent <= 7) {
      reasons.push('Happening soon');
    }

    const availablePercentage = event.available_tickets / event.capacity;
    if (availablePercentage < 0.3) {
      reasons.push('Almost sold out');
    }

    return reasons.length > 0 ? reasons.join(', ') : 'Recommended for you';
  }

  /**
   * Get trending events (most popular)
   */
  static async getTrendingEvents(limit: number = 10): Promise<RecommendationEvent[]> {
    try {
      const { data: events, error } = await supabase
        .from('events')
        .select(`
          *,
          venue:venues(*)
        `)
        .eq('is_active', true)
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true });

      if (error || !events) return [];

      // Calculate popularity score based on bookings and likes
      const scoredEvents = events.map(event => {
        const popularityScore = this.calculatePopularityScore(event);
        return {
          ...event,
          score: popularityScore,
          reason: 'Trending event'
        };
      });

      return scoredEvents
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(event => ({
          id: event.id,
          title: event.title,
          description: event.description,
          category: event.category,
          start_time: event.start_time,
          end_time: event.end_time,
          price: event.price,
          capacity: event.capacity,
          available_tickets: event.available_tickets,
          venue: event.venue,
          images: event.images || [],
          tags: event.tags || [],
          score: event.score,
          reason: event.reason
        }));
    } catch (error) {
      console.error('Error getting trending events:', error);
      return [];
    }
  }

  /**
   * Calculate popularity score for trending events
   */
  private static calculatePopularityScore(event: any): number {
    let score = 0;

    // Booking rate
    const bookingRate = (event.capacity - event.available_tickets) / event.capacity;
    score += bookingRate * 50;

    // Recency bonus
    const daysUntilEvent = Math.ceil(
      (new Date(event.start_time).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysUntilEvent <= 7) {
      score += 30;
    } else if (daysUntilEvent <= 30) {
      score += 15;
    }

    // Venue reputation (if available)
    if (event.venue?.rating) {
      score += event.venue.rating * 10;
    }

    return Math.min(score, 100);
  }

  /**
   * Get similar events based on a specific event
   */
  static async getSimilarEvents(eventId: string, limit: number = 5): Promise<RecommendationEvent[]> {
    try {
      // Get the reference event
      const { data: referenceEvent } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (!referenceEvent) return [];

      // Get events in the same category
      const { data: similarEvents, error } = await supabase
        .from('events')
        .select(`
          *,
          venue:venues(*)
        `)
        .eq('is_active', true)
        .eq('category', referenceEvent.category)
        .neq('id', eventId)
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true });

      if (error || !similarEvents) return [];

      // Score based on similarity
      const scoredEvents = similarEvents.map(event => {
        const similarityScore = this.calculateSimilarityScore(event, referenceEvent);
        return {
          ...event,
          score: similarityScore,
          reason: `Similar to ${referenceEvent.title}`
        };
      });

      return scoredEvents
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(event => ({
          id: event.id,
          title: event.title,
          description: event.description,
          category: event.category,
          start_time: event.start_time,
          end_time: event.end_time,
          price: event.price,
          capacity: event.capacity,
          available_tickets: event.available_tickets,
          venue: event.venue,
          images: event.images || [],
          tags: event.tags || [],
          score: event.score,
          reason: event.reason
        }));
    } catch (error) {
      console.error('Error getting similar events:', error);
      return [];
    }
  }

  /**
   * Calculate similarity score between two events
   */
  private static calculateSimilarityScore(event1: any, event2: any): number {
    let score = 0;

    // Same venue
    if (event1.venue?.id === event2.venue?.id) {
      score += 40;
    }

    // Similar price range
    const priceDiff = Math.abs(event1.price - event2.price);
    const maxPrice = Math.max(event1.price, event2.price);
    if (priceDiff / maxPrice < 0.2) {
      score += 30;
    } else if (priceDiff / maxPrice < 0.5) {
      score += 15;
    }

    // Similar tags
    const tags1 = event1.tags || [];
    const tags2 = event2.tags || [];
    const commonTags = tags1.filter((tag: string) => tags2.includes(tag));
    if (commonTags.length > 0) {
      score += (commonTags.length / Math.max(tags1.length, tags2.length)) * 30;
    }

    return Math.min(score, 100);
  }
} 