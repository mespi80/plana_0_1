"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Home, Heart, User, Sparkles, Calendar, BarChart3, Shield } from "lucide-react";

export function BottomNavigation() {
  const pathname = usePathname();
  const { user, canAccessBusiness, canAccessAdmin } = useAuth();

  const getNavItems = () => {
    const baseItems = [
      {
        href: "/",
        label: "Home",
        icon: Home,
        active: pathname === "/"
      },
      {
        href: "/discover",
        label: "Discover",
        icon: Sparkles,
        active: pathname === "/discover"
      },
      {
        href: "/qr-code",
        label: "Liked",
        icon: Heart,
        active: pathname === "/qr-code"
      },
      {
        href: "/bookings",
        label: "Bookings",
        icon: Calendar,
        active: pathname === "/bookings"
      }
    ];

    // Add business dashboard for business users
    if (canAccessBusiness()) {
      baseItems.push({
        href: "/business/dashboard",
        label: "Business",
        icon: BarChart3,
        active: pathname.startsWith("/business")
      });
    }

    // Add admin dashboard for admin users
    if (canAccessAdmin()) {
      baseItems.push({
        href: "/admin",
        label: "Admin",
        icon: Shield,
        active: pathname.startsWith("/admin")
      });
    }

    // Always add profile at the end
    baseItems.push({
      href: "/profile",
      label: "Profile",
      icon: User,
      active: pathname === "/profile"
    });

    return baseItems;
  };

  const navItems = getNavItems();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                item.active
                  ? "text-purple-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon
                className={`w-6 h-6 mb-1 ${
                  item.active ? "fill-current" : ""
                }`}
              />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
} 