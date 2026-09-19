"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase/client";
import { LoadingDots } from "@/app/components/loading-dots";

export function AppBootLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let resolved = false;

    const hideLoader = () => {
      if (cancelled || resolved) return;
      resolved = true;
      window.setTimeout(() => {
        if (!cancelled) setVisible(false);
      }, 400);
    };

    const finishBoot = async () => {
      const startTime = Date.now();

      try {
        if (supabase) {
          await supabase.auth.getSession();
        }

        await new Promise<void>((resolve) => {
          if (document.readyState === "complete") {
            resolve();
            return;
          }
          window.addEventListener("load", () => resolve(), { once: true });
        });
      } catch {
        // Ignore boot issues and still allow the app to render.
      } finally {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 1200 - elapsed);
        window.setTimeout(() => {
          if (!cancelled) {
            hideLoader();
          }
        }, remaining);
      }
    };

    const onBootReady = () => {
      hideLoader();
    };

    window.addEventListener("cellulite-boot-ready", onBootReady);
    void finishBoot();

    return () => {
      cancelled = true;
      window.removeEventListener("cellulite-boot-ready", onBootReady);
    };
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div className="loading-screen" role="status" aria-live="polite" aria-label="Loading application">
      <div className="loading-screen__content">
        <LoadingDots />
      </div>
    </div>
  );
}
