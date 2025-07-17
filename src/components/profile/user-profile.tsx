"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { User, Camera, MapPin, Mail, Calendar, Edit, Save, X, Upload } from "lucide-react";
import { InterestSelector } from "@/components/auth/interest-selector";

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  bio: string;
  avatar_url?: string;
  location: string;
  interests: string[];
  notifications_enabled: boolean;
  created_at: string;
  updated_at: string;
}

interface UserProfileProps {
  userId?: string;
  onProfileUpdate?: (profile: UserProfile) => void;
}

export function UserProfile({ userId, onProfileUpdate }: UserProfileProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [editForm, setEditForm] = useState({
    full_name: "",
    bio: "",
    location: "",
    interests: [] as string[],
    notifications_enabled: true,
  });

  const supabase = createClientComponentClient();

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const currentUserId = userId || user?.id;

      if (!currentUserId) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", currentUserId)
        .single();

      if (error) {
        throw error;
      }

      setProfile(data);
      setEditForm({
        full_name: data.full_name || "",
        bio: data.bio || "",
        location: data.location || "",
        interests: data.interests || [],
        notifications_enabled: data.notifications_enabled ?? true,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
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
        .upsert({
          id: user.id,
          full_name: editForm.full_name,
          bio: editForm.bio,
          location: editForm.location,
          interests: editForm.interests,
          notifications_enabled: editForm.notifications_enabled,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        throw error;
      }

      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      
      // Reload profile to get updated data
      await loadProfile();
      
      // Call callback if provided
      if (onProfileUpdate && profile) {
        onProfileUpdate({ ...profile, ...editForm });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setEditForm({
        full_name: profile.full_name || "",
        bio: profile.bio || "",
        location: profile.location || "",
        interests: profile.interests || [],
        notifications_enabled: profile.notifications_enabled ?? true,
      });
    }
    setIsEditing(false);
    setError(null);
    setSuccess(null);
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !profile) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from("users")
        .update({ avatar_url: publicUrl })
        .eq("id", profile.id);

      if (updateError) {
        throw updateError;
      }

      await loadProfile();
      setSuccess("Avatar updated successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload avatar");
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-8">
          <div className="text-center">
            <p className="text-muted-foreground">Profile not found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Profile</CardTitle>
            <CardDescription>Manage your account information and preferences</CardDescription>
          </div>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
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

        {/* Avatar Section */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center overflow-hidden">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-purple-600" />
              )}
            </div>
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-purple-600 text-white p-1 rounded-full cursor-pointer hover:bg-purple-700">
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold">{profile.full_name}</h3>
            <p className="text-muted-foreground">{profile.email}</p>
          </div>
        </div>

        {/* Profile Information */}
        {isEditing ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={editForm.full_name}
                onChange={(e) => setEditForm(prev => ({ ...prev, full_name: e.target.value }))}
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={editForm.bio}
                onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell us about yourself..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={editForm.location}
                onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Enter your location"
              />
            </div>

            <div className="space-y-2">
              <Label>Interests</Label>
              <InterestSelector
                selectedInterests={editForm.interests}
                onInterestsChange={(interests) => setEditForm(prev => ({ ...prev, interests }))}
                maxSelections={8}
                showCategories={true}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  Receive updates about events and activities
                </p>
              </div>
              <Button
                variant={editForm.notifications_enabled ? "default" : "outline"}
                onClick={() => setEditForm(prev => ({ 
                  ...prev, 
                  notifications_enabled: !prev.notifications_enabled 
                }))}
              >
                {editForm.notifications_enabled ? "Enabled" : "Disabled"}
              </Button>
            </div>

            <div className="flex space-x-2">
              <Button onClick={handleSave} disabled={isSaving} className="flex-1">
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
              <Button onClick={handleCancel} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{profile.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {profile.location || "Location not set"}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Member since {new Date(profile.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            {profile.bio && (
              <div>
                <h4 className="font-medium mb-2">Bio</h4>
                <p className="text-sm text-muted-foreground">{profile.bio}</p>
              </div>
            )}

            {profile.interests && profile.interests.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Interests</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest) => (
                    <Badge key={interest} variant="secondary">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 