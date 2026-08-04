import { NextResponse } from "next/server";
import { listLiveNotifications } from "@/lib/notifications/data";

export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const since = searchParams.get("since");
  return NextResponse.json(listLiveNotifications(since));
}
