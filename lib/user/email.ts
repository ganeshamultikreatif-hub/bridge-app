export const USER_EMAIL_DOMAIN = "scheduler.app";

export function buildUserEmail(localPart: string): string {
  return `${localPart.trim().toLowerCase()}@${USER_EMAIL_DOMAIN}`;
}

export function parseUserEmailLocalPart(email: string): string {
  const suffix = `@${USER_EMAIL_DOMAIN}`;

  if (email.toLowerCase().endsWith(suffix)) {
    return email.slice(0, -suffix.length);
  }

  return email.split("@")[0] ?? email;
}
