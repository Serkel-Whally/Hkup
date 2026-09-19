import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { query } from "@/app/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const name = String(body?.name ?? "").trim();
    const email = String(body?.email ?? "").trim().toLowerCase();
    const password = String(body?.password ?? "");

    if (!name || !email || !password || password.length < 8) {
      return NextResponse.json(
        { error: "Please provide a valid name, email, and a password with at least 8 characters." },
        { status: 400 }
      );
    }

    const existing = await query<{ id: string }>(
      `SELECT id FROM users WHERE lower(email) = $1 LIMIT 1`,
      [email]
    );

    if (existing.rowCount && existing.rowCount > 0) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const passwordHash = await hash(password, 12);

    const result = await query<{
      id: string;
      email: string;
      full_name: string | null;
      phone: string | null;
      role: string | null;
      suspended: boolean | null;
    }>(
      `
        INSERT INTO users (email, full_name, phone, password_hash, role, suspended)
        VALUES ($1, $2, $3, $4, 'USER', false)
        RETURNING id, email, full_name, phone, role, suspended
      `,
      [email, name, null, passwordHash]
    );

    const user = result.rows[0];

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.full_name || user.email,
          phone: user.phone || null,
          role: user.role || "USER",
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to register your account." },
      { status: 500 }
    );
  }
}
