import { Pool } from "pg";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes("render") || process.env.DATABASE_URL?.includes("supabase") ? { rejectUnauthorized: false } : false,
});

export async function query<T extends Record<string, unknown>>(text: string, params: unknown[] = []) {
  return pool.query<T>(text, params);
}
