import { NextResponse } from "next/server";
import { listInboxNotifications } from "@/lib/notifications/data";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(listInboxNotifications());
}
