import { createAdminSession, ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

type AdminRow = RowDataPacket & {
  id: number;
  username: string;
  passwordHash: string;
};

async function findAdminUser(username: string): Promise<AdminRow | null> {
  const [rows] = await db.query<AdminRow[]>(
    "SELECT id, username, passwordHash FROM AdminUser WHERE username = ? LIMIT 1",
    [username],
  );

  return rows[0] ?? null;
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    username?: string;
    password?: string;
  };

  const username = body.username?.trim() ?? "";
  const password = body.password ?? "";

  if (!username || !password) {
    return NextResponse.json(
      { error: "Username and password are required" },
      { status: 400 },
    );
  }

  const admin = await findAdminUser(username);
  if (!admin) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const isMatch = await bcrypt.compare(password, admin.passwordHash);
  if (!isMatch) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: await createAdminSession(admin.username),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return response;
}
