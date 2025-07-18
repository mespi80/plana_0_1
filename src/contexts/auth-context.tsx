"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, UserRole, AuthState } from '@/types/auth';
import { AuthService } from '@/lib/auth';

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string, role?: UserRole) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  hasRole: (requiredRole: UserRole) => boolean;
  canAccessBusiness: () => boolean;
  canAccessAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    // Add a small delay to prevent rapid auth checks
    const timer = setTimeout(() => {
      checkUser();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const checkUser = async () => {
    try {
      const { user, error } = await AuthService.getCurrentUser();
      
      if (error) {
        // Only log unexpected errors, not missing sessions
        if (error !== 'No user found' && !error.includes('Auth session missing')) {
          console.error('Auth check error:', error);
        }
      }

      // Convert UserProfile to User type
      const userData: User | null = user ? {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        avatar_url: user.avatar_url,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
      } : null;

      console.log('Auth check - User data:', userData);
      console.log('Auth check - User role:', userData?.role);

      setAuthState({
        user: userData,
        isLoading: false,
        isAuthenticated: !!userData,
      });
    } catch (error) {
      console.error('Auth check failed:', error);
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  };

  const signIn = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      const { user, error } = await AuthService.signIn(email, password);
      
      if (user) {
        // Get the user profile after successful sign in
        const { user: profile, error: profileError } = await AuthService.getCurrentUser();
        
        // Convert UserProfile to User type
        const userData: User | null = profile ? {
          id: profile.id,
          email: profile.email,
          full_name: profile.full_name,
          avatar_url: profile.avatar_url,
          role: profile.role,
          created_at: profile.created_at,
          updated_at: profile.updated_at,
        } : null;
        
        setAuthState({
          user: userData,
          isLoading: false,
          isAuthenticated: !!userData,
        });
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }

      return { error };
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { error: 'An unexpected error occurred' };
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role?: UserRole) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      const { user, error } = await AuthService.signUp({ email, password, full_name: fullName, role });
      
      if (user) {
        // Get the user profile after successful sign up
        const { user: profile, error: profileError } = await AuthService.getCurrentUser();
        
        // Convert UserProfile to User type
        const userData: User | null = profile ? {
          id: profile.id,
          email: profile.email,
          full_name: profile.full_name,
          avatar_url: profile.avatar_url,
          role: profile.role,
          created_at: profile.created_at,
          updated_at: profile.updated_at,
        } : null;
        
        setAuthState({
          user: userData,
          isLoading: false,
          isAuthenticated: !!userData,
        });
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }

      return { error };
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { error: 'An unexpected error occurred' };
    }
  };

  const signOut = async () => {
    try {
      await AuthService.signOut();
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const hasRole = (requiredRole: UserRole): boolean => {
    if (!authState.user) {
      console.log('hasRole - No user found');
      return false;
    }
    
    const userRole = authState.user.role;
    console.log('hasRole - Checking role:', { requiredRole, userRole, userId: authState.user.id });
    
    // Role hierarchy: admin > business > user
    switch (requiredRole) {
      case 'admin':
        const adminResult = userRole === 'admin';
        console.log('hasRole - Admin check result:', adminResult);
        return adminResult;
      case 'business':
        const businessResult = userRole === 'business' || userRole === 'admin';
        console.log('hasRole - Business check result:', businessResult);
        return businessResult;
      case 'user':
        console.log('hasRole - User check result: true');
        return true; // All authenticated users have user access
      default:
        console.log('hasRole - Unknown role:', requiredRole);
        return false;
    }
  };

  const canAccessBusiness = (): boolean => {
    return hasRole('business');
  };

  const canAccessAdmin = (): boolean => {
    return hasRole('admin');
  };

  const value: AuthContextType = {
    ...authState,
    signIn,
    signUp,
    signOut,
    hasRole,
    canAccessBusiness,
    canAccessAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 