const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export type AuthUser = { id: string; name?: string; email: string; phone?: string };

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
  return requestAuth("login", body);
}

export function register(body: { name: string; email: string; phone: string; password: string }) {
  return requestAuth("register", body);
}
