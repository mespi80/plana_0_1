"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { User, MapPin, Heart, Check, ArrowRight, ArrowLeft } from "lucide-react";

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  component: React.ReactNode;
}

const INTERESTS = [
  { id: "live-music", label: "Live Music", icon: "🎵" },
  { id: "comedy", label: "Comedy", icon: "🎭" },
  { id: "food-dining", label: "Food & Dining", icon: "🍽️" },
  { id: "art-culture", label: "Art & Culture", icon: "🎨" },
  { id: "sports", label: "Sports", icon: "⚽" },
  { id: "nightlife", label: "Nightlife", icon: "🍸" },
  { id: "wellness", label: "Wellness", icon: "🧘" },
  { id: "technology", label: "Technology", icon: "💻" },
  { id: "networking", label: "Networking", icon: "🤝" },
  { id: "education", label: "Education", icon: "📚" },
  { id: "family", label: "Family", icon: "👨‍👩‍👧‍👦" },
  { id: "outdoor", label: "Outdoor", icon: "🌲" },
];

interface OnboardingFlowProps {
  onComplete?: () => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    fullName: "",
    bio: "",
    interests: [] as string[],
    location: "",
    notifications: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createClientComponentClient();

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleInterest = (interestId: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }));
  };

  const handleLocationPermission = async () => {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        });
      });
      
      // Reverse geocode to get address
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      
      if (data.results?.[0]) {
        updateFormData("location", data.results[0].formatted_address);
      }
    } catch (err) {
      console.error("Location permission denied:", err);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Update user profile in Supabase
      const { error: profileError } = await supabase
        .from("users")
        .upsert({
          id: user.id,
          full_name: formData.fullName,
          bio: formData.bio,
          interests: formData.interests,
          location: formData.location,
          notifications_enabled: formData.notifications,
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        });

      if (profileError) {
        throw profileError;
      }

      onComplete?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setIsLoading(false);
    }
  };

  const steps: OnboardingStep[] = [
    {
      id: 1,
      title: "Welcome to PLANA!",
      description: "Let's set up your profile to personalize your experience",
      component: (
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
              <User className="w-10 h-10 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold">Welcome to PLANA!</h2>
            <p className="text-muted-foreground">
              Let's set up your profile to personalize your experience and help you discover amazing events.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: "Basic Information",
      description: "Tell us a bit about yourself",
      component: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={(e) => updateFormData("fullName", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio (Optional)</Label>
            <Input
              id="bio"
              placeholder="Tell us about yourself..."
              value={formData.bio}
              onChange={(e) => updateFormData("bio", e.target.value)}
            />
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: "What interests you?",
      description: "Select your interests to get personalized recommendations",
      component: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Select all that apply (you can change these later)
          </p>
          <div className="grid grid-cols-2 gap-3">
            {INTERESTS.map((interest) => (
              <Button
                key={interest.id}
                variant={formData.interests.includes(interest.id) ? "default" : "outline"}
                className="justify-start h-auto p-3"
                onClick={() => toggleInterest(interest.id)}
              >
                <span className="mr-2">{interest.icon}</span>
                {interest.label}
                {formData.interests.includes(interest.id) && (
                  <Check className="ml-auto w-4 h-4" />
                )}
              </Button>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 4,
      title: "Location",
      description: "Help us find events near you",
      component: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="location">Your Location</Label>
            <div className="flex gap-2">
              <Input
                id="location"
                placeholder="Enter your city or address"
                value={formData.location}
                onChange={(e) => updateFormData("location", e.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleLocationPermission}
                className="shrink-0"
              >
                <MapPin className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            We'll use this to show you events happening nearby
          </p>
        </div>
      ),
    },
    {
      id: 5,
      title: "Notifications",
      description: "Stay updated on events you might like",
      component: (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-medium">Push Notifications</h3>
              <p className="text-sm text-muted-foreground">
                Get notified about new events and updates
              </p>
            </div>
            <Button
              variant={formData.notifications ? "default" : "outline"}
              onClick={() => updateFormData("notifications", !formData.notifications)}
            >
              {formData.notifications ? "Enabled" : "Disabled"}
            </Button>
          </div>
        </div>
      ),
    },
  ];

  const canProceed = () => {
    switch (currentStep) {
      case 0: return true;
      case 1: return formData.fullName.trim().length > 0;
      case 2: return formData.interests.length > 0;
      case 3: return formData.location.trim().length > 0;
      case 4: return true;
      default: return false;
    }
  };

  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index <= currentStep
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {index < currentStep ? <Check className="w-4 h-4" /> : step.id}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 h-0.5 mx-2 ${
                      index < currentStep ? "bg-purple-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <CardTitle className="text-2xl">{steps[currentStep].title}</CardTitle>
          <CardDescription>{steps[currentStep].description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}
          
          {steps[currentStep].component}

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            {isLastStep ? (
              <Button
                onClick={handleComplete}
                disabled={isLoading || !canProceed()}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isLoading ? "Saving..." : "Complete Setup"}
              </Button>
            ) : (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canProceed()}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 