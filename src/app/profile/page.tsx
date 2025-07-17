"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { User, Settings, LogOut, MapPin, Bell, Shield, HelpCircle, CreditCard } from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push("/auth/login");
        return;
      }
      
      setUser(session.user);
      setIsLoading(false);
    };

    getSession();
  }, [supabase.auth, router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  const menuItems = [
    {
      icon: CreditCard,
      label: "Payment Settings",
      href: "/settings/payment"
    },
    {
      icon: MapPin,
      label: "Location Settings",
      href: "/profile/location"
    },
    {
      icon: Bell,
      label: "Notifications",
      href: "/profile/notifications"
    },
    {
      icon: Shield,
      label: "Privacy & Security",
      href: "/profile/privacy"
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      href: "/profile/help"
    }
  ];

  return (
    <AppLayout>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <h1 className="text-xl font-bold text-gray-900">Profile</h1>
      </header>

      {/* Content */}
      <div className="flex-1 p-4">
        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-purple-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900">
                {user?.user_metadata?.full_name || "User"}
              </h2>
              <p className="text-gray-500">{user?.email}</p>
              <p className="text-sm text-gray-400">
                Member since {new Date(user?.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={item.label}>
                <button 
                  className="w-full flex items-center space-x-3 p-4 hover:bg-gray-50 transition-colors"
                  onClick={() => router.push(item.href)}
                >
                  <Icon className="w-5 h-5 text-gray-500" />
                  <span className="flex-1 text-left text-gray-900">{item.label}</span>
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                </button>
                {index < menuItems.length - 1 && (
                  <div className="border-b border-gray-100 mx-4"></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Sign Out Button */}
        <div className="mt-6">
          <button
            onClick={handleSignOut}
            className="w-full bg-red-50 text-red-600 py-3 px-4 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Sign Out
          </button>
        </div>
      </div>
    </AppLayout>
  );
} 