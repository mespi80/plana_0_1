"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthState, UserRole } from '@/types/auth';
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
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { user, error } = await AuthService.getCurrentUser();
      
      if (error) {
        console.error('Auth check error:', error);
      }

      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: !!user,
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
      const { user, error } = await AuthService.signIn({ email, password });
      
      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: !!user,
      });

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
      
      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: !!user,
      });

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
    return AuthService.hasRole(authState.user, requiredRole);
  };

  const canAccessBusiness = (): boolean => {
    return AuthService.canAccessBusiness(authState.user);
  };

  const canAccessAdmin = (): boolean => {
    return AuthService.canAccessAdmin(authState.user);
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