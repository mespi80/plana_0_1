import { User } from '@supabase/supabase-js';
import { supabase } from './supabase';

export interface SignUpData {
  email: string;
  password: string;
  full_name: string;
  role?: 'user' | 'business' | 'admin';
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'user' | 'business' | 'admin';
  avatar_url?: string;
  interests?: string[];
  location_lat?: number;
  location_lng?: number;
  created_at: string;
  updated_at: string;
}

export class AuthService {
  /**
   * Sign up a new user
   */
  static async signUp(data: SignUpData): Promise<{ user: User | null; error: string | null }> {
    if (!supabase) {
      return { user: null, error: 'Supabase is not configured. Please set environment variables.' };
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        return { user: null, error: authError.message };
      }

      if (authData.user) {
        // Create user profile with role
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email: data.email,
            full_name: data.full_name,
            role: data.role || 'user',
          });

        if (profileError) {
          return { user: null, error: profileError.message };
        }

        // If business user, create business record
        if (data.role === 'business') {
          const { error: businessError } = await supabase
            .from('businesses')
            .insert({
              owner_id: authData.user.id,
              name: `${data.full_name}'s Business`,
              business_type: 'general',
            });

          if (businessError) {
            console.error('Business creation error:', businessError);
          }
        }

        // Get the created profile
        const { data: createdProfile, error: getProfileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        if (getProfileError) {
          return { user: null, error: getProfileError.message };
        }

        return { user: createdProfile as User, error: null };
      }

      return { user: null, error: 'Failed to create user' };
    } catch (error) {
      return { user: null, error: 'An unexpected error occurred' };
    }
  }

  /**
   * Sign in a user
   */
  static async signIn(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    if (!supabase) {
      return { user: null, error: 'Supabase is not configured. Please set environment variables.' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { user: null, error: error.message };
      }

      return { user: data.user, error: null };
    } catch (error) {
      return { user: null, error: 'An unexpected error occurred' };
    }
  }

  /**
   * Sign out the current user
   */
  static async signOut(): Promise<{ error: string | null }> {
    if (!supabase) {
      return { error: 'Supabase is not configured. Please set environment variables.' };
    }

    try {
      const { error } = await supabase.auth.signOut();
      return { error: error?.message || null };
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  }

  /**
   * Get the current session
   */
  static async getSession(): Promise<{ session: any; error: string | null }> {
    if (!supabase) {
      return { session: null, error: 'Supabase is not configured. Please set environment variables.' };
    }

    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      return { session, error: error?.message || null };
    } catch (error) {
      return { session: null, error: 'An unexpected error occurred' };
    }
  }

  /**
   * Get the current user
   */
  static async getUser(): Promise<{ user: User | null; error: string | null }> {
    if (!supabase) {
      return { user: null, error: 'Supabase is not configured. Please set environment variables.' };
    }

    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      return { user, error: error?.message || null };
    } catch (error) {
      return { user: null, error: 'An unexpected error occurred' };
    }
  }

  /**
   * Get current user with profile data
   */
  static async getCurrentUser(): Promise<{ user: UserProfile | null; error: string | null }> {
    if (!supabase) {
      return { user: null, error: 'Supabase is not configured. Please set environment variables.' };
    }

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        return { user: null, error: 'No user found' };
      }

      // Get user profile from profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        return { user: null, error: 'Profile not found' };
      }

      return { user: profile as UserProfile, error: null };
    } catch (error) {
      return { user: null, error: 'An unexpected error occurred' };
    }
  }

  /**
   * Check if user has a specific role
   */
  static hasRole(user: UserProfile | null, requiredRole: 'user' | 'business' | 'admin'): boolean {
    if (!user) return false;
    
    const userRole = user.role;
    
    // Role hierarchy: admin > business > user
    switch (requiredRole) {
      case 'admin':
        return userRole === 'admin';
      case 'business':
        return userRole === 'business' || userRole === 'admin';
      case 'user':
        return true; // All authenticated users have user access
      default:
        return false;
    }
  }

  /**
   * Check if user can access business features
   */
  static canAccessBusiness(user: UserProfile | null): boolean {
    return this.hasRole(user, 'business');
  }

  /**
   * Check if user can access admin features
   */
  static canAccessAdmin(user: UserProfile | null): boolean {
    return this.hasRole(user, 'admin');
  }
} 