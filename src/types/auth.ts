export type UserRole = 'user' | 'business' | 'admin';

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface BusinessUser extends User {
  role: 'business';
  business_id?: string;
  business_name?: string;
}

export interface AdminUser extends User {
  role: 'admin';
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpData {
  email: string;
  password: string;
  full_name: string;
  role?: UserRole;
}

export interface PasswordResetData {
  email: string;
}

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
} 