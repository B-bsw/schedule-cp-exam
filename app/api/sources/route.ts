import { db } from "@/lib/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { NextResponse } from "next/server";

type SourceRow = RowDataPacket & {
  id: number;
  name: string;
  url: string;
};

export async function GET() {
  const [rows] = await db.query<SourceRow[]>(
    "SELECT id, name, url FROM SheetSource ORDER BY name ASC",
  );

  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const body = (await request.json()) as { name?: string; url?: string };
  const name = body.name?.trim() ?? "";
  const url = body.url?.trim() ?? "";

  if (!name || !url) {
    return NextResponse.json(
      { error: "name and url are required" },
      { status: 400 },
    );
  }

  try {
    await db.query<ResultSetHeader>(
      "INSERT INTO SheetSource (name, url, createdAt, updatedAt) VALUES (?, ?, NOW(3), NOW(3))",
      [name, url],
    );
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "ER_DUP_ENTRY"
    ) {
      return NextResponse.json(
        { error: "name or url already exists" },
        { status: 409 },
      );
    }
    throw error;
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
