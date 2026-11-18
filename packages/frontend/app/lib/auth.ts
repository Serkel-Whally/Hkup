const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export type AuthUser = { id: string; name?: string; email: string; phone?: string };
const AUTH_STORAGE_KEY = "cellulite_auth";

export type AuthSession = { user: AuthUser; token: string };

export function saveAuthSession(session: AuthSession) {
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  }
}

export function getAuthSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) || "null");
  } catch {
    return null;
  }
}

export function clearAuthSession() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

export function authHeaders(): Record<string, string> {
  const session = getAuthSession();
  return session?.token ? { Authorization: `Bearer ${session.token}` } : {};
}

async function requestAuth(path: string, body: Record<string, string>) {
  const response = await fetch(`${API_URL}/api/auth/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Something went wrong. Please try again.");
  return data as { user: AuthUser; token?: string };
}

export function login(body: { email: string; password: string }) {
  return requestAuth("login", body).then((result) => {
    if (result.token) saveAuthSession({ user: result.user, token: result.token });
    return result;
  });
}

export function register(body: { name: string; email: string; phone: string; password: string }) {
  return requestAuth("register", body).then((result) => {
    if (result.token) saveAuthSession({ user: result.user, token: result.token });
    return result;
  });
}
