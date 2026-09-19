import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function getTrustedAppOrigin() {
  const configuredOrigin =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);

  if (configuredOrigin) {
    try {
      return new URL(configuredOrigin).origin;
    } catch {
      return configuredOrigin.replace(/\/+$/, "") || "http://localhost:3000";
    }
  }

  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }

  return process.env.NODE_ENV === "production" ? "https://cellulitis.vercel.app" : "http://localhost:3000";
}

export function getAuthRedirectUrl(pathname = "/auth/callback") {
  const origin = getTrustedAppOrigin();
  const redirectUrl = new URL(pathname, origin);
  return redirectUrl.toString();
}

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createBrowserClient(supabaseUrl, supabaseAnonKey)
    : null;

export async function getCurrentSession() {
  if (!supabase) return { session: null, error: new Error("Supabase is not configured.") };

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  return { session, error };
}

export async function getAuthenticatedUser() {
  if (!supabase) return null;

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;
  return user;
}

export async function signOut() {
  if (!supabase) return { error: new Error("Supabase is not configured.") };
  return supabase.auth.signOut();
}
