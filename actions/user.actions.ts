"use server";

import type { AppUser } from "@/types/user";

/** ponytail: stub until CEP user profile API lands. */
export async function resolveProfileAvatarAction(
  avatarUrl: string,
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  return { ok: true, url: avatarUrl.trim() };
}

export async function updateOwnPasswordAction(
  _input: unknown,
): Promise<{ ok: true } | { ok: false; error: string }> {
  return { ok: false, error: "Not implemented" };
}

export async function updateOwnProfileAction(
  _input: unknown,
): Promise<{ ok: true; data: AppUser } | { ok: false; error: string }> {
  return { ok: false, error: "Not implemented" };
}
