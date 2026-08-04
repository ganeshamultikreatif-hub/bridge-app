import { APP_TIMEZONE } from "@/lib/datetime/format";

function getHourInAppTimezone(date: Date): number {
  return Number(
    new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      hour12: false,
      timeZone: APP_TIMEZONE,
    }).format(date),
  );
}

export function getTimeGreeting(date = new Date()): string {
  const hour = getHourInAppTimezone(date);

  if (hour >= 5 && hour < 11) {
    return "Selamat pagi";
  }

  if (hour >= 11 && hour < 15) {
    return "Selamat siang";
  }

  if (hour >= 15 && hour < 18) {
    return "Selamat sore";
  }

  return "Selamat malam";
}
