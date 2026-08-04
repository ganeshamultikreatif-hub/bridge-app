import { NextResponse } from "next/server";
import { markNotificationRead } from "@/lib/notifications/data";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let id: string | undefined;
  try {
    const body = (await request.json()) as { id?: string };
    id = typeof body.id === "string" ? body.id : undefined;
  } catch {
    id = undefined;
  }

  markNotificationRead(id);
  return NextResponse.json({ ok: true });
}
