"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { addStoredNotification } from "@/app/lib/notifications";
import { supabase } from "@/app/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setError(true);
      return;
    }

    const client = supabase;

    let active = true;

    const redirectIfAuthenticated = async () => {
      const { data, error: sessionError } = await client.auth.getSession();
      if (!active) return;

      if (sessionError || !data.session) {
        setError(true);
        return;
      }

      addStoredNotification({
        title: "Welcome to CelluLite",
        message: "Congratulations! Your account was created successfully.",
        kind: "system",
        tone: "green",
        dedupeKey: `account-created:${data.session.user.id}`,
      });

      router.replace("/dashboard");
      router.refresh();
    };

    void redirectIfAuthenticated();

    const { data: authListener } = client.auth.onAuthStateChange((event, session) => {
      if (session && (event === "SIGNED_IN" || event === "INITIAL_SESSION")) {
        router.replace("/dashboard");
        router.refresh();
      }
    });

    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  if (error) {
    return <main><p>Email confirmation could not be completed. Please sign in again.</p></main>;
  }

  return <main><p>Completing email confirmation...</p></main>;
}