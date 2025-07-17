"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Smartphone, 
  LogOut, 
  Save,
  Eye,
  EyeOff,
  Trash2
} from "lucide-react";
import { LocationHandler } from "@/components/location/location-handler";

interface UserSettings {
  notifications_enabled: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
  marketing_emails: boolean;
  location_sharing: boolean;
  profile_visibility: "public" | "private" | "friends";
  theme: "light" | "dark" | "system";
  language: string;
}

interface UserSettingsProps {
  onSettingsUpdate?: (settings: UserSettings) => void;
}

export function UserSettings({ onSettingsUpdate }: UserSettingsProps) {
  const [settings, setSettings] = useState<UserSettings>({
    notifications_enabled: true,
    email_notifications: true,
    push_notifications: true,
    marketing_emails: false,
    location_sharing: true,
    profile_visibility: "public",
    theme: "system",
    language: "en",
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const supabase = createClientComponentClient();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase
        .from("users")
        .select("notifications_enabled, location_sharing")
        .eq("id", user.id)
        .single();

      if (error && error.code !== "PGRST116") { // PGRST116 = no rows returned
        throw error;
      }

      if (data) {
        setSettings(prev => ({
          ...prev,
          notifications_enabled: data.notifications_enabled ?? true,
          location_sharing: data.location_sharing ?? true,
        }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load settings");
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = (key: keyof UserSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { error } = await supabase
        .from("users")
        .update({
          notifications_enabled: settings.notifications_enabled,
          location_sharing: settings.location_sharing,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) {
        throw error;
      }

      setSuccess("Settings saved successfully!");
      onSettingsUpdate?.(settings);
      
      // Apply theme setting
      if (settings.theme === "dark") {
        document.documentElement.classList.add("dark");
      } else if (settings.theme === "light") {
        document.documentElement.classList.remove("dark");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = "/";
    } catch (err) {
      setError("Failed to sign out");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Delete user data from all tables
      await supabase.from("users").delete().eq("id", user.id);
      await supabase.from("bookings").delete().eq("user_id", user.id);
      await supabase.from("favorites").delete().eq("user_id", user.id);
      
      // Delete the user account
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      
      if (error) {
        throw error;
      }

      window.location.href = "/";
    } catch (err) {
      setError("Failed to delete account. Please contact support.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Settings</h1>
        <Button onClick={handleSaveSettings} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}
      
      {success && (
        <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Manage your notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications about events and updates
                </p>
              </div>
              <Button
                variant={settings.notifications_enabled ? "default" : "outline"}
                onClick={() => updateSetting("notifications_enabled", !settings.notifications_enabled)}
              >
                {settings.notifications_enabled ? "Enabled" : "Disabled"}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email updates about your bookings
                </p>
              </div>
              <Button
                variant={settings.email_notifications ? "default" : "outline"}
                onClick={() => updateSetting("email_notifications", !settings.email_notifications)}
              >
                {settings.email_notifications ? "Enabled" : "Disabled"}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Marketing Emails</Label>
                <p className="text-sm text-muted-foreground">
                  Receive promotional emails and offers
                </p>
              </div>
              <Button
                variant={settings.marketing_emails ? "default" : "outline"}
                onClick={() => updateSetting("marketing_emails", !settings.marketing_emails)}
              >
                {settings.marketing_emails ? "Enabled" : "Disabled"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Privacy
            </CardTitle>
            <CardDescription>
              Control your privacy settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="font-medium">Profile Visibility</Label>
              <select
                value={settings.profile_visibility}
                onChange={(e) => updateSetting("profile_visibility", e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="public">Public</option>
                <option value="friends">Friends Only</option>
                <option value="private">Private</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Location Sharing</Label>
                <p className="text-sm text-muted-foreground">
                  Allow location-based recommendations
                </p>
              </div>
              <Button
                variant={settings.location_sharing ? "default" : "outline"}
                onClick={() => updateSetting("location_sharing", !settings.location_sharing)}
              >
                {settings.location_sharing ? "Enabled" : "Disabled"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Appearance
            </CardTitle>
            <CardDescription>
              Customize the app appearance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="font-medium">Theme</Label>
              <select
                value={settings.theme}
                onChange={(e) => updateSetting("theme", e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="system">System</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label className="font-medium">Language</Label>
              <select
                value={settings.language}
                onChange={(e) => updateSetting("language", e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Location Services */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Location Services
            </CardTitle>
            <CardDescription>
              Manage location permissions and services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LocationHandler
              onLocationUpdate={(location) => {
                console.log("Location updated:", location);
              }}
              onPermissionChange={(permission) => {
                console.log("Permission changed:", permission);
              }}
            />
          </CardContent>
        </Card>
      </div>

      {/* Account Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Account Actions
          </CardTitle>
          <CardDescription>
            Manage your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button onClick={handleSignOut} variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
            
            <Button 
              onClick={() => setShowDeleteConfirm(true)} 
              variant="destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          </div>

          {showDeleteConfirm && (
            <div className="p-4 border border-red-200 rounded-md bg-red-50">
              <h4 className="font-medium text-red-800 mb-2">Delete Account</h4>
              <p className="text-sm text-red-700 mb-4">
                This action cannot be undone. All your data will be permanently deleted.
              </p>
              <div className="flex gap-2">
                <Button onClick={handleDeleteAccount} variant="destructive" size="sm">
                  Confirm Delete
                </Button>
                <Button 
                  onClick={() => setShowDeleteConfirm(false)} 
                  variant="outline" 
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 