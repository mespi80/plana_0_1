"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { SupabaseClient } from "@supabase/supabase-js";

export function GoogleSignInButton() {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClientComponentClient();

  async function handleSignIn() {
    setIsLoading(true);
    await supabase.auth.signInWithOAuth({ provider: "google" });
    setIsLoading(false);
  }

  return (
    <Button onClick={handleSignIn} disabled={isLoading} variant="outline">
      {isLoading ? "Signing in..." : "Sign in with Google"}
    </Button>
  );
} 