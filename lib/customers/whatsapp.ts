/**
 * Normalize WhatsApp to comparable digits (Indonesia-friendly).
 * Strips non-digits; converts leading 0 → 62; ensures 62 prefix when 8… local.
 */
export function normalizeWhatsapp(raw: string): string {
  let digits = raw.replace(/\D/g, "");

  if (digits.startsWith("0")) {
    digits = `62${digits.slice(1)}`;
  } else if (digits.startsWith("8") && digits.length >= 9) {
    digits = `62${digits}`;
  }

  return digits;
}

export function formatWhatsappDisplay(normalized: string): string {
  if (!normalized) return "";
  if (normalized.startsWith("62") && normalized.length > 4) {
    const rest = normalized.slice(2);
    const parts = [rest.slice(0, 3), rest.slice(3, 7), rest.slice(7)].filter(
      Boolean,
    );
    return `+62 ${parts.join("-")}`;
  }
  return `+${normalized}`;
}

export function isValidWhatsapp(raw: string): boolean {
  const normalized = normalizeWhatsapp(raw);
  return normalized.length >= 10 && normalized.length <= 15;
}
