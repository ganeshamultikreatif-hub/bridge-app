import { cookies } from "next/headers";
import { APPEARANCE_USER_COOKIE } from "@/lib/appearance/constants";

const APPEARANCE_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

function appearanceCookieOptions() {
  return {
    httpOnly: false,
    maxAge: APPEARANCE_COOKIE_MAX_AGE,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };
}

export async function setAppearanceUserCookie(userId: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(APPEARANCE_USER_COOKIE, userId, appearanceCookieOptions());
}

export async function clearAppearanceUserCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(APPEARANCE_USER_COOKIE);
}

export async function ensureAppearanceUserCookie(
  userId: string,
): Promise<void> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(APPEARANCE_USER_COOKIE)?.value;

  if (existing !== userId) {
    cookieStore.set(APPEARANCE_USER_COOKIE, userId, appearanceCookieOptions());
  }
}
