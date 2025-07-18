"use client";

import { useAuth } from "@/contexts/auth-context";
import { Badge } from "@/components/ui/badge";
import { User, Shield, Building2, Loader2 } from "lucide-react";

export function AuthStatus() {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Loading...</span>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center space-x-2">
        <Badge variant="secondary">Not Signed In</Badge>
      </div>
    );
  }

  const getRoleIcon = () => {
    switch (user.role) {
      case 'admin':
        return <Shield className="w-4 h-4" />;
      case 'business':
        return <Building2 className="w-4 h-4" />;
      case 'user':
        return <User className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getRoleColor = () => {
    switch (user.role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'business':
        return 'bg-blue-100 text-blue-800';
      case 'user':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600">{user.full_name}</span>
      <Badge className={getRoleColor()}>
        <div className="flex items-center space-x-1">
          {getRoleIcon()}
          <span className="capitalize">{user.role}</span>
        </div>
      </Badge>
    </div>
  );
} 