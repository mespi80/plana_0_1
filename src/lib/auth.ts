import { createClient } from '@supabase/supabase-js';
import { User, UserRole, LoginCredentials, SignUpData } from '@/types/auth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

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
   * Sign in user
   */
  static async signIn(credentials: LoginCredentials): Promise<{ user: User | null; error: string | null }> {
    if (!supabase) {
      return { user: null, error: 'Supabase is not configured. Please set environment variables.' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        return { user: null, error: error.message };
      }

      if (data.user) {
        // Get user profile with role
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          return { user: null, error: profileError.message };
        }

        return { user: profile as User, error: null };
      }

      return { user: null, error: 'Failed to sign in' };
    } catch (error) {
      return { user: null, error: 'An unexpected error occurred' };
    }
  }

  /**
   * Sign out user
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
   * Get current user
   */
  static async getCurrentUser(): Promise<{ user: User | null; error: string | null }> {
    if (!supabase) {
      return { user: null, error: null }; // Return null user without error for graceful handling
    }

    try {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) {
        // Handle missing session gracefully
        if (error.message.includes('Auth session missing') || error.message.includes('No user found')) {
          return { user: null, error: null };
        }
        return { user: null, error: error.message };
      }

      if (!user) {
        return { user: null, error: null };
      }

      // Get user profile with role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        // If profile doesn't exist, user might not be fully set up
        if (profileError.code === 'PGRST116') {
          return { user: null, error: null };
        }
        return { user: null, error: profileError.message };
      }

      return { user: profile as User, error: null };
    } catch (error) {
      return { user: null, error: 'An unexpected error occurred' };
    }
  }

  /**
   * Update user role (admin only)
   */
  static async updateUserRole(userId: string, newRole: UserRole): Promise<{ error: string | null }> {
    if (!supabase) {
      return { error: 'Supabase is not configured. Please set environment variables.' };
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      return { error: error?.message || null };
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  }

  /**
   * Get all users (admin only)
   */
  static async getAllUsers(): Promise<{ users: User[] | null; error: string | null }> {
    if (!supabase) {
      return { users: null, error: 'Supabase is not configured. Please set environment variables.' };
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return { users: null, error: error.message };
      }

      return { users: data as User[], error: null };
    } catch (error) {
      return { users: null, error: 'An unexpected error occurred' };
    }
  }

  /**
   * Delete user (admin only)
   */
  static async deleteUser(userId: string): Promise<{ error: string | null }> {
    if (!supabase) {
      return { error: 'Supabase is not configured. Please set environment variables.' };
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      return { error: error?.message || null };
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(userId: string, updates: Partial<User>): Promise<{ user: User | null; error: string | null }> {
    if (!supabase) {
      return { user: null, error: 'Supabase is not configured. Please set environment variables.' };
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        return { user: null, error: error.message };
      }

      return { user: data as User, error: null };
    } catch (error) {
      return { user: null, error: 'An unexpected error occurred' };
    }
  }

  /**
   * Check if user has required role
   */
  static hasRole(user: User | null, requiredRole: UserRole): boolean {
    if (!user) return false;
    
    const roleHierarchy = {
      'user': 1,
      'business': 2,
      'admin': 3
    };
    
    const userRoleLevel = roleHierarchy[user.role as UserRole] || 0;
    const requiredRoleLevel = roleHierarchy[requiredRole] || 0;
    
    return userRoleLevel >= requiredRoleLevel;
  }

  /**
   * Check if user can access business features
   */
  static canAccessBusiness(user: User | null): boolean {
    return this.hasRole(user, 'business');
  }

  /**
   * Check if user can access admin features
   */
  static canAccessAdmin(user: User | null): boolean {
    return this.hasRole(user, 'admin');
  }
} 